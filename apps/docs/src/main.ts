// Import the SCSS source directly so the docs site can run without a
// pre-built klods-css. In production consumers would just use `klods-css`.
import "klods-css/src/klods.scss";
import "./styles.css";

import type { KlodsNode } from "klods-js";
import { content, el, footer, header, page, sidebar, stack } from "klods-js";

import { componentLinks, renderComponentsSection } from "./pages/components.js";
import { renderIntroSection } from "./pages/intro.js";
import { renderLayoutSection } from "./pages/layout.js";
import { renderThemesSection } from "./pages/themes.js";
import { renderUtilitiesSection } from "./pages/utilities.js";

type SubLink = { label: string; anchor: string };
type Section = { id: string; title: string; render: () => KlodsNode; links?: SubLink[] };

const SECTIONS: Section[] = [
  { id: "intro", title: "Intro", render: renderIntroSection },
  {
    id: "layout",
    title: "Layout",
    render: renderLayoutSection,
    links: [
      { label: "Page", anchor: "page-with-header-content-and-footer" },
      { label: "With sidebar", anchor: "page-with-a-sidebar" },
      { label: "Narrow content", anchor: "narrow-content" },
    ],
  },
  {
    id: "utilities",
    title: "Utilities",
    render: renderUtilitiesSection,
    links: [
      { label: "stack", anchor: "stack-vertical-with-gap" },
      { label: "cluster", anchor: "cluster-horizontal-wraps" },
      { label: "row", anchor: "row-horizontal-no-wrap" },
      { label: "grid", anchor: "grid-equal-columns" },
      { label: "spread", anchor: "spread-push-children-apart" },
      { label: "center", anchor: "center-centre-everything" },
    ],
  },
  {
    id: "components",
    title: "Components",
    render: renderComponentsSection,
    links: componentLinks,
  },
  { id: "themes", title: "Themes", render: renderThemesSection },
];

const THEMES: Array<{ id: string; label: string }> = [
  { id: "", label: "Default" },
  { id: "dark", label: "Dark" },
  { id: "playful", label: "Playful" },
  { id: "brutalist", label: "Brutalist" },
];

function themeSwitcher(): KlodsNode {
  return el("div", { class: "klods-cluster", role: "group", "aria-label": "Theme" }, [
    el("strong", {}, "Theme:"),
    ...THEMES.map((t) =>
      el(
        "button",
        {
          class: "docs-theme-swatch",
          type: "button",
          "data-theme-id": t.id,
          "aria-pressed": (document.documentElement.getAttribute("data-theme") ?? "") === t.id,
          onClick: () => {
            document.documentElement.setAttribute("data-theme", t.id);
            for (const btn of document.querySelectorAll<HTMLButtonElement>(".docs-theme-swatch")) {
              btn.setAttribute("aria-pressed", String(btn.dataset.themeId === t.id));
            }
          },
        },
        t.label
      )
    ),
  ]);
}

function tocLink(section: Section): KlodsNode {
  return el("li", {}, [
    el("a", { href: `#${section.id}` }, section.title),
    section.links?.length
      ? el(
          "ul",
          { class: "docs-toc docs-toc--sub" },
          section.links.map((l) => el("li", {}, el("a", { href: `#${l.anchor}` }, l.label)))
        )
      : null,
  ]);
}

function shell(): KlodsNode {
  return page({ sidebar: true, class: "docs-shell" }, [
    header({}, [
      el("strong", { style: "font-size: 1.25rem;" }, "klods"),
      el("span", { class: "klods-badge" }, `v${__KLODS_VERSION__}`),
      el("span", { class: "klods-push" }),
      themeSwitcher(),
    ]),
    sidebar({}, [el("nav", { "aria-label": "Sections" }, [el("ul", { class: "docs-toc" }, SECTIONS.map(tocLink))])]),
    content({ narrow: true }, [
      stack(
        { gap: 7 },
        SECTIONS.map((s) => el("section", { id: s.id, class: "docs-section" }, [s.render()]))
      ),
    ]),
    footer({}, [
      el("span", {}, "klods · MIT · "),
      el("a", { href: "https://github.com/druewilding" }, "github.com/druewilding"),
    ]),
  ]);
}

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app root");
shell().render(root);
