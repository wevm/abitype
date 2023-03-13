// prettier-ignore
import type { UserConfigSettings } from "shiki-twoslash"
import type MarkdownIt from "markdown-it"

import { setupForFile, transformAttributesToHTML } from "remark-shiki-twoslash"

export const markdownItShikiTwoslashSetup = async (settings: UserConfigSettings): Promise<MarkdownIt.PluginWithOptions<UserConfigSettings>> => {
  const { highlighters } = await setupForFile(settings)

  return (markdownit, options) => {
    markdownit.options.highlight = (code, lang, attrs) => {
      code = code.replace(/\r?\n$/, "") // strip trailing newline fed during code block parsing
      return transformAttributesToHTML(code, [lang, attrs].join(" "), highlighters, options!)
    }
  }
}
