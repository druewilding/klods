import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, KlodsNode, normalizeArgs } from "../core.js";

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
export function alert(): KlodsNode;
export function alert(children: KlodsChild | KlodsChild[]): KlodsNode;
export function alert(props: (AlertProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function alert(
  a?: (AlertProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<AlertProps & KlodsAttrs>(a, b);
  // role=alert by default for assistive tech, overridable.
  const merged = { role: "alert", ...props } as AlertProps & KlodsAttrs;
  return alertBase(merged, children);
}
