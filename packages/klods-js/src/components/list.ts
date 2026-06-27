import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, classNames, el, KlodsNode, normalizeArgs } from "../core.js";

export type ListProps = {
  flush?: boolean;
};
export const list = builder<ListProps>({
  tag: "ul",
  base: "klods-list",
  modifiers: {
    flush: "klods-list--flush",
  },
});

export type ListItemProps = {
  /** Content for the leading slot (icon, avatar, badge, etc.). */
  lead?: KlodsChild | KlodsChild[];
  /** Content for the trailing slot (badge, action, status, etc.). */
  trail?: KlodsChild | KlodsChild[];
  /** When set, the item renders as a full-row link. */
  href?: string;
};
export function listItem(): KlodsNode;
export function listItem(children: KlodsChild | KlodsChild[]): KlodsNode;
export function listItem(props: (ListItemProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function listItem(
  a?: (ListItemProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ListItemProps & KlodsAttrs>(a, b);
  const { lead, trail, href, class: extraClass, ...rest } = props ?? {};
  const liCls =
    classNames([
      "klods-list__item",
      href !== undefined ? "klods-list__item--link" : "",
      classNames(extraClass as KlodsAttrs["class"]),
    ]) || undefined;

  const hasSlots = lead !== undefined || trail !== undefined;
  const buildSlots = (): KlodsChild[] => {
    const parts: KlodsChild[] = [];
    if (lead !== undefined) parts.push(el("span", { class: "klods-list__lead" }, lead as KlodsChild));
    parts.push(el("span", { class: "klods-list__content" }, children ?? []));
    if (trail !== undefined) parts.push(el("span", { class: "klods-list__trail" }, trail as KlodsChild));
    return parts;
  };

  if (href !== undefined) {
    const linkContent = hasSlots ? buildSlots() : (children ?? []);
    return el("li", { class: liCls }, [el("a", { href, class: "klods-list__link", ...rest }, linkContent)]);
  }
  if (hasSlots) return el("li", { ...rest, class: liCls }, buildSlots());
  return el("li", { ...rest, class: liCls }, children ?? []);
}
