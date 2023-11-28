import footNote from 'markdown-it-footnote'
import ts from 'typescript'
import { defineConfig } from 'vitepress'
import { withTwoslash } from 'vitepress-plugin-shiki-twoslash'

import { version } from '../../packages/abitype/package.json'
import { getSidebar } from './sidebar'

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
      sidebar: getSidebar(),
      siteTitle: false,
      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/wevm_dev' },
        { icon: 'github', link: 'https://github.com/wagmi-dev/abitype' },
      ],
    },
    title: 'ABIType: Strict TypeScript types for Ethereum ABIs',
    twoslash: {
      addTryButton: true,
      defaultCompilerOptions: {
        paths: {
          // Source - reference source files so we don't need to build packages to get types (speeds things up)
          abitype: ['../../packages/abitype/src/exports'],
          'abitype/*': ['../../packages/abitype/src/exports/*'],
        },
        strict: true,
        target: ts.ScriptTarget.ESNext,
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
