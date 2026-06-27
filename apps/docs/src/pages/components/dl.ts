import type { KlodsNode } from "klods-js";
import { badge, card, cardTitle, dd, dl, dt } from "klods-js";

import { example } from "../../example.js";

export const label = "Description list";
export const anchor = "description-list";

export const examples: KlodsNode[] = [
  example({
    title: "Description list",
    render: () =>
      dl([dt("Author"), dd("Ari Smith"), dt("Published"), dd("27 June 2026"), dt("Category"), dd("Design systems")]),
  }),

  example({
    title: "Description list — inline",
    description: "Add `inline: true` for a two-column layout that pairs each term with its detail on the same row.",
    render: () =>
      dl({ inline: true }, [
        dt("Author"),
        dd("Ari Smith"),
        dt("Published"),
        dd("27 June 2026"),
        dt("Category"),
        dd("Design systems"),
      ]),
  }),

  example({
    title: "Description list — inside a card",
    description: "An inline description list pairs naturally with a card to display structured metadata.",
    render: () =>
      card({ style: "max-width: 24rem;" }, [
        cardTitle("Package details"),
        dl({ inline: true }, [
          dt("Package"),
          dd("klods-js"),
          dt("Version"),
          dd(badge({ variant: "success" }, "v1.0.0")),
          dt("License"),
          dd("MIT"),
          dt("Downloads"),
          dd("12,345"),
        ]),
      ]),
  }),
];
