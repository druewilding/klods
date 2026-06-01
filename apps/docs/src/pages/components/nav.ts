import type { KlodsNode } from "klods-js";
import { nav, navLink, navList, navToggle, toggleNav } from "klods-js";

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
    title: "Nav — collapse",
    description:
      "Add class klods-nav--collapse to get a hamburger toggle on narrow viewports. The list is hidden until the toggle is clicked.",
    render: () =>
      nav({ class: "klods-nav--collapse" }, [
        navToggle({ onClick: (e: MouseEvent) => toggleNav(e.currentTarget as HTMLElement) }),
        navList({}, [
          navLink({ href: "#", active: true }, "Home"),
          navLink({ href: "#" }, "Projects"),
          navLink({ href: "#" }, "About"),
          navLink({ href: "#" }, "Contact"),
        ]),
      ]),
  }),
];
