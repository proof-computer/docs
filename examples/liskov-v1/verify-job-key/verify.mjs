import {createHash, X509Certificate} from 'node:crypto';

// Node's crypto rejects blake2b with a 32-byte digest (blake2b512 only).
// RFC 7693, unkeyed, sequential, 32-byte output.
const BLAKE2B_IV = [
  0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
  0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n,
];
const BLAKE2B_SIGMA = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
];
const U64 = (1n << 64n) - 1n;
const SINGLE_CHUNK_BYTES = 262144;
const MAINNET_GENESIS = '0x4b5f95eefedf0d0fb514339edc24d2d411310520f687b4146145bcedb99885b9';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export {SINGLE_CHUNK_BYTES, MAINNET_GENESIS};

function add64(left, right) {
  return (left + right) & U64;
}

function rotr64(value, bits) {
  return ((value >> BigInt(bits)) | (value << (64n - BigInt(bits)))) & U64;
}

function load64(buffer, offset) {
  let value = 0n;
  for (let index = 0; index < 8; index += 1) {
    value |= BigInt(buffer[offset + index] ?? 0) << (8n * BigInt(index));
  }
  return value;
}

function store64(buffer, offset, value) {
  for (let index = 0; index < 8; index += 1) {
    buffer[offset + index] = Number((value >> (8n * BigInt(index))) & 0xffn);
  }
}

function blake2bCompress(state, block, byteCount, last) {
  const message = Array.from({length: 16}, (_, index) => load64(block, index * 8));
  const vector = state.slice();
  for (let index = 0; index < 8; index += 1) vector.push(BLAKE2B_IV[index]);
  vector[12] = (vector[12] ^ byteCount) & U64;
  if (last) vector[14] = (vector[14] ^ U64) & U64;
  const mix = (a, b, c, d, x, y) => {
    vector[a] = add64(add64(vector[a], vector[b]), x);
    vector[d] = rotr64(vector[d] ^ vector[a], 32);
    vector[c] = add64(vector[c], vector[d]);
    vector[b] = rotr64(vector[b] ^ vector[c], 24);
    vector[a] = add64(add64(vector[a], vector[b]), y);
    vector[d] = rotr64(vector[d] ^ vector[a], 16);
    vector[c] = add64(vector[c], vector[d]);
    vector[b] = rotr64(vector[b] ^ vector[c], 63);
  };
  for (let round = 0; round < 12; round += 1) {
    const sigma = BLAKE2B_SIGMA[round];
    mix(0, 4, 8, 12, message[sigma[0]], message[sigma[1]]);
    mix(1, 5, 9, 13, message[sigma[2]], message[sigma[3]]);
    mix(2, 6, 10, 14, message[sigma[4]], message[sigma[5]]);
    mix(3, 7, 11, 15, message[sigma[6]], message[sigma[7]]);
    mix(0, 5, 10, 15, message[sigma[8]], message[sigma[9]]);
    mix(1, 6, 11, 12, message[sigma[10]], message[sigma[11]]);
    mix(2, 7, 8, 13, message[sigma[12]], message[sigma[13]]);
    mix(3, 4, 9, 14, message[sigma[14]], message[sigma[15]]);
  }
  for (let index = 0; index < 8; index += 1) {
    state[index] = (state[index] ^ vector[index] ^ vector[index + 8]) & U64;
  }
}

function blake2b(bytes, outlen) {
  const input = Buffer.from(bytes);
  const state = BLAKE2B_IV.map((word, index) => (index === 0 ? word ^ (0x01010000n | BigInt(outlen)) : word));
  let offset = 0;
  if (input.length === 0) {
    blake2bCompress(state, Buffer.alloc(128), 0n, true);
  } else {
    while (offset < input.length) {
      const block = Buffer.alloc(128);
      const take = Math.min(128, input.length - offset);
      input.copy(block, 0, offset, offset + take);
      offset += take;
      blake2bCompress(state, block, BigInt(offset), offset === input.length);
    }
  }
  const out = Buffer.alloc(outlen);
  for (let index = 0; index < outlen / 8; index += 1) store64(out, index * 8, state[index]);
  return out;
}

export function blake2b256(bytes) {
  return blake2b(bytes, 32);
}

export function blake2b256Hex(bytes) {
  return blake2b256(bytes).toString('hex');
}

export function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function encodeVarint(value) {
  const bytes = [];
  let remaining = value;
  while (remaining >= 0x80) {
    bytes.push((remaining & 0x7f) | 0x80);
    remaining = Math.floor(remaining / 128);
  }
  bytes.push(remaining);
  return Buffer.from(bytes);
}

