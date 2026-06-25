import type { KlodsNode } from "klods-js";
import {
  chevDownIcon,
  chevRightIcon,
  closeIcon,
  cluster,
  list,
  listItem,
  menuIcon,
  muted,
  p,
  span,
  stack,
} from "klods-js";

import { example } from "../../example.js";

export const label = "Built-in icons";
export const anchor = "built-in-icons";

export const examples: KlodsNode[] = [
  example({
    title: "Built-in icons",
    render: () =>
      cluster([
        stack({ gap: 2, inline: true }, [menuIcon(), muted("menuIcon")]),
        stack({ gap: 2, inline: true }, [chevRightIcon(), muted("chevRightIcon")]),
        stack({ gap: 2, inline: true }, [chevDownIcon(), muted("chevDownIcon")]),
        stack({ gap: 2, inline: true }, [closeIcon(), muted("closeIcon")]),
      ]),
  }),

  example({
    title: "Built-in icons — sizes",
    render: () =>
      cluster({ align: "center" }, [
        chevRightIcon({ size: 12 }),
        chevRightIcon({ size: 16 }),
        chevRightIcon({ size: 20 }),
        chevRightIcon({ size: 24 }),
        chevRightIcon({ size: 32 }),
      ]),
  }),

  example({
    title: "Built-in icons — color",
    render: () =>
      cluster([
        span({ style: "color: var(--klods-color-accent)" }, chevRightIcon({ size: 20 })),
        span({ style: "color: var(--klods-color-success)" }, chevRightIcon({ size: 20 })),
        span({ style: "color: var(--klods-color-danger)" }, chevRightIcon({ size: 20 })),
        span({ style: "color: var(--klods-color-muted)" }, chevRightIcon({ size: 20 })),
      ]),
  }),

  example({
    title: "Built-in icons — in context",
    render: () =>
      list([
        listItem({ href: "#", lead: menuIcon(), trail: chevRightIcon() }, "Navigation item"),
        listItem({ href: "#", lead: chevDownIcon(), trail: chevRightIcon() }, "Expandable item"),
        listItem({ href: "#", lead: closeIcon(), trail: chevRightIcon() }, "Dismissible item"),
      ]),
  }),

  example({
    title: "Built-in icons — accessible label",
    render: () => p(chevRightIcon({ label: "Next page" })),
  }),
];
