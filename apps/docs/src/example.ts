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
import { card, cardBody, cardTitle, el } from "klods-js";

export type ExampleSpec = {
  title: string;
  description?: string;
  /** A function that produces the KlodsNode to demo. Source is shown verbatim. */
  render: () => KlodsNode;
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

/** Strip leading whitespace common to all lines (so the TS source isn't deeply indented). */
function dedent(source: string): string {
  const lines = source.split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)?.[0].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((l) => l.slice(min))
    .join("\n")
    .trim();
}

function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function example(spec: ExampleSpec): KlodsNode {
  const result = spec.render();
  const tsSource = dedent(spec.render.toString());
  const htmlSource = prettyHtml(result.toString());

  return card({ class: "docs-example", id: slug(spec.title) }, [
    cardTitle({}, spec.title),
    spec.description ? el("p", { class: "klods-muted docs-example__desc" }, spec.description) : null,
    cardBody({ class: "docs-example__body" }, [
      el("section", { class: "docs-example__preview", "aria-label": "Live preview" }, [result]),
      el("details", { class: "docs-example__source", open: true }, [
        el("summary", {}, "TypeScript"),
        el("pre", {}, [el("code", { class: "language-ts" }, tsSource)]),
      ]),
      el("details", { class: "docs-example__source" }, [
        el("summary", {}, "HTML"),
        el("pre", {}, [el("code", { class: "language-html" }, htmlSource)]),
      ]),
    ]),
  ]);
}
