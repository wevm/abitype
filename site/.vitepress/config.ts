import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  description: 'Just playing around.',
  lang: 'en-US',
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config: async (md) => {
      // use more markdown-it plugins!
      // md.use(require('markdown-it-shiki-twoslash'))
    }
  },
  themeConfig: {
    // algolia: {
    //   appId: 'B2GGTJJMD3',
    //   apiKey: '42f4bd06fd3343c9a742128af056bdf5',
    //   indexName: 'abitype',
    // },
    editLink: {
      pattern: 'https://github.com/wagmi-dev/abitype/edit/main/site/:path',
      text: 'Suggest changes to this page',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT weth, LLC  ',
    },
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api' },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Release Notes ',
            link: 'https://github.com/wagmi-dev/abitype/releases',
          },
          {
            text: 'Contributing ',
            link: 'https://github.com/wagmi-dev/abitype/blob/main/.github/CONTRIBUTING.md',
          },
        ],
      },
    ],
    outline: [2, 3],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          collapsed: false,
          items: [
            {
              text: 'What is ABIType?',
              link: '/',
            },
            {
              text: 'Getting Started',
              link: '/getting-started',
            },
            {
              text: 'Comparisons',
              link: '/guide/comparisons',
            },
            {
              text: 'Walkthrough',
              link: '/guide/walkthrough',
            },
          ]
        },
        {
          text: 'API',
          collapsed: false,
          items: [
            {
              text: 'Configuration',
              link: '/api/config',
            },
            {
              text: 'Types',
              link: '/api',
            },
            {
              text: 'Utilities',
              link: '/api/utilities',
            },
            {
              text: 'Human-Readable',
              link: '/api/human',
            },
            {
              text: 'Test Entrypoint',
              link: '/api/test',
            },
            {
              text: 'Zod Entrypoint',
              link: '/api/zod',
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/wagmi_sh' },
      { icon: 'github', link: 'https://github.com/wagmi-dev/abitype' },
    ],
  },
  title: 'ABIType',
})