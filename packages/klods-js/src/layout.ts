// Layout builders — the four corners and the "I-always-forget" utilities.
// Each builder is a thin wrapper around `builder()` from core.ts.

import type { KlodsAttrs, KlodsChild } from "./core.js";
import { builder, el, KlodsNode, raw } from "./core.js";

// ── Page ─────────────────────────────────────────────────────────────────
export type PageProps = {
  /** Render with a sidebar column. */
  sidebar?: boolean;
  /** Which side the sidebar appears on. Defaults to `"leading"` (inline-start). */
  sidebarPosition?: "leading" | "trailing";
  /** Keep the header pinned to the top of the viewport while the page scrolls. */
  stickyHeader?: boolean;
};

export const page = builder<PageProps>({
  tag: "div",
  base: "klods-page",
  modifiers: {
    sidebar: "klods-page--with-sidebar",
    sidebarPosition: (v) => (v === "trailing" ? "klods-page--sidebar-trailing" : undefined),
    stickyHeader: "klods-page--sticky-header",
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
export const section = builder({ tag: "section", base: "klods-section" });

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

type RowProps = GapProp & { inline?: boolean };
export const row = builder<RowProps>({
  tag: "div",
  base: "klods-row",
  modifiers: { gap: gapModifier("klods-row"), inline: "klods-row--inline" },
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

// ── Sidebar toggle ───────────────────────────────────────────────────────
const HAMBURGER_ICON = raw(
  '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect y="3" width="20" height="2" rx="1" fill="currentColor"/><rect y="9" width="20" height="2" rx="1" fill="currentColor"/><rect y="15" width="20" height="2" rx="1" fill="currentColor"/></svg>'
);

/**
 * Hamburger button for toggling the sidebar on mobile. Only rendered by CSS
 * on narrow viewports. Wire up with `toggleSidebar`.
 *
 * @example
 * sidebarToggle({ onClick: (e) => toggleSidebar(e.currentTarget as HTMLElement) })
 */
export function sidebarToggle(attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  return el(
    "button",
    { type: "button", "aria-label": "Toggle sidebar", class: "klods-sidebar-toggle", ...(attrs ?? {}) },
    children ?? HAMBURGER_ICON
  );
}

/**
 * Toggle the open/closed state of the sidebar. Pass any element inside the
 * `.klods-page` (e.g. the toggle button itself) as the argument.
 *
 * On first call per page element, auto-wires two permanent listeners:
 *  - Clicking a link inside the sidebar closes the drawer.
 *  - Clicking the backdrop (outside the sidebar and header) closes the drawer.
 *
 * @example
 * sidebarToggle({ onClick: (e) => toggleSidebar(e.currentTarget as HTMLElement) })
 */
export function toggleSidebar(targetEl: HTMLElement): void {
  const pageEl = targetEl.closest(".klods-page") as HTMLElement | null;
  if (!pageEl) return;

  // Set up permanent listeners once per page element.
  if (!pageEl.hasAttribute("data-sidebar-wired")) {
    pageEl.setAttribute("data-sidebar-wired", "");
    const sidebarEl = pageEl.querySelector<HTMLElement>(":scope > .klods-sidebar");
    if (sidebarEl) {
      // Prevent sidebar clicks reaching the backdrop listener below.
      sidebarEl.addEventListener("click", (e) => e.stopPropagation());
      // Close when a link inside the sidebar is clicked.
      sidebarEl.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("a")) {
          pageEl.removeAttribute("data-sidebar-open");
        }
      });
    }
    // Close when the backdrop is clicked (outside sidebar and header).
    pageEl.addEventListener("click", (e) => {
      if (!pageEl.hasAttribute("data-sidebar-open")) return;
      const headerEl = pageEl.querySelector<HTMLElement>(":scope > .klods-header");
      if (headerEl?.contains(e.target as Node)) return;
      pageEl.removeAttribute("data-sidebar-open");
    });
  }

  if (pageEl.hasAttribute("data-sidebar-open")) {
    pageEl.removeAttribute("data-sidebar-open");
  } else {
    pageEl.setAttribute("data-sidebar-open", "");
  }
}
