// prettier-ignore
import type { UserConfigSettings } from "shiki-twoslash"
import type MarkdownIt from 'markdown-it'
import { getHighlighter } from 'shiki'
import { setupForFile, transformAttributesToHTML } from 'remark-shiki-twoslash'

export const markdownItShikiTwoslashSetup = async (
  settings: UserConfigSettings,
): Promise<MarkdownIt.PluginWithOptions<UserConfigSettings>> => {
  const { highlighters } = await setupForFile(settings)
  const highlighter = await getHighlighter({
    themes: settings['themes'],
    langs: ['bash'],
  })

  return (markdownit, options) => {
    markdownit.options.highlight = (code, lang, attrs) => {
      code = code.replace(/\r?\n$/, '') // strip trailing newline fed during code block parsing

      if (lang === 'bash') {
        const light = highlighter.codeToHtml(code, {
          lang: 'bash',
        })
        const dark = highlighter.codeToHtml(code, {
          lang: 'bash',
          theme: 'vitesse-dark',
        })
        const bothCodeBlocks = light + '\n' + dark

        return bothCodeBlocks
      }

      return transformAttributesToHTML(
        code,
        [lang, attrs].join(' '),
        highlighters,
        options!,
      )
    }
  }
}
