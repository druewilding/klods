import type { KlodsNode } from "klods-js";
import { cluster, p, segmented } from "klods-js";

import { example } from "../../example.js";

export const label = "Segmented control";
export const anchor = "segmented-control";

export const examples: KlodsNode[] = [
  example({
    title: "Segmented control",
    description:
      "Radio buttons drawn as one pill, for picking one of a few short options. Arrow keys move between them, and the choice is sent with a form under its name. Give it a label for screen readers when nothing on the page names it.",
    render: () =>
      segmented({
        name: "theme",
        label: "Theme",
        options: [
          { label: "Auto", value: "auto" },
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
        ],
        value: "auto",
      }),
  }),
  example({
    title: "Segmented control — with a visible label",
    description:
      "When a label on the page names it, point aria-labelledby at that label instead. Options can be plain strings, used as both the text and the value.",
    render: () =>
      cluster([
        p({ id: "segmented-play-as", class: "klods-label" }, "Play as"),
        segmented({
          name: "color",
          "aria-labelledby": "segmented-play-as",
          options: ["White", "Black", "Random"],
          value: "White",
        }),
      ]),
  }),
  example({
    title: "Segmented control — disabled option",
    render: () =>
      segmented({
        name: "view",
        label: "View",
        options: ["Day", "Week", { label: "Month", disabled: true }],
        value: "Week",
      }),
  }),
];
