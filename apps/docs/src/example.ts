// Self-generating example helper.
//
// You give it a `render` function. The helper:
//   1. Calls the function once to get a KlodsNode → live DOM preview.
//   2. Reads the function's source via `render.toString()` → "TypeScript" pane.
//   3. Calls `.toString()` on the result → "HTML" pane.
//
// The three panes are guaranteed to stay in sync because they all derive from
// one source of truth: the `render` function you pass in.

import type { KlodsNode } from "klods-js";
import { card, cardBody, cardTitle, el, raw } from "klods-js";

import hljs from "./hljs";

export type ExampleSpec = {
  title: string;
  description?: string;
  /** A function that produces the KlodsNode to demo. Source is shown verbatim. */
  render: () => KlodsNode;
  /** Set to true to hide the TypeScript and HTML source panes (e.g. for prose-only cards). */
  hideCode?: boolean;
  /**
   * Pre-formatted TypeScript source injected by the vite-plugin-example-source
   * build plugin. When present, used instead of fn.toString() so the pane shows
   * the original source (with types, proper indentation) rather than esbuild output.
   */
  _source?: string;
};

/** Tiny HTML pretty-printer for the "HTML" tab. */
function prettyHtml(html: string): string {
  const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
  const tokens = html.split(/(<\/?[^>]+>)/g).filter(Boolean);
  let depth = 0;
  const out: string[] = [];
  for (const tok of tokens) {
    if (/^<\//.test(tok)) {
      depth = Math.max(0, depth - 1);
      out.push("  ".repeat(depth) + tok);
    } else if (/^<[^/]/.test(tok)) {
      const tagName = /^<([a-zA-Z0-9-]+)/.exec(tok)?.[1] ?? "";
      const selfClosing = /\/>$/.test(tok) || VOID.test(tagName);
      out.push("  ".repeat(depth) + tok);
      if (!selfClosing) depth += 1;
    } else {
      const trimmed = tok.trim();
      if (trimmed) out.push("  ".repeat(depth) + trimmed);
    }
  }
  return out.join("\n");
}

/** Strip the `() => ` arrow wrapper from a render function's source. */
function stripArrow(source: string): string {
  // Handles both `() => expr` and `() =>\n  expr`
  return source.replace(/^\(\) =>\s*/, "");
}

/** Strip leading whitespace common to all lines (so the TS source isn't deeply indented). */
function dedent(source: string): string {
  const lines = source.split("\n");
  // Skip line 0 when computing the minimum indent — after stripArrow() it has
  // 0 leading whitespace and would otherwise prevent any stripping of body lines.
  const bodyLines = lines.slice(1);
  const indents = bodyLines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)?.[0].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((l, i) => (i === 0 ? l : l.slice(min)))
    .join("\n")
    .trim();
}

/** Convert tabs to 2 spaces. */
function tabsToSpaces(source: string): string {
  return source.replace(/\t/g, "  ");
}

function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function example(spec: ExampleSpec): KlodsNode {
  const result = spec.render();
  // Prefer the pre-formatted source injected by the build plugin (preserves
  // TypeScript types and original indentation). Fall back to fn.toString()
  // in environments where the plugin hasn't run (e.g. vitest).
  const tsSource = spec._source ?? tabsToSpaces(dedent(stripArrow(spec.render.toString())));
  const htmlSource = tabsToSpaces(prettyHtml(result.toString()));

  // Only highlight when the code panes are actually shown.
  const tsHighlighted = !spec.hideCode
    ? hljs.highlight(tsSource, { language: "typescript", ignoreIllegals: true }).value
    : null;
  const htmlHighlighted = !spec.hideCode
    ? hljs.highlight(htmlSource, { language: "xml", ignoreIllegals: true }).value
    : null;

  return card({ class: "docs-example", id: slug(spec.title) }, [
    cardTitle({}, spec.title),
    spec.description ? el("p", { class: "klods-muted docs-example__desc" }, spec.description) : null,
    cardBody({ class: "docs-example__body" }, [
      el("section", { class: "docs-example__preview", "aria-label": "Live preview" }, [result]),
      spec.hideCode
        ? null
        : el("details", { class: "docs-example__source" }, [
            el("summary", {}, "TypeScript"),
            el("pre", {}, [el("code", { class: "hljs language-typescript" }, raw(tsHighlighted!))]),
          ]),
      spec.hideCode
        ? null
        : el("details", { class: "docs-example__source" }, [
            el("summary", {}, "HTML"),
            el("pre", {}, [el("code", { class: "hljs language-xml" }, raw(htmlHighlighted!))]),
          ]),
    ]),
  ]);
}
