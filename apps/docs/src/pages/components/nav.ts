import type { KlodsNode } from "klods-js";
import { el, nav, navLink, navList, prose } from "klods-js";

import { example } from "../../example.js";

export const label = "Nav";
export const anchor = "nav";

export const examples: KlodsNode[] = [
  example({
    title: "Nav",
    render: () =>
      nav({}, [
        navList({}, [
          navLink({ href: "#", active: true }, "Home"),
          navLink({ href: "#" }, "Projects"),
          navLink({ href: "#" }, "About"),
          navLink({ href: "#" }, "Contact"),
        ]),
      ]),
  }),

  example({
    title: "Nav — mobile sidebar pattern",
    render: () =>
      prose({}, [
        el("p", {}, [
          "The recommended mobile nav pattern is to pair ",
          el("code", {}, "sidebarToggle"),
          " with ",
          el("code", {}, "toggleSidebar"),
          ". Add a ",
          el("code", {}, "sidebarToggle"),
          " to your header and put your nav links in both the header (hidden on mobile via ",
          el("code", {}, "klods-hide-tablet"),
          ") and the sidebar.",
        ]),
        el("pre", {}, el("code", {},
`page({ sidebar: true, stickyHeader: true }, [
  header({}, [
    sidebarToggle({ onClick: (e) => toggleSidebar(e.currentTarget) }),
    fill({}, [el("strong", {}, "My App")]),
    nav({ class: "klods-hide-tablet" }, [
      navList({}, [
        navLink({ href: "#" }, "Home"),
        navLink({ href: "/about" }, "About"),
      ]),
    ]),
  ]),
  sidebar({}, [
    nav({}, [
      navList({}, [
        navLink({ href: "#" }, "Home"),
        navLink({ href: "/about" }, "About"),
      ]),
    ]),
  ]),
  content({}, [ … ]),
])`
        )),
        el("p", {}, [
          "The ",
          el("code", {}, "toggleSidebar"),
          " helper auto-wires the backdrop-dismiss and nav-link-close behaviour on first call — no extra setup required.",
        ]),
      ]),
  }),
];
