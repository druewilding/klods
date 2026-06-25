import type { KlodsNode } from "klods-js";
import { badge, card, cardTitle, list, listItem, raw } from "klods-js";

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
        listItem({ lead: "✅" }, "Account verified"),
        listItem({ lead: "⚠️" }, "Payment required"),
        listItem({ lead: "❌" }, "Profile incomplete"),
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
    title: "List — navigation",
    render: () => {
      const chevron = raw(
        '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 2l6 6-6 6"/></svg>'
      );
      return list([
        listItem({ href: "#", lead: "📨", trail: chevron }, "Messages"),
        listItem({ href: "#", lead: "🔔", trail: chevron }, "Notifications"),
        listItem({ href: "#", lead: "⚙️", trail: chevron }, "Settings"),
      ]);
    },
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
