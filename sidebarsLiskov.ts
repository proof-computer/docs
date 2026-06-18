import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  liskovSidebar: [
    'index',
    {
      type: 'category',
      label: 'Quickstart',
      link: {type: 'doc', id: 'quickstart/index'},
      collapsed: false,
      items: ['quickstart/install', 'quickstart/first-deploy'],
    },
    {
      type: 'category',
      label: 'Concepts',
      link: {type: 'doc', id: 'concepts/index'},
      items: [
        'concepts/replacement-custody',
        'concepts/deployment-lifecycle',
        'concepts/trust-model',
        'concepts/policy-and-versioning',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {type: 'doc', id: 'guides/index'},
      items: [
        'guides/github-launches',
        'guides/sealed-secrets',
        'guides/encrypted-logging',
        'guides/baran-ingress',
        'guides/schedules-and-replicas',
        'guides/budgets-and-spend',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      link: {type: 'doc', id: 'reference/index'},
      items: [
        'reference/cli',
        'reference/policy-schema',
        'reference/reconcile-states',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      link: {type: 'doc', id: 'troubleshooting/index'},
      items: [
        'troubleshooting/replacement-holds',
        'troubleshooting/preflight-and-spend',
        'troubleshooting/recovery',
      ],
    },
  ],
};

export default sidebars;
