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
const executionConvergenceContractPath = join(root, 'fixtures', 'liskov-execution-convergence-contract.json');
const v5ManifestPath = join(root, 'fixtures', 'liskov-v5-retained-manifest.json');
const v5StarterRoot = join(root, 'examples', 'liskov-v1', 'retained-v5-starter');
const v5StarterManifestPath = join(v5StarterRoot, '.liskov', 'application-manifest.json');
const v5StarterWorkflowPath = join(v5StarterRoot, 'liskov.yml');
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
  'troubleshooting/execution-coverage',
  'troubleshooting/config-bootstrap',
  'troubleshooting/logs',
  'troubleshooting/billing-retirement',
  'troubleshooting/support',
  'legal/index',
  'legal/master-terms',
  'legal/service-credits-and-payments-policy',
  'legal/acceptable-use-policy',
  'legal/data-processing-addendum',
  'legal/subprocessors',
  'legal/privacy-notice',
  'legal/cookie-notice',
  'legal/marketplace-terms',
  'legal/marketplace-notice-and-action-policy',
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

// The contractual suite remains Version 1.0, effective 1 September 2026
// (orchestrator Q-20260904-mm3v). The three product-analytics notices moved to
// Version 1.1 on 8 September 2026. The review artefacts that
// are not customer documents stay `draft: true`, which excludes them from the
// production build. Keep both lists explicit so adding, publishing or
// accidentally exposing a legal document changes this check.
const legalPublishedIds = [
  'legal/index',
  'legal/master-terms',
  'legal/service-credits-and-payments-policy',
  'legal/acceptable-use-policy',
  'legal/privacy-notice',
  'legal/data-processing-addendum',
  'legal/cookie-notice',
  'legal/marketplace-terms',
  'legal/marketplace-notice-and-action-policy',
  'legal/subprocessors',
];
const legalReviewDraftIds = [
  'legal/legal-review-memorandum',
  'legal/change-log',
  'legal/launch-sign-off-matrix',
  'legal/implementation-copy',
  'legal/marketplace-publisher-terms',
];
const legalPublishedVersionLine = 'Version 1.0 — effective 1 September 2026';
const legalPublishedVersionLines = new Map([
  ['legal/privacy-notice', 'Version 1.1 — effective 8 September 2026'],
  ['legal/cookie-notice', 'Version 1.1 — effective 8 September 2026'],
  ['legal/subprocessors', 'Version 1.1 — effective 8 September 2026'],
]);

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
  // The V6 manifest contract, drafted ahead of the release (BKLG-20260907-fgtk); BKLG-20260907-ie6x promotes it.
  'reference/manifest-v6',
  // The Billing Spend guide, prepared from the served spendHistory contract (BKLG-20260922-kmc0); BKLG-20260922-j7nu promotes it.
  'organizations/spend-analysis',
  // The Compute guide, prepared from the committed Compute route vectors (BKLG-20260923-5y9y); BKLG-20260922-j7nu promotes it.
  'organizations/compute',
  // The Google sign-in and invitation guide, prepared from ADR-0155 and the merged Google packets (BKLG-20260923-v8en); BKLG-20260921-spd9 promotes it.
  'get-started/google-sign-in',
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
  const requiredNotice = id === 'build/encrypted-javascript'
    ? ':::caution[Registered V5 release required]' : ':::danger[Not released]';
  check(content.includes(requiredNotice), `${id}: gated page omits its remaining release notice`);
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

