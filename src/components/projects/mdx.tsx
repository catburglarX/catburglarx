import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import { CODE_LANGS, codeTheme } from "@/lib/shiki";
import { Screenshot } from "./screenshot";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-3 text-2xl sm:text-[1.75rem]" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-2 text-xl" {...props} />,
  p: (props) => <p className="my-4" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 marker:text-blush" {...props} />,
  ol: (props) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 marker:font-bold marker:text-primary"
      {...props}
    />
  ),
  a: ({ href = "", ...props }) =>
    /^https?:\/\//.test(href) ? (
      <a className="link" href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a className="link" href={href} {...props} />
    ),
  code: (props) => (
    <code
      className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[0.85em] [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0"
      {...props}
    />
  ),
  pre: (props) => <pre className="card my-6" {...props} />,
  Screenshot,
};

/** Compiles a case study at build time. Code blocks are highlighted by Shiki; no MDX runtime ships to the browser. */
export async function Mdx({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    rehypePlugins: [[rehypeShiki, { theme: codeTheme, langs: [...CODE_LANGS] }]],
  });
  return <Content components={components} />;
}
