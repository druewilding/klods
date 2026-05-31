// Utility builders — thin wrappers over the most-reached-for klods-css utility classes.

import { builder } from "./core.js";

// ── Push ─────────────────────────────────────────────────────────────────
// Renders a <span class="klods-push">.
// Pushes siblings to the end of a flex/grid row by consuming all remaining
// inline space (margin-inline-start: auto).
export const push = builder({ tag: "span", base: "klods-push" });

// ── Fill ─────────────────────────────────────────────────────────────────
// Renders a <div class="klods-fill">.
// Grows to fill available flex/grid space (flex: 1 1 auto).
// Useful as a wrapper when you need one slot to absorb leftover room —
// e.g. equal-width side groups in a header to centre a middle item.
export const fill = builder({ tag: "div", base: "klods-fill" });
