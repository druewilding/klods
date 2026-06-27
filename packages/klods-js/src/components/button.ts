import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, KlodsNode, normalizeArgs } from "../core.js";

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
export function button(): KlodsNode;
export function button(children: KlodsChild | KlodsChild[]): KlodsNode;
export function button(props: (ButtonProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function button(
  a?: (ButtonProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ButtonProps & KlodsAttrs>(a, b);
  // Default `type="button"` so it never accidentally submits a form.
  const merged = { type: "button", ...props } as ButtonProps & KlodsAttrs;
  return buttonBase(merged, children);
}
