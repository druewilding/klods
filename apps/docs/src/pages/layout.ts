import type { KlodsNode } from "klods";
import { content, el, footer, header, page, sidebar, stack } from "klods";

import { example } from "../example.js";

export function renderLayoutSection(): KlodsNode {
  return stack({ gap: 5 }, [
    el("h2", {}, "Layout"),
    el("p", { class: "klods-lead" }, "The four corners of every page: header, sidebar, content, footer."),

    example({
      title: "Page with header, content and footer",
      description: "The simplest layout. Uses CSS Grid under the hood and works without JS.",
      render: () => page({}, [header({}, "Header"), content({}, "Main content"), footer({}, "Footer")]),
    }),

    example({
      title: "Page with a sidebar",
      description: "Add `sidebar: true` to grow a sidebar column. Add `sidebarRight: true` to flip it.",
      render: () =>
        page({ sidebar: true }, [
          header({}, "Header"),
          sidebar({}, "Sidebar"),
          content({}, "Main content"),
          footer({}, "Footer"),
        ]),
    }),

    example({
      title: "Narrow content",
      description: "`content({ narrow: true })` caps the main column at --klods-content-max and centres it.",
      render: () =>
        page({}, [
          header({}, "Header"),
          content({ narrow: true }, "Comfortably-narrow text column."),
          footer({}, "Footer"),
        ]),
    }),
  ]);
}
