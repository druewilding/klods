import type { KlodsNode } from "klods-js";
import { a, badge, button, cluster, p, span, stack, tooltip } from "klods-js";

import { example } from "../../example.js";

export const label = "Tooltip";
export const anchor = "tooltip";

export const examples: KlodsNode[] = [
  example({
    title: "Tooltip",
    description:
      "Wrap any inline content with `tooltip({ tip })` to show a tip bubble on hover and keyboard focus. Built on the Popover API with CSS Anchor Positioning where supported.",
    render: () =>
      cluster({ gap: 4 }, [
        tooltip({ tip: "Saved to your account" }, button("Save")),
        tooltip({ tip: "Opens in a new tab" }, a({ href: "#" }, "Learn more")),
        tooltip({ tip: "Draft — not yet published" }, badge("Draft")),
      ]),
  }),

  example({
    title: "Tooltip — placement",
    description:
      "Set `position` to `\"above\"` (default), `\"below\"`, `\"start\"`, or `\"end\"` to control which side the tip appears on.",
    render: () =>
      cluster({ gap: 4 }, [
        tooltip({ tip: "Above (default)", position: "above" }, button("Above")),
        tooltip({ tip: "Below", position: "below" }, button("Below")),
        tooltip({ tip: "To the start", position: "start" }, button("Start")),
        tooltip({ tip: "To the end", position: "end" }, button("End")),
      ]),
  }),

  example({
    title: "Tooltip — on plain text",
    description:
      "When wrapping non-interactive content, the tooltip wrapper itself becomes focusable so keyboard users can still read the tip.",
    render: () =>
      p([
        "The ",
        tooltip(
          { tip: "Variable-ratio intermittent reinforcement — a reward schedule that drives compulsive engagement." },
          span("slot-machine effect")
        ),
        " is widely used in social media design.",
      ]),
  }),

  example({
    title: "Tooltip — long content",
    description: "Tips wrap at `max-width: 20rem`. Useful for longer explanatory text.",
    render: () =>
      stack({ gap: 3 }, [
        tooltip(
          {
            tip: "This action permanently removes the file from all connected devices and cannot be undone. Make sure you have a backup before continuing.",
          },
          button({ variant: "danger" }, "Delete file")
        ),
      ]),
  }),
];
