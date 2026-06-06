import type { KlodsNode } from "klods-js";
import { a, button, clearToasts, cluster, em, showToast, strong } from "klods-js";

import { example } from "../../example.js";

export const label = "Toast";
export const anchor = "toast";

export const examples: KlodsNode[] = [
  example({
    title: "Toast",
    description:
      "Call `showToast(options, message)` to display a transient notification at the bottom-right of the page. Toasts auto-dismiss after 5s and can be closed early with the × button.",
    render: () =>
      cluster({ gap: 2 }, [
        button(
          {
            onClick: () => {
              showToast("File saved successfully.");
            },
          },
          "Default"
        ),
        button(
          {
            onClick: () => {
              showToast({ variant: "success" }, "Your changes have been saved.");
            },
          },
          "Success"
        ),
        button(
          {
            onClick: () => {
              showToast({ variant: "warning" }, em("Your session expires in 5 minutes."));
            },
          },
          "Warning"
        ),
        button(
          {
            variant: "danger",
            onClick: () => {
              showToast({ variant: "danger" }, "Something went wrong. Please try again.");
            },
          },
          "Danger"
        ),
        button(
          {
            onClick: () => {
              showToast({ variant: "info" }, ["You have a ", a({ href: "#" }, "new message from Alex"), "."]);
            },
          },
          "Info"
        ),
        button({ onClick: () => clearToasts() }, "Clear toasts"),
      ]),
  }),

  example({
    title: "Toast — persistent",
    description: "Pass `duration: 0` to keep the toast visible until the user manually dismisses it.",
    render: () =>
      button(
        {
          onClick: () => {
            showToast({ variant: "warning", duration: 0 }, [
              strong("Action required:"),
              " please review the pending changes.",
            ]);
          },
        },
        "Show persistent toast"
      ),
  }),
];