// Published legal pages: no draft flag, their declared version line, no review
// residue, no factual placeholders, and no customer crypto-payment rail
// (ADR-0011: Stripe fiat only for v1).
for (const id of legalPublishedIds) {
  const file = join(docsRoot, `${id}.md`);
  if (!existsSync(file)) {
    check(false, `published legal page ${id} is declared but missing`);
    continue;
  }
  const content = readFileSync(file, 'utf8');
  const frontmatterEnd = content.indexOf('\n---\n', 4);
  const frontmatter = frontmatterEnd > 4 ? content.slice(4, frontmatterEnd) : '';
  check(!/^draft: true$/mu.test(frontmatter), `${id}: published legal page is still a draft`);
  const expectedVersionLine = legalPublishedVersionLines.get(id) ?? legalPublishedVersionLine;
  check(content.includes(expectedVersionLine), `${id}: published legal page omits ${expectedVersionLine}`);
  check(!/\[verify\]|\[insert\]|review draft|not in force/i.test(content), `${id}: published legal page retains review residue`);
  check(!/USDC|cryptoasset quote|### [0-9.]+ Cryptoasset payment|accept specified cryptoassets as payment/i.test(content), `${id}: published legal page offers a customer crypto rail`);
  check(!/marketplace-legal@/.test(content), `${id}: published legal page names the retired marketplace-legal mailbox`);
}
check(readFileSync(join(docsRoot, 'legal', 'master-terms.md'), 'utf8').includes('PROOF does not accept cryptoassets as payment.'), 'Master Terms lost the no-crypto-payment statement');
check(readFileSync(join(docsRoot, 'legal', 'master-terms.md'), 'utf8').includes('Customer is the sole Controller of any Personal Data in Distributed Workload Data'), 'Master Terms lost the customer-responsibility model for workload data');

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
  ![...legalReviewDraftIds, ...legalPublishedIds].some((id) => readFileSync(join(docsRoot, `${id}.md`), 'utf8').includes('trading as PROOF.COMPUTER')),
  'legal pages retain the rejected PROOF.COMPUTER trading name',
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
  [/\b(?:just(?! Tickets Ltd)|simply|obviously)\b/i, 'unfriendly shortcut word'], // "Not Just Tickets Ltd" is Plain's legal name in the Subprocessor Schedule
  [/\bblackbox\b|BLACKBOX_/i, 'internal logging implementation name'],
  [/\blockbox\b/i, 'internal secrets implementation name'],
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
  'encrypted JavaScript must preserve the separate registered V5 public-release gate');
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
check(!/Preview|openclaw|cargo|marketplace/i.test(sidebar.replace(/'legal\/[a-z-]+'/g, '')), 'sidebar exposes an unavailable Preview/OpenClaw/Cargo/Marketplace path');
for (const id of legalPublishedIds) check(sidebar.includes(`'${id}'`), `sidebar omits published legal page ${id}`);

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
const v5StarterManifest = JSON.parse(readFileSync(v5StarterManifestPath, 'utf8'));
const v5StarterPackage = JSON.parse(readFileSync(join(v5StarterRoot, 'package.json'), 'utf8'));
const v5StarterLock = readFileSync(join(v5StarterRoot, 'pnpm-lock.yaml'), 'utf8');
const v5StarterSource = readFileSync(join(v5StarterRoot, 'src', 'index.ts'), 'utf8').trim();
const v5StarterReadme = readFileSync(join(v5StarterRoot, 'README.md'), 'utf8');
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
check(v5ReleaseContract.verifiedAt === '2026-09-07', 'V5 release contract: wrong verification date');
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
check(v5Manifest.runtime?.engine === 'nodejs', 'V5 fixture: first use must select the Node.js engine');
check(v5Manifest.execution?.mode === 'once', 'V5 fixture: first use must be one-shot');
check(v5Manifest.deployment?.schedule?.duration === '60s', 'V5 fixture: schedule must meet the provider 60-second minimum');
check(v5Manifest.deployment?.spend?.unit === 'service_credit_micros', 'V5 fixture: self-custody spend leaked into first use');
check(v5Manifest.state?.mode === 'off', 'V5 fixture: retained state must be explicitly off');
check(
  JSON.stringify(v5StarterManifest) === JSON.stringify(v5Manifest),
  'V5 starter: manifest differs from the retained fixture',
);
check(v5StarterPackage.packageManager === 'pnpm@10.33.0', 'V5 starter: pnpm version is not pinned');

for (const fixture of ['retained-v5-starter', 'builder-iteration']) {
  const fixtureRoot = join(root, 'examples', 'liskov-v1', fixture);
  const pkg = JSON.parse(readFileSync(join(fixtureRoot, 'package.json'), 'utf8'));
  check(pkg.scripts.build.includes('--format=cjs'), `${fixture}: Acurast requires a CommonJS artifact`);
  check(pkg.scripts.build.includes('node scripts/smoke-bundle.mjs'), `${fixture}: build must smoke the finished artifact`);
  const smoke = readFileSync(join(fixtureRoot, 'scripts', 'smoke-bundle.mjs'), 'utf8');
  check(smoke.includes('new Script(bundle'), `${fixture}: smoke must parse the actual bundle without executing bootstrap`);
}

