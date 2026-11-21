import {readFileSync} from 'node:fs';
import {X509Certificate} from 'node:crypto';
import {ed25519Keys, hexKey, verifyRecorded} from './verify.mjs';

const DEFAULT_ENDPOINT = 'wss://archive.mainnet.acurast.com';
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
];
const GOOGLE_ROOT = 'https://android.googleapis.com/attestation/root';
const GOOGLE_STATUS = 'https://android.googleapis.com/attestation/status';

function parseArgs(argv) {
  const parsed = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument ${token}`);
    const name = token.slice(2);
    const next = argv[index + 1];
    if (next === undefined || next.startsWith('--')) parsed[name] = true;
    else {
      parsed[name] = next;
      index += 1;
    }
  }
  return parsed;
}

function requireText(args, name) {
  const value = args[name];
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Missing --${name}`);
  return value;
}

function jobIdOf(origin, jobNumber) {
  return [{Acurast: origin}, jobNumber];
}

function asScript(value) {
  if (typeof value !== 'string') return '';
  if (value.startsWith('ipfs://')) return value;
  const hex = value.replace(/^0x/i, '');
  if (/^[0-9a-f]+$/i.test(hex) && hex.length % 2 === 0) {
    const text = Buffer.from(hex, 'hex').toString('utf8');
    if (text.startsWith('ipfs://')) return text;
  }
  return value;
}

function collect(value, visit, into = []) {
  if (Array.isArray(value)) value.forEach((item) => collect(item, visit, into));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, visit, into));
  else visit(value, into);
  return into;
}

function derCertificates(value) {
  return collect(value, (item, into) => {
    if (typeof item === 'string' && /^0x308[0-9a-f]+$/i.test(item)) into.push(item.slice(2));
  });
}

function certSerialsFrom(stored) {
  const ids = stored?.certIds ?? stored?.cert_ids;
  if (!Array.isArray(ids)) throw new Error('StoredAttestation has no certificate ids');
  const serials = [];
  const visit = (value) => {
    if (!Array.isArray(value) || value.length === 0) return;
    if (value.every((item) => Array.isArray(item))) {
      value.forEach(visit);
      return;
    }
    if (value.length === 2 && value.every((item) => typeof item === 'string' && /^0x[0-9a-f]+$/i.test(item))) {
      serials.push(value[1].slice(2).toLowerCase());
    }
  };
  visit(ids);
  if (serials.length < 2) throw new Error('StoredAttestation certificate ids do not name a chain');
  return serials;
}

function pemsFrom(value) {
  return collect(value, (item, into) => {
    if (typeof item === 'string' && item.includes('BEGIN CERTIFICATE')) into.push(item);
  });
}

function statusSerials(value) {
  const serials = [];
  const walk = (item) => {
    if (Array.isArray(item)) item.forEach(walk);
    else if (item && typeof item === 'object') {
      for (const [key, child] of Object.entries(item)) {
        if (/^[0-9a-f]+$/i.test(key)) serials.push(key);
        walk(child);
      }
    }
  };
  walk(value);
  return serials;
}

async function atBlock(api, block) {
  const hash = await api.rpc.chain.getBlockHash(block);
  return {hash, apiAt: await api.at(hash)};
}

