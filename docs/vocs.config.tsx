import * as React from 'react'
import ts from 'typescript'
import { defineConfig } from 'vocs'
import { sidebar } from './sidebar'
import { version } from './version'

export default defineConfig({
  description:
    'Utilities and type definitions for ABI properties and values, covering the Contract ABI Specification, as well as EIP-712 Typed Data.',
  editLink: {
    pattern: 'https://github.com/wevm/abitype/edit/main/docs/:path',
    text: 'Suggest changes to this page',
  },
  head: (
    <>
      <meta
        name="keywords"
        content="ethereum, abi, typescript, types, eip-712, typed data"
      />
      <meta property="og:url" content="https://abitype.dev" />
      <meta property="twitter:image" content="https://abitype.dev/og.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <script
        src="https://cdn.usefathom.com/script.js"
        data-site="WKTTIYCY"
        defer
      />
    </>
  ),
  markdown: {
    code: {
      theme: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
  },
  ogImageUrl: '/og.png',
  iconUrl: '/favicon.png',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  rootDir: '.',
  sidebar,
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/wevm/abitype',
    },
    {
      icon: 'discord',
      link: 'https://discord.gg/xCUz9FRcXD',
    },
    {
      icon: 'x',
      link: 'https://x.com/wevm_dev',
    },
  ],
  sponsors: [
    {
      name: 'Collaborator',
      height: 120,
      items: [
        [
          {
            name: 'Paradigm',
            link: 'https://paradigm.xyz',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/paradigm-light.svg',
          },
        ],
      ],
    },
    {
      name: 'Large Enterprise',
      height: 60,
      items: [
        [
          {
            name: 'WalletConnect',
            link: 'https://walletconnect.com',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/walletconnect-light.svg',
          },
          {
            name: 'Stripe',
            link: 'https://www.stripe.com',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/stripe-light.svg',
          },
        ],
      ],
    },
    {
      name: 'Small Enterprise',
      height: 40,
      items: [
        [
          {
            name: 'Family',
            link: 'https://twitter.com/family',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/family-light.svg',
          },
          {
            name: 'Context',
            link: 'https://twitter.com/context',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/context-light.svg',
          },
          {
            name: 'PartyDAO',
            link: 'https://twitter.com/prtyDAO',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/partydao-light.svg',
          },
        ],
        [
          {
            name: 'SushiSwap',
            link: 'https://www.sushi.com',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/sushi-light.svg',
          },
          {
            name: 'Dynamic',
            link: 'https://www.dynamic.xyz',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/dynamic-light.svg',
          },
          {
            name: 'BitKeep',
            link: 'https://bitkeep.com',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/bitkeep-light.svg',
          },
        ],
        [
          {
            name: 'Privy',
            link: 'https://privy.io',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/privy-light.svg',
          },
          {
            name: 'Spruce',
            link: 'https://spruceid.com',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/spruce-light.svg',
          },
          {
            name: 'rollup.id',
            link: 'https://rollup.id',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/rollup.id-light.svg',
          },
        ],
        [
          {
            name: 'PancakeSwap',
            link: 'https://pancakeswap.finance',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/pancake-light.svg',
          },
          {
            name: 'Celo',
            link: 'https://celo.org',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/celo-light.svg',
          },
          {
            name: 'Rainbow',
            link: 'https://rainbow.me',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/rainbow-light.svg',
          },
        ],
        [
          {
            name: 'Pimlico',
            link: 'https://pimlico.io',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/pimlico-light.svg',
          },
          {
            name: 'Zora',
            link: 'https://zora.co',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/zora-light.svg',
          },
          {
            name: 'Supa',
            link: 'https://twitter.com/supafinance',
            image:
              'https://raw.githubusercontent.com/wevm/.github/main/content/sponsors/supa-light.svg',
          },
        ],
      ],
    },
  ],
  theme: {
    accentColor: '#6da13f',
    colorScheme: 'system',
  },
  title: 'ABIType',
  titleTemplate: '%s · ABIType',
  topNav: [
    { text: 'Guide', link: '/' },
    { text: 'API', link: '/api/types' },
    {
      text: `v${version}`,
      items: [
        {
          text: 'Release Notes ',
          link: 'https://github.com/wevm/abitype/releases',
        },
        {
          text: 'Contributing ',
          link: 'https://github.com/wevm/abitype/blob/main/.github/CONTRIBUTING.md',
        },
      ],
    },
  ],
  twoslash: {
    defaultCompilerOptions: {
      strict: true,
      target: ts.ScriptTarget.ESNext,
    },
  },
})
