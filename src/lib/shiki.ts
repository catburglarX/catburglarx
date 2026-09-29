import { createCssVariablesTheme, getSingletonHighlighter } from "shiki";

// Token colours are CSS variables (see --shiki-* in globals.css), so one
// highlighted block follows the light and dark theme with no extra markup.
export const codeTheme = createCssVariablesTheme({
  name: "coffee-and-code",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

export const CODE_LANGS = ["ts", "tsx", "bash", "python", "json", "html", "css"] as const;

export function highlighter() {
  return getSingletonHighlighter({ themes: [codeTheme], langs: [...CODE_LANGS] });
}

export async function highlight(code: string, lang: (typeof CODE_LANGS)[number]): Promise<string> {
  return (await highlighter()).codeToHtml(code, { lang, theme: codeTheme });
}