async function firstTrue(low, high, predicate) {
  let found = null;
  let start = low;
  let end = high;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (await predicate(mid)) {
      found = mid;
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return found;
}

async function sequenceAt(api, block) {
  const {apiAt} = await atBlock(api, block);
  return BigInt((await apiAt.query.acurast.localJobIdSequence()).toString().replace(/,/g, ''));
}

async function lastTrue(low, high, predicate) {
  let found = null;
  let start = low;
  let end = high;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (await predicate(mid)) {
      found = mid;
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return found;
}

async function matchAt(api, block, processor, jobId) {
  const {apiAt, hash} = await atBlock(api, block);
  const match = await apiAt.query.acurastMarketplace.storedMatches(processor, jobId);
  if (match.isEmpty) return null;
  const decoded = match.toJSON();
  return {block, hash: hash.toHex(), acknowledged: decoded?.acknowledged === true, decoded, raw: match.toHex()};
}

async function processorsAt(api, block, jobId) {
  const {apiAt} = await atBlock(api, block);
  const entries = await apiAt.query.acurastMarketplace.assignedProcessors.entries(jobId);
  const processors = new Set();
  for (const [key, value] of entries) {
    for (const arg of key.args) {
      const text = arg.toString();
      if (text.startsWith('5')) processors.add(text);
    }
    const json = value?.toJSON?.();
    if (typeof json === 'string' && json.startsWith('5')) processors.add(json);
    collect(json, (item, into) => {
      if (typeof item === 'string' && item.startsWith('5') && item.length >= 46 && item.length <= 50) into.push(item);
    }).forEach((item) => processors.add(item));
  }
  return [...processors];
}

async function findAcknowledgement(api, registration, head, processor, jobId) {
  const acknowledged = async (block) => (await matchAt(api, block, processor, jobId))?.acknowledged === true;
  let low = registration;
  let probe = registration;
  let step = 1;
  while (probe <= head) {
    const match = await matchAt(api, probe, processor, jobId);
    if (match?.acknowledged) return firstTrue(low, probe, acknowledged);
    if (!match) {
      const lastPresent = await lastTrue(low, probe - 1, async (block) => (await matchAt(api, block, processor, jobId)) !== null);
      if (lastPresent === null || !(await acknowledged(lastPresent))) return null;
      return firstTrue(low, lastPresent, acknowledged);
    }
    if (probe === head) return null;
    low = probe;
    probe = Math.min(head, probe + step);
    step *= 2;
  }
  return null;
}

async function fetchArtifact(cid) {
  const errors = [];
  for (const gateway of IPFS_GATEWAYS) {
    const url = `${gateway}${cid}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        errors.push(`${url} HTTP ${response.status}`);
        continue;
      }
      return {bytes: Buffer.from(await response.arrayBuffer()), url};
    } catch (error) {
      errors.push(`${url} ${error.message}`);
    }
  }
  throw new Error(`No IPFS gateway returned the artifact (${errors.join('; ')})`);
}

async function googleRootMatching(chainRootDer) {
  const response = await fetch(GOOGLE_ROOT);
  if (!response.ok) throw new Error(`Google root HTTP ${response.status}`);
  const body = await response.json();
  const certificates = pemsFrom(body).map((pem) => new X509Certificate(pem));
  const chainRoot = new X509Certificate(Buffer.from(chainRootDer, 'hex'));
  const chainSpki = chainRoot.publicKey.export({type: 'spki', format: 'der'});
  const match = certificates.find((certificate) => certificate.publicKey.export({type: 'spki', format: 'der'}).equals(chainSpki));
  if (!match) throw new Error('None of the published Google roots has the chain root key');
  return {pem: match.toString(), fetchedAt: new Date().toISOString()};
}

async function googleRevocation() {
  const response = await fetch(GOOGLE_STATUS);
  if (!response.ok) throw new Error(`Google status HTTP ${response.status}`);
  const body = await response.json();
  return {serials: statusSerials(body), fetchedAt: new Date().toISOString()};
}

async function readRegistration(api, block, jobId) {
  const {apiAt, hash} = await atBlock(api, block);
  const registration = await apiAt.query.acurast.storedJobRegistration(...jobId);
  const decoded = registration.toJSON();
  return {
    hash: hash.toHex(),
    script: asScript(decoded?.script ?? ''),
  };
}

async function onboardAt(api, block, processor) {
  const {hash, apiAt} = await atBlock(api, block);
  const signed = await api.rpc.chain.getBlock(hash);
  const events = await apiAt.query.system.events();
  for (let index = 0; index < signed.block.extrinsics.length; index += 1) {
    const extrinsic = signed.block.extrinsics[index];
    if (extrinsic.method.section !== 'acurastProcessorManager' || extrinsic.method.method !== 'onboard') continue;
    if (extrinsic.signer.toString() !== processor) continue;
    const ders = derCertificates(extrinsic.method.toJSON());
    if (ders.length === 0) continue;
    const storedEvent = events.some((record) => {
      if (!record.phase.isApplyExtrinsic || record.phase.asApplyExtrinsic.toNumber() !== index) return false;
      return record.event.section === 'acurast' && record.event.method === 'AttestationStoredV2';
    });
    if (!storedEvent) continue;
    return {index, hash: extrinsic.hash.toHex(), ders, event: 'acurast.AttestationStoredV2'};
  }
  throw new Error(`Block ${block} has no onboard extrinsic signed by ${processor} with AttestationStoredV2`);
}

async function acknowledgementExtrinsic(api, block, processor, key) {
  const {hash} = await atBlock(api, block);
  const signed = await api.rpc.chain.getBlock(hash);
  for (let index = 0; index < signed.block.extrinsics.length; index += 1) {
    const extrinsic = signed.block.extrinsics[index];
    const call = `${extrinsic.method.section}.${extrinsic.method.method}`;
    if (!call.endsWith('acknowledgeMatch') && !call.endsWith('acknowledgeExecutionMatch')) continue;
    if (extrinsic.signer.toString() !== processor) continue;
    const args = extrinsic.method.args.map((arg) => arg.toJSON());
    return {
      index,
      hash: extrinsic.hash.toHex(),
      call,
      signer: processor,
      args: {job_id: args[0], pub_keys: args[1]},
    };
  }
  throw new Error(`Block ${block} has no acknowledgement extrinsic signed by ${processor} for key ${key}`);
}

async function live(args) {
  const origin = requireText(args, 'origin');
  const jobNumber = Number(requireText(args, 'job'));
  const key = hexKey(requireText(args, 'key'));
  const artifact = requireText(args, 'artifact');
  const endpoint = typeof args.endpoint === 'string' ? args.endpoint : DEFAULT_ENDPOINT;
  const {ApiPromise, WsProvider} = await import('@polkadot/api');
  const api = await ApiPromise.create({provider: new WsProvider(endpoint)});
  try {
    const finalizedHash = await api.rpc.chain.getFinalizedHead();
    const finalizedHeader = await api.rpc.chain.getHeader(finalizedHash);
    const head = finalizedHeader.number.toNumber();
    const genesis = api.genesisHash.toHex();
    const jobId = jobIdOf(origin, jobNumber);
    const registration = args['registration-block']
      ? Number(args['registration-block'])
      : await firstTrue(1, head, async (block) => (await sequenceAt(api, block)) >= BigInt(jobNumber));
    if (!registration) throw new Error('No registration block: LocalJobIdSequence never reaches the job number');
    const processors = await processorsAt(api, registration, jobId);
    if (processors.length === 0) throw new Error('AssignedProcessors lists nobody for this job at the registration block');
    let processor = processors[0];
    let acknowledgement = args['acknowledgement-block'] ? Number(args['acknowledgement-block']) : null;
    if (!acknowledgement) {
      for (const candidate of processors) {
        const found = await findAcknowledgement(api, registration, head, candidate, jobId);
        if (found === null) continue;
        const match = await matchAt(api, found, candidate, jobId);
        if (ed25519Keys(match?.decoded?.pubKeys).includes(key)) {
          processor = candidate;
          acknowledgement = found;
          break;
        }
      }
    }
    if (!acknowledgement) throw new Error('No acknowledgement block for a match that holds the key');
    const beforeRegistration = await sequenceAt(api, registration - 1);
    const atRegistration = await sequenceAt(api, registration);
    const registrationRead = await readRegistration(api, registration, jobId);
    const beforeMatch = await matchAt(api, acknowledgement - 1, processor, jobId);
    const atMatch = await matchAt(api, acknowledgement, processor, jobId);
    const {apiAt: acknowledgementApi} = await atBlock(api, acknowledgement);
    const acknowledgementTimestamp = new Date(Number((await acknowledgementApi.query.timestamp.now()).toString())).toISOString();
    const {apiAt} = await atBlock(api, acknowledgement);
    const assigned = await apiAt.query.acurastMarketplace.assignedProcessors.entries(jobId);
    const assignedProcessors = [];
    for (const [storageKey, storageValue] of assigned) {
      for (const arg of storageKey.args) {
        const text = arg.toString();
        if (text.startsWith('5')) assignedProcessors.push(text);
      }
      if (typeof storageValue?.toString === 'function' && storageValue.toString().startsWith('5')) {
        assignedProcessors.push(storageValue.toString());
      }
    }
    const extrinsic = await acknowledgementExtrinsic(api, acknowledgement, processor, key);
    const storedAtAcknowledgement = await acknowledgementApi.query.acurast.storedAttestation(processor);
    if (storedAtAcknowledgement.isEmpty) throw new Error('StoredAttestation is absent at the acknowledgement block');
    const storedHex = storedAtAcknowledgement.toHex();
    const certSerials = certSerialsFrom(storedAtAcknowledgement.toJSON());
    const onboarding = await firstTrue(1, acknowledgement, async (block) => {
      const {apiAt: historic} = await atBlock(api, block);
      const stored = await historic.query.acurast.storedAttestation(processor);
      return !stored.isEmpty && stored.toHex() === storedHex;
    });
    if (onboarding === null) throw new Error('StoredAttestation at the acknowledgement block has no first appearance at or before that block');
    const onboard = await onboardAt(api, onboarding, processor);
    const apiAtHead = await api.at(finalizedHash);
    const chainRevokedSerials = [];
    for (const serialHex of certSerials) {
      const row = await apiAtHead.query.acurast.storedRevokedCertificate(`0x${serialHex}`);
      if (!row.isEmpty) chainRevokedSerials.push(serialHex);
    }
    const cid = String(registrationRead.script).replace(/^ipfs:\/\//, '');
    const artifactBytes = await fetchArtifact(cid);
    const root = await googleRootMatching(onboard.ders[0]);
    const revocation = await googleRevocation();
    const processorAccount = api.createType('AccountId', processor).toHex().replace(/^0x/, '');
    const fixture = {
      network: {
        genesisHash: genesis,
        finalizedAtRead: {block: head, hash: finalizedHash.toHex()},
      },
      publisher: {
        jobId: JSON.stringify([{Acurast: origin}, String(jobNumber)]),
        sequence: String(jobNumber),
        processorId: processor,
        processorAccountHex: processorAccount,
        jobPublicKeys: {ed25519: key},
        acknowledgement: {
          block: acknowledgement,
          blockTimestamp: acknowledgementTimestamp,
          extrinsicIndex: extrinsic.index,
        },
        artifactDigest: artifact,
      },
      reads: {
        registration: {atBlock: registration, script: registrationRead.script},
        storedMatches: {
          atBlock: acknowledgement,
          jobId: JSON.stringify([{Acurast: origin}, String(jobNumber)]),
          decoded: {acknowledged: atMatch?.acknowledged === true, pubKeys: atMatch?.decoded?.pubKeys ?? []},
        },
        assignedProcessors: {processors: [...new Set(assignedProcessors)]},
        acknowledgementExtrinsic: {
          signer: extrinsic.signer,
          call: extrinsic.call,
          args: extrinsic.args,
        },
        artifact: {
          cid,
          bytes: artifactBytes.bytes.length,
          sha256: artifact.replace(/^sha256:/i, ''),
          bytesBase64: artifactBytes.bytes.toString('base64'),
        },
        attestation: {
          atAcknowledgement: {
            block: acknowledgement,
            present: true,
            certSerials,
          },
          storedAttestationValueFirstPresentAt: {block: onboarding},
          onboardExtrinsic: {
            block: onboarding,
            event: onboard.event,
          },
          certificateChainRootFirstDerBase64: onboard.ders.map((der) => Buffer.from(der, 'hex').toString('base64')),
          chainRevokedSerials,
        },
        googleRoot: {root0Pem: root.pem},
        googleRevocation: {chainSerialsListed: revocation.serials},
        search: {
          localJobIdSequence: {
            atBlockBefore: {block: registration - 1, value: beforeRegistration.toString()},
            atRegistrationBlock: {block: registration, value: atRegistration.toString()},
          },
          storedMatchesBefore: {
            block: acknowledgement - 1,
            decoded: {acknowledged: beforeMatch?.acknowledged === true},
          },
        },
      },
    };
    const result = verifyRecorded(fixture);
    delete fixture.reads.artifact.bytesBase64;
    const printable = {
      endpoint,
      registrationBlock: registration,
      acknowledgementBlock: acknowledgement,
      onboardingBlock: onboarding,
      acknowledgementExtrinsic: extrinsic.hash,
      artifactUrl: artifactBytes.url,
      processor,
      facts: fixture,
      verification: result,
    };
    console.log(JSON.stringify(printable, null, 2));
    return result.ok ? 0 : 1;
  } finally {
    await api.disconnect();
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (typeof args.fixture === 'string') {
    const fixture = JSON.parse(readFileSync(args.fixture, 'utf8'));
    const result = verifyRecorded(fixture);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  }
  process.exit(await live(args));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
