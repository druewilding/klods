import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, el, KlodsNode, normalizeArgs, tagBuilder } from "../core.js";
import { menuIcon } from "../icons.js";

export const nav = builder({ tag: "nav", base: "klods-nav" });
export const navList = builder({ tag: "ul", base: "klods-nav__list" });
export const buttonGroup = builder({ tag: "div", base: "klods-button-group" });

/**
 * Hamburger toggle button for `.klods-nav--collapse`. Renders a default
 * three-line icon; pass children to override. Wire up with `toggleNav`.
 */
export function navToggle(): KlodsNode;
export function navToggle(children: KlodsChild | KlodsChild[]): KlodsNode;
export function navToggle(attrs: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function navToggle(a?: KlodsAttrs | KlodsChild | KlodsChild[] | null, b?: KlodsChild | KlodsChild[]): KlodsNode {
  const [attrs, children] = normalizeArgs<KlodsAttrs>(a, b);
  return el(
    "button",
    { type: "button", "aria-label": "Toggle navigation", class: "klods-nav__toggle", ...attrs },
    children ?? menuIcon()
  );
}

/**
 * Toggle the open/closed state of a `.klods-nav--collapse` element.
 * Pass the toggle button element (or any element inside the nav) as the argument.
 *
 * @example
 * navToggle({ onClick: (e) => toggleNav(e.currentTarget as HTMLElement) })
 */
export function toggleNav(targetEl: HTMLElement): void {
  const navEl = targetEl.closest(".klods-nav--collapse") as HTMLElement | null;
  if (!navEl) return;
  if (navEl.hasAttribute("data-nav-open")) {
    navEl.removeAttribute("data-nav-open");
  } else {
    navEl.setAttribute("data-nav-open", "");
  }
}

export type TocProps = { sub?: boolean };
export const toc = builder<TocProps>({ tag: "ul", base: "klods-toc", modifiers: { sub: "klods-toc--sub" } });
export const tocItem = tagBuilder("li");

export type TocLinkProps = { active?: boolean };
export const tocLink = builder<TocLinkProps>({
  tag: "a",
  base: "klods-toc__link",
  modifiers: { active: "klods-toc__link--active" },
});

export type NavLinkProps = {
  href?: string;
  active?: boolean;
};
const navLinkBuilder = builder<NavLinkProps>({
  tag: "a",
  base: "klods-nav__link",
  modifiers: { active: "klods-nav__link--active" },
});
export function navLink(props?: (NavLinkProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function navLink(children: KlodsChild | KlodsChild[]): KlodsNode;
export function navLink(
  a?: (NavLinkProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<NavLinkProps & KlodsAttrs>(a, b);
  // Wrap each link in <li> so it's idiomatic inside <ul class="klods-nav__list">.
  return el("li", {}, [navLinkBuilder(props, children)]);
}