function encodeLengthDelimited(fieldNumber, payload) {
  const body = Buffer.from(payload);
  return Buffer.concat([
    Buffer.from([(fieldNumber << 3) | 2]),
    encodeVarint(body.length),
    body,
  ]);
}

function base58btc(bytes) {
  let value = 0n;
  for (const byte of bytes) value = (value << 8n) + BigInt(byte);
  let encoded = '';
  while (value > 0n) {
    encoded = BASE58[Number(value % 58n)] + encoded;
    value /= 58n;
  }
  for (const byte of bytes) {
    if (byte !== 0) break;
    encoded = `1${encoded}`;
  }
  return encoded || '1';
}

function base58Decode(text) {
  if (typeof text !== 'string' || text.length === 0) throw new Error('SS58 address is empty');
  let value = 0n;
  for (const char of text) {
    const digit = BASE58.indexOf(char);
    if (digit < 0) throw new Error('SS58 address is not base58');
    value = value * 58n + BigInt(digit);
  }
  const bytes = [];
  while (value > 0n) {
    bytes.push(Number(value & 0xffn));
    value >>= 8n;
  }
  bytes.reverse();
  let zeros = 0;
  for (const char of text) {
    if (char !== '1') break;
    zeros += 1;
  }
  return Buffer.concat([Buffer.alloc(zeros), Buffer.from(bytes)]);
}

// SS58 checksum is the first two bytes of BLAKE2b-512("SS58PRE" || prefix || account).
function accountIdHex(value) {
  const text = String(value ?? '').trim();
  if (/^(?:0x)?[0-9a-fA-F]{64}$/.test(text)) return text.replace(/^0x/i, '').toLowerCase();
  try {
    const decoded = base58Decode(text);
    const prefixLength = decoded.length > 0 && (decoded[0] & 0x40) !== 0 ? 2 : 1;
    const bodyLength = prefixLength + 32;
    if (decoded.length !== bodyLength + 2) return null;
    const body = decoded.subarray(0, bodyLength);
    const checksum = blake2b(Buffer.concat([Buffer.from('SS58PRE'), body]), 64);
    if (checksum[0] !== decoded[bodyLength] || checksum[1] !== decoded[bodyLength + 1]) return null;
    return body.subarray(prefixLength).toString('hex');
  } catch {
    return null;
  }
}

// Kubo CIDv0: dag-pb UnixFS file leaf, one chunk, no raw leaves.
export function cidV0(bytes) {
  const body = Buffer.from(bytes);
  if (body.length > SINGLE_CHUNK_BYTES) {
    throw new Error(`multi-chunk artifact: ${body.length} bytes need a UnixFS DAG, and this check refuses to guess the chunker`);
  }
  const unixfs = Buffer.concat([
    Buffer.from([0x08, 0x02]),
    encodeLengthDelimited(2, body),
    Buffer.from([0x18]),
    encodeVarint(body.length),
  ]);
  const node = encodeLengthDelimited(1, unixfs);
  const digest = createHash('sha256').update(node).digest();
  return base58btc(Buffer.concat([Buffer.from([0x12, 0x20]), digest]));
}

export function hexKey(value) {
  return String(value ?? '').replace(/^0x/i, '').toLowerCase();
}

function serialKey(value) {
  const hex = String(value ?? '').toLowerCase().replace(/[^0-9a-f]/g, '').replace(/^0+/, '');
  return hex || '0';
}

function jobIdentity(value) {
  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }
  }
  const pair = Array.isArray(parsed) ? parsed : null;
  if (!pair || pair.length < 2) return null;
  const originText = pair[0]?.Acurast ?? pair[0]?.acurast ?? null;
  const sequence = String(pair[1] ?? '').replace(/\D/g, '');
  const origin = originText ? accountIdHex(originText) : null;
  if (!origin || !sequence) return null;
  return {origin, sequence};
}

function sameJob(left, right) {
  const a = jobIdentity(left);
  const b = jobIdentity(right);
  return Boolean(a && b && a.origin === b.origin && a.sequence === b.sequence);
}

export function ed25519Keys(entries) {
  const keys = [];
  for (const entry of entries ?? []) {
    const raw = entry?.ed25519 ?? entry?.ED25519 ?? entry?.Ed25519;
    if (raw !== undefined) keys.push(hexKey(raw));
  }
  return keys;
}

function certificateOf(encoded) {
  const text = String(encoded);
  if (text.includes('BEGIN CERTIFICATE')) return new X509Certificate(text);
  return new X509Certificate(Buffer.from(text, 'base64'));
}

