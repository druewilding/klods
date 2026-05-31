import type { KlodsNode } from "klods";
import {
  alert,
  badge,
  button,
  card,
  cardBody,
  cardFooter,
  cardTitle,
  cluster,
  el,
  nav,
  navLink,
  navList,
  stack,
} from "klods";

import { example } from "../example.js";

export function renderComponentsSection(): KlodsNode {
  return stack({ gap: 5 }, [
    el("h2", {}, "Components"),
    el("p", { class: "klods-lead" }, "Opinionated defaults; extend any of them with class, id, data-* etc."),

    example({
      title: "Buttons",
      render: () =>
        cluster({}, [
          button({}, "Default"),
          button({ variant: "primary" }, "Primary"),
          button({ variant: "danger" }, "Danger"),
          button({ variant: "ghost" }, "Ghost"),
        ]),
    }),

    example({
      title: "Card",
      render: () =>
        card({ elevated: true, style: "max-width: 24rem;" }, [
          cardTitle({}, "Cosy card"),
          cardBody({}, "Cards stack a title, a body and an optional footer with sensible spacing."),
          cardFooter({}, [button({ variant: "primary" }, "OK"), button({}, "Cancel")]),
        ]),
    }),

    example({
      title: "Badge",
      render: () =>
        cluster({}, [
          badge({}, "default"),
          badge({ variant: "accent" }, "accent"),
          badge({ variant: "success" }, "success"),
          badge({ variant: "danger" }, "danger"),
        ]),
    }),

    example({
      title: "Alert",
      render: () =>
        stack({}, [
          alert({ variant: "info" }, "Heads up — info."),
          alert({ variant: "success" }, "All good."),
          alert({ variant: "warning" }, "Be careful."),
          alert({ variant: "danger" }, "Something broke."),
        ]),
    }),

    example({
      title: "Nav",
      render: () =>
        nav({}, [
          navList({}, [
            navLink({ href: "#", active: true }, "Home"),
            navLink({ href: "#" }, "Projects"),
            navLink({ href: "#" }, "About"),
            navLink({ href: "#" }, "Contact"),
          ]),
        ]),
    }),

    example({
      title: "Extending — pass through any attribute",
      description: "Every builder accepts class, id, data-*, aria-*, style, event handlers, etc.",
      render: () =>
        button(
          {
            variant: "primary",
            id: "save-btn",
            class: "my-tracker",
            "data-event": "click_save",
            "aria-label": "Save the document",
            onClick: () => alert({}, "(no-op in the docs)"),
          },
          "Save"
        ),
    }),
  ]);
}
