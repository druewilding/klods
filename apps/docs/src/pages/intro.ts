import type { KlodsNode } from "klods-js";
import { alert, card, cardBody, cardTitle, el, lead, prose, stack } from "klods-js";

export function renderIntroSection(): KlodsNode {
  return stack({ gap: 4 }, [
    el("div", {}, [
      el("h1", {}, "klods"),
      el("h2", {}, "Full documentation"),
      lead({}, "Tiny, opinionated, fully themeable HTML/CSS/JS pieces that snap together like lego."),
    ]),
    prose({}, [
      el("p", {}, ["klods (Danish for ", el("em", {}, "block"), ") gives you two ways to build:"]),
      el("ul", {}, [
        el("li", {}, [
          el("strong", {}, "Plain HTML"),
          " — drop in ",
          el("code", {}, "klods.css"),
          " and use the BEM classes (",
          el("code", {}, "klods-page"),
          ", ",
          el("code", {}, "klods-stack"),
          ", …). No JS required.",
        ]),
        el("li", {}, [
          el("strong", {}, "Typed builders"),
          " — ",
          el("code", {}, 'import { page, header, … } from "klods-js"'),
          " for a lego-like API that produces both DOM and HTML strings.",
        ]),
      ]),
    ]),
    stack({ gap: 8 }, [
      card({}, [
        cardTitle({}, "Install"),
        cardBody({}, [
          el("pre", {}, el("code", {}, "npm install klods-js klods-css")),
          el("p", { class: "klods-muted" }, "Or for a vanilla HTML/Rails project, just link the CSS:"),
          el(
            "pre",
            {},
            el("code", {}, '<link rel="stylesheet" href="https://unpkg.com/klods-css/dist/klods.min.css">')
          ),
        ]),
      ]),
      alert(
        { variant: "info" },
        "Every example below is rendered live, and the source you see is the source that produced it."
      ),
    ]),
  ]);
}
