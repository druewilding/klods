import type { KlodsNode } from "klods-js";
import {
  checkCircleIcon,
  chevDownIcon,
  chevLeftIcon,
  chevRightIcon,
  chevUpIcon,
  closeIcon,
  cluster,
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
  muted,
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
      cluster([
        stack({ gap: 2, inline: true }, [checkCircleIcon(), muted("checkCircleIcon")]),
        stack({ gap: 2, inline: true }, [chevDownIcon(), muted("chevDownIcon")]),
        stack({ gap: 2, inline: true }, [chevLeftIcon(), muted("chevLeftIcon")]),
        stack({ gap: 2, inline: true }, [chevRightIcon(), muted("chevRightIcon")]),
        stack({ gap: 2, inline: true }, [chevUpIcon(), muted("chevUpIcon")]),
        stack({ gap: 2, inline: true }, [closeIcon(), muted("closeIcon")]),
        stack({ gap: 2, inline: true }, [copyIcon(), muted("copyIcon")]),
        stack({ gap: 2, inline: true }, [dangerCircleIcon(), muted("dangerCircleIcon")]),
        stack({ gap: 2, inline: true }, [editIcon(), muted("editIcon")]),
        stack({ gap: 2, inline: true }, [externalLinkIcon(), muted("externalLinkIcon")]),
        stack({ gap: 2, inline: true }, [eyeIcon(), muted("eyeIcon")]),
        stack({ gap: 2, inline: true }, [eyeOffIcon(), muted("eyeOffIcon")]),
        stack({ gap: 2, inline: true }, [infoCircleIcon(), muted("infoCircleIcon")]),
        stack({ gap: 2, inline: true }, [menuIcon(), muted("menuIcon")]),
        stack({ gap: 2, inline: true }, [plusIcon(), muted("plusIcon")]),
        stack({ gap: 2, inline: true }, [searchIcon(), muted("searchIcon")]),
        stack({ gap: 2, inline: true }, [trashIcon(), muted("trashIcon")]),
        stack({ gap: 2, inline: true }, [userIcon(), muted("userIcon")]),
        stack({ gap: 2, inline: true }, [warningIcon(), muted("warningIcon")]),
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
