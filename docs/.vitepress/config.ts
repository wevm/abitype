import footNote from 'markdown-it-footnote'
import { ScriptTarget } from 'typescript'
import { defineConfig } from 'vitepress'
import { withTwoslash } from 'vitepress-plugin-shiki-twoslash'

import { version } from '../../package.json'

export default withTwoslash(
  defineConfig({
    cleanUrls: true,
    description:
      'Utilities and type definitions for ABI properties and values, covering the Contract ABI Specification, as well as EIP-712 Typed Data.',
    head: [
      ['meta', { name: 'theme-color', content: '#729b1a' }],
      ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      [
        'link',
        {
          rel: 'alternate icon',
          href: '/favicon.png',
          type: 'image/png',
          sizes: '48x48',
        },
      ],
      [
        'meta',
        {
          name: 'keywords',
          content: 'ethereum, abi, typescript, types, eip-712, typed data',
        },
      ],
      ['meta', { property: 'og:url', content: 'https://abitype.dev' }],
      ['meta', { property: 'og:image', content: 'https://abitype.dev/og.png' }],
      [
        'meta',
        { name: 'twitter:image', content: 'https://abitype.dev/og.png' },
      ],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      [
        'script',
        {
          src: 'https://cdn.usefathom.com/script.js',
          'data-site': 'WKTTIYCY',
          defer: '',
        },
      ],
    ],
    lang: 'en-US',
    lastUpdated: true,
    markdown: {
      theme: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      config: (md) => {
        md.use(footNote)
      },
    },
    themeConfig: {
      algolia: {
        appId: '4QMG0RYQG7',
        apiKey: 'd2114bafbf2a7fb3c9c2a856d4bc9e38',
        indexName: 'abitype',
      },
      editLink: {
        pattern: 'https://github.com/wagmi-dev/abitype/edit/main/docs/:path',
        text: 'Suggest changes to this page',
      },
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2023-PRESENT weth, LLC  ',
      },
      logo: {
        light: '/logo-light.svg',
        dark: '/logo-dark.svg',
        alt: 'ABIType logo',
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
                text: 'What is ABIType?',
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
      siteTitle: false,
      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/wagmi_sh' },
        { icon: 'github', link: 'https://github.com/wagmi-dev/abitype' },
      ],
    },
    title: 'ABIType: Strict TypeScript types for Ethereum ABIs',
    twoslash: {
      addTryButton: true,
      defaultCompilerOptions: {
        target: ScriptTarget.ESNext,
      },
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    },
  }),
)
