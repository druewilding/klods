import type { KlodsAttrs, KlodsChild } from "../core.js";
import { classNames, el, KlodsNode, normalizeArgs } from "../core.js";

export type CrumbProps = {
  /** Href for linked crumbs. Omit for the current (last) crumb. */
  href?: string;
};

/**
 * One item in a breadcrumb trail. Pass to `breadcrumbs([...])`.
 * Supply `href` for linked ancestors; omit for the current page crumb.
 */
export function crumb(): KlodsNode;
export function crumb(children: KlodsChild | KlodsChild[]): KlodsNode;
export function crumb(props: (CrumbProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function crumb(
  a?: (CrumbProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<CrumbProps & KlodsAttrs>(a, b);
  const { href, ...rest } = props ?? {};
  // Store href as a data attribute so breadcrumbs() can read it back.
  return el("li", { "data-crumb-href": href, ...rest }, children);
}

/**
 * Accessible breadcrumb trail. Pass an array of `crumb()` nodes.
 * The last crumb is automatically marked with `aria-current="page"`.
 *
 * @example
 * breadcrumbs([
 *   crumb({ href: "/" }, "Home"),
 *   crumb({ href: "/products" }, "Products"),
 *   crumb("Widget"),
 * ])
 */
export function breadcrumbs(crumbs: KlodsNode[], attrs?: KlodsAttrs): KlodsNode {
  const items = crumbs.map((crumbNode, i) => {
    const isLast = i === crumbs.length - 1;
    const href = crumbNode.attrs["data-crumb-href"] as string | undefined;
    const {
      "data-crumb-href": _href,
      class: extraClass,
      ...restAttrs
    } = crumbNode.attrs as KlodsAttrs & {
      "data-crumb-href"?: string;
    };
    const content: KlodsChild[] =
      href && !isLast ? [el("a", { href, class: "klods-breadcrumb__link" }, crumbNode.children)] : crumbNode.children;
    return new KlodsNode(
      "li",
      {
        ...restAttrs,
        class: classNames(["klods-breadcrumb__item", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
        ...(isLast ? { "aria-current": "page" } : {}),
      },
      content
    );
  });

  const { class: extraClass, "aria-label": ariaLabel, ...restAttrs } = attrs ?? {};
  return el(
    "nav",
    {
      ...restAttrs,
      "aria-label": (ariaLabel as string | undefined) ?? "Breadcrumb",
      class: classNames(extraClass as KlodsAttrs["class"]) || undefined,
    },
    el("ol", { class: "klods-breadcrumb__list" }, items)
  );
}
