import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  switchboardSidebar: [
    'index',
    {
      type: 'category',
      label: 'Quickstart',
      link: {type: 'doc', id: 'quickstart/index'},
      collapsed: false,
      items: ['quickstart/install', 'quickstart/launch-demo'],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {type: 'doc', id: 'guides/index'},
      items: ['guides/custom-domains', 'guides/cargo-ssh'],
    },
    {
      type: 'category',
      label: 'Concepts',
      link: {type: 'doc', id: 'concepts/index'},
      items: ['concepts/trust-model', 'concepts/deployment-lifecycle'],
    },
    {
      type: 'category',
      label: 'SDK & Adapters',
      link: {type: 'doc', id: 'sdk-adapters/index'},
      items: [
        'sdk-adapters/express',
        'sdk-adapters/fastify',
        'sdk-adapters/sdk-workflows',
      ],
    },
    {
      type: 'category',
      label: 'Operator Preview',
      link: {type: 'doc', id: 'operator-preview/index'},
      items: ['operator-preview/gateway'],
    },
    {
      type: 'category',
      label: 'Reference',
      link: {type: 'doc', id: 'reference/index'},
      items: ['reference/cli', 'reference/config', 'reference/relay-api'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      link: {type: 'doc', id: 'troubleshooting/index'},
      items: ['troubleshooting/deploy', 'troubleshooting/dns-acme'],
    },
  ],
};

export default sidebars;
