import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {dirname, extname, join, relative, resolve, sep} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docsRoot = join(root, 'docs', 'liskov');
const sidebarPath = join(root, 'sidebarsLiskov.ts');
const manifestPath = join(root, 'examples', 'liskov-v1', 'application-manifest.json');
const workflowPath = join(root, 'examples', 'liskov-v1', 'liskov.yml');
const errors = [];

const expectedIds = [
  'index',
  'get-started/index',
  'get-started/choose-your-path',
  'get-started/set-up-liskov',
  'get-started/marketplace',
  'get-started/github',
  'get-started/first-deployment',
  'build/index',
  'build/workload-requirements',
  'build/runtime-sdk',
  'build/manifest-v4',
  'build/github-actions',
  'build/artifacts-provenance',
  'build/validate-import-publish',
  'configure/index',
  'configure/variables',
  'configure/secrets',
  'configure/resources-networking',
  'configure/schedules-updates',
  'configure/processor-placement',
  'configure/logging-diagnostics',
  'configure/spend-limits',
  'operate/index',
  'operate/status-action-plan',
  'operate/deployments-jobs',
  'operate/proof-chain',
  'operate/logs-activity',
  'operate/update',
  'operate/pause-resume',
  'operate/diagnose-retry',
  'operate/retire',
  'marketplace/index',
  'marketplace/options',
  'marketplace/uptime-prober',
  'marketplace/verify',
  'organizations/index',
  'organizations/teams',
  'organizations/roles',
  'organizations/service-credits',
  'organizations/charges',
  'organizations/records-notifications',
  'concepts/index',
  'concepts/how-liskov-works',
  'concepts/domain-model',
  'concepts/replacement-custody',
  'concepts/trust-boundaries',
  'concepts/attestation',
  'concepts/costs-custody',
  'concepts/product-boundaries',
  'reference/index',
  'reference/cli',
  'reference/manifest-v4',
  'reference/runtime-sdk',
  'reference/capabilities',
  'reference/statuses-actions-errors',
  'reference/configuration-precedence',
  'reference/schema-endpoints',
  'reference/glossary',
  'troubleshooting/index',
  'troubleshooting/account-funding',
  'troubleshooting/build-publish',
  'troubleshooting/deployment',
  'troubleshooting/config-bootstrap',
  'troubleshooting/logs',
  'troubleshooting/billing-retirement',
  'troubleshooting/support',
];

