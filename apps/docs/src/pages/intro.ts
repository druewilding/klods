import type { KlodsNode } from "klods-js";
import {
  alert,
  card,
  cardBody,
  cardTitle,
  code,
  div,
  em,
  h1,
  lead,
  li,
  p,
  pre,
  prose,
  stack,
  strong,
  ul,
} from "klods-js";

export function renderIntroSection(): KlodsNode {
  return stack({ gap: 4 }, [
    div([h1("klods"), lead("Tiny, opinionated, fully themeable HTML/CSS/JS pieces that snap together like lego.")]),
    prose([
      p(["klods (Danish for ", em("block"), ") gives you two ways to build:"]),
      ul([
        li([
          strong("Plain HTML"),
          " — drop in ",
          code("klods.css"),
          " and use the BEM classes (",
          code("klods-page"),
          ", ",
          code("klods-stack"),
          ", …). No JS required.",
        ]),
        li([
          strong("Typed builders"),
          " — ",
          code('import { page, header, … } from "klods-js"'),
          " for a lego-like API that produces both DOM and HTML strings.",
        ]),
      ]),
    ]),
    stack({ gap: 8 }, [
      card([
        cardTitle("Install"),
        cardBody([
          pre(code("npm install klods-js klods-css")),
          p({ class: "klods-muted" }, "Or for a vanilla HTML/Rails project, just link the CSS:"),
          pre(code('<link rel="stylesheet" href="https://unpkg.com/klods-css/dist/klods.min.css">')),
        ]),
      ]),
      alert(
        { variant: "info" },
        "Every example below is rendered live, and the source you see is the source that produced it."
      ),
    ]),
  ]);
}
