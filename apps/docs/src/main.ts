// Import the SCSS source directly so the docs site can run without a
// pre-built klods-css. In production consumers would just use `klods-css`.
import "klods-css/src/klods.scss";
import "./styles.css";

import type { KlodsNode } from "klods-js";
import {
  a,
  button,
  buttonGroup,
  content,
  el,
  fill,
  footer,
  header,
  page,
  push,
  row,
  section,
  sidebar,
  sidebarToggle,
  span,
  stack,
  strong,
  toc,
  tocItem,
  tocLink,
  toggleSidebar,
} from "klods-js";

import { componentLinks, renderComponentsSection } from "./pages/components.js";
import { iconLinks, renderIconsSection } from "./pages/icons.js";
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
  {
    id: "icons",
    title: "Icons",
    render: renderIconsSection,
    links: iconLinks,
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
  return row({ inline: true, gap: 2 }, [
    buttonGroup({ "aria-label": "Theme" }, [
      ...THEMES.map((t) =>
        button(
          {
            variant: "ghost",
            "data-theme-id": t.id,
            "aria-pressed": String((document.documentElement.getAttribute("data-theme") ?? "") === t.id),
            onClick: () => {
              if (t.id) {
                document.documentElement.setAttribute("data-theme", t.id);
              } else {
                document.documentElement.removeAttribute("data-theme");
              }
              const active = document.documentElement.getAttribute("data-theme") ?? "";
              const params = new URLSearchParams(location.search);
              if (active) params.set("theme", active);
              else params.delete("theme");
              history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
              const vanillaLink = document.getElementById("vanilla-link") as HTMLAnchorElement | null;
              if (vanillaLink) vanillaLink.href = active ? `./vanilla.html?theme=${active}` : "./vanilla.html";
              for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-theme-id]")) {
                btn.setAttribute("aria-pressed", String((btn.dataset.themeId ?? "") === active));
              }
            },
          },
          t.label
        )
      ),
    ]),
  ]);
}

function sectionTocItem(section: Section): KlodsNode {
  return tocItem([
    tocLink({ href: `#${section.id}` }, section.title),
    section.links?.length
      ? toc(
          { sub: true },
          section.links.map((l) => tocItem(tocLink({ href: `#${l.anchor}` }, l.label)))
        )
      : null,
  ]);
}

function shell(): KlodsNode {
  return page({ sidebar: true, stickyHeader: true, class: "docs-shell" }, [
    header([
      sidebarToggle({ onClick: (e: MouseEvent) => toggleSidebar(e.currentTarget as HTMLElement) }),
      fill([
        strong({ style: "font-size: 1.25rem;" }, "klods"),
        span({ class: "klods-badge" }, `v${__KLODS_VERSION__}`),
      ]),
      a(
        {
          id: "vanilla-link",
          href: initialTheme ? `./vanilla.html?theme=${initialTheme}` : "./vanilla.html",
          class: "klods-button klods-button--ghost",
        },
        "Vanilla HTML →"
      ),
      fill({ class: "klods-hide-tablet" }, [push(), themeSwitcher()]),
    ]),
    sidebar([el("nav", { "aria-label": "Sections" }, [toc(SECTIONS.map(sectionTocItem))])]),
    content([
      stack(
        { gap: 7 },
        SECTIONS.map((s) => section({ id: s.id }, [s.render()]))
      ),
    ]),
    footer([
      span("klods · MIT · "),
      a({ href: "https://github.com/druewilding/klods" }, "github.com/druewilding/klods"),
    ]),
  ]);
}

// Restore theme from URL on load (before render so aria-pressed is correct)
const initialTheme = new URLSearchParams(location.search).get("theme") ?? "";
if (initialTheme) document.documentElement.setAttribute("data-theme", initialTheme);
else document.documentElement.removeAttribute("data-theme");

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app root");
shell().render(root);
