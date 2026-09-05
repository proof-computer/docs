import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {dirname, extname, join, relative, resolve, sep} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docsRoot = join(root, 'docs', 'liskov');
const baranRoot = join(root, 'docs', 'baran');
const sidebarPath = join(root, 'sidebarsLiskov.ts');
const manifestPath = join(root, 'examples', 'liskov-v1', 'application-manifest.json');
const workflowPath = join(root, 'examples', 'liskov-v1', 'liskov.yml');
const cliContractPath = join(root, 'fixtures', 'liskov-cli-contract.json');
const v5ReleaseContractPath = join(root, 'fixtures', 'liskov-v5-release-contract.json');
const v5ManifestPath = join(root, 'fixtures', 'liskov-v5-retained-manifest.json');
const errors = [];

const baseExpectedIds = [
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
  'operate/processors',
  'operate/proof-chain',
  'operate/logs-activity',
  'operate/update',
  'operate/pause-resume',
  'operate/diagnose-retry',
  'operate/retire',
  'operate/integrations',
  'operate/runtime-ssh',
  'marketplace/index',
  'marketplace/options',
  'marketplace/uptime-prober',
  'marketplace/verify',
  'organizations/index',
  'organizations/teams',
  'organizations/roles',
  'organizations/service-credits',
  'organizations/charges',
  'organizations/network-costs-and-outcomes',
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

const v5ReleaseContract = JSON.parse(readFileSync(v5ReleaseContractPath, 'utf8'));
const v5DocumentationModes = ['release_gated', 'promotion_prepared', 'public'];
const v5Mode = v5ReleaseContract.documentationMode;
const v5PromotedIds = [
  'build/manifest-v5',
  'operate/runtime-ssh-v5',
  'reference/manifest-v5',
];
const v5PagesPromoted = v5Mode === 'promotion_prepared' || v5Mode === 'public';
const expectedIds = [
  ...baseExpectedIds,
  ...(v5PagesPromoted ? v5PromotedIds : []),
];

const releaseGatedIds = [
  'get-started/marketplace',
  'marketplace/index',
  'marketplace/options',
  'marketplace/uptime-prober',
  'marketplace/verify',
];

// Legal-review artifacts are versioned in the public source repository so
// counsel and owners can review exact text, but they are not customer terms or
// capability documentation until their publication gates close. Docusaurus'
// `draft: true` excludes them from the production build. Keep the list explicit
// so adding or accidentally publishing a legal document changes this check.
const legalReviewDraftIds = [
  'legal/index',
  'legal/legal-review-memorandum',
  'legal/master-terms',
  'legal/service-credits-and-payments-policy',
  'legal/acceptable-use-policy',
  'legal/privacy-notice',
  'legal/data-processing-addendum',
  'legal/cookie-notice',
  'legal/marketplace-terms',
  'legal/marketplace-notice-and-action-policy',
  'legal/subprocessors',
  'legal/change-log',
  'legal/launch-sign-off-matrix',
  'legal/implementation-copy',
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
const baranFiles = walk(baranRoot).filter((file) => extname(file) === '.md').sort();

// Unreleased contracts drafted ahead of implementation. They are written as
// though final so the design can be reviewed for inconsistency before coding
// starts, so they must build and be link-checked — but they document a
// capability no customer can reach, and `reference/capabilities.md` stays the
// availability owner. Same treatment as the private-alpha Baran pages: kept out
// of the sidebar, out of the sitemap, and out of the inventory.
const unlistedIds = new Set([
  ...(!v5PagesPromoted ? v5PromotedIds : []),
  'configure/clustering',
  'build/encrypted-javascript',
]);

const ids = files
  .map(idFor)
  .filter((id) => !unlistedIds.has(id) && !legalReviewDraftIds.includes(id))
  .sort();
check(
  JSON.stringify(ids) === JSON.stringify([...expectedIds].sort()),
  `page inventory differs\nexpected: ${[...expectedIds].sort().join(', ')}\nactual: ${ids.join(', ')}`,
);

for (const id of unlistedIds) {
  const file = join(docsRoot, `${id}.md`);
  if (!existsSync(file)) {
    check(false, `unlisted page ${id} is declared but missing`);
    continue;
  }
  const content = readFileSync(file, 'utf8');
  check(content.startsWith('---\nunlisted: true\n'), `${id}: unreleased page is not unlisted`);
  check(content.includes(':::danger[Not released]'), `${id}: unreleased page omits the not-released notice`);
}

for (const id of legalReviewDraftIds) {
  const file = join(docsRoot, `${id}.md`);
  if (!existsSync(file)) {
    check(false, `legal review draft ${id} is declared but missing`);
    continue;
  }
  const content = readFileSync(file, 'utf8');
  const frontmatterEnd = content.indexOf('\n---\n', 4);
  const frontmatter = frontmatterEnd > 4 ? content.slice(4, frontmatterEnd) : '';
  check(/^draft: true$/mu.test(frontmatter), `${id}: legal review page is not a Docusaurus draft`);
  check(/not in force/i.test(content), `${id}: legal review page omits the not-in-force notice`);
  check(/3 September 2026/i.test(content), `${id}: legal review page omits the reviewed source date`);
}

const legalReviewSourceManifest = readFileSync(
  join(docsRoot, 'legal', 'source-sha256s.txt'),
  'utf8',
);
check(
  legalReviewSourceManifest.includes('733512277ff9385d9c8a4339e47ec150245c73bfd775b6248f71be172421d915'),
  'legal review source manifest omits the supplied final-bundle digest',
);

const approvedLegalIdentityDrafts = [
  readFileSync(join(docsRoot, 'legal', 'index.md'), 'utf8'),
  readFileSync(join(docsRoot, 'legal', 'master-terms.md'), 'utf8'),
  readFileSync(join(docsRoot, 'legal', 'privacy-notice.md'), 'utf8'),
];
const approvedLegalIdentityText = approvedLegalIdentityDrafts.join('\n');
for (const token of [
  'MOOSE LABS LTD',
  '11435949',
  'GB311456142',
  'The Old Bakery, Camden Road, Tunbridge Wells, England, TN1 2QP',
  'trading as **PROOF**',
  'hello@proof.computer',
]) {
  check(approvedLegalIdentityText.includes(token), `approved legal identity omits: ${token}`);
}
check(
  !legalReviewDraftIds.some((id) => readFileSync(join(docsRoot, `${id}.md`), 'utf8').includes('trading as PROOF.COMPUTER')),
  'legal review drafts retain the rejected PROOF.COMPUTER trading name',
);
check(
  readFileSync(join(docsRoot, 'legal', 'launch-sign-off-matrix.md'), 'utf8').includes('Complete — owner approved 4 September 2026'),
  'contracting-entity sign-off is not recorded as complete',
);
check(
  readFileSync(join(docsRoot, 'legal', 'launch-sign-off-matrix.md'), 'utf8').includes('provide a non-production Liskov runtime configured with Stripe test API/webhook credentials'),
  'launch sign-off matrix lost the named Stripe canary owner action',
);
const launchSignOffMatrix = readFileSync(join(docsRoot, 'legal', 'launch-sign-off-matrix.md'), 'utf8');
check(
  launchSignOffMatrix.includes('Product/Legal verified all seven pre-existing non-personal organisations as internal'),
  'launch sign-off matrix lost the completed B2B-only existing-organisation verification',
);
check(
  launchSignOffMatrix.includes('exact legal copy belongs on sign-up, login and the Terms, not in the hero'),
  'launch sign-off matrix lost the approved Liskov homepage copy placement',
);
const masterTermsPage = readFileSync(join(docsRoot, 'legal', 'master-terms.md'), 'utf8');
check(masterTermsPage.includes('The Services are not available for consumer use.'), 'Master Terms lost the approved strict consumer boundary');
check(!masterTermsPage.includes('Consumer use requires separate written terms signed by PROOF.'), 'Master Terms still offers the rejected signed consumer exception');
const implementationCopyPage = readFileSync(join(docsRoot, 'legal', 'implementation-copy.md'), 'utf8');
check(implementationCopyPage.includes('liskov.business-eligibility.v1'), 'implementation copy omits the approved eligibility statement version');
check(implementationCopyPage.includes('There is no self-service or manual consumer exception.'), 'implementation copy omits the approved strict consumer response');
check(implementationCopyPage.includes('I am authorised to create this Workspace for **[Customer legal name]**.'), 'implementation copy omits the approved split clickwrap wording');
check(implementationCopyPage.includes('Create Workspace and accept'), 'implementation copy omits the approved clickwrap button');
check(!implementationCopyPage.includes('agree on behalf of **[Customer legal name]** to the **Order**'), 'implementation copy still accepts an Order before one exists');
check(launchSignOffMatrix.includes('Product/Legal approved the exact split Workspace/Order formation copy'), 'launch sign-off matrix lost the active LGL-04 approval');

const marketplaceTermsDraft = readFileSync(
  join(docsRoot, 'legal', 'marketplace-terms.md'),
  'utf8',
);
for (const token of [
  'Business users only — free listings only',
  'PROOF does not collect money or cryptoassets for a Publisher',
  'paid listings require separate terms and written activation by PROOF',
  'Reviews/ratings must not be enabled until PROOF has completed its Online Safety Act scope/risk work',
]) {
  check(marketplaceTermsDraft.includes(token), `Free Marketplace Terms omit reviewed launch boundary: ${token}`);
}

const allContent = [readFileSync(join(root, 'src', 'pages', 'index.tsx'), 'utf8')];
for (const file of files) {
  const id = idFor(file);
  const content = readFileSync(file, 'utf8');
  if (!legalReviewDraftIds.includes(id)) allContent.push(content);

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
check(!/\bBaran\b/.test(combined), 'normal Liskov documentation exposes private-alpha Baran');
for (const [pattern, explanation] of [
  [/\bliskov\.json\b/i, 'retired manifest filename'],
  [/proof liskov (?:admin|custody)\b/i, 'internal command prefix'],
  [/override-replacement-hold/i, 'internal replacement override'],
  [/\bzero[- ]trust\b/i, 'unsupported zero-trust claim'],
  [/\b(?:just|simply|obviously)\b/i, 'unfriendly shortcut word'],
  [/\bblackbox\b|BLACKBOX_/i, 'internal logging implementation name'],
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

const retirementPage = readFileSync(join(docsRoot, 'operate', 'retire.md'), 'utf8');
const capabilitiesPage = readFileSync(join(docsRoot, 'reference', 'capabilities.md'), 'utf8');
const githubActionsPage = readFileSync(join(docsRoot, 'build', 'github-actions.md'), 'utf8');
check(capabilitiesPage.includes('| Encrypted JavaScript payload delivery | Release-gated v1;'),
  'encrypted JavaScript must remain gated until the released workflow and production canary are accepted');
check(capabilitiesPage.includes('| Private customer code inside Cargo images | Not v1;'),
  'JavaScript acceptance must not silently promote Cargo cache confidentiality');

const liskovIndexPage = readFileSync(join(docsRoot, 'index.md'), 'utf8');
const setupPage = readFileSync(join(docsRoot, 'get-started', 'set-up-liskov.md'), 'utf8');
const processorsPage = readFileSync(join(docsRoot, 'operate', 'processors.md'), 'utf8');
const artifactPinHelper = readFileSync(join(root, 'scripts', 'post-slipway-artifact-pin.mjs'), 'utf8');
const marketplaceStartPage = readFileSync(join(docsRoot, 'get-started', 'marketplace.md'), 'utf8');
const serviceCreditsPage = readFileSync(join(docsRoot, 'organizations', 'service-credits.md'), 'utf8');
const recordsNotificationsPage = readFileSync(join(docsRoot, 'organizations', 'records-notifications.md'), 'utf8');
const chargesPage = readFileSync(join(docsRoot, 'organizations', 'charges.md'), 'utf8');
const outcomesPage = readFileSync(join(docsRoot, 'organizations', 'network-costs-and-outcomes.md'), 'utf8');
const costsCustodyPage = readFileSync(join(docsRoot, 'concepts', 'costs-custody.md'), 'utf8');
const deploymentsPage = readFileSync(join(docsRoot, 'operate', 'deployments-jobs.md'), 'utf8');
const billingRetirementPage = readFileSync(join(docsRoot, 'troubleshooting', 'billing-retirement.md'), 'utf8');
const accountFundingPage = readFileSync(join(docsRoot, 'troubleshooting', 'account-funding.md'), 'utf8');
const teamsPage = readFileSync(join(docsRoot, 'organizations', 'teams.md'), 'utf8');
const rolesPage = readFileSync(join(docsRoot, 'organizations', 'roles.md'), 'utf8');
// BKLG-20260903-ytrn — the Team page and the seat allowance.
//
// The seat rule is the launch decision of 2026-09-03: refuse beyond the
// allowance, no overage. These pin the parts a customer acts on, and the two
// claims the authorization model will not back.
check(
  /An invitation that would take the organization past\s+its allowance is refused/.test(teamsPage),
  'teams page does not state that an invitation past the seat allowance is refused',
);
check(
  /There is no seat overage/.test(teamsPage),
  'teams page omits the no-overage rule',
);
check(
  /the previous link stops\s+working/i.test(teamsPage),
  'teams page does not warn that resending retires the previous invitation link',
);
check(
  /every organization\s+currently resolves to the Free allowance of \*\*one seat\*\*/.test(teamsPage),
  'teams page omits the release-gated single-seat reality',
);
check(
  /\| Organizations, persistent and request-scoped CLI selection, team invitations, assignable roles \| v1; the plan seat allowance is enforced at invite time with no overage/.test(capabilitiesPage),
  'capability matrix does not record the enforced seat allowance',
);
check(
  /These roles are \*\*not a ladder\*\*/.test(rolesPage),
  'roles page omits the not-a-ladder statement',
);
check(
  !/and above/i.test(rolesPage),
  'roles page describes a role hierarchy the authorization code does not have',
);
check(
  !/\bauditor\b/i.test(rolesPage) && !/\bauditor\b/i.test(teamsPage),
  'organization docs name a role (auditor) that has never existed',
);
check(
  /Grant or revoke Admin \| The \*\*Owner\*\* only/.test(rolesPage),
  'roles page does not record that granting Admin is the Owner\'s alone',
);
check(
  /changing or\s+removing someone's role, or suspending them, does not revoke their key/.test(rolesPage),
  'roles page omits that a role or suspension does not govern Runtime SSH keys',
);
check(
  !/suspending and reinstating a member is not yet available/.test(teamsPage),
  'teams page still says suspend/reinstate is unavailable',
);
check(
  /An admin can\s+\*\*suspend\*\* a member and \*\*reinstate\*\* them/.test(teamsPage),
  'teams page does not describe the suspend and reinstate control',
);
check(
  /keep their membership, their role, and their seat/.test(teamsPage),
  'teams page omits that a suspended member keeps role and seat',
);
check(
  /Suspending a member does not revoke Runtime SSH operator keys/.test(teamsPage),
  'teams page omits that suspension does not revoke Runtime SSH keys',
);

check(
  !/retirement contract[\s\S]{0,120}(?:still gated|release gate)/i.test(retirementPage),
  'retirement page retains the removed production release gate',
);
check(
  /\| Safe retirement and immutable receipt \| v1 \|/.test(capabilitiesPage),
  'capability matrix does not classify released retirement as v1',
);
check(githubActionsPage.includes('v1.2.2'), 'GitHub Actions page omits the verified v1 release');
check(
  !/v1[^\n]{0,80}(?:not yet published|does not yet publish)/i.test(githubActionsPage),
  'GitHub Actions page retains the removed v1 release gate',
);
check(!liskovIndexPage.includes('./get-started/marketplace.md'), 'Liskov landing page recommends release-gated Marketplace launch');
check(!/Choose \*\*Add funds\*\*/i.test(setupPage), 'setup page contains a release-gated add-funds recipe');
check(setupPage.includes('Business use only'), 'setup page omits the business-only creation gate');
check(setupPage.includes('not pre-selected'), 'setup page does not state the eligibility checkbox default');
check(/Country where your business is\s+established/.test(teamsPage), 'organizations page omits the business-country field');
check(/There is no\s+self-service or manual consumer exception/.test(teamsPage), 'organizations page omits the strict consumer response');
check(capabilitiesPage.includes('business-purpose/18+/authority statement'), 'capability matrix omits the B2B-only organization boundary');
const statusesActionsErrorsPage = readFileSync(join(docsRoot, 'reference', 'statuses-actions-errors.md'), 'utf8');
for (const code of [
  'business_eligibility_required',
  'business_eligibility_version_mismatch',
  'business_country_required',
  'invalid_business_country_code',
]) {
  check(statusesActionsErrorsPage.includes(`\`${code}\``), `error reference omits ${code}`);
}
for (const [surface, content] of [['setup', setupPage], ['processor task', processorsPage]]) {
  check(content.includes('https://console.liskov.proof.computer'), `${surface} omits the permanent console link`);
  check(!content.includes('https://liskov.proof.computer'), `${surface} still recommends the retired apex`);
}
check(
  artifactPinHelper.includes('https://console.liskov.proof.computer/api/applications/{applicationId}/artifact-pins/github'),
  'artifact-pin helper still defaults to the retiring apex',
);
check(!/^## \d+\./m.test(marketplaceStartPage), 'Marketplace release-boundary page contains a step-by-step launch recipe');
check(!/continue to Stripe|complete the Stripe checkout/i.test(serviceCreditsPage), 'Service Credit read page contains a release-gated checkout recipe');
check(/VAT is\s+collected separately: it never becomes Service Credit/.test(serviceCreditsPage), 'Service Credit read page omits the VAT/credit boundary');
check(recordsNotificationsPage.includes('subtotal before tax, VAT/tax, and total'), 'billing records page omits the typed invoice tax breakdown');
check(capabilitiesPage.includes('mints only the pre-tax Service Credit face value'), 'capability matrix omits the release-gated Checkout tax boundary');
check(
  chargesPage.includes('Execution evidence determines whether Liskov may settle a managed final charge.'),
  'charge task does not say what authorizes managed settlement',
);
check(
  /gross refund[\s\S]{0,180}settlement's locked rate/i.test(chargesPage),
  'charge task does not bind reclaim to finalized gross refund at the locked rate',
);
check(
  /included deregistration[\s\S]{0,320}no\s+deregistration was submitted/i.test(chargesPage),
  'charge task does not distinguish included zero from no submitted deregistration',
);
check(!/^## Stripe checkout succeeded/m.test(accountFundingPage), 'troubleshooting contains a customer Stripe checkout procedure');
check(accountFundingPage.includes('do not change this release boundary'), 'troubleshooting lets configured Stripe state imply customer availability');
check(
  /accepted execution report/i.test(outcomesPage),
  'outcome page does not name accepted execution reports as the consumption driver',
);
check(
  /no\s+deregistration was submitted[\s\S]{0,260}never be read as a zero\s+return/i.test(outcomesPage),
  'outcome page does not distinguish a zero return from no submitted deregistration',
);
check(
  !/never charged for[\s\S]{0,80}transaction fee/i.test(outcomesPage),
  'outcome page claims native chain fees are never charged, which the net-reclaim path contradicts',
);
check(
  /recovered through your plan/i.test(outcomesPage),
  'outcome page does not state that native chain fees are recovered through the plan',
);
for (const [surface, content] of [
  ['capabilities', capabilitiesPage],
  ['charges', chargesPage],
  ['outcomes', outcomesPage],
  ['costs/custody', costsCustodyPage],
  ['deployment interpretation', deploymentsPage],
  ['billing troubleshooting', billingRetirementPage],
]) {
  check(/not\s+billed/i.test(content), `${surface} omits the managed no-report zero-charge rule`);
}
check(chargesPage.includes('report_absent_not_billed'), 'charge lifecycle omits the stable no-report settlement reason');
check(
  /self-custody[\s\S]{0,400}ACU movement remains immutable/i.test(costsCustodyPage),
  'costs/custody does not preserve immutable self-custody ACU accounting',
);
check(
  /no report filed[\s\S]{0,400}no\s+customer\s+action/i.test(billingRetirementPage),
  'billing troubleshooting does not close ordinary managed no-report rows without customer action',
);


const sidebar = readFileSync(sidebarPath, 'utf8');
const publicEntry = allContent[0];
const siteConfig = readFileSync(join(root, 'docusaurus.config.ts'), 'utf8');
check(!publicEntry.includes('to="/liskov/quickstart"'), 'homepage links to retired quickstart route');
check(!publicEntry.includes('to="/liskov/guides"'), 'homepage links to retired guides route');
check(!publicEntry.includes('Baran'), 'homepage exposes private-alpha Baran');
check(!siteConfig.includes("label: 'Baran'"), 'navbar or footer exposes private-alpha Baran');
check(!siteConfig.includes("label: 'Baran Plugin'"), 'footer exposes the private-alpha Baran plugin');
for (const file of baranFiles) {
  const content = readFileSync(file, 'utf8');
  check(content.startsWith('---\nunlisted: true\n'), `${relative(baranRoot, file)}: private-alpha Baran page is not unlisted`);
}
check(readFileSync(join(baranRoot, 'index.md'), 'utf8').includes('Private alpha'), 'Baran landing omits private-alpha notice');
for (const id of expectedIds.filter((id) => !releaseGatedIds.includes(id))) {
  check(sidebar.includes(`'${id}'`), `sidebar omits ${id}`);
}
for (const id of releaseGatedIds) {
  check(!sidebar.includes(`'${id}'`), `sidebar exposes release-gated path ${id}`);
}
for (const id of unlistedIds) {
  check(!sidebar.includes(`'${id}'`), `sidebar exposes unreleased page ${id}`);
}
for (const id of legalReviewDraftIds) {
  check(!sidebar.includes(`'${id}'`), `sidebar exposes legal review draft ${id}`);
}
check(!/Preview|openclaw|cargo|marketplace/i.test(sidebar), 'sidebar exposes an unavailable Preview/OpenClaw/Cargo/Marketplace path');

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
const cliContract = JSON.parse(readFileSync(cliContractPath, 'utf8'));
const v5Manifest = JSON.parse(readFileSync(v5ManifestPath, 'utf8'));
const v5GuidePage = readFileSync(join(docsRoot, 'build', 'manifest-v5.md'), 'utf8');
const v5ReferencePage = readFileSync(join(docsRoot, 'reference', 'manifest-v5.md'), 'utf8');
const v5SshPage = readFileSync(join(docsRoot, 'operate', 'runtime-ssh-v5.md'), 'utf8');

check(v5DocumentationModes.includes(v5Mode), `V5 release contract: invalid documentationMode ${String(v5Mode)}`);
check(
  v5ReleaseContract.schema === 'proof.liskov.docs-v5-release-contract.v1',
  'V5 release contract: wrong schema',
);
// 2026-09-04 (BKLG-20260817-776u): availability transition release_gated → promoted.
// Production registration is v4_and_v5 (handler generation 96, activation-mode
// readiness green); every pinned consumer commit is contained in a released ref.
check(v5ReleaseContract.verifiedAt === '2026-09-05', 'V5 release contract: wrong verification date');
check(
  v5ReleaseContract.contract?.rcDigest === 'sha256:549272988045e9357c4945850706569ed8dc7f0c6f419b7cf5c57d54b294bb10',
  'V5 release contract: wrong RC digest',
);
check(
  v5ReleaseContract.contract?.manifestSchemaDigest === 'sha256:38ca88eefe599d9a13b0906fb7ae86be002fb7aa15767925a2fe11908fec95da',
  'V5 release contract: wrong manifest schema digest',
);
check(
  v5ReleaseContract.contract?.effectivePolicySchemaDigest === 'sha256:5907054022521f9926164d1e899fa89ecf931ea916da5d7989a6c58015053c30',
  'V5 release contract: wrong effective-policy schema digest',
);
check(
  v5ReleaseContract.contract?.productionRegistration === (v5PagesPromoted ? 'v4_and_v5' : 'v4_only'),
  'V5 release contract: production registration disagrees with the documentation mode',
);
check(
  v5ReleaseContract.contract?.activationAuthorized === v5PagesPromoted,
  'V5 release contract: activation authority disagrees with the documentation mode',
);
if (v5PagesPromoted) {
  check(v5ReleaseContract.contract?.handlerGeneration === 96, 'V5 release contract: wrong activated handler generation');
  check(Array.isArray(v5ReleaseContract.activation?.evidence) && v5ReleaseContract.activation.evidence.length >= 4, 'V5 release contract: promotion lacks activation evidence');
}
check(v5ReleaseContract.contract?.retainedCorpusCount === 25, 'V5 release contract: wrong retained corpus count');
check(v5ReleaseContract.contract?.implementationCloseoutRows === 31, 'V5 release contract: wrong closeout row count');
check(v5ReleaseContract.contract?.firstPublicMaxJobs === 2, 'V5 release contract: wrong first-public job bound');

for (const [consumer, commit] of Object.entries({
  cli: 'e135604ed2f6c59ffc737fce5fe08eaa19d77d0c',
  console: 'f07323a13e7890614e1a5aec754b08523f485f94',
  workflow: 'aa1b83f0fd4b08ac33a6c9970d2077885922d79c',
  cargoRuntime: '20444a833bd9eb627362171737cbc26f9f70901d',
  managedSshMatrix: '6bce5181c4c6160fa48001a653070f351138cf89',
})) {
  check(v5ReleaseContract.consumers?.[consumer]?.sourceCommit === commit, `V5 release contract: wrong ${consumer} commit`);
}
check(
  v5ReleaseContract.consumers?.examples?.retainedSetCommit === 'f9b6330ac76f9c77a3a74567d1f44e47eade7f48',
  'V5 release contract: wrong retained examples commit',
);
const v5ReleasedRefs = v5PagesPromoted
  ? { cli: 'v0.13.0', console: 'main@12cdad96ac8414984c34401d2caa857149979a22', workflow: 'v1.2.4', cargoRuntime: 'v0.10.37' }
  : { cli: null, console: null, workflow: null, cargoRuntime: null };
for (const [consumer, ref] of Object.entries(v5ReleasedRefs)) {
  check(
    v5ReleaseContract.consumers?.[consumer]?.releasedRefContainingCommit === ref,
    `V5 release contract: ${consumer} released ref must be ${String(ref)}`,
  );
}
if (v5PagesPromoted) {
  check(v5ReleaseContract.consumers?.cli?.packageVersion === cliContract.version, 'V5 release contract: CLI version disagrees with the CLI contract fixture');
  check(v5ReleaseContract.consumers?.workflow?.packageVersion === '1.2.4', 'V5 release contract: workflow release must be 1.2.4');
}

check(v5Manifest.schema === 'proof.liskov.application-manifest', 'V5 fixture: wrong manifest schema');
check(v5Manifest.schemaVersion === 5, 'V5 fixture: wrong schemaVersion');
check(v5Manifest.release?.mode === 'source', 'V5 fixture: first use must use source release');
check(v5Manifest.runtime?.kind === 'javascript', 'V5 fixture: first use must use JavaScript');
check(v5Manifest.execution?.mode === 'once', 'V5 fixture: first use must be one-shot');
check(v5Manifest.deployment?.spend?.unit === 'service_credit_micros', 'V5 fixture: self-custody spend leaked into first use');
check(v5Manifest.state?.mode === 'off', 'V5 fixture: retained state must be explicitly off');
for (const deferredRoot of ['ingress', 'integrations', 'cohort', 'hooks']) {
  check(!(deferredRoot in v5Manifest), `V5 fixture: deferred root present: ${deferredRoot}`);
}
const firstV5ManifestBlock = /```json title="\.liskov\/application-manifest\.json"\n([\s\S]*?)\n```/u.exec(v5GuidePage);
check(firstV5ManifestBlock !== null, 'V5 guide: missing checked first-manifest block');
if (firstV5ManifestBlock !== null) {
  try {
    check(
      JSON.stringify(JSON.parse(firstV5ManifestBlock[1])) === JSON.stringify(v5Manifest),
      'V5 guide: first manifest differs from the checked fixture',
    );
  } catch {
    check(false, 'V5 guide: first manifest block is not JSON');
  }
}

for (const page of [v5GuidePage, v5ReferencePage]) {
  for (const deferredRoot of ['ingress', 'integrations', 'cohort', 'hooks']) {
    check(!new RegExp(`"${deferredRoot}"\\s*:`, 'u').test(page), `V5 docs author deferred root ${deferredRoot}`);
  }
  check(!/"unit"\s*:\s*"acu_planck"/u.test(page), 'V5 docs author deferred self-custody spend');
  check(!/"kind"\s*:\s*"(?:tailscale|acurast_tunnel|cloudflare_tunnel)"/u.test(page), 'V5 docs author a deferred provider');
}
for (const token of [
  'first public capability and entitlement limit is **exactly 2**',
  'proof liskov application manifest validate',
  'proof liskov application policy explain',
  ...(v5PagesPromoted
    ? [
        'proof liskov application create',
        'proof liskov application source-binding set',
        'proof liskov application policy publish',
        '--expected-pointer-version',
        'acurast-app.yml@v1',
        'v1.2.4',
        'does not run again on its own',
      ]
    : ['aa1b83f0fd4b08ac33a6c9970d2077885922d79c']),
]) {
  check(v5GuidePage.includes(token), `V5 guide omits ${token}`);
}
check(
  v5ReferencePage.includes('GET /api/application-manifest/v5/schema'),
  'V5 reference omits the owner-served authored schema endpoint',
);
check(
  /\| Simultaneous jobs \| Manifest V4 is v1 at exactly `1`; retained V5 is (?:release-gated|v1) at one or two jobs;/.test(capabilitiesPage),
  'capability matrix does not distinguish the V4 and retained V5 job bounds',
);
for (const token of [
  'runtime-ssh operator-key add',
  'runtime-ssh operator-key remove',
  'future attachment snapshots only',
  // Was `no customer CLI`, the honest statement while nothing could revoke a
  // live attachment. BKLG-20260903-suie shipped the command, so the token that
  // has to be present is the command itself; the retracted sentence is
  // asserted absent below.
  'runtime-ssh attachment revoke',
  'RUNTIME_SSH_HOST_KEY_MISMATCH',
  'one-time ticket',
  'leaves workload health unchanged',
  // BKLG-20260805-awz6: the snapshot is immutable and the withdrawal is a
  // separate deny layer; the connection reports both so drift is inspectable.
  'never narrowed in place',
  'authorizedKeyFingerprints',
  'snapshotKeyFingerprints',
  'withdrawnKeyFingerprints',
  'runtime_ssh_operator_key_withdrawn',
  'withdrawn-key list',
  // BKLG-20260817-776u: register before the first launch, or the run stays degraded.
  'first launch',
  'runtime_ssh_operator_key_registry_empty',
  // BKLG-20260813-gebd / BKLG-20260903-futx: both blast radii, and ADR-0112 metering.
  'The relay is a single machine',
  'helper or sidecar death',
  'log overage rate',
]) {
  check(v5SshPage.includes(token), `V5 Managed SSH guide omits ${token}`);
}
check(!v5SshPage.includes('through support'), 'V5 Managed SSH guide must not send revocation to support (BKLG-20260903-suie: no such route)');

if (v5Mode === 'release_gated') {
  check(v5ReleaseContract.availability === 'Release-gated v1', 'V5 gated source map has wrong availability');
  check(/Retained Manifest V5 \/ Policy V5 exact pair \| Release-gated v1/.test(capabilitiesPage), 'capabilities prematurely promote V5');
  check(v5GuidePage.includes('not a released package'), 'V5 gated guide must not imply the CLI source commit is released');
  for (const id of v5PromotedIds) check(!sidebar.includes(`'${id}'`), `sidebar prematurely exposes ${id}`);
} else {
  check(v5ReleaseContract.availability === 'v1', 'V5 promotion source map has wrong availability');
  check(/Retained Manifest V5 \/ Policy V5 exact pair \| v1/.test(capabilitiesPage), 'capabilities omit promoted V5');
  check(v5SshPage.includes('Preview on Developer and above'), 'V5 Managed SSH guide must state the promoted plan boundary');
  check(/Retained V5 managed Runtime SSH policy path \| Preview on Developer and above/.test(capabilitiesPage), 'capabilities omit the promoted V5 managed SSH boundary');
  check(v5ReferencePage.includes('| Production registration | `v4_and_v5`'), 'V5 reference still claims V4-only registration');
  check(v5ReferencePage.includes('| Activation authorized | `true` |'), 'V5 reference still claims activation is unauthorized');
  check(v5ReferencePage.includes('does not run again on its own'), 'V5 reference must state the once re-run boundary (BKLG-20260903-6ni6)');
  check(!v5GuidePage.includes('not a released package'), 'V5 promoted guide still calls the CLI commit unreleased');
  for (const stale of ['V4-only', 'not authorized', 'not available in production']) {
    for (const page of [v5GuidePage, v5ReferencePage, v5SshPage]) check(!page.includes(stale), `promoted V5 page retains stale gate text: ${stale}`);
  }
  for (const id of v5PromotedIds) check(sidebar.includes(`'${id}'`), `sidebar omits promoted ${id}`);
  for (const page of [v5GuidePage, v5ReferencePage, v5SshPage]) {
    check(!page.startsWith('---\nunlisted: true\n'), 'promoted V5 page remains unlisted');
    check(!page.includes(':::danger[Not released]'), 'promoted V5 page retains not-released notice');
  }
}

check(manifest.schema === 'proof.liskov.application-manifest', 'fixture: wrong manifest schema');
check(manifest.schemaVersion === 4, 'fixture: wrong schemaVersion');
check(manifest.release?.artifact?.encryption?.mode === 'none', 'fixture: the supported baseline example must use unencrypted IPFS bundles');
check(manifest.deployment?.parallelism === 1, 'fixture: public parallelism must be 1');
check(manifest.deployment?.placement?.processorSelection?.mode === 'open_market', 'fixture: public placement must be open_market');
check(manifest.deployment?.lifecycle?.renewal?.mode === 'after_scheduled_end', 'fixture: unsupported renewal recipe');
check(manifest.deployment?.lifecycle?.update?.existingJobs?.mode === 'run_until_scheduled_end', 'fixture: unsupported predecessor behavior');
check(manifest.deployment?.lifecycle?.recovery?.runtimeFailure?.mode === 'wait_until_scheduled_end', 'fixture: unsupported runtime recovery');
check(!('ingress' in manifest), 'fixture: general ingress must not appear in the public recipe');
check(manifest.observability?.logs?.enabled === true, 'fixture: managed logging must be enabled explicitly');
check(
  JSON.stringify(Object.keys(manifest.observability?.logs ?? {})) === JSON.stringify(['enabled']),
  'fixture: public logging recipe must use only observability.logs.enabled',
);

const encryptedContract = JSON.parse(readFileSync(join(root, 'fixtures/liskov-encrypted-code-contract.json'), 'utf8'));
const encryptedRecipe = readFileSync(join(docsRoot, 'build/encrypted-javascript.md'), 'utf8');
check(encryptedContract.mode === 'aes-256-gcm-payload-v1', 'encrypted code fixture: wrong delivery mode');
check(encryptedContract.runtimeVersion === '0.3.29' && encryptedContract.cliVersion === '0.13.0', 'encrypted code fixture: wrong released owners');
check(encryptedContract.productionAccepted === false, 'encrypted code: promotion needs production acceptance');
for (const token of [encryptedContract.mode, encryptedContract.keySecretId, encryptedContract.keyEnvironment,
  encryptedContract.buildKeySecret, '--paused', '--dry-run', 'encrypted_code_verified', 'encrypted_code_start_failed',
  'PROOF can access', 'Cargo', 'plaintext digest', 'ciphertext digest']) {
  check(encryptedRecipe.includes(token), `encrypted code recipe omits contract token: ${token}`);
}
const encryptedExample = readFileSync(join(root, 'examples/liskov-v1/encrypted-module.mts'), 'utf8').trim();
check(encryptedRecipe.includes(encryptedExample), 'encrypted code module differs from typechecked fixture');

const cliPage = readFileSync(join(docsRoot, 'reference', 'cli.md'), 'utf8');
check(cliContract.package === '@proof-computer/proof-cli-liskov', 'CLI fixture: wrong package');
check(cliContract.version === '0.13.0', 'CLI fixture: wrong released version');
check(cliContract.command === 'liskov:application:logs', 'CLI fixture: missing logs command');
check(cliContract.flags?.limit?.minimum === 1 && cliContract.flags?.limit?.maximum === 500, 'CLI fixture: wrong log limit bounds');
check(
  JSON.stringify(cliContract.flags?.origin) === JSON.stringify(['all', 'customer', 'runtime-ssh', 'runtime_ssh']),
  'CLI fixture: wrong log origins',
);
check(
  cliContract.flags?.organization?.environment === 'LISKOV_ORGANIZATION' &&
    cliContract.flags?.organization?.maximumUtf8Bytes === 255 &&
    cliContract.flags?.organization?.resolution === 'exact-id-before-exact-slug',
  'CLI fixture: wrong request-scoped organization selector contract',
);
check(cliPage.includes(`\`${cliContract.package}\` \`${cliContract.version}\``), 'CLI page omits the fixture package version');
for (const token of ['application logs APP_REF', '--limit', '--deployment', '--job', 'runtime-ssh', '--json', '--follow', '--from-start', '--event', '--ndjson']) {
  check(cliPage.includes(token), `CLI page omits managed logging contract token: ${token}`);
}
check(cliContract.sshCommand === 'liskov:ssh', 'CLI fixture: missing Runtime SSH command');
check(
  JSON.stringify(cliContract.sshArguments) === JSON.stringify(['APP']),
  'CLI fixture: wrong Runtime SSH arguments',
);
for (const flag of ['identity', 'print-command', 'accept-host-key']) {
  check(cliContract.sshFlags?.[flag] !== undefined, `CLI fixture: missing Runtime SSH flag ${flag}`);
  check(cliPage.includes(`--${flag}`), `CLI page omits Runtime SSH flag: --${flag}`);
}

// Availability transition (published in v0.7.0 on 2026-08-15, documented
// 2026-09-03, BKLG-20260813-wh4o): the operator-key registry commands.
// Registering is never a grant; the page must keep saying so.
//
// Availability transition (v0.9.0 on 2026-09-03, BKLG-20260805-awz6):
// `operator-key remove` now withdraws the key's access as well, and the
// `withdrawn-key` family reaches a key with no registry row. The earlier
// "does not revoke access" sentence was true and is now false, so it must not
// return; the drain rule for a session already open is the sentence that
// replaces it, because a reader who believes an open session is cut is the
// new failure the wording exists to prevent.
check(
  JSON.stringify(cliContract.operatorKeyCommands) ===
    JSON.stringify([
      'liskov:runtime-ssh:operator-key:add',
      'liskov:runtime-ssh:operator-key:list',
      'liskov:runtime-ssh:operator-key:remove',
    ]),
  'CLI fixture: wrong operator-key command ids',
);
for (const flag of ['name', 'identity', 'public-key-file']) {
  check(cliContract.operatorKeyAddFlags?.[flag] !== undefined, `CLI fixture: missing operator-key add flag ${flag}`);
  check(cliPage.includes(`--${flag}`), `CLI page omits operator-key add flag: --${flag}`);
}
for (const token of [
  'operator-key add',
  'operator-key list',
  'operator-key remove',
  'does not grant access',
  'withdraws its access',
  'ingress.ssh.provider.authorizedKeys',
]) {
  check(cliPage.includes(token), `CLI page omits operator-key contract token: ${token}`);
}
check(!cliPage.includes('does not revoke access'), 'CLI page repeats the retracted non-revocation claim');
check(
  JSON.stringify(cliContract.withdrawnKeyCommands) ===
    JSON.stringify([
      'liskov:runtime-ssh:withdrawn-key:add',
      'liskov:runtime-ssh:withdrawn-key:list',
      'liskov:runtime-ssh:withdrawn-key:remove',
    ]),
  'CLI fixture: wrong withdrawn-key command ids',
);
check(cliContract.operatorKeyRemoveWithdrawsAccess === true, 'CLI fixture: operator-key remove must withdraw access');
check(
  cliContract.withdrawalDrain?.establishedSessions === 'drain' &&
    cliContract.withdrawalDrain?.maximumSessionDurationSeconds === 7200 &&
    cliContract.withdrawalDrain?.heartbeatTimeoutSeconds === 60,
  'CLI fixture: wrong withdrawal drain bounds',
);
for (const flag of ['fingerprint', 'identity', 'reason']) {
  check(cliContract.withdrawnKeyAddFlags?.[flag] !== undefined, `CLI fixture: missing withdrawn-key add flag ${flag}`);
  check(cliPage.includes(`--${flag}`), `CLI page omits withdrawn-key add flag: --${flag}`);
}
for (const token of [
  'withdrawn-key add',
  'withdrawn-key list',
  'withdrawn-key remove',
  'drains',
  'two-hour maximum session duration',
  'revokedTicketCount',
]) {
  check(cliPage.includes(token), `CLI page omits withdrawal contract token: ${token}`);
}
// Availability transition (v0.10.0, BKLG-20260903-suie): an attachment can be
// revoked deliberately. Until this shipped, both SSH pages said in as many
// words that there was no customer command, no console control and no
// support-reachable route that cut a live attachment. That was true and is now
// false, so — as with awz6's retraction — the old sentence must not return, and
// the two facts that replace it are the blast radius (the whole attachment,
// everyone on it) and the one thing revocation still does not do (cut a session
// already open).
check(
  JSON.stringify(cliContract.attachmentCommands) ===
    JSON.stringify([
      'liskov:runtime-ssh:attachment:list',
      'liskov:runtime-ssh:attachment:revoke',
    ]),
  'CLI fixture: wrong attachment command ids',
);
check(cliContract.attachmentRevokeFailureCode === 'operator_revoked', 'CLI fixture: wrong revoke failure code');
check(cliContract.attachmentRevokeEndsTheJob === false, 'CLI fixture: revoking must not end the job');
check(cliContract.attachmentListFlags?.['include-terminal'] !== undefined, 'CLI fixture: missing attachment list flag');
for (const token of [
  'attachment list',
  'attachment revoke',
  'newlyRevoked',
  '--include-terminal',
]) {
  check(cliPage.includes(token), `CLI page omits attachment contract token: ${token}`);
}

const operatePage = readFileSync(join(docsRoot, 'operate', 'runtime-ssh.md'), 'utf8');
check(operatePage.includes('operator-key add'), 'operate/runtime-ssh omits the operator-key add command');
check(/does not\s+grant access/.test(operatePage), 'operate/runtime-ssh omits the non-grant statement');
check(!/does not revoke access/.test(operatePage), 'operate/runtime-ssh repeats the retracted non-revocation claim');
for (const token of [
  'withdrawn-key add',
  'withdrawn-key remove',
  'runtime_ssh_operator_key_withdrawn',
  'is **not** cut',
  'two-hour maximum',
  'end the job',
]) {
  check(operatePage.includes(token), `operate/runtime-ssh omits withdrawal token: ${token}`);
}
// BKLG-20260805-rykk (gateway, deployed 2026-09-03): the relay names which of
// four situations refused an operator, and each calls for a different customer
// action. `credential_rejected` in particular must be described as a platform
// fault, not a key problem: it was the sole symptom of the 2026-08-18 to
// 2026-09-03 outage in which no session could open.
for (const code of [
  'access_proxy_rejected_session_already_open',
  'access_proxy_rejected_connector_not_registered',
  'access_proxy_rejected_connector_unavailable',
  'access_proxy_rejected_credential_rejected',
]) {
  check(operatePage.includes(code), `operate/runtime-ssh omits refusal code ${code}`);
  check(v5SshPage.includes(code), `operate/runtime-ssh-v5 omits refusal code ${code}`);
}
check(operatePage.includes('This is not your key'), 'operate/runtime-ssh must say credential_rejected is not the key');
for (const token of [
  'runtime_ssh_service_credit_required',
  'currentPeriod.byteAllowance.runtimeSshServiceCreditRequired',
  'Billing & funding',
  'already open continues',
]) {
  check(operatePage.includes(token), `operate/runtime-ssh omits Service Credit refusal token: ${token}`);
}
for (const page of [operatePage, v5SshPage]) {
  check(!/no support-reachable route/.test(page), 'an SSH page repeats the retracted no-revocation-route claim');
  check(!/no way to cut access to a current attachment/.test(page), 'an SSH page repeats the retracted no-revocation claim');
  check(page.includes('attachment revoke'), 'an SSH page omits the attachment revoke command');
  check(page.includes('operator_revoked'), 'an SSH page omits the operator_revoked failure code');
  check(
    /Integrations → Liskov-Managed Runtime\s+SSH/.test(page) && /select \*\*Revoke\*\*/.test(page),
    'an SSH page omits the Console attachment-revoke path',
  );
}

// Availability transition (2026-08-05): Runtime SSH moved from an internal
// allowlist to plan entitlement. The capability page owns that claim, and it
// must stay distinct from hosted inbound ingress, which remains outside v1.
//
// Availability transition (2026-08-06, published 2026-09-03): the entitlement
// split by provider. Availability restated (2026-09-04, BKLG-20260903-k0ay):
// the accepted six-plan ladder ratified the catalog's boolean inheritance, so
// the Liskov-operated relay is sold from Developer upward and the
// customer-owned Tailscale provider from Pro upward. The two rows must never
// share a tier again, because a reader generalizing one provider's tier to the
// other is the failure this split exists to prevent.
// The same release states the relay's single-machine blast radius and that
// relay traffic draws on the plan's included log volume (owner decisions of
// 2026-09-03, ADR-0112 in the orchestrator).
check(
  /\| Runtime SSH into your own running job, Liskov-operated relay \| Preview on Developer and above/.test(capabilitiesPage),
  'capabilities: managed Runtime SSH must be classified Preview on Developer and above',
);
check(
  /\| Runtime SSH into your own running job, your own Tailscale network \| Preview on Pro and above/.test(capabilitiesPage),
  'capabilities: customer-owned Tailscale Runtime SSH must be classified Preview on Pro and above',
);
const integrationsPage = readFileSync(join(docsRoot, 'operate', 'integrations.md'), 'utf8');
check(
  /revoke one attachment for\s+everyone on it without ending the job/.test(integrationsPage),
  'integrations: managed SSH omits the Console attachment-revoke boundary',
);
check(
  integrationsPage.includes('**Live**') && integrationsPage.includes('**Roadmap**'),
  'integrations: must state the two catalogue statuses',
);
check(
  /Liskov-Managed SSH/.test(integrationsPage) && /GitHub App/.test(integrationsPage) && /Telegram/.test(integrationsPage),
  'integrations: live rows must name Managed SSH, GitHub App, and Telegram',
);
check(
  /listed as Roadmap in Integrations until a live policy version can name it/.test(capabilitiesPage),
  'capabilities: Tailscale must be listed as Roadmap until a live policy can name it',
);
check(
  /\/settings\/integrations/.test(integrationsPage) && /\/settings\/runtime-ssh/.test(integrationsPage),
  'integrations: must name the Console catalogue and the one-release Runtime SSH URL',
);
check(
  !/Tailscale network \| Preview on (Starter|Enterprise|Developer) /.test(capabilitiesPage),
  'capabilities: the retired Tailscale availability claims must not return',
);
check(
  /single machine/.test(capabilitiesPage) && /included log volume/.test(capabilitiesPage),
  'capabilities: managed Runtime SSH must state the single-machine relay and the shared log allowance',
);
check(
  /helper or sidecar death ends managed SSH for that job until the next run/.test(capabilitiesPage)
    && /job itself is unaffected/.test(capabilitiesPage),
  'capabilities: managed Runtime SSH must state the helper/sidecar-death blast radius beside the single-gateway acceptance',
);
for (const token of [
  'Developer and above',
  'single machine',
  'included log volume',
  'Pro and above',
  'runtime_ssh_provider_plan_required',
  'helper or sidecar death',
]) {
  check(
    readFileSync(join(docsRoot, 'operate', 'runtime-ssh.md'), 'utf8').includes(token),
    `operate/runtime-ssh omits ${token}`,
  );
}
// BKLG-20260903-k0ay deleted the four-plan catalog. `starter` and `team` are
// not plan ids any more, so no page may name them.
for (const page of ['operate/runtime-ssh.md', 'operate/runtime-ssh-v5.md', 'reference/capabilities.md', 'reference/manifest-v5.md']) {
  check(
    !/\b(Starter|Team)\b/.test(readFileSync(join(docsRoot, ...page.split('/')), 'utf8')),
    `${page}: the retired Starter/Team plan names must not return`,
  );
}
check(
  /\| Liskov-hosted HTTP\/SSH ingress \| Not v1 \|/.test(capabilitiesPage),
  'capabilities: hosted inbound ingress must stay Not v1 and distinct from Runtime SSH',
);

// Availability transition (2026-08-15): CLI log reads gained live follow and
// full-history cursor pagination (BKLG-20260815-k3tf). The CLI reference must
// document the streaming flags and no longer claim they are absent.
check(cliPage.includes('--follow'), 'CLI reference omits the released --follow streaming flag');
check(cliPage.includes('--from-start'), 'CLI reference omits the released --from-start pagination flag');
check(!/no follow\/tail/i.test(cliPage), 'CLI reference retains the removed no-follow/tail claim');

for (const retired of cliContract.retiredCommands ?? []) {
  check(!combined.includes(retired.replaceAll(':', ' ')), `public docs expose retired CLI command: ${retired}`);
}

const workflow = readFileSync(workflowPath, 'utf8');
check(workflow.includes('acurast-app.yml@v1'), 'workflow fixture: missing released @v1 reference');
check(workflow.includes('id-token: write'), 'workflow fixture: missing OIDC permission');
check(workflow.includes('contents: read'), 'workflow fixture: missing contents permission');
check(workflow.includes('authored-manifest-path:'), 'workflow fixture: missing manifest input');
check(!/yes-spend|bearer|LISKOV_TOKEN/i.test(workflow), 'workflow fixture: contains a spend or bearer credential');

for (const [fileId, required] of Object.entries({
  'get-started/choose-your-path': ['Marketplace', 'GitHub', 'Release-gated v1', 'customer add-funds'],
  'get-started/set-up-liskov': ['read', 'release-gated', 'Available', 'Reserved'],
  'get-started/marketplace': ['Release-gated v1', 'engineering acceptance', 'not supported customer paths'],
  'marketplace/uptime-prober': ['Release-gated v1', 'engineering acceptance', 'not a supported customer offering'],
  'organizations/service-credits': ['read-only', 'Customer funding is release-gated', 'payment details'],
  'get-started/github': ['Publication availability', 'v1.2.2', 'artifact-version-id', 'Proof'],
  'operate/proof-chain': ['GitHub OIDC', 'policy digest', 'runtime instance'],
  'operate/processors': ['your org', 'whole fleet', 'Enterprise', 'storageBytes', 'read-only', 'not-found', 'Redaction and missing data are not the same state'],
  'troubleshooting/deployment': ['Normal waiting', 'Needs action', 'decision-id', 'processorAtMatchCap', 'authoringFault'],
  'reference/configuration-precedence': ['Application-managed value', 'process.env', 'Signed runtime bootstrap', 'LISKOV_ORGANIZATION', 'persistent organization'],
  'operate/pause-resume': ['does not force-stop', 'scheduled end'],
  'operate/update': ['successor', 'without mutating'],
  'operate/retire': ['does not stop existing jobs', 'receipt'],
  'reference/capabilities': ['Release-gated v1', 'Preview', 'Internal', 'Not v1', 'Encrypted JavaScript payload delivery', 'Private customer code inside Cargo images'],
  'reference/cli': ['0.13.0', 'application logs APP_REF', '1–500', 'runtime-ssh', 'exits zero', '--organization', 'organizationContext.sessionDefault', 'ssh APP', 'operator-key', 'withdrawn-key'],
  'reference/manifest-v4': ['deprecated_manifest_field', 'profileId', 'sinkName', 'future schema', 'durationMs', '60000', 'maxStartDelayMs', '3600000'],
  'reference/statuses-actions-errors': ['processorAtMatchCap', 'authoringFault', 'acurast_job_registration_duration_below_minimum'],
  'configure/logging-diagnostics': ['only logging field needed', 'provisions', 'application logs'],
  'operate/logs-activity': ['application logs', '--deployment', '--job', '--follow', '--from-start', 'Retained log history', 'Free | 24 hours', 'Enterprise | 90 days'],
  'troubleshooting/logs': ['exits zero', 'malformed-response failures'],
  'concepts/trust-boundaries': ['briefly PROOF over TLS', 'Plaintext is not persisted', 'Private source is not private deployed code', 'cache reuse'],
  'build/artifacts-provenance': ['reusable GitHub pin action requires `none`', 'complete path is not supported today'],
  'troubleshooting/account-funding': [
    'There is no supported customer checkout',
    'Service Credit reads disagree',
    'subscription_intent_conflict',
    'subscription_outcome_uncertain',
    'A trial remains',
    'subscription_action_invalid',
    'subscription_interval_invalid',
    'Do not change the inputs under that key',
    'not_a_member',
    'organizationContext.effective',
    'organizationContext.sessionDefault',
  ],
  'troubleshooting/support': ['Never include', 'Application UID', 'runtime-instance ID'],
})) {
  const page = readFileSync(join(docsRoot, `${fileId}.md`), 'utf8');
  for (const token of required) {
    check(page.toLowerCase().includes(token.toLowerCase()), `retrieval audit: ${fileId} omits "${token}"`);
  }
}

for (const [pattern, message] of [
  [/\| Service Credit balance, reservation, and ledger reads \| v1; read-only surfaces are supported/, 'capability matrix omits supported read-only Service Credit surfaces'],
  [/\| Stripe USD checkout and Service Credit issuance \| Release-gated v1;/, 'capability matrix does not gate Stripe funding'],
  [/\| Curated first-party Marketplace launch \| Release-gated v1;/, 'capability matrix does not gate Marketplace launch'],
  [/\| Uptime Prober \| Release-gated v1;/, 'capability matrix does not gate Uptime Prober'],
  [/\| Organization-gated processor record in Console \| v1;[^\n]+Enterprise \|/, 'capability matrix omits the released processor record or its Enterprise boundary'],
]) {
  check(pattern.test(capabilitiesPage), message);
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
  'proof liskov application logs',
  'proof liskov application pause',
  'proof liskov application resume',
  'proof liskov application retire',
]) {
  check(combined.includes(command), `public command audit: missing ${command}`);
}

for (const token of ['?order=stable', '?order=time', '?order=job', '#slot-1:g3', 'Job identity not reported', 'Load more']) {
  check(deploymentsPage.includes(token), `Deployments operating guide omits released contract: ${token}`);
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
