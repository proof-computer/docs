import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  liskovSidebar: [
    'index',
    {
      type: 'category',
      label: 'Get started',
      link: {type: 'doc', id: 'get-started/index'},
      collapsed: false,
      items: [
        'get-started/choose-your-path',
        'get-started/set-up-liskov',
        'get-started/github',
        'get-started/first-deployment',
      ],
    },
    {
      type: 'category',
      label: 'Build & release',
      link: {type: 'doc', id: 'build/index'},
      items: [
        'build/workload-requirements',
        'build/runtime-sdk',
        'build/manifest-v4',
        'build/github-actions',
        'build/artifacts-provenance',
        'build/validate-import-publish',
      ],
    },
    {
      type: 'category',
      label: 'Configure',
      link: {type: 'doc', id: 'configure/index'},
      items: [
        'configure/variables',
        'configure/secrets',
        'configure/resources-networking',
        'configure/schedules-updates',
        'configure/processor-placement',
        'configure/logging-diagnostics',
        'configure/spend-limits',
      ],
    },
    {
      type: 'category',
      label: 'Deploy & operate',
      link: {type: 'doc', id: 'operate/index'},
      items: [
        'operate/status-action-plan',
        'operate/deployments-jobs',
        'operate/proof-chain',
        'operate/logs-activity',
        'operate/runtime-ssh',
        'operate/update',
        'operate/pause-resume',
        'operate/diagnose-retry',
        'operate/retire',
      ],
    },
    {
      type: 'category',
      label: 'Organizations & billing',
      link: {type: 'doc', id: 'organizations/index'},
      items: [
        'organizations/teams',
        'organizations/roles',
        'organizations/service-credits',
        'organizations/charges',
        'organizations/records-notifications',
      ],
    },
    {
      type: 'category',
      label: 'Concepts & security',
      link: {type: 'doc', id: 'concepts/index'},
      items: [
        'concepts/how-liskov-works',
        'concepts/domain-model',
        'concepts/replacement-custody',
        'concepts/trust-boundaries',
        'concepts/attestation',
        'concepts/costs-custody',
        'concepts/product-boundaries',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      link: {type: 'doc', id: 'reference/index'},
      items: [
        'reference/cli',
        'reference/manifest-v4',
        'reference/runtime-sdk',
        'reference/capabilities',
        'reference/statuses-actions-errors',
        'reference/configuration-precedence',
        'reference/schema-endpoints',
        'reference/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      link: {type: 'doc', id: 'troubleshooting/index'},
      items: [
        'troubleshooting/account-funding',
        'troubleshooting/build-publish',
        'troubleshooting/deployment',
        'troubleshooting/config-bootstrap',
        'troubleshooting/logs',
        'troubleshooting/billing-retirement',
        'troubleshooting/support',
      ],
    },
  ],
};

export default sidebars;