function compressedP256(certificate) {
  const jwk = certificate.publicKey.export({format: 'jwk'});
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') {
    throw new Error('leaf public key is not P-256');
  }
  const x = Buffer.from(jwk.x, 'base64url');
  const y = Buffer.from(jwk.y, 'base64url');
  if (x.length !== 32 || y.length !== 32) throw new Error('P-256 coordinates are not 32 bytes');
  return Buffer.concat([Buffer.from([y[31] % 2 === 0 ? 0x02 : 0x03]), x]);
}

function spki(certificate) {
  return certificate.publicKey.export({type: 'spki', format: 'der'});
}

function validAt(certificate, time) {
  const from = Date.parse(certificate.validFrom);
  const to = Date.parse(certificate.validTo);
  return Number.isFinite(from) && Number.isFinite(to) && time >= from && time <= to;
}

function checkResult(ok, reason) {
  return ok ? {ok: true, reason: ''} : {ok: false, reason};
}

function sequenceSamples(fixture) {
  const search = fixture?.reads?.search?.localJobIdSequence;
  return [
    search?.atBlockBefore,
    search?.atRegistrationBlock,
  ].filter((sample) => sample && sample.block !== undefined);
}

function acknowledgementSamples(fixture) {
  const before = fixture?.reads?.search?.storedMatchesBefore;
  const at = fixture?.reads?.storedMatches;
  const samples = [];
  if (before) samples.push({block: before.block, acknowledged: before.decoded?.acknowledged === true});
  if (at) samples.push({block: at.atBlock, acknowledged: at.decoded?.acknowledged === true});
  return samples;
}

export function findRegistrationBlock(samples, jobNumber) {
  const job = BigInt(jobNumber);
  const ordered = [...samples].sort((left, right) => Number(left.block) - Number(right.block));
  const found = ordered.find((sample) => BigInt(sample.value) >= job);
  return found ? Number(found.block) : null;
}

export function findAcknowledgementBlock(samples, registrationBlock) {
  const ordered = [...samples].sort((left, right) => Number(left.block) - Number(right.block));
  const found = ordered.find((sample) => Number(sample.block) >= Number(registrationBlock) && sample.acknowledged === true);
  return found ? Number(found.block) : null;
}

function checkStep1(fixture, acknowledgementBlock) {
  const reasons = [];
  const genesis = String(fixture?.network?.genesisHash ?? '').toLowerCase();
  if (genesis !== MAINNET_GENESIS) reasons.push('genesis hash is not Acurast mainnet');
  const finalized = Number(fixture?.network?.finalizedAtRead?.block);
  const registrationBlock = Number(fixture?.reads?.registration?.atBlock);
  if (!(registrationBlock < finalized && acknowledgementBlock < finalized)) {
    reasons.push('registration or acknowledgement block is not below the finalized head');
  }
  const published = hexKey(fixture?.publisher?.jobPublicKeys?.ed25519);
  const matchKeys = ed25519Keys(fixture?.reads?.storedMatches?.decoded?.pubKeys);
  if (fixture?.reads?.storedMatches?.decoded?.acknowledged !== true) reasons.push('match is not acknowledged');
  if (matchKeys.length !== 1) reasons.push(`match holds ${matchKeys.length} ed25519 keys`);
  if (matchKeys.length === 1 && matchKeys[0] !== published) reasons.push('match ed25519 key differs from the published key');
  const processors = fixture?.reads?.assignedProcessors?.processors ?? [];
  if (!processors.includes(fixture?.publisher?.processorId)) reasons.push('processor is not assigned to the job');
  const extrinsic = fixture?.reads?.acknowledgementExtrinsic;
  const call = String(extrinsic?.call ?? '');
  if (!call.endsWith('acknowledgeMatch') && !call.endsWith('acknowledgeExecutionMatch')) {
    reasons.push('acknowledgement extrinsic is not acknowledgeMatch');
  }
  if (extrinsic?.signer !== fixture?.publisher?.processorId) reasons.push('acknowledgement signer is not the processor');
  if (!sameJob(fixture?.publisher?.jobId, fixture?.reads?.storedMatches?.jobId)) {
    reasons.push('match key is for a different job');
  }
  if (!sameJob(fixture?.publisher?.jobId, extrinsic?.args?.job_id)) {
    reasons.push('acknowledgement job id differs from the published job');
  }
  const extrinsicKeys = ed25519Keys(extrinsic?.args?.pub_keys);
  if (!extrinsicKeys.includes(published)) reasons.push('acknowledgement does not publish the ed25519 key');
  return checkResult(reasons.length === 0, reasons.join('; '));
}

