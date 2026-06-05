import type { KlodsNode } from "klods-js";
import { breadcrumbs, crumb } from "klods-js";

import { example } from "../../example.js";

export const label = "Breadcrumb";
export const anchor = "breadcrumb";

export const examples: KlodsNode[] = [
  example({
    title: "Breadcrumb",
    render: () => breadcrumbs([crumb({ href: "#" }, "Home"), crumb({ href: "#" }, "Products"), crumb("Widget Pro")]),
  }),

  example({
    title: "Breadcrumb — two levels",
    render: () => breadcrumbs([crumb({ href: "#" }, "Docs"), crumb("Getting started")]),
  }),
];
