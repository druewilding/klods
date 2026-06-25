import type { KlodsNode } from "klods-js";
import { badge, card, cardTitle, list, listItem } from "klods-js";

import { example } from "../../example.js";

export const label = "List";
export const anchor = "list";

export const examples: KlodsNode[] = [
  example({
    title: "List",
    render: () => list([listItem("Apples"), listItem("Bananas"), listItem("Cherries")]),
  }),

  example({
    title: "List — leading slot",
    render: () =>
      list([
        listItem({ lead: badge({ variant: "success" }, "✓") }, "Account verified"),
        listItem({ lead: badge({ variant: "danger" }, "!") }, "Payment required"),
        listItem({ lead: badge("–") }, "Profile incomplete"),
      ]),
  }),

  example({
    title: "List — trailing slot",
    render: () =>
      list([
        listItem({ trail: badge({ variant: "accent" }, "New") }, "Messages"),
        listItem({ trail: badge("12") }, "Notifications"),
        listItem({ trail: badge("3") }, "Updates"),
      ]),
  }),

  example({
    title: "List — lead and trail",
    render: () =>
      list([
        listItem(
          { lead: badge({ variant: "accent" }, "JS"), trail: badge({ variant: "success" }, "Stable") },
          "klods-js"
        ),
        listItem(
          { lead: badge({ variant: "accent" }, "CSS"), trail: badge({ variant: "success" }, "Stable") },
          "klods-css"
        ),
        listItem({ lead: badge("Docs"), trail: badge({ variant: "danger" }, "Beta") }, "docs site"),
      ]),
  }),

  example({
    title: "List — flush",
    render: () =>
      card([
        cardTitle("Shopping list"),
        list({ flush: true }, [listItem("Milk"), listItem("Eggs"), listItem("Bread")]),
      ]),
  }),
];
