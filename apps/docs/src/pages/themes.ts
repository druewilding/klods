import type { KlodsNode } from "klods-js";
import { card, cardBody, cardTitle, el, prose, stack } from "klods-js";

export function renderThemesSection(): KlodsNode {
  return stack({ gap: 5 }, [
    el("h2", {}, "Themes"),
    el("p", { class: "klods-lead" }, "Switch the theme using the buttons in the header — the whole site re-skins."),
    prose({}, [
      el("p", {}, [
        "Themes are pure CSS-variable overrides keyed off ",
        el("code", {}, "[data-theme]"),
        ". Set ",
        el("code", {}, 'data-theme="dark"'),
        " on ",
        el("code", {}, "<html>"),
        " (or any container) and every klods component re-skins.",
      ]),
      el("p", {}, "Bundled presets:"),
      el("ul", {}, [
        el("li", {}, [el("code", {}, "default"), " — clean, neutral light theme."]),
        el("li", {}, [el("code", {}, "dark"), " — high-contrast dark theme."]),
        el("li", {}, [el("code", {}, "playful"), " — pink and round."]),
        el("li", {}, [el("code", {}, "brutalist"), " — black borders, hard shadows."]),
      ]),
      el("p", {}, "Roll your own by overriding any of the --klods-* tokens. There is no compile-time required."),
      el(
        "pre",
        {},
        el(
          "code",
          {},
          `:root[data-theme="ocean"] {
  --klods-color-bg: #001b29;
  --klods-color-fg: #d8f2ff;
  --klods-color-surface: #002c44;
  --klods-color-surface-2: #003a59;
  --klods-color-border: #0a4f76;
  --klods-color-accent: #6cd2ff;
  --klods-color-accent-fg: #001b29;
}`
        )
      ),
    ]),
    card({}, [
      cardTitle({}, "Tokens cheat-sheet"),
      cardBody({}, [
        el("p", {}, "All tokens live in one place and are intended to be overridden:"),
        el(
          "pre",
          {},
          el(
            "code",
            {},
            `--klods-color-bg / -fg / -muted / -surface / -surface-2 / -border
--klods-color-accent / -accent-fg / -link / -danger / -success / -warning / -info
--klods-font-sans / -font-mono / -font-size-base / -sm / -lg / -xl / -2xl / -3xl
--klods-line-height-base / -tight
--klods-space-0 .. --klods-space-8
--klods-radius-sm / -md / -lg / -pill
--klods-shadow-sm / -md / -lg
--klods-content-max / -sidebar-width / -header-height / -gutter
--klods-transition`
          )
        ),
      ]),
    ]),
  ]);
}
