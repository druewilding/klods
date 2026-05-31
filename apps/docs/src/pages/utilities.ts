import type { KlodsNode } from "klods-js";
import { center, cluster, el, grid, row, spread, stack } from "klods-js";

import { example } from "../example.js";

const box = (label: string): KlodsNode =>
  el(
    "div",
    {
      style:
        "padding:var(--klods-space-3);background:var(--klods-color-surface-2);border-radius:var(--klods-radius-sm);min-width:4rem;text-align:center;",
    },
    label
  );

export function renderUtilitiesSection(): KlodsNode {
  return stack({ gap: 5 }, [
    el("h2", {}, "Utilities"),
    el("p", { class: "klods-lead" }, "The “I always forget how to do this in CSS” classes."),

    example({
      title: "stack — vertical with gap",
      render: () => stack({ gap: 3 }, [box("one"), box("two"), box("three")]),
    }),

    example({
      title: "cluster — horizontal, wraps",
      render: () => cluster({ gap: 3 }, [box("a"), box("b"), box("c"), box("d"), box("e")]),
    }),

    example({
      title: "row — horizontal, no wrap",
      render: () => row({ gap: 3 }, [box("left"), box("middle"), box("right")]),
    }),

    example({
      title: "grid — equal columns",
      render: () => grid({ cols: 3, gap: 3 }, [box("1"), box("2"), box("3"), box("4"), box("5"), box("6")]),
    }),

    example({
      title: "grid --fit — auto-responsive",
      description: "Sets the minimum item width via `--klods-grid-min` (defaults to 16rem).",
      render: () => grid({ fit: true, gap: 3 }, [box("a"), box("b"), box("c"), box("d")]),
    }),

    example({
      title: "spread — push children apart",
      render: () => spread({}, [box("start"), box("end")]),
    }),

    example({
      title: "center — centre everything",
      render: () => center({ style: "min-height: 8rem; background: var(--klods-color-surface);" }, box("centred")),
    }),
  ]);
}
