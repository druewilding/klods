import type { KlodsNode } from "klods-js";
import { badge, table, tableWrap, tbody, td, th, thead, tr } from "klods-js";

import { example } from "../../example.js";

export const label = "Table";
export const anchor = "table";

export const examples: KlodsNode[] = [
  example({
    title: "Table",
    render: () =>
      table([
        thead(tr([th("Name"), th("Role"), th("Status")])),
        tbody([
          tr([td("Alice"), td("Engineer"), td(badge({ variant: "success" }, "active"))]),
          tr([td("Bob"), td("Designer"), td(badge({ variant: "accent" }, "away"))]),
          tr([td("Carol"), td("Manager"), td(badge({ variant: "danger" }, "inactive"))]),
        ]),
      ]),
  }),

  example({
    title: "Table — striped",
    render: () =>
      table({ striped: true }, [
        thead(tr([th("Country"), th("Capital"), th("Population")])),
        tbody([
          tr([td("Denmark"), td("Copenhagen"), td("5.9M")]),
          tr([td("Sweden"), td("Stockholm"), td("10.5M")]),
          tr([td("Norway"), td("Oslo"), td("5.5M")]),
          tr([td("Finland"), td("Helsinki"), td("5.6M")]),
        ]),
      ]),
  }),

  example({
    title: "Table — scroll wrapper",
    description: "Wrap any table in tableWrap() so it scrolls horizontally on small screens instead of overflowing.",
    render: () =>
      tableWrap([
        table({ style: "min-width: 52rem" }, [
          thead(
            tr([
              th("Name"),
              th("Role"),
              th("Department"),
              th("Location"),
              th("Start date"),
              th("Contract"),
              th("Salary"),
              th("Status"),
            ])
          ),
          tbody([
            tr([
              td("Alice"),
              td("Engineer"),
              td("Platform"),
              td("Copenhagen"),
              td("Jan 2022"),
              td("Full-time"),
              td("£72,000"),
              td(badge({ variant: "success" }, "active")),
            ]),
            tr([
              td("Bob"),
              td("Designer"),
              td("Product"),
              td("Stockholm"),
              td("Mar 2023"),
              td("Part-time"),
              td("£48,000"),
              td(badge({ variant: "accent" }, "away")),
            ]),
            tr([
              td("Carol"),
              td("Manager"),
              td("Engineering"),
              td("Oslo"),
              td("Aug 2019"),
              td("Full-time"),
              td("£95,000"),
              td(badge({ variant: "danger" }, "inactive")),
            ]),
          ]),
        ]),
      ]),
  }),
];
