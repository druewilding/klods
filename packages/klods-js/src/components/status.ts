import { builder } from "../core.js";

export type StatusProps = {
  variant?: "default" | "accent" | "success" | "warning" | "info" | "danger";
  /** A soft ring that keeps spreading from the dot, for something happening now. */
  pulse?: boolean;
};

/**
 * A colored dot beside text, for a live state like "Your turn" or "Online".
 * The text must say the state on its own; add `role: "status"` when it changes
 * while the page is open, so screen readers announce it.
 */
export const status = builder<StatusProps>({
  tag: "span",
  base: "klods-status",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-status--${v}` : undefined),
    pulse: "klods-status--pulse",
  },
});
