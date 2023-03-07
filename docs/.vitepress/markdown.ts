import type { DefaultTheme, UserConfig } from 'vitepress'
import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash'
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import footNote from 'markdown-it-footnote'
type ThemeConfig = DefaultTheme.Config
type Config = UserConfig<ThemeConfig>

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../')

const shiki = await markdownItShikiTwoslashSetup({
  theme: 'vitesse-dark',
  wrapFragments: true,
  vfsRoot: resolve(root, 'packages/twoslash'),
})
export const MARKDOWN: Config['markdown'] = {
  theme: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
  config: (md) => {
    md.use(footNote)
    md.use(shiki, {
      vfsRoot: resolve(root, 'packages/twoslash'),
      defaultCompilerOptions: {
        target: 'esnext',
      },
      wrapFragments: true,
    })
  },
}
