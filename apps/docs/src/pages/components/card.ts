import type { KlodsNode } from "klods-js";
import { button, card, cardBody, cardFooter, cardTitle } from "klods-js";

import { example } from "../../example.js";

export const label = "Card";
export const anchor = "card";

export const examples: KlodsNode[] = [
  example({
    title: "Card",
    render: () =>
      card({ style: "max-width: 24rem;" }, [
        cardTitle("Cosy card"),
        cardBody("Cards stack a title, a body and an optional footer with sensible spacing."),
        cardFooter([button({ variant: "primary" }, "OK"), button("Cancel")]),
      ]),
  }),
  example({
    title: "Elevated card",
    description: "Add `elevated: true` to make the card stand out from the background with a shadow.",
    render: () =>
      card({ elevated: true, style: "max-width: 24rem;" }, [
        cardTitle("Cosy card"),
        cardBody("Cards stack a title, a body and an optional footer with sensible spacing."),
        cardFooter([button({ variant: "primary" }, "OK"), button("Cancel")]),
      ]),
  }),
];
