import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'PROOF Docs',
  tagline: 'Documentation for PROOF products',
  favicon: 'img/proof-mark.svg',
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap',
      type: 'text/css',
    },
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],

  url: 'https://docs.proof.computer',
  baseUrl: '/',

  organizationName: 'proof-computer',
  projectName: 'docs',

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
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
          // Baran is the default docs instance, served at /baran. Liskov is a
          // second instance registered as a plugin below.
          path: 'docs/baran',
          routeBasePath: 'baran',
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

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'liskov',
        path: 'docs/liskov',
        routeBasePath: 'liskov',
        sidebarPath: './sidebarsLiskov.ts',
        editUrl: 'https://github.com/proof-computer/docs/tree/main/',
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    navbar: {
      title: 'PROOF',
      logo: {
        alt: 'PROOF Beacon mark',
        src: 'img/proof-mark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'baranSidebar',
          position: 'left',
          label: 'Baran',
        },
        {
          type: 'docSidebar',
          sidebarId: 'liskovSidebar',
          docsPluginId: 'liskov',
          position: 'left',
          label: 'Liskov',
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
              label: 'Baran',
              to: '/baran',
            },
            {
              label: 'Liskov',
              to: '/liskov',
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
              label: 'Baran Plugin',
              href: 'https://www.npmjs.com/package/@proof-computer/proof-cli-baran',
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