function digestHex(value) {
  return hexKey(String(value ?? '').replace(/^sha256:/i, ''));
}

function checkStep2(fixture) {
  const script = String(fixture?.reads?.registration?.script ?? '');
  const cid = script.startsWith('ipfs://') ? script.slice('ipfs://'.length) : '';
  const recordedCid = fixture?.reads?.artifact?.cid;
  const publishedSha = digestHex(fixture?.publisher?.artifactDigest);
  const recordedField = fixture?.reads?.artifact?.sha256;
  const recordedSha = recordedField === undefined || recordedField === null || recordedField === ''
    ? ''
    : digestHex(recordedField);
  const size = Number(fixture?.reads?.artifact?.bytes);
  const reasons = [];
  if (!cid || cid !== recordedCid) reasons.push('registration script CID differs from the artifact CID');
  if (!publishedSha) reasons.push('artifact digest is missing');
  if (!Number.isInteger(size) || size < 0) reasons.push('artifact size is missing');
  else if (size > SINGLE_CHUNK_BYTES) reasons.push('artifact is multi-chunk');
  const encoded = fixture?.reads?.artifact?.bytesBase64;
  if (recordedSha && publishedSha && recordedSha !== publishedSha) {
    reasons.push('published artifact digest differs from the recorded SHA-256');
  }
  if (!recordedSha && !encoded) reasons.push('artifact digest was not recorded or recomputed');
  if (encoded) {
    const bytes = Buffer.from(encoded, 'base64');
    if (publishedSha && sha256Hex(bytes) !== publishedSha) reasons.push('artifact bytes do not hash to the digest');
    try {
      if (cidV0(bytes) !== cid) reasons.push('recomputed CIDv0 differs from the registration script');
    } catch (error) {
      reasons.push(error.message);
    }
  } else if (!fixture?.reads?.artifact?.bytesNotRecorded) {
    reasons.push('artifact bytes are missing');
  }
  return checkResult(reasons.length === 0, reasons.join('; '));
}

function chainCertificates(fixture) {
  const encoded = fixture?.reads?.attestation?.certificateChainRootFirstDerBase64 ?? [];
  const chain = encoded.map(certificateOf);
  const root = certificateOf(fixture?.reads?.googleRoot?.root0Pem);
  return {chain, root};
}

function checkStep3Chain(fixture) {
  try {
    const {chain, root} = chainCertificates(fixture);
    if (chain.length < 2) return checkResult(false, 'certificate chain needs a root and a leaf');
    if (!spki(chain[0]).equals(spki(root))) return checkResult(false, 'chain root SPKI differs from Google root');
    for (let index = 1; index < chain.length; index += 1) {
      if (!chain[index].verify(chain[index - 1].publicKey)) {
        return checkResult(false, `certificate ${index} was not signed by certificate ${index - 1}`);
      }
    }
    return checkResult(true, '');
  } catch (error) {
    return checkResult(false, error.message);
  }
}

function verificationTime(fixture) {
  const parsed = Date.parse(fixture?.publisher?.acknowledgement?.blockTimestamp ?? '');
  return Number.isFinite(parsed) ? parsed : null;
}

function checkStep3Validity(fixture) {
  const time = verificationTime(fixture);
  if (time === null) return checkResult(false, 'acknowledgement time is missing');
  try {
    const {chain, root} = chainCertificates(fixture);
    const certificates = [...chain, root];
    const expired = certificates.filter((certificate) => !validAt(certificate, time));
    return checkResult(expired.length === 0, expired.length === 0 ? '' : 'a certificate is outside its validity at the acknowledgement time');
  } catch (error) {
    return checkResult(false, error.message);
  }
}

function revokedSerials(fixture) {
  const google = fixture?.reads?.googleRevocation?.chainSerialsListed;
  const chain = fixture?.reads?.attestation?.chainRevokedSerials;
  if (!Array.isArray(google)) return {missing: 'Google revocation list was not read'};
  if (!Array.isArray(chain)) return {missing: 'chain revocation list was not read'};
  return {missing: '', serials: new Set([...google, ...chain].map(serialKey))};
}

function checkStep3Revocation(fixture) {
  try {
    const revoked = revokedSerials(fixture);
    if (revoked.missing) return checkResult(false, revoked.missing);
    const {chain} = chainCertificates(fixture);
    const listed = chain.filter((certificate) => revoked.serials.has(serialKey(certificate.serialNumber)));
    return checkResult(listed.length === 0, listed.length === 0 ? '' : 'a chain serial is revoked');
  } catch (error) {
    return checkResult(false, error.message);
  }
}

