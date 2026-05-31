// First wave of components: nav, card, button, badge, alert, prose helpers.
// All match the BEM classes shipped by klods-css.

import type { KlodsAttrs, KlodsChild } from "./core.js";
import { builder, el, KlodsNode } from "./core.js";

// ── Nav ──────────────────────────────────────────────────────────────────
export const nav = builder({ tag: "nav", base: "klods-nav" });
export const navList = builder({ tag: "ul", base: "klods-nav__list" });
export type TocProps = { sub?: boolean };
export const toc = builder<TocProps>({ tag: "ul", base: "klods-toc", modifiers: { sub: "klods-toc--sub" } });
export const tocItem = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("li", attrs ?? {}, children);
export const tocLink = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("a", attrs ?? {}, children);

export type NavLinkProps = {
  href?: string;
  active?: boolean;
};
const navLinkBuilder = builder<NavLinkProps>({
  tag: "a",
  base: "klods-nav__link",
  modifiers: { active: "klods-nav__link--active" },
});
export function navLink(props?: (NavLinkProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // Wrap each link in <li> so it's idiomatic inside <ul class="klods-nav__list">.
  return el("li", {}, [navLinkBuilder(props ?? null, children)]);
}

// ── Card ─────────────────────────────────────────────────────────────────
export type CardProps = {
  elevated?: boolean;
};
export const card = builder<CardProps>({
  tag: "div",
  base: "klods-card",
  modifiers: { elevated: "klods-card--elevated" },
});
export const cardTitle = builder({ tag: "h3", base: "klods-card__title" });
export const cardBody = builder({ tag: "div", base: "klods-card__body" });
export const cardFooter = builder({ tag: "div", base: "klods-card__footer" });

// ── Button ───────────────────────────────────────────────────────────────
export type ButtonProps = {
  variant?: "default" | "primary" | "danger" | "ghost";
  type?: "button" | "submit" | "reset";
};
const buttonBase = builder<ButtonProps>({
  tag: "button",
  base: "klods-button",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-button--${v}` : undefined),
  },
});
export function button(props?: (ButtonProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // Default `type="button"` so it never accidentally submits a form.
  const merged = { type: "button", ...(props ?? {}) } as ButtonProps & KlodsAttrs;
  return buttonBase(merged, children);
}

// ── Badge ────────────────────────────────────────────────────────────────
export type BadgeProps = {
  variant?: "default" | "accent" | "success" | "danger";
};
export const badge = builder<BadgeProps>({
  tag: "span",
  base: "klods-badge",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-badge--${v}` : undefined),
  },
});

// ── Alert ────────────────────────────────────────────────────────────────
export type AlertProps = {
  variant?: "default" | "info" | "success" | "warning" | "danger";
};
const alertBase = builder<AlertProps>({
  tag: "div",
  base: "klods-alert",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-alert--${v}` : undefined),
  },
});
export function alert(props?: (AlertProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // role=alert by default for assistive tech, overridable.
  const merged = { role: "alert", ...(props ?? {}) } as AlertProps & KlodsAttrs;
  return alertBase(merged, children);
}

// ── Prose helpers ────────────────────────────────────────────────────────
export const prose = builder({ tag: "div", base: "klods-prose" });
export const muted = builder({ tag: "span", base: "klods-muted" });
export const lead = builder({ tag: "p", base: "klods-lead" });

// ── Table ────────────────────────────────────────────────────────────────
export type TableProps = {
  striped?: boolean;
  dense?: boolean;
};
export const table = builder<TableProps>({
  tag: "table",
  base: "klods-table",
  modifiers: {
    striped: "klods-table--striped",
    dense: "klods-table--dense",
  },
});
export const thead = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("thead", attrs ?? {}, children);
export const tbody = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("tbody", attrs ?? {}, children);
export const tr = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("tr", attrs ?? {}, children);
export const th = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("th", attrs ?? {}, children);
export const td = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("td", attrs ?? {}, children);

// ── Code ─────────────────────────────────────────────────────────────────
export function codeBlock(attrs?: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode {
  return el("pre", attrs ?? {}, el("code", {}, content));
}
export function inlineCode(attrs?: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode {
  return el("code", attrs ?? {}, content);
}

// ── Box ──────────────────────────────────────────────────────────────────
export const box = builder({ tag: "div", base: "klods-box" });
