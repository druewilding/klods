import { builder } from "../core.js";

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
