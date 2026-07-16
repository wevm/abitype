import { defineConfig } from 'vocs/config'
import { sidebar } from './sidebar'
import { version } from './version'

const baseUrl =
  process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`
    : 'https://abitype.dev'

function rehypeTwoslashGeneratedLinks() {
  return (tree: any) => {
    visit(tree)

    function visit(node: any, insideTwoslashDocs = false) {
      if (!node || typeof node !== 'object') return

      const className = node.properties?.className
      const classNames = Array.isArray(className)
        ? className
        : typeof className === 'string'
          ? className.split(/\s+/)
          : []
      const nextInsideTwoslashDocs =
        insideTwoslashDocs || classNames.includes('twoslash-popup-docs')

      if (
        node.tagName === 'a' &&
        (nextInsideTwoslashDocs || node.properties?.href === 'InterfaceAbi')
      )
        delete node.properties?.href

      for (const child of node.children ?? [])
        visit(child, nextInsideTwoslashDocs)
    }
  }
}

export default defineConfig({
  baseUrl,
  description:
    'Utilities and type definitions for ABI properties and values, covering the Contract ABI Specification, as well as EIP-712 Typed Data.',
  editLink: {
    link: 'https://github.com/wevm/abitype/edit/main/docs/:path',
    text: 'Suggest changes to this page',
  },
  codeHighlight: {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  markdown: {
    rehypePlugins: [rehypeTwoslashGeneratedLinks],
  },
  redirects: [
    {
      source: '/api/human',
      destination: 'https://oxlib.sh/guides/abi#human-readable-abis',
      status: 308,
    },
    {
      source: '/api/zod',
      destination: 'https://oxlib.sh/zod/schemas/Abi',
      status: 308,
    },
  ],
  ogImageUrl: '/og.png',
  iconUrl: '/favicon.png',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  srcDir: '.',
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
  accentColor: '#6da13f',
  colorScheme: 'light dark',
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
    twoslashOptions: {
      compilerOptions: {
        strict: true,
        // `ts.ScriptTarget.ESNext` without importing `typescript` into the Vercel server bundle.
        target: 99,
      },
    },
  },
})
