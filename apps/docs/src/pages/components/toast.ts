import type { KlodsNode } from "klods-js";
import { button, clearToastsTrigger, cluster, showToast, toastTrigger } from "klods-js";

import { example } from "../../example.js";

export const label = "Toast";
export const anchor = "toast";

export const examples: KlodsNode[] = [
  example({
    title: "Toast",
    description:
      "Use `toastTrigger(props, label)` to render a button that shows a transient notification. Toasts auto-dismiss after 5s and can be closed early with the × button.",
    render: () =>
      cluster({ gap: 2 }, [
        toastTrigger({ message: "File saved successfully." }, "Default"),
        toastTrigger({ message: "Your changes have been saved.", toastVariant: "success" }, "Success"),
        toastTrigger({ message: "Your session expires in 5 minutes.", toastVariant: "warning" }, "Warning"),
        toastTrigger({ message: "Something went wrong. Please try again.", toastVariant: "danger", variant: "danger" }, "Danger"),
        toastTrigger({ message: "You have a new message from Alex.", toastVariant: "info" }, "Info"),
      ]),
  }),

  example({
    title: "Toast — persistent",
    description: "Pass `duration: 0` to keep the toast visible until the user manually dismisses it.",
    render: () =>
      toastTrigger(
        { message: "Action required: please review the pending changes.", toastVariant: "warning", duration: 0 },
        "Show persistent toast"
      ),
  }),

  example({
    title: "Toast — clear toasts",
    description: "Use `clearToastsTrigger` to render a button that dismisses all visible toasts at once.",
    render: () => clearToastsTrigger("Clear toasts"),
  }),

  example({
    title: "Toast — programmatic",
    description:
      "Call `showToast()` directly from any event handler, promise callback, or framework action — no pre-wired button needed. Not supported in klods-ruby (server-rendered pages cannot call client-side JS functions directly; use `toast_trigger` instead).",
    ruby: false,
    render: () =>
      button(
        { onClick: () => showToast({ variant: "info" }, "Triggered from a callback.") },
        "Show via callback"
      ),
  }),
];
