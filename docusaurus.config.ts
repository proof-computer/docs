import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'PROOF Docs',
  tagline: 'Documentation for PROOF products',
  favicon: 'img/proof-mark.svg',

  url: 'https://docs.proof.computer',
  baseUrl: '/',

  organizationName: 'proof-computer',
  projectName: 'docs',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs/switchboard',
          routeBasePath: 'switchboard',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/proof-computer/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'PROOF Docs',
      logo: {
        alt: 'PROOF',
        src: 'img/proof-mark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'switchboardSidebar',
          position: 'left',
          label: 'Switchboard',
        },
        {
          href: 'https://github.com/proof-computer',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Switchboard',
              to: '/switchboard',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: 'PROOF CLI',
              href: 'https://www.npmjs.com/package/@proof-computer/proof-cli',
            },
            {
              label: 'Switchboard CLI',
              href: 'https://www.npmjs.com/package/@proof-computer/switchboard-cli',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/proof-computer',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PROOF. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