function checkStep3Stored(fixture) {
  const read = fixture?.reads?.attestation?.atAcknowledgement;
  if (!read || typeof read !== 'object') {
    return checkResult(false, 'StoredAttestation was not read at the acknowledgement block');
  }
  if (read.present !== true) return checkResult(false, 'StoredAttestation is absent at the acknowledgement block');
  const acknowledgement = Number(fixture?.publisher?.acknowledgement?.block);
  if (Number(read.block) !== acknowledgement) {
    return checkResult(false, 'StoredAttestation read is not at the acknowledgement block');
  }
  const event = String(fixture?.reads?.attestation?.onboardExtrinsic?.event ?? '');
  if (!event.endsWith('AttestationStoredV2')) {
    return checkResult(false, 'onboarding extrinsic has no AttestationStoredV2 event');
  }
  const first = Number(fixture?.reads?.attestation?.storedAttestationValueFirstPresentAt?.block);
  const onboardBlock = Number(fixture?.reads?.attestation?.onboardExtrinsic?.block);
  if (!Number.isInteger(first) || first !== onboardBlock || first > acknowledgement) {
    return checkResult(false, 'onboarding extrinsic is not the block where the stored attestation appeared');
  }
  const storedSerials = read.certSerials;
  if (!Array.isArray(storedSerials) || storedSerials.length < 2) {
    return checkResult(false, 'StoredAttestation certificate ids are missing');
  }
  try {
    const {chain} = chainCertificates(fixture);
    if (chain.length !== storedSerials.length) {
      return checkResult(false, 'certificate chain length differs from the stored certificate ids');
    }
    for (let index = 0; index < chain.length; index += 1) {
      if (serialKey(chain[index].serialNumber) !== serialKey(storedSerials[index])) {
        return checkResult(false, 'certificate serial differs from the stored certificate id');
      }
    }
    return checkResult(true, '');
  } catch (error) {
    return checkResult(false, error.message);
  }
}

function checkStep3Account(fixture) {
  try {
    const {chain} = chainCertificates(fixture);
    if (chain.length < 2) return checkResult(false, 'certificate chain needs a root and a leaf');
    const leaf = chain[chain.length - 1];
    const compressed = compressedP256(leaf);
    const recorded = hexKey(fixture?.reads?.attestation?.leafCompressedP256);
    if (recorded && compressed.toString('hex') !== recorded) {
      return checkResult(false, 'leaf key differs from the recorded compressed key');
    }
    const account = blake2b256Hex(compressed);
    const processor = hexKey(fixture?.publisher?.processorAccountHex);
    return checkResult(account === processor, account === processor ? '' : 'BLAKE2b-256 of the leaf key differs from the processor account');
  } catch (error) {
    return checkResult(false, error.message);
  }
}

export function verifyRecorded(fixture) {
  const jobNumber = String(fixture?.publisher?.sequence ?? '');
  const registrationFound = findRegistrationBlock(sequenceSamples(fixture), jobNumber);
  const registrationClaimed = Number(fixture?.reads?.registration?.atBlock);
  const registrationSearch = {
    ok: registrationFound === registrationClaimed,
    found: registrationFound,
    reason: registrationFound === registrationClaimed ? '' : `registration search found ${registrationFound}`,
  };
  const acknowledgementFound = registrationFound === null
    ? null
    : findAcknowledgementBlock(acknowledgementSamples(fixture), registrationFound);
  const acknowledgementClaimed = Number(fixture?.publisher?.acknowledgement?.block);
  const acknowledgementSearch = {
    ok: acknowledgementFound === acknowledgementClaimed,
    found: acknowledgementFound,
    reason: acknowledgementFound === acknowledgementClaimed ? '' : `acknowledgement search found ${acknowledgementFound}`,
  };
  const checks = {
    registrationSearch,
    acknowledgementSearch,
    step1: checkStep1(fixture, acknowledgementClaimed),
    step2: checkStep2(fixture),
    step3Chain: checkStep3Chain(fixture),
    step3Validity: checkStep3Validity(fixture),
    step3Revocation: checkStep3Revocation(fixture),
    step3Stored: checkStep3Stored(fixture),
    step3Account: checkStep3Account(fixture),
  };
  return {
    ok: Object.values(checks).every((check) => check.ok),
    registrationBlock: registrationFound,
    acknowledgementBlock: acknowledgementFound,
    checks,
  };
}