check(
  v5StarterPackage.dependencies?.['@proof-computer/liskov-runtime'] === 'github:proof-computer/liskov-runtime-js#v0.3.33',
  'V5 starter: runtime SDK is not pinned to released v0.3.33',
);
for (const script of ['typecheck', 'test', 'build']) {
  check(typeof v5StarterPackage.scripts?.[script] === 'string', `V5 starter: missing ${script} script`);
}
for (const token of [
  'e13d3651052110e177d6460657e08e1a6ea47e06',
  "specifier: github:proof-computer/liskov-runtime-js#v0.3.33",
]) {
  check(v5StarterLock.includes(token), `V5 starter: lock file omits ${token}`);
}
for (const token of [
  'bootstrapLiskovRuntime',
  "logging: {mode: 'required'}",
  "secrets: {mode: 'background'}",
  "runtime.log('starter.fetch.completed'",
]) {
  check(v5StarterSource.includes(token), `V5 starter: source omits ${token}`);
}
check(v5StarterReadme.includes('does not claim ingress, durable state, a custom image'), 'V5 starter: README expands an unsupported boundary');
for (const deferredRoot of ['ingress', 'integrations', 'cohort', 'hooks']) {
  check(!(deferredRoot in v5Manifest), `V5 fixture: deferred root present: ${deferredRoot}`);
}
const firstV5SourceBlock = /```ts title="src\/index\.ts"\n([\s\S]*?)\n```/u.exec(v5GuidePage);
check(firstV5SourceBlock !== null, 'V5 guide: missing checked starter source block');
if (firstV5SourceBlock !== null) {
  check(firstV5SourceBlock[1].trim() === v5StarterSource, 'V5 guide: starter source differs from the checked fixture');
}
const createCommandIndex = v5GuidePage.indexOf('proof liskov application create hello-liskov');
const bindingCommandIndex = v5GuidePage.indexOf('proof liskov application source-binding set hello-liskov');
const workflowIndex = v5GuidePage.indexOf('uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1');
check(
  createCommandIndex >= 0 && createCommandIndex < bindingCommandIndex && bindingCommandIndex < workflowIndex,
  'V5 guide: Application create and source binding must precede the first dependent workflow build',
);
for (const command of [
  'pnpm install --frozen-lockfile',
  'pnpm typecheck',
  'pnpm test',
  'pnpm build',
  'test -s dist/bundle.js',
]) {
  check(v5GuidePage.includes(command), `V5 guide: local starter verification omits ${command}`);
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
  // BKLG-20260924-seyr (ADR-0158): a relaunched sandbox reconnects and re-pins;
  // a clean helper stop still ends access for the run.
  'The relay is a single machine',
  'relaunches the job\'s sandbox',
  'stops cleanly',
  'host.previousFingerprint',
  'It never accepts any\nother mismatch',
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
check(encryptedContract.runtimeVersion === '0.3.30' && encryptedContract.cliVersion === '0.13.0', 'encrypted code fixture: wrong released owners');
check(encryptedContract.productionAccepted === true, 'encrypted code: preserve accepted production execution');
check(encryptedContract.actionVersion === '1.3.2' && encryptedContract.actionCommit === 'c15b4b52d53bb7b7d631c2446151d994b93d2693',
  'encrypted code: the released action must include the job-directory bootstrap');
check(encryptedContract.registeredV5PublicReleaseRequired === true && encryptedRecipe.includes('Registered V5 release required'),
  'encrypted code: production proof must not silently promote the wider V5 release');
check(encryptedContract.productionEvidence?.jobId === '160393' &&
  encryptedContract.productionEvidence?.loaderStage === 'application.encrypted_code.loaded' &&
  encryptedContract.productionEvidence?.applicationStage === 'application.encrypted_canary' &&
  encryptedContract.productionEvidence?.verification === 'runtime-signature-v2',
  'encrypted code: acceptance needs both signed loader and application outcomes');
check(capabilitiesPage.includes('production execution is verified') && !encryptedRecipe.includes(':::danger[Not released]'),
  'encrypted code: remove the superseded encryption-specific acceptance notice');
for (const token of [encryptedContract.mode, encryptedContract.keySecretId, encryptedContract.keyEnvironment,
  encryptedContract.buildKeySecret, '--paused', '--dry-run', 'encrypted_code_verified', 'encrypted_code_start_failed', 'encrypted_code_failure_detail', 'lockbox_response_key_missing',
  'PROOF can access', 'Cargo', 'plaintext digest', 'ciphertext digest']) {
  check(encryptedRecipe.includes(token), `encrypted code recipe omits contract token: ${token}`);
}
const encryptedExample = readFileSync(join(root, 'examples/liskov-v1/encrypted-module.mts'), 'utf8').trim();
check(encryptedRecipe.includes(encryptedExample), 'encrypted code module differs from typechecked fixture');

const cliPage = readFileSync(join(docsRoot, 'reference', 'cli.md'), 'utf8');
check(cliContract.package === '@proof-computer/proof-cli-liskov', 'CLI fixture: wrong package');
check(cliContract.version === '0.14.0', 'CLI fixture: wrong released version');
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

const executionConvergenceContract = JSON.parse(readFileSync(executionConvergenceContractPath, 'utf8'));
check(
  executionConvergenceContract.schema === 'proof.liskov.docs-execution-convergence-contract.v1',
  'execution-convergence contract: wrong schema',
);
check(
  executionConvergenceContract.envelope?.schema === 'proof.liskov.execution-convergence.v1',
  'execution-convergence contract: wrong envelope schema',
);
check(
  executionConvergenceContract.envelope?.budgetBytes === 49152,
  'execution-convergence contract: wrong budget',
);
check(
  executionConvergenceContract.owners?.console?.commit === '96e3f0638d948b24b516ed7713761784ad62c80f',
  'execution-convergence contract: wrong Console commit',
);
check(
  executionConvergenceContract.owners?.api?.commit === '2db522130b314a044f7c50ee530c610d32868b4e',
  'execution-convergence contract: wrong API commit',
);
check(
  executionConvergenceContract.owners?.cli?.commit === '150b7c96d0caa23e757222dd1eb0288db48a368d',
  'execution-convergence contract: wrong CLI commit',
);
check(
  executionConvergenceContract.owners?.cli?.npmContainsCommit === false,
  'execution-convergence contract: CLI source must not be claimed as an npm release',
);
check(
  executionConvergenceContract.writerActivationAuthorized === false,
  'execution-convergence contract: writer activation must stay unauthorized',
);
check(
  executionConvergenceContract.actionPlanRoutesToCoverage === true
    && executionConvergenceContract.newCustomerMutation === false,
  'execution-convergence contract: Action Plan must keep Coverage routing with no new mutation',
);
check(
  /\| Console Coverage and Executions convergence strip \| v1;/.test(capabilitiesPage),
  'capability matrix omits the released Console convergence strip',
);
check(
  /\| CLI execution-convergence sibling on `application execution show` \| Release-gated v1;/.test(capabilitiesPage),
  'capability matrix does not gate the unreleased CLI convergence sibling',
);
check(
  /\| Desired-execution candidate writer selection \| Internal; incumbent remains selected/.test(capabilitiesPage),
  'capability matrix omits the incumbent writer boundary',
);
check(
  cliPage.includes('150b7c96d0caa23e757222dd1eb0288db48a368d'),
  'CLI reference omits the unreleased convergence source commit',
);
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
  /relaunches the job's sandbox, managed SSH reconnects/.test(capabilitiesPage)
    && /ends managed SSH for that job until the next run/.test(capabilitiesPage)
    && /job itself is unaffected/.test(capabilitiesPage),
  'capabilities: managed Runtime SSH must state the sandbox-relaunch reconnect and the helper/sidecar blast radius beside the single-gateway acceptance',
);
for (const token of [
  'Developer and above',
  'single machine',
  'included log volume',
  'Pro and above',
  'runtime_ssh_provider_plan_required',
  'relaunches the job\'s sandbox',
  'stops cleanly',
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

const v5StarterWorkflow = readFileSync(v5StarterWorkflowPath, 'utf8');
for (const token of [
  'acurast-app.yml@v1',
  'id-token: write',
  'contents: read',
  'app-id: hello-liskov',
  'entrypoint: bundle.js',
  'authored-manifest-path: .liskov/application-manifest.json',
]) {
  check(v5StarterWorkflow.includes(token), `V5 starter workflow: missing ${token}`);
}
check(!/yes-spend|bearer|LISKOV_TOKEN/i.test(v5StarterWorkflow), 'V5 starter workflow: contains a spend or bearer credential');

// BKLG-20260908-w0oi: the recommended entry route reaches the retained V5
// path end to end. The landing page's first recommendation is the GitHub
// journey; that journey installs the released CLI from the contract fixture
// (never the 0.7.0 plugin that predates `application source-binding`), copies
// the checked starter, and creates and binds the Application before the first
// push that runs the dependent workflow build, then publishes from it.
const entryRouteGithubPage = readFileSync(join(docsRoot, 'get-started', 'github.md'), 'utf8');
const entryRouteChoosePage = readFileSync(join(docsRoot, 'get-started', 'choose-your-path.md'), 'utf8');
const landingStartLink = /Start with \*\*\[[^\]]+\]\(([^)]+)\)\*\*/u.exec(liskovIndexPage);
check(
  landingStartLink?.[1] === './get-started/github.md',
  'entry route: the Liskov landing page must recommend the GitHub journey first',
);
check(/Manifest V5/.test(liskovIndexPage), 'entry route: the landing page does not name the Manifest V5 path');
check(
  /\| \*\*GitHub\*\* \| v1 with retained Manifest V5 source import\. \|/.test(entryRouteChoosePage),
  'entry route: choose-your-path does not classify GitHub as the retained V5 path',
);
check(
  !/Available only where Manifest V4 publication is enabled/.test(entryRouteChoosePage),
  'entry route: choose-your-path still gates the GitHub path on Manifest V4 publication',
);
check(
  entryRouteGithubPage.includes(`proof plugins install @proof-computer/proof-cli-liskov@${cliContract.version}`),
  `entry route: the GitHub journey does not install the released CLI ${cliContract.version}`,
);
for (const fileId of ['index', 'get-started/index', 'get-started/choose-your-path', 'get-started/set-up-liskov', 'get-started/github', 'get-started/first-deployment', 'build/manifest-v5']) {
  const page = readFileSync(join(docsRoot, `${fileId}.md`), 'utf8');
  check(
    !/proof-cli-liskov@0\.7\.0/.test(page),
    `entry route: ${fileId} installs the pre-source-binding CLI 0.7.0`,
  );
}
check(
  !/^## \d+\. Author Manifest V4/mu.test(entryRouteGithubPage),
  'entry route: the GitHub journey still authors Manifest V4 as its first-use step',
);
check(
  entryRouteGithubPage.includes('examples/liskov-v1/retained-v5-starter'),
  'entry route: the GitHub journey does not copy the checked V5 starter',
);
check(
  v5StarterManifest.applicationId === 'hello-liskov' && v5StarterWorkflow.includes('app-id: hello-liskov'),
  'entry route: the starter manifest or workflow names a different Application than the journey creates',
);
{
  const order = [
    'proof plugins install @proof-computer/proof-cli-liskov@',
    'pnpm install --frozen-lockfile',
    'proof liskov application manifest validate',
    'proof liskov application create hello-liskov',
    'proof liskov application source-binding set hello-liskov',
    'git push origin main',
    'proof liskov application source-binding show hello-liskov',
    'proof liskov application policy publish hello-liskov',
    'proof liskov application policy explain hello-liskov',
    'proof liskov application logs hello-liskov',
  ].map((token) => [token, entryRouteGithubPage.indexOf(token)]);
  for (const [token, index] of order) {
    check(index >= 0, `entry route: the GitHub journey omits ${token}`);
  }
  for (let i = 1; i < order.length; i += 1) {
    if (order[i - 1][1] < 0 || order[i][1] < 0) continue;
    check(
      order[i - 1][1] < order[i][1],
      `entry route: "${order[i - 1][0]}" must precede "${order[i][0]}" in the GitHub journey`,
    );
  }
}
check(
  entryRouteGithubPage.includes('uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1'),
  'entry route: the GitHub journey does not call the reusable workflow at @v1',
);
check(
  entryRouteGithubPage.includes(v5StarterManifest.deployment.schedule.duration) &&
    /60-second\s+provider minimum/.test(entryRouteGithubPage),
  'entry route: the GitHub journey does not keep the 60-second provider minimum',
);
check(
  /Publishing in step 6 is the mutation/.test(entryRouteGithubPage) &&
    /A green workflow is a built artifact, not a running Application/.test(entryRouteGithubPage),
  'entry route: the GitHub journey does not separate the spend mutation from a green build',
);
check(
  /release-gated/.test(entryRouteGithubPage) && /already-available Service Credits/.test(entryRouteGithubPage),
  'entry route: the GitHub journey does not state the existing-credit funding prerequisite',
);

