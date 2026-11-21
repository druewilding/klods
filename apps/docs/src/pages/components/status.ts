import type { KlodsNode } from "klods-js";
import { cluster, list, listItem, status } from "klods-js";

import { example } from "../../example.js";

export const label = "Status";
export const anchor = "status";

export const examples: KlodsNode[] = [
  example({
    title: "Status",
    description:
      "A colored dot beside text, for a live state. Lighter than a badge, so it can sit in a header or a list row. The text keeps the normal text color; the dot carries the color.",
    render: () =>
      cluster({ gap: 5 }, [
        status("Offline"),
        status({ variant: "accent" }, "Reviewing"),
        status({ variant: "success" }, "Online"),
        status({ variant: "warning" }, "Degraded"),
        status({ variant: "info" }, "Updating"),
        status({ variant: "danger" }, "Down"),
      ]),
  }),
  example({
    title: "Status — pulse",
    description:
      'For something happening right now. With reduced motion the ring stays still. Add role="status" when the text changes while the page is open, so screen readers announce it.',
    render: () =>
      cluster({ gap: 5 }, [
        status({ variant: "success", pulse: true, role: "status" }, "Your turn"),
        status({ variant: "danger", pulse: true }, "Recording"),
      ]),
  }),
  example({
    title: "Status — in a list",
    render: () =>
      list([
        listItem({ trail: status({ variant: "success" }, "Live") }, "docs"),
        listItem({ trail: status({ variant: "info", pulse: true }, "Deploying") }, "api"),
        listItem({ trail: status({ variant: "warning" }, "Slow") }, "search"),
        listItem({ trail: status("Stopped") }, "worker"),
      ]),
  }),
];
