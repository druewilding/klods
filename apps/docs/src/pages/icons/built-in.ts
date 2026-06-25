import type { KlodsNode } from "klods-js";
import {
  chevDownIcon,
  chevLeftIcon,
  chevRightIcon,
  chevUpIcon,
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
        stack({ gap: 2, inline: true }, [chevDownIcon(), muted("chevDownIcon")]),
        stack({ gap: 2, inline: true }, [chevLeftIcon(), muted("chevLeftIcon")]),
        stack({ gap: 2, inline: true }, [chevRightIcon(), muted("chevRightIcon")]),
        stack({ gap: 2, inline: true }, [chevUpIcon(), muted("chevUpIcon")]),
        stack({ gap: 2, inline: true }, [closeIcon(), muted("closeIcon")]),
        stack({ gap: 2, inline: true }, [menuIcon(), muted("menuIcon")]),
      ]),
  }),

  example({
    title: "Built-in icons — sizes",
    render: () =>
      cluster({ align: "center" }, [
        chevRightIcon({ size: "small" }),
        chevRightIcon({ size: "medium" }),
        chevRightIcon({ size: "large" }),
      ]),
  }),

  example({
    title: "Built-in icons — color",
    render: () =>
      cluster([
        span({ style: "color: var(--klods-color-accent)" }, chevRightIcon()),
        span({ style: "color: var(--klods-color-success)" }, chevRightIcon()),
        span({ style: "color: var(--klods-color-danger)" }, chevRightIcon()),
        span({ style: "color: var(--klods-color-muted)" }, chevRightIcon()),
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