for (const [fileId, required] of Object.entries({
  'get-started/choose-your-path': ['Marketplace', 'GitHub', 'Release-gated v1', 'customer add-funds'],
  'get-started/set-up-liskov': ['read', 'release-gated', 'Available', 'Reserved'],
  'get-started/marketplace': ['Release-gated v1', 'engineering acceptance', 'not supported customer paths'],
  'marketplace/uptime-prober': ['Release-gated v1', 'engineering acceptance', 'not a supported customer offering'],
  'organizations/service-credits': ['read-only', 'Customer funding is release-gated', 'payment details'],
  'get-started/github': ['Manifest V5', 'retained-v5-starter', 'v1.2.4', 'source-binding set', 'Artifact sha256:', 'Proof'],
  'operate/proof-chain': ['GitHub OIDC', 'policy digest', 'runtime instance'],
  'operate/processors': ['your org', 'whole fleet', 'Enterprise', 'storageBytes', 'read-only', 'not-found', 'Redaction and missing data are not the same state'],
  'troubleshooting/deployment': ['Normal waiting', 'Needs action', 'decision-id', 'processorAtMatchCap', 'authoringFault'],
  'troubleshooting/execution-coverage': [
    'permission withheld',
    'pending launch',
    'unknown submission',
    'ended/unsettled',
    'partial history',
    'selected versus proposed',
    'Quiet is not stalled',
    '96e3f0638d948b24b516ed7713761784ad62c80f',
    '2db522130b314a044f7c50ee530c610d32868b4e',
    '150b7c96d0caa23e757222dd1eb0288db48a368d',
    'incumbent remains selected',
  ],
  'configure/variables': ['Manifest V5', '"source": "managed"', '"source": "literal"', '"value": "safe"', 'Empty strings'],
  'configure/secrets': ['"kind": "environment"', '"kind": "file"', '0.10.40', '0.3.32', '0600', 'independently'],
  'troubleshooting/config-bootstrap': ['runtime_bootstrap_customer_secrets_runtime_incompatible', 'runtime_secrets_file_installation'],
  'reference/configuration-precedence': ['Application-managed value', 'process.env', 'Signed runtime bootstrap', 'LISKOV_ORGANIZATION', 'persistent organization'],
  'operate/pause-resume': ['does not force-stop', 'scheduled end'],
  'operate/update': ['successor', 'without mutating'],
  'operate/retire': ['does not stop existing jobs', 'receipt'],
  'reference/capabilities': ['Release-gated v1', 'Preview', 'Internal', 'Not v1', 'Encrypted JavaScript payload delivery', 'Private customer code inside Cargo images'],
  'reference/cli': ['0.13.0', 'application logs APP_REF', '1–500', 'runtime-ssh', 'exits zero', '--organization', 'organizationContext.sessionDefault', 'ssh APP', 'operator-key', 'withdrawn-key'],
  'reference/manifest-v4': ['deprecated_manifest_field', 'profileId', 'sinkName', 'future schema', 'durationMs', '60000', 'maxStartDelayMs', '3600000'],
  'reference/statuses-actions-errors': [
    'processorAtMatchCap',
    'authoringFault',
    'acurast_job_registration_duration_below_minimum',
    'quiet',
    'ended_unsettled',
    'selected',
    'proposed',
  ],
  'configure/logging-diagnostics': ['only logging field needed', 'provisions', 'application logs'],
  'operate/logs-activity': ['application logs', '--deployment', '--job', '--follow', '--from-start', 'Retained log history', 'Free | 24 hours', 'Enterprise | 90 days'],
  'troubleshooting/logs': ['exits zero', 'malformed-response failures'],
  'concepts/trust-boundaries': ['briefly PROOF over TLS', 'Plaintext is not persisted', 'Private source is not private deployed code', 'cache reuse'],
  'build/artifacts-provenance': ['reusable GitHub pin action requires `none`', 'complete path is not supported today'],
  'troubleshooting/account-funding': [
    'Liskov says it is invitation-only',
    'There is no supported customer checkout',
    'Service Credit reads disagree',
    'subscription_intent_conflict',
    'subscription_outcome_uncertain',
    'subscription_command_blocked',
    'subscription_mutations_paused',
    'subscription_payment_action_pending',
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
  // BKLG-20260918-83o6: new-account creation became invitation-only when
  // LISKOV_SIGNUP_WAITLIST was turned on. Existing sign-in stays v1; the
  // availability transition is the part that must not silently regress.
  [/\| GitHub sign-in; browser-confirmed CLI login \| v1 for an existing account\.[^\n]+invitation-only[^\n]+\|/, 'capability matrix does not state that new-account creation is invitation-only'],
]) {
  check(pattern.test(capabilitiesPage), message);
}

// BKLG-20260918-83o6: the invitation-only boundary is only actionable if the
// wait-list form is on the pages a turned-away visitor and a first-time reader
// actually open, and the URL is exact.
const WAITLIST_FORM_HREF = 'https://form.typeform.com/to/pNe4ot4a';
for (const fileId of [
  'reference/capabilities',
  'get-started/set-up-liskov',
  'troubleshooting/account-funding',
]) {
  const page = readFileSync(join(docsRoot, `${fileId}.md`), 'utf8');
  check(page.includes('invitation-only'), `invitation-only boundary: ${fileId} does not state it`);
  check(page.includes(WAITLIST_FORM_HREF), `invitation-only boundary: ${fileId} omits the wait-list form`);
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

for (const token of ['?order=stable', '?order=time', '?order=job', '#slot-1:g3', 'Job identity not reported', 'Load more', 'Show loaded history', 'Evidence unavailable', '$0.0008', 'stale']) {
  check(deploymentsPage.includes(token), `Deployments operating guide omits released contract: ${token}`);
}

// BKLG-20260922-kmc0 — the unlisted Billing Spend guide, prepared from the
// spendHistory block liskov-rs PR 1045 serves on the organization billing read
// and the Console page BKLG-20260922-ufrz builds. It stays Not released (the
// unlisted loop above pins the notice and the sidebar) until the release
// verification promotes it; nothing public may link to it or classify it first.
const spendAnalysisId = 'organizations/spend-analysis';
const spendAnalysisPage = readFileSync(join(docsRoot, `${spendAnalysisId}.md`), 'utf8');
for (const file of files) {
  if (idFor(file) === spendAnalysisId) continue;
  check(!readFileSync(file, 'utf8').includes('spend-analysis'), `${idFor(file)}: links the unreleased Billing Spend guide`);
}
check(!readFileSync(join(root, 'src', 'pages', 'index.tsx'), 'utf8').includes('spend-analysis'), 'landing page links the unreleased Billing Spend guide');
check(!/spend-analysis|Billing Spend|\*\*Spend\*\* page/.test(capabilitiesPage), 'capabilities classifies the Billing Spend page before its release verification');
for (const [token, meaning] of [
  // Path: a Billing child, not a new section.
  ['open **Billing & funding**, then **Spend**', 'the path through Billing'],
  ['`/settings/billing/spend`', 'the Console route'],
  // Ranges: whole UTC days, the partial present day, cut from 90 served days.
  ['**7 days**, **30 days**, or **90 days**', 'the three ranges'],
  ['**UTC days**', 'the UTC day basis'],
  ['**Today is partial.**', 'the partial present day'],
  ['Exactly 90 entries, oldest first', 'the 90 served days'],
  // Consumption kinds, each tied to its ledger kind.
  ['| **Compute** | `deploy_spend` |', 'Compute as deploy_spend'],
  ['| **Deployment fee** | `deployment_fee` |', 'Deployment fee as deployment_fee'],
  ['| **Platform usage** | `usage_charge` |', 'Platform usage as usage_charge'],
  // Reserves are held, not charged spend.
  ['It is held, not charged.', 'a reserve is not spend'],
  ['**Top-ups, refunds, and plan invoices.**', 'the excluded ledger rows'],
  // Forecasts are estimates, never invoices, and absent without history.
  ['Neither is an invoice, a quote, a limit, or a promise.', 'runway and daily average are estimates'],
  ['fewer than seven days of counted', 'the history threshold'],
  ['`insufficient_history`', 'the insufficient-history absence'],
  ['`no_current_period`', 'the no-current-period absence'],
  ['Liskov never stores it, never\nbills it', 'the projection is never billed'],
  ['**current billing period**', 'Spend by application stays the current period'],
  // Absent and error states stay apart; unknown never becomes zero.
  ['- **No spend.** Every day is present and zero.', 'the zero-spend state'],
  ['- **Not enough history.**', 'the insufficient-history state'],
  ['- **The read failed.**', 'the read-error state'],
  ['It does not show zeros in their place', 'unknown is not drawn as zero'],
]) {
  check(spendAnalysisPage.includes(token), `Billing Spend guide omits ${meaning}: ${token}`);
}
for (const [pattern, claim] of [
  [/\bSpend\b(?:\*\*)?(?: page)? is (?:now )?(?:available|released|live)\b/i, 'a production availability claim'],
  [/forecast band|daily cap|escrow/i, 'an unagreed forecast, cap or escrow series'],
]) {
  const prose = spendAnalysisPage.replace('Spend does not draw a forecast band, a daily cap, or a chart of\nheld reserves.', '');
  check(!pattern.test(prose), `Billing Spend guide makes ${claim}: ${pattern}`);
}

// BKLG-20260923-5y9y — the unlisted Compute guide, prepared from the committed
// Compute route vectors (liskov-rs crates/liskov-control-plane-api/vectors/
// compute_{summary,feasibility,errors}.json at 62b34f9a73c20c174131a2c98012007b897316f0,
// served by PR 1077, BKLG-20260923-7t1d). It stays Not released (the unlisted
// loop above pins the notice and the sidebar) until BKLG-20260922-j7nu verifies
// the deployed path; nothing public may link to it or classify it first.
const computeGuideId = 'organizations/compute';
const computeGuidePage = readFileSync(join(docsRoot, `${computeGuideId}.md`), 'utf8');
for (const file of files) {
  if (idFor(file) === computeGuideId) continue;
  check(!/organizations\/compute\b|\(\.\/compute\.md|\/compute\.md/.test(readFileSync(file, 'utf8')), `${idFor(file)}: links the unreleased Compute guide`);
}
check(!/organizations\/compute\b|compute\.md|['"]\/compute/.test(readFileSync(join(root, 'src', 'pages', 'index.tsx'), 'utf8')), 'landing page links the unreleased Compute guide');
check(!/organizations\/compute\b|compute\.md|\*\*Compute\*\* page|placement check/i.test(capabilitiesPage), 'capabilities classifies the Compute page before its release verification');
for (const [token, meaning] of [
  // Path and access: network-wide counts behind a signed-in membership.
  ['open **Compute** in the navigation', 'the Console path'],
  ['`/compute`, and the placement check at `/compute/placement`', 'the Console routes'],
  ['every\norganization sees the same counts', 'counts describe the network, not the organization'],
  // Counts, never inventory, with the suppression floor and zero kept apart.
  ['never shows a\nprocessor or manager identifier', 'no inventory'],
  ['It is either **zero** or **20 or more**.', 'the suppression floor'],
  ['| **Fewer than 20** | `suppressed` |', 'the suppressed state'],
  ['| Hidden | `withheld` |', 'the withheld state'],
  ['This is not zero and not fewer than 20.', 'unavailable is not zero'],
  ['**Zero is shown as zero.**', 'zero stays zero'],
  // Upper bounds with placement headroom, and only the supported V5 fields.
  ['They are **upper bounds** on what is\nplaceable', 'reported capability as an upper bound'],
  ['at least 10%\nmore than it', 'memory and storage headroom'],
  ['at least 50% more', 'CPU score headroom'],
  ['| Memory | `deployment.placement.minimums.memory` |', 'the memory minimum'],
  ['| Storage | `deployment.placement.minimums.storage` |', 'the storage minimum'],
  ['| Single-core score | `deployment.placement.minimums.cpuSingleCoreScore` |', 'the single-core minimum'],
  ['| Multi-core score | `deployment.placement.minimums.cpuMultiCoreScore` |', 'the multi-core minimum'],
  ['| Runtime | `runtime.kind` |', 'the runtime kind'],
  ['| Jobs | `deployment.jobs` | 1–256; one if you leave it out', 'the jobs default'],
  // Missing, stale and conflicting sources stay distinct.
  ['| `projection_missing` |', 'the missing projection'],
  ['| `source_not_built` |', 'the unbuilt source'],
  ['| `no_measured_basis` |', 'the unmeasured basis'],
  ['| `source_conflict` |', 'conflicting facts'],
  ['| `not_served` |', 'the unserved panel'],
  ['- **Stale** — the last observation is older than expected', 'the stale state'],
  ['An unavailable\npanel shows no figures at all, never zeros.', 'an unavailable panel draws no zeros'],
  ['- **The read failed.**', 'the read-error state'],
  ['It does not show zeros in their place.', 'a failed read is not zero'],
  // Observed liveness, not inferred reliability.
  ['**observed** heartbeating', 'observed heartbeats'],
  ['It does not infer missed heartbeats', 'no inferred missed heartbeats'],
  ['is **unavailable**, not zero', 'an uncovered hour is not zero'],
  // Located-only geography, and no country or manager control in V5.
  ['**only processors Liskov has already located**', 'located-only geography'],
  ['**of the located**, never of the whole network', 'shares of the located'],
  ['never extrapolates', 'no extrapolation'],
  ['they are not enabled by these\nV5 pages', 'country and manager controls not enabled'],
  ['| `unsupported_in_v5` |', 'the V6 control refusal'],
  ['| `unsupported_selector` |', 'the processor selector refusal'],
  // Occupancy: absent is not zero capacity.
  ['**Absent occupancy is not zero capacity**', 'absent occupancy'],
  // Memory sizing, one workload per device, no speed claim.
  ['**one workload of\n  that size per device**', 'one workload per device'],
  ['It is **not a CPU-speed claim**', 'no CPU-speed claim'],
  ['Liskov does not substitute an assumed\nreserve.', 'no assumed reserve'],
  // Final JIT stays the allocation authority.
  ['The answer is **advisory**. It is an upper bound', 'feasibility is advisory'],
  ['**final placement at launch** is what assigns a processor', 'final JIT authority'],
  ['A result of 20\nor more is not a promise', 'no placement promise'],
  ['`compute_summary_v1`', 'the summary schema'],
  ['`compute_feasibility_v1`', 'the feasibility schema'],
]) {
  check(computeGuidePage.includes(token), `Compute guide omits ${meaning}: ${token}`);
}
for (const [pattern, claim] of [
  [/\b(?:Compute|placement check)\b(?:\*\*)?(?: page)? (?:is|are) (?:now )?(?:available|released|live)\b/i, 'a production availability claim'],
  [/processor(?:Id)?s?\s*[:=]\s*["'`]?0x|\b[1-9]\d{2,}\s+(?:processors|devices|phones)\b/i, 'a processor inventory or sample count'],
  [/\b(?:t4g|EC2|equivalent to)\b/i, 'a cloud-instance speed equivalence'],
  [/\bprobe\b|\bproof liskov (?:admin|platform)\b|\bSQL\b|\bre-?run the (?:projection|ingest)/i, 'a probe or operator repair instruction'],
]) {
  check(!pattern.test(computeGuidePage), `Compute guide makes ${claim}: ${pattern}`);
}

// BKLG-20260923-v8en — the unlisted Google sign-in and invitation guide,
// prepared from ADR-0155 and the merged Google packets (liskov-rs d3ef06f8:
// PRs 1060, 1070, 1087; liskov-ui f8205a8: PRs 178, 189). It stays Not released
// (the unlisted loop above pins the notice and the sidebar) until
// BKLG-20260921-spd9 verifies the deployed path with production evidence and a
// legal disposition; nothing public may link to it, classify it, or describe
// Google sign-in first.
const googleGuideId = 'get-started/google-sign-in';
const googleGuideFile = join(docsRoot, `${googleGuideId}.md`);
const googleGuidePage = existsSync(googleGuideFile) ? readFileSync(googleGuideFile, 'utf8') : '';
const googleSignInClaim = /sign(?:ing)? in with Google|Google sign-in|(?:Continue|Accept) with Google|Google account/i;
for (const file of files) {
  const id = idFor(file);
  if (id === googleGuideId) continue;
  const content = readFileSync(file, 'utf8');
  check(!/get-started\/google-sign-in\b|google-sign-in\.md/.test(content), `${id}: links the unreleased Google sign-in guide`);
  check(!googleSignInClaim.test(content), `${id}: describes Google sign-in before its release verification`);
}
check(!/google-sign-in/.test(readFileSync(join(root, 'src', 'pages', 'index.tsx'), 'utf8')), 'landing page links the unreleased Google sign-in guide');
check(!/\bGoogle\b/.test(capabilitiesPage), 'capabilities classifies Google sign-in before its release verification');
for (const [token, meaning] of [
  // ADR-0155 §1: the verified mailbox is the native account the email link reaches.
  ['**the same account**', 'Google and the email link reach one account'],
  ['Your Liskov account is your email address.', 'the mailbox is the account'],
  ['**without regard to capital letters**, and nothing\n  else.', 'case normalisation only'],
  ['are **three different\n  accounts** here', 'no Gmail dot or + canonicalisation'],
  ['Google must have **confirmed** the address.', 'email_verified is required'],
  ['reaches the account for the new address, not the old one', 'a changed Google address is another account'],
  // ADR-0155 §3 and §6: GitHub stays separate; Google confers no repository access.
  ['**two separate\naccounts**', 'GitHub is a separate account'],
  ['Liskov never merges or links the two, and never tells you that another\n  account exists.', 'no merge, link or disclosure'],
  ['**A Google sign-in grants no GitHub repository access.**', 'no repository access'],
  ['Signing in with Google does not change which actions need GitHub.', 'GitHub-gated actions unchanged'],
  // The agreed sign-in page (liskov-ui PR 178) and the hjxz flow.
  ['**Continue with Google**', 'the sign-in control'],
  ['**Google login not configured** or **Google login\nunavailable**', 'the unconfigured and unavailable states'],
  ['> We couldn\'t sign you in. Try again, or use another way to sign in.', 'the generic failure copy'],
  ['> Google didn\'t confirm an email address for this account. Use the magic link instead.', 'the unverified-email copy'],
  ['so it never says whether an\naccount exists', 'failure never discloses an account'],
  ['Finish within 10 minutes, in the same browser you started in.', 'the flow lifetime and browser binding'],
  ['Signing in never spends Service Credits.', 'no spend'],
  // ADR-0155 §4: the wait-list treats Google exactly as email.
  ['A Google sign-in is admitted exactly as an email sign-in is.', 'wait-list parity'],
  ['**Liskov is invitation-only right now**', 'the wait-list screen'],
  ['you do not need a\nnew invitation to use Google with the same address', 'a returning mailbox needs no second invitation'],
  // ADR-0155 §5 and the invitation page (liskov-rs PR 1087, liskov-ui PR 189).
  ['A GitHub\n  sign-in proves no email address, so it cannot accept an invitation sent to\n  one.', 'GitHub cannot accept an email invitation'],
  ['**An invitation sent to a GitHub account** is accepted with GitHub', 'the GitHub-login invitation is unchanged'],
  ['**Accept with Google**', 'the invitation control'],
  ['**Sign in as that address to accept it.**', 'the mailbox refusal'],
  ['the invitation stays usable by\nthe person it was sent to', 'a refused link stays redeemable'],
  ['**This invitation has already been used, so it cannot seat anyone again.**', 'the 409 state'],
  ['**This invitation has expired.**', 'the 410 state'],
  ['no other organization and no GitHub repository\naccess', 'acceptance grants only the role'],
]) {
  check(googleGuidePage.includes(token), `Google sign-in guide omits ${meaning}: ${token}`);
}
for (const [pattern, claim] of [
  [/\bGoogle\b[^.\n]*\b(?:is|are) (?:now )?(?:available|released|live)\b/i, 'a production availability claim'],
  [/\b(?:automatically|will|we) (?:merge|link|join|combine)\b|\b(?:merged|linked) (?:with|to) your GitHub/i, 'an account merge or link'],
  [/\bGoogle\b[^.\n]*\b(?:grants?|gives?) (?:you )?(?:GitHub )?(?:repository|repo) access/i, 'a repository-access grant'],
  [/\b(?:ignores?|removes?|strips?) (?:the )?(?:dots|`?\+`? suffix)/i, 'Gmail address canonicalisation'],
  [/\bDecline\b/i, 'the undecided Decline invitation control'],
  [/\bno seat\b|\bseat (?:limit|allowance)\b/i, 'a seat refusal the accept route does not have'],
  [/invite_email_mismatch|invite_not_for_you|LISKOV_GOOGLE_|\/api\/auth\/google|platform admin/i, 'a server code, operator setting or internal route'],
]) {
  check(!pattern.test(googleGuidePage), `Google sign-in guide makes ${claim}: ${pattern}`);
}

check(combined.includes('v0.3.26'), 'runtime reference omits the supported SDK version');
check(combined.includes('v0.3.33') && combined.includes('signed runtime-env fallback'),
  'runtime reference omits the released JavaScript signed fallback');
check(combined.includes('QmQCpRJ593xRyKko9smvtFixzfAGwDuG6gXBemRtUeSe4U'), 'Uptime Prober CID differs from descriptor');
check(combined.includes('7545ffe44288c548ff4dea09ef0c0dc318a8dd490c5dc822becec3ff0d307d57'), 'Uptime Prober digest differs from descriptor');
check(combined.includes('UPTIME_PROBER_TG_BOT_TOKEN'), 'Uptime Prober secret destination differs from descriptor');

if (errors.length > 0) {
  console.error(`Liskov docs checks failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Liskov docs checks passed: ${files.length} pages, ${redirectSources.size} redirects, fixtures and retrieval map verified.`);

// BKLG-20260904-1s9e: pause copy must preserve the customer release gate.
const checkoutPausePage = readFileSync(new URL("../docs/liskov/troubleshooting/account-funding.md", import.meta.url), "utf8");
for (const literal of ["checkout_admission_disabled", "stripe_webhook_not_configured", "Previously paid purchases", "release gate"]) {
  if (!checkoutPausePage.includes(literal)) throw new Error(`Checkout pause contract missing: ${literal}`);
}
