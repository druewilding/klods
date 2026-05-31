// Import the SCSS source directly so the docs site can run without a
// pre-built klods-css. In production consumers would just use `klods-css`.
import "klods-css/src/klods.scss";
import "./styles.css";

import type { KlodsNode } from "klods-js";
import { content, el, fill, footer, header, page, push, sidebar, stack, toc, tocItem, tocLink } from "klods-js";

import { componentLinks, renderComponentsSection } from "./pages/components.js";
import { renderIntroSection } from "./pages/intro.js";
import { layoutLinks, renderLayoutSection } from "./pages/layout.js";
import { renderThemesSection } from "./pages/themes.js";
import { renderUtilitiesSection, utilityLinks } from "./pages/utilities.js";

type SubLink = { label: string; anchor: string };
type Section = { id: string; title: string; render: () => KlodsNode; links?: SubLink[] };

const SECTIONS: Section[] = [
  { id: "intro", title: "Intro", render: renderIntroSection },
  {
    id: "layout",
    title: "Layout",
    render: renderLayoutSection,
    links: layoutLinks,
  },
  {
    id: "utilities",
    title: "Utilities",
    render: renderUtilitiesSection,
    links: utilityLinks,
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

function sectionTocItem(section: Section): KlodsNode {
  return tocItem({}, [
    tocLink({ href: `#${section.id}` }, section.title),
    section.links?.length
      ? toc(
          { sub: true },
          section.links.map((l) => tocItem({}, tocLink({ href: `#${l.anchor}` }, l.label)))
        )
      : null,
  ]);
}

function shell(): KlodsNode {
  return page({ sidebar: true, stickyHeader: true, class: "docs-shell" }, [
    header({}, [
      fill({}, [
        el("strong", { style: "font-size: 1.25rem;" }, "klods"),
        el("span", { class: "klods-badge" }, `v${__KLODS_VERSION__}`),
      ]),
      el("a", { href: "./vanilla.html", class: "klods-button klods-button--ghost" }, "Vanilla HTML demo →"),
      fill({}, [push(), themeSwitcher()]),
    ]),
    sidebar({}, [el("nav", { "aria-label": "Sections" }, [toc({}, SECTIONS.map(sectionTocItem))])]),
    content({ narrow: true }, [
      stack(
        { gap: 7 },
        SECTIONS.map((s) => el("section", { id: s.id, class: "docs-section" }, [s.render()]))
      ),
    ]),
    footer({}, [
      el("span", {}, "klods · MIT · "),
      el("a", { href: "https://github.com/druewilding/klods" }, "github.com/druewilding/klods"),
    ]),
  ]);
}

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app root");
shell().render(root);
