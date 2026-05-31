import type { KlodsNode } from "klods-js";
import { nav, navLink, navList } from "klods-js";

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
];