function walk(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function idFor(file) {
  return relative(docsRoot, file).split(sep).join('/').replace(/\.md$/, '');
}

const files = walk(docsRoot).filter((file) => extname(file) === '.md').sort();
const ids = files.map(idFor);
check(
  JSON.stringify(ids) === JSON.stringify([...expectedIds].sort()),
  `page inventory differs\nexpected: ${[...expectedIds].sort().join(', ')}\nactual: ${ids.join(', ')}`,
);

const allContent = [readFileSync(join(root, 'src', 'pages', 'index.tsx'), 'utf8')];
for (const file of files) {
  const id = idFor(file);
  const content = readFileSync(file, 'utf8');
  allContent.push(content);

  check(content.startsWith('---\n'), `${id}: missing frontmatter`);
  const frontmatterEnd = content.indexOf('\n---\n', 4);
  check(frontmatterEnd > 4, `${id}: malformed frontmatter`);
  const frontmatter = frontmatterEnd > 4 ? content.slice(4, frontmatterEnd) : '';
  check(/^title:\s+\S.+$/m.test(frontmatter), `${id}: missing title`);
  check(/^description:\s+\S.+$/m.test(frontmatter), `${id}: missing description`);

  let inFence = false;
  let h1Count = 0;
  let previousLevel = 0;
  for (const line of content.split('\n')) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const heading = /^(#{1,6})\s+\S/.exec(line);
    if (!heading) continue;
    const level = heading[1].length;
    if (level === 1) h1Count += 1;
    if (previousLevel > 0 && level > previousLevel + 1) {
      errors.push(`${id}: heading level jumps from h${previousLevel} to h${level}`);
    }
    previousLevel = level;
  }
  check(!inFence, `${id}: unclosed code fence`);
  check(h1Count === 1, `${id}: expected one H1, found ${h1Count}`);

  for (const match of content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    const label = match[1].trim().toLowerCase();
    const target = match[2].split('#')[0];
    check(!['here', 'click here', 'this'].includes(label), `${id}: non-descriptive link text "${match[1]}"`);
    if (!target || /^(?:https?:|mailto:|\/baran)/.test(target)) continue;
    if (target.startsWith('/liskov')) {
      const routeId = target.replace(/^\/liskov\/?/, '') || 'index';
      check(expectedIds.includes(routeId), `${id}: broken Liskov route ${target}`);
      continue;
    }
    const candidate = resolve(dirname(file), target);
    const valid = existsSync(candidate)
      || existsSync(`${candidate}.md`)
      || existsSync(join(candidate, 'index.md'));
    check(valid, `${id}: broken local link ${match[2]}`);
  }
}

const combined = allContent.join('\n');
for (const [pattern, explanation] of [
  [/\bliskov\.json\b/i, 'retired manifest filename'],
  [/proof liskov (?:admin|custody)\b/i, 'internal command prefix'],
  [/override-replacement-hold/i, 'internal replacement override'],
  [/\bzero[- ]trust\b/i, 'unsupported zero-trust claim'],
  [/\b(?:just|simply|obviously)\b/i, 'unfriendly shortcut word'],
  [/\bTBD\b|\bTODO\b|coming soon/i, 'placeholder copy'],
]) {
  check(!pattern.test(combined), `public content contains ${explanation}: ${pattern}`);
}

for (const oldDirectory of ['quickstart', 'policy', 'guides']) {
  check(!existsSync(join(docsRoot, oldDirectory)), `legacy directory remains: ${oldDirectory}`);
}
check(!existsSync(join(docsRoot, 'preview')), 'Preview navigation exists without confirmed availability');
check(!existsSync(join(docsRoot, 'marketplace', 'openclaw.md')), 'OpenClaw page exists without a versioned descriptor');
check(!existsSync(join(root, 'static', 'examples', 'liskov')), 'superseded downloadable Liskov examples remain public');

const sidebar = readFileSync(sidebarPath, 'utf8');
const publicEntry = allContent[0];
check(!publicEntry.includes('to="/liskov/quickstart"'), 'homepage links to retired quickstart route');
check(!publicEntry.includes('to="/liskov/guides"'), 'homepage links to retired guides route');
for (const id of expectedIds) {
  check(sidebar.includes(`'${id}'`), `sidebar omits ${id}`);
}
check(!/Preview|openclaw|cargo/i.test(sidebar), 'sidebar exposes an unavailable Preview/OpenClaw/Cargo path');

const redirectConfig = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const redirectSources = new Set(redirectConfig.redirects.map((item) => item.source));
check(redirectSources.size === redirectConfig.redirects.length, 'redirect map contains duplicate sources');
for (const redirect of redirectConfig.redirects) {
  check(redirect.permanent === true, 'redirect is not permanent: ' + redirect.source);
  check(redirect.source !== redirect.destination, 'redirect loops to itself: ' + redirect.source);
  if (redirect.destination.startsWith('/liskov')) {
    const destinationId = redirect.destination.replace(/^\/liskov\/?/, '') || 'index';
    check(expectedIds.includes(destinationId) || expectedIds.includes(destinationId + '/index'), 'redirect has missing destination: ' + redirect.source + ' -> ' + redirect.destination);
  }
}
for (const oldPath of [
  '/liskov/quickstart',
  '/liskov/quickstart/install',
  '/liskov/quickstart/first-deploy',
  '/liskov/policy',
  '/liskov/guides',
  '/liskov/guides/github-launches',
  '/liskov/guides/sealed-secrets',
  '/liskov/reference/policy-schema',
  '/liskov/reference/reconcile-states',
  '/liskov/troubleshooting/replacement-holds',
]) {
  check(redirectSources.has(oldPath), `redirect map omits ${oldPath}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
check(manifest.schema === 'proof.liskov.application-manifest', 'fixture: wrong manifest schema');
check(manifest.schemaVersion === 4, 'fixture: wrong schemaVersion');
check(manifest.deployment?.parallelism === 1, 'fixture: public parallelism must be 1');
check(manifest.deployment?.placement?.processorSelection?.mode === 'open_market', 'fixture: public placement must be open_market');
check(manifest.deployment?.lifecycle?.renewal?.mode === 'after_scheduled_end', 'fixture: unsupported renewal recipe');
check(manifest.deployment?.lifecycle?.update?.existingJobs?.mode === 'run_until_scheduled_end', 'fixture: unsupported predecessor behavior');
check(manifest.deployment?.lifecycle?.recovery?.runtimeFailure?.mode === 'wait_until_scheduled_end', 'fixture: unsupported runtime recovery');
check(!('ingress' in manifest), 'fixture: general ingress must not appear in the public recipe');

const workflow = readFileSync(workflowPath, 'utf8');
check(workflow.includes('acurast-app.yml@v1'), 'workflow fixture: missing release-gated @v1 reference');
check(workflow.includes('id-token: write'), 'workflow fixture: missing OIDC permission');
check(workflow.includes('contents: read'), 'workflow fixture: missing contents permission');
check(workflow.includes('authored-manifest-path:'), 'workflow fixture: missing manifest input');
check(!/yes-spend|bearer|LISKOV_TOKEN/i.test(workflow), 'workflow fixture: contains a spend or bearer credential');

for (const [fileId, required] of Object.entries({
  'get-started/choose-your-path': ['Marketplace', 'GitHub'],
  'get-started/set-up-liskov': ['Stripe', 'Available', 'Reserved'],
  'get-started/marketplace': ['Uptime Prober', 'Telegram', 'Verify'],
  'get-started/github': ['Release gate', 'artifact-version-id', 'Proof'],
  'operate/proof-chain': ['GitHub OIDC', 'policy digest', 'runtime instance'],
  'troubleshooting/deployment': ['Normal waiting', 'Needs action', 'decision-id'],
  'reference/configuration-precedence': ['Application-managed value', 'process.env', 'Signed runtime bootstrap'],
  'operate/pause-resume': ['does not force-stop', 'scheduled end'],
  'operate/update': ['successor', 'without mutating'],
  'operate/retire': ['does not stop existing jobs', 'receipt'],
  'reference/capabilities': ['Release-gated v1', 'Preview', 'Internal', 'Not v1'],
  'concepts/trust-boundaries': ['briefly PROOF over TLS', 'Plaintext is not persisted'],
  'troubleshooting/support': ['Never include', 'Application UID', 'runtime-instance ID'],
})) {
  const page = readFileSync(join(docsRoot, `${fileId}.md`), 'utf8');
  for (const token of required) {
    check(page.toLowerCase().includes(token.toLowerCase()), `retrieval audit: ${fileId} omits "${token}"`);
  }
}

for (const command of [
  'proof liskov login',
  'proof liskov whoami',
  'proof liskov organization use',
  'proof liskov application manifest validate',
  'proof liskov application import',
  'proof liskov application publish',
  'proof liskov application status',
  'proof liskov application action-plan',
  'proof liskov application pause',
  'proof liskov application resume',
  'proof liskov application retire',
]) {
  check(combined.includes(command), `public command audit: missing ${command}`);
}

check(combined.includes('v0.3.26'), 'runtime reference omits the supported SDK version');
check(combined.includes('QmQCpRJ593xRyKko9smvtFixzfAGwDuG6gXBemRtUeSe4U'), 'Uptime Prober CID differs from descriptor');
check(combined.includes('7545ffe44288c548ff4dea09ef0c0dc318a8dd490c5dc822becec3ff0d307d57'), 'Uptime Prober digest differs from descriptor');
check(combined.includes('UPTIME_PROBER_TG_BOT_TOKEN'), 'Uptime Prober secret destination differs from descriptor');

if (errors.length > 0) {
  console.error(`Liskov docs checks failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Liskov docs checks passed: ${files.length} pages, ${redirectSources.size} redirects, fixtures and retrieval map verified.`);
