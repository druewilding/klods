import type { KlodsNode } from "klods-js";
import {
  badge,
  button,
  card,
  cardBody,
  cardTitle,
  code,
  el,
  h2,
  h3,
  li,
  p,
  pre,
  prose,
  row,
  stack,
  ul,
} from "klods-js";

export function renderThemesSection(): KlodsNode {
  return stack({ gap: 6 }, [
    h2("Themes"),
    p({ class: "klods-lead" }, "Switch the theme using the buttons in the header — the whole site re-skins."),

    // ── Theming basics ─────────────────────────────────────────────────────
    prose([
      p([
        "Themes are pure CSS-variable overrides keyed off ",
        code("[data-theme]"),
        ". Set ",
        code('data-theme="dark"'),
        " on ",
        code("<html>"),
        " (or any container) and every klods component re-skins.",
      ]),
      p("Bundled presets:"),
      ul([
        li([code("default"), " — clean, neutral light theme."]),
        li([code("dark"), " — high-contrast dark theme."]),
        li([code("playful"), " — pink and round."]),
        li([code("brutalist"), " — black borders, hard shadows."]),
      ]),
      p("Roll your own by overriding any of the --klods-* tokens. No compile step required."),
      pre(
        code(`:root[data-theme="ocean"] {
  --klods-color-bg: #001b29;
  --klods-color-fg: #d8f2ff;
  --klods-color-surface: #002c44;
  --klods-color-surface-2: #003a59;
  --klods-color-border: #0a4f76;
  --klods-color-accent: #6cd2ff;
  --klods-color-accent-fg: #001b29;
}`)
      ),
    ]),

    card([
      cardTitle("Tokens cheat-sheet"),
      cardBody([
        p("All tokens live in one place and are intended to be overridden:"),
        pre(
          code(`--klods-color-bg / -fg / -muted / -surface / -surface-2 / -border
--klods-color-accent / -accent-fg / -link / -danger / -success / -warning / -info
--klods-font-sans / -font-mono / -font-size-base / -sm / -lg / -xl / -2xl / -3xl
--klods-line-height-base / -tight
--klods-space-0 .. --klods-space-8
--klods-radius-sm / -md / -lg / -pill
--klods-shadow-sm / -md / -lg
--klods-content-max / -sidebar-width / -header-height / -gutter
--klods-transition`)
        ),
      ]),
    ]),

    // ── Per-component theming ──────────────────────────────────────────────
    h3("Per-component theming"),
    prose([
      p([
        "Key components expose their own scoped tokens that fall back to global design tokens.",
        " Set the scoped token anywhere in the DOM — the custom property inherits down — and only",
        " that component type is affected inside that scope.",
      ]),
      pre(
        code(`/* Re-skin cards in one section — global tokens stay untouched */
.my-panel {
  --klods-card-bg: color-mix(in srgb, var(--klods-color-accent) 8%, var(--klods-color-bg));
  --klods-card-border: var(--klods-color-accent);
  --klods-card-radius: var(--klods-radius-lg);
}

/* Pill buttons in one form */
.my-form {
  --klods-button-radius: var(--klods-radius-pill);
}

/* Green tabs in a sidebar widget */
.my-widget {
  --klods-tabs-active: var(--klods-color-success);
}`)
      ),
      p("All scoped tokens and their defaults:"),
      pre(
        code(`/* Card */
--klods-card-bg:     var(--klods-color-surface)
--klods-card-border: var(--klods-color-border)
--klods-card-radius: var(--klods-radius-md)

/* Button (default variant) */
--klods-button-bg:     var(--klods-color-surface-2)
--klods-button-fg:     var(--klods-color-fg)
--klods-button-border: var(--klods-color-border)
--klods-button-radius: var(--klods-radius-sm)

/* Badge (default variant) */
--klods-badge-bg: var(--klods-color-surface-2)
--klods-badge-fg: var(--klods-color-fg)

/* Modal */
--klods-modal-bg:     var(--klods-color-surface)
--klods-modal-radius: var(--klods-radius-lg)

/* Tabs */
--klods-tabs-active: var(--klods-color-accent)

/* Tooltip */
--klods-tooltip-bg: oklch(20% 0.01 264)
--klods-tooltip-fg: oklch(98% 0 0)`)
      ),
    ]),
    row({ gap: 4 }, [
      el(
        "div",
        { style: "flex:1" },
        card([
          cardTitle("Default card"),
          cardBody(
            p({ class: "klods-muted" }, "No overrides — uses --klods-card-bg which defaults to --klods-color-surface.")
          ),
        ])
      ),
      el(
        "div",
        {
          style: [
            "flex:1",
            "--klods-card-bg: color-mix(in srgb, var(--klods-color-accent) 8%, var(--klods-color-bg))",
            "--klods-card-border: var(--klods-color-accent)",
            "--klods-card-radius: var(--klods-radius-lg)",
            "--klods-button-radius: var(--klods-radius-pill)",
          ].join(";"),
        },
        card([
          cardTitle("Scoped overrides"),
          cardBody([
            p(
              { class: "klods-muted" },
              "Parent sets --klods-card-bg, --klods-card-border, --klods-card-radius, --klods-button-radius."
            ),
            button("Pill button"),
          ]),
        ])
      ),
    ]),

    // ── Compact density ────────────────────────────────────────────────────
    h3("Compact density"),
    prose([
      p([
        "Set ",
        code('data-density="compact"'),
        " on ",
        code("<html>"),
        " (or any container) to tighten all spacing tokens to roughly 75% of their defaults.",
        " Useful for data-dense UIs or when fitting more content on screen.",
      ]),
      pre(code('document.documentElement.setAttribute("data-density", "compact")')),
    ]),
    card([
      cardTitle("Default density"),
      cardBody(
        stack({ gap: 4 }, [
          row({ gap: 3 }, [button("Action"), button({ variant: "primary" }, "Primary"), badge("New")]),
          p({ class: "klods-muted" }, "Standard spacing — --klods-space-4 is 1rem (16px)."),
        ])
      ),
    ]),
    el("div", { "data-density": "compact" }, [
      card([
        cardTitle("Compact density"),
        cardBody(
          stack({ gap: 4 }, [
            row({ gap: 3 }, [button("Action"), button({ variant: "primary" }, "Primary"), badge("New")]),
            p({ class: "klods-muted" }, "Compact spacing — --klods-space-4 is 0.75rem (12px)."),
          ])
        ),
      ]),
    ]),

    // ── Reduced motion ─────────────────────────────────────────────────────
    h3("Reduced motion"),
    prose([
      p([
        "klods respects the system ",
        code("prefers-reduced-motion"),
        " preference automatically.",
        " When it is set to ",
        code("reduce"),
        ", the ",
        code("--klods-transition"),
        " token is set to ",
        code("0ms"),
        ", eliminating all transitions and shortening animation durations to zero.",
      ]),
      p(["You can simulate this in CSS without changing system settings:"]),
      pre(code(":root { --klods-transition: 0ms; }")),
    ]),

    // ── Print styles ───────────────────────────────────────────────────────
    h3("Print styles"),
    prose([
      p([
        "klods ships ",
        code("@layer klods.print"),
        " with sensible print defaults.",
        " The layer sits at the top of the cascade so it wins cleanly without ",
        code("!important"),
        ".",
      ]),
      ul([
        li([
          "Hides ",
          code(".klods-sidebar"),
          ", ",
          code(".klods-sidebar-toggle"),
          ", modals, toasts, and tooltip tips.",
        ]),
        li("Collapses the sidebar grid to a single column."),
        li("Removes sticky header positioning."),
        li("Expands all closed disclosure elements so their content prints."),
        li("Removes box shadows."),
        li(["Adds ", code("break-inside: avoid"), " to cards, list items, and description lists."]),
      ]),
    ]),
  ]);
}
