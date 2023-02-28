import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash'

export default defineConfig({
  description: 'Just playing around.',
  ignoreDeadLinks: true, // TODO: Turn off for prod
  lang: 'en-US',
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config: async (md) => {
      md.use(require('markdown-it-footnote'))
    },
  },
  themeConfig: {
    algolia: {
      appId: 'B2GGTJJMD3',
      apiKey: '42f4bd06fd3343c9a742128af056bdf5',
      indexName: 'abitype',
    },
    editLink: {
      pattern: 'https://github.com/wagmi-dev/abitype/edit/main/site/:path',
      text: 'Suggest changes to this page',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT weth, LLC  ',
    },
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'API', link: '/api/types' },
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
          items: [
            {
              text: 'What is ABIType? 🚧',
              link: '/',
            },
            {
              text: 'Getting Started',
              link: '/guide/getting-started',
            },
            {
              text: 'Walkthrough',
              link: '/guide/walkthrough',
            },
            {
              text: 'Comparisons',
              link: '/guide/comparisons',
            },
          ],
        },
        {
          text: 'API',
          items: [
            {
              text: 'Types',
              link: '/api/types',
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
              text: 'Test',
              link: '/api/test',
            },
            {
              text: 'Zod',
              link: '/api/zod',
            },
          ],
        },
        {
          text: 'Config',
          items: [
            {
              text: 'Reference',
              link: '/config',
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
