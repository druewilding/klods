// Layout builders — the four corners and the "I-always-forget" utilities.
// Each builder is a thin wrapper around `builder()` from core.ts.

import type { KlodsAttrs, KlodsChild } from "./core.js";
import { builder, KlodsNode } from "./core.js";

// ── Page ─────────────────────────────────────────────────────────────────
export type PageProps = {
  /** Render with a sidebar column. */
  sidebar?: boolean;
  /** Place the sidebar on the right (only meaningful with `sidebar: true`). */
  sidebarRight?: boolean;
};

export const page = builder<PageProps>({
  tag: "div",
  base: "klods-page",
  modifiers: {
    sidebar: "klods-page--with-sidebar",
    sidebarRight: "klods-page--sidebar-right",
  },
});

// ── Page slots ───────────────────────────────────────────────────────────
export const header = builder({ tag: "header", base: "klods-header" });
export const sidebar = builder({ tag: "aside", base: "klods-sidebar" });

export type ContentProps = {
  /** Cap content width to --klods-content-max and centre it. */
  narrow?: boolean;
};
export const content = builder<ContentProps>({
  tag: "main",
  base: "klods-content",
  modifiers: { narrow: "klods-content--narrow" },
});

export const footer = builder({ tag: "footer", base: "klods-footer" });

// ── Layout utilities ─────────────────────────────────────────────────────
type GapProp = { gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 };

const gapModifier = (prefix: string) => (v: number | undefined) =>
  v === undefined ? undefined : `${prefix}--gap-${v}`;

export const stack = builder<GapProp>({
  tag: "div",
  base: "klods-stack",
  modifiers: { gap: gapModifier("klods-stack") },
});

export const cluster = builder<GapProp>({
  tag: "div",
  base: "klods-cluster",
  modifiers: { gap: gapModifier("klods-cluster") },
});

export const row = builder<GapProp>({
  tag: "div",
  base: "klods-row",
  modifiers: { gap: gapModifier("klods-row") },
});

export type GridProps = GapProp & {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Auto-fit responsive columns; pair with `--klods-grid-min` if you want a custom minimum. */
  fit?: boolean;
};
export const grid = builder<GridProps>({
  tag: "div",
  base: "klods-grid",
  modifiers: {
    gap: gapModifier("klods-grid"),
    cols: (v) => (v === undefined ? undefined : `klods-grid--cols-${v}`),
    fit: "klods-grid--fit",
  },
});

export const center = builder({ tag: "div", base: "klods-center" });
export const spread = builder({ tag: "div", base: "klods-spread" });

// ── Convenience: empty fragment-ish wrapper for quick text + nodes ──────
export function text(value: string | number): KlodsNode {
  // Wrap loose text in a span so it composes anywhere a KlodsNode is expected.
  return new KlodsNode("span", {}, [String(value)]);
}

// Re-export attribute / child types so consumers can extend a builder neatly.
export type { KlodsAttrs, KlodsChild };
