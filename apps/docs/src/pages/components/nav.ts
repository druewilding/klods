import type { KlodsNode } from "klods-js";
import { code, nav, navLink, navList, p, pre, prose } from "klods-js";

import { example } from "../../example.js";

export const label = "Nav";
export const anchor = "nav";

export const examples: KlodsNode[] = [
  example({
    title: "Nav",
    render: () =>
      nav(
        navList([
          navLink({ href: "#", active: true }, "Home"),
          navLink({ href: "#" }, "Projects"),
          navLink({ href: "#" }, "About"),
          navLink({ href: "#" }, "Contact"),
        ])
      ),
  }),

  example({
    title: "Nav — mobile sidebar pattern",
    hideCode: true,
    render: () =>
      prose([
        p([
          "The recommended mobile nav pattern is to pair a ",
          code("sidebarToggle"),
          " component with a ",
          code("toggleSidebar"),
          " function. Add a ",
          code("sidebarToggle"),
          " to your header and put your nav links in the sidebar.",
        ]),
        pre(
          code(`page({ sidebar: true, stickyHeader: true }, [
  header([
    sidebarToggle({ onClick: (e) => toggleSidebar(e.currentTarget) }),
    fill([strong("My App")]),
  ]),
  sidebar([
    nav([
      navList([
        navLink({ href: "#" }, "Home"),
        navLink({ href: "/about" }, "About"),
      ]),
    ]),
  ]),
  content([ … ]),
])`)
        ),
        p([
          "The ",
          code("toggleSidebar"),
          " helper auto-wires the backdrop-dismiss and nav-link-close behaviour on first call — no extra setup required.",
        ]),
      ]),
  }),
];
