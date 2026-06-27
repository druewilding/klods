import type { KlodsNode } from "klods-js";
import {
  div,
  modal,
  modalActions,
  modalBody,
  modalClose,
  modalDismiss,
  modalHeader,
  modalPanel,
  modalTitle,
  modalTrigger,
  p,
} from "klods-js";

import { example } from "../../example.js";

export const label = "Modal";
export const anchor = "modal";

export const examples: KlodsNode[] = [
  example({
    title: "Modal",
    description:
      "Built on the native `<dialog>` element. Use `modalTrigger` to open, `modalClose` to dismiss with the × button, and `modalDismiss` for action buttons — all wire up automatically.",
    render: () =>
      div([
        modalTrigger({ variant: "primary" }, "Open modal"),
        modal(
          modalPanel([
            modalHeader([modalTitle("Confirm action"), modalClose()]),
            modalBody("Are you sure you want to continue? This action cannot be undone."),
            modalActions([modalDismiss({ variant: "primary" }, "Confirm"), modalDismiss("Cancel")]),
          ])
        ),
      ]),
  }),

  example({
    title: "Modal — info",
    description: "A simpler modal with no footer actions — just a dismiss button in the header.",
    render: () =>
      div([
        modalTrigger("Show info"),
        modal(
          modalPanel([
            modalHeader([modalTitle("What is klods?"), modalClose()]),
            modalBody([
              p("klods is a tiny, opinionated, fully themeable HTML/CSS/JS component library."),
              p("It ships two packages — klods-css for styles and klods-js for TypeScript builders."),
            ]),
          ])
        ),
      ]),
  }),
];
