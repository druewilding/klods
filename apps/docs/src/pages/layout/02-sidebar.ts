import type { KlodsNode } from "klods-js";
import { content, footer, header, page, sidebar } from "klods-js";

import { example } from "../../example.js";

export const label = "With sidebar";
export const anchor = "page-with-a-sidebar";

export const examples: KlodsNode[] = [
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
];
