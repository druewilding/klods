import type { KlodsNode } from "klods-js";
import {
  checkCircleIcon,
  chevDownIcon,
  chevLeftIcon,
  chevRightIcon,
  chevUpIcon,
  closeIcon,
  cluster,
  code,
  copyIcon,
  dangerCircleIcon,
  editIcon,
  externalLinkIcon,
  eyeIcon,
  eyeOffIcon,
  infoCircleIcon,
  list,
  listItem,
  menuIcon,
  p,
  plusIcon,
  searchIcon,
  span,
  stack,
  trashIcon,
  userIcon,
  warningIcon,
} from "klods-js";

import { example } from "../../example.js";

export const label = "Built-in icons";
export const anchor = "built-in-icons";

export const examples: KlodsNode[] = [
  example({
    title: "Built-in icons",
    render: () =>
      cluster({ gap: 5 }, [
        stack({ gap: 2, inline: true }, [checkCircleIcon(), code("checkCircleIcon")]),
        stack({ gap: 2, inline: true }, [chevDownIcon(), code("chevDownIcon")]),
        stack({ gap: 2, inline: true }, [chevLeftIcon(), code("chevLeftIcon")]),
        stack({ gap: 2, inline: true }, [chevRightIcon(), code("chevRightIcon")]),
        stack({ gap: 2, inline: true }, [chevUpIcon(), code("chevUpIcon")]),
        stack({ gap: 2, inline: true }, [closeIcon(), code("closeIcon")]),
        stack({ gap: 2, inline: true }, [copyIcon(), code("copyIcon")]),
        stack({ gap: 2, inline: true }, [dangerCircleIcon(), code("dangerCircleIcon")]),
        stack({ gap: 2, inline: true }, [editIcon(), code("editIcon")]),
        stack({ gap: 2, inline: true }, [externalLinkIcon(), code("externalLinkIcon")]),
        stack({ gap: 2, inline: true }, [eyeIcon(), code("eyeIcon")]),
        stack({ gap: 2, inline: true }, [eyeOffIcon(), code("eyeOffIcon")]),
        stack({ gap: 2, inline: true }, [infoCircleIcon(), code("infoCircleIcon")]),
        stack({ gap: 2, inline: true }, [menuIcon(), code("menuIcon")]),
        stack({ gap: 2, inline: true }, [plusIcon(), code("plusIcon")]),
        stack({ gap: 2, inline: true }, [searchIcon(), code("searchIcon")]),
        stack({ gap: 2, inline: true }, [trashIcon(), code("trashIcon")]),
        stack({ gap: 2, inline: true }, [userIcon(), code("userIcon")]),
        stack({ gap: 2, inline: true }, [warningIcon(), code("warningIcon")]),
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
        listItem({ href: "#", lead: userIcon(), trail: chevRightIcon() }, "My account"),
        listItem({ href: "#", lead: searchIcon(), trail: chevRightIcon() }, "Search"),
        listItem({ href: "#", lead: trashIcon(), trail: chevRightIcon() }, "Trash"),
      ]),
  }),

  example({
    title: "Built-in icons — accessible label",
    render: () => p(chevRightIcon({ label: "Next page" })),
  }),
];
