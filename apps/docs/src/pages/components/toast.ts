import type { KlodsNode } from "klods-js";
import { button, clearToasts, cluster, showToast } from "klods-js";

import { example } from "../../example.js";

export const label = "Toast";
export const anchor = "toast";

export const examples: KlodsNode[] = [
  example({
    title: "Toast",
    description:
      "Call `showToast(message, options)` to display a transient notification at the bottom-right of the page. Toasts auto-dismiss after 5 s and can be closed early with the × button.",
    render: () =>
      cluster({ gap: 2 }, [
        button({ onClick: () => { clearToasts(); showToast("File saved successfully."); } }, "Default"),
        button(
          { onClick: () => { clearToasts(); showToast("Your changes have been saved.", { variant: "success" }); } },
          "Success"
        ),
        button(
          { onClick: () => { clearToasts(); showToast("Your session expires in 5 minutes.", { variant: "warning" }); } },
          "Warning"
        ),
        button(
          { variant: "danger", onClick: () => { clearToasts(); showToast("Something went wrong. Please try again.", { variant: "danger" }); } },
          "Danger"
        ),
        button(
          { onClick: () => { clearToasts(); showToast("New message from Alex.", { variant: "info" }); } },
          "Info"
        ),
      ]),
  }),

  example({
    title: "Toast — persistent",
    description: "Pass `duration: 0` to keep the toast visible until the user manually dismisses it.",
    render: () =>
      button(
        {
          onClick: () => {
            clearToasts();
            showToast("Action required: please review the pending changes.", { variant: "warning", duration: 0 });
          },
        },
        "Show persistent toast"
      ),
  }),
];
