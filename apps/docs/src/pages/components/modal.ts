import type { KlodsNode } from "klods-js";
import {
  button,
  closeModal,
  div,
  el,
  modal,
  modalActions,
  modalBody,
  modalClose,
  modalHeader,
  modalPanel,
  modalTitle,
  openModal,
  p,
} from "klods-js";

import { example } from "../../example.js";

export const label = "Modal";
export const anchor = "modal";

export const examples: KlodsNode[] = [
  example({
    title: "Modal",
    description:
      "Built on the native `<dialog>` element. Call `openModal(el)` to show it as an overlay and `closeModal(el)` to dismiss. The backdrop and entry animation are CSS-only.",
    render: () =>
      div([
        button(
          {
            variant: "primary",
            onClick: (e: Event) => openModal((e.currentTarget as HTMLElement).nextElementSibling as HTMLElement),
          },
          "Open modal"
        ),
        modal([
          modalPanel([
            modalHeader([
              modalTitle("Confirm action"),
              modalClose({ onClick: (e: Event) => closeModal(e.currentTarget as HTMLElement) }),
            ]),
            modalBody("Are you sure you want to continue? This action cannot be undone."),
            modalActions([
              button(
                { variant: "primary", onClick: (e: Event) => closeModal(e.currentTarget as HTMLElement) },
                "Confirm"
              ),
              button({ onClick: (e: Event) => closeModal(e.currentTarget as HTMLElement) }, "Cancel"),
            ]),
          ]),
        ]),
      ]),
  }),

  example({
    title: "Modal — info",
    description: "A simpler modal with no footer actions — just a dismiss button in the header.",
    render: () => {
      const dialog = modal([
        modalPanel([
          modalHeader([
            modalTitle("What is klods?"),
            modalClose({ onClick: (e: Event) => closeModal(e.currentTarget as HTMLElement) }),
          ]),
          modalBody([
            p("klods is a tiny, opinionated, fully themeable HTML/CSS/JS component library."),
            p("It ships two packages — klods-css for styles and klods-js for TypeScript builders."),
          ]),
        ]),
      ]);
      return div([
        button(
          { onClick: (e: Event) => openModal((e.currentTarget as HTMLElement).nextElementSibling as HTMLElement) },
          "Show info"
        ),
        dialog,
      ]);
    },
  }),
];
