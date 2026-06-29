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

// ── TOC sub-links ──────────────────────────────────────────────────────────
export const themesLinks: Array<{ label: string; anchor: string }> = [
  { label: "Per-component theming", anchor: "themes-per-component" },
  { label: "Compact density", anchor: "themes-compact" },
  { label: "Reduced motion", anchor: "themes-reduced-motion" },
  { label: "Print styles", anchor: "themes-print" },
  { label: "Theme builder", anchor: "themes-builder" },
];

// ── Theme builder ──────────────────────────────────────────────────────────
const TOKEN_GROUPS = [
  {
    label: "Colors",
    tokens: [
      { token: "--klods-color-bg", label: "Background" },
      { token: "--klods-color-fg", label: "Foreground" },
      { token: "--klods-color-muted", label: "Muted text" },
      { token: "--klods-color-surface", label: "Surface" },
      { token: "--klods-color-surface-2", label: "Surface 2" },
      { token: "--klods-color-border", label: "Border" },
      { token: "--klods-color-accent", label: "Accent" },
      { token: "--klods-color-accent-fg", label: "Accent text" },
      { token: "--klods-color-danger", label: "Danger" },
      { token: "--klods-color-success", label: "Success" },
      { token: "--klods-color-warning", label: "Warning" },
      { token: "--klods-color-info", label: "Info" },
    ],
  },
  {
    label: "Radius",
    tokens: [
      { token: "--klods-radius-sm", label: "Small" },
      { token: "--klods-radius-md", label: "Medium" },
      { token: "--klods-radius-lg", label: "Large" },
      { token: "--klods-radius-pill", label: "Pill" },
    ],
  },
  {
    label: "Typography",
    tokens: [
      { token: "--klods-font-sans", label: "Sans font" },
      { token: "--klods-font-mono", label: "Mono font" },
      { token: "--klods-font-size-base", label: "Base size" },
    ],
  },
];

const ALL_TOKENS = TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => t.token));

function tbTokenId(token: string): string {
  return `tb-${token.slice(2)}`; // "--klods-color-bg" → "tb-klods-color-bg"
}

function tbUpdateOutput(): void {
  const overrides = ALL_TOKENS.map((t) => ({
    token: t,
    val: document.documentElement.style.getPropertyValue(t).trim(),
  })).filter(({ val }) => val !== "");

  const textarea = document.getElementById("tb-output") as HTMLTextAreaElement | null;
  if (!textarea) return;

  textarea.value = overrides.length
    ? `:root {\n${overrides.map(({ token, val }) => `  ${token}: ${val};`).join("\n")}\n}`
    : "/* No overrides yet — change a token above */";
}

function tbSyncPlaceholders(): void {
  const cs = getComputedStyle(document.documentElement);
  for (const token of ALL_TOKENS) {
    const input = document.getElementById(tbTokenId(token)) as HTMLInputElement | null;
    if (input) input.placeholder = cs.getPropertyValue(token).trim();
  }
}

function tbCopy(): void {
  const textarea = document.getElementById("tb-output") as HTMLTextAreaElement | null;
  if (!textarea) return;
  navigator.clipboard.writeText(textarea.value).catch(() => {
    textarea.select();
    document.execCommand("copy");
  });
  const btn = document.getElementById("tb-copy");
  if (!btn) return;
  btn.textContent = "Copied!";
  setTimeout(() => {
    btn.textContent = "Copy CSS";
  }, 2000);
}

function tbReset(): void {
  for (const token of ALL_TOKENS) {
    document.documentElement.style.removeProperty(token);
    const input = document.getElementById(tbTokenId(token)) as HTMLInputElement | null;
    if (input) input.value = "";
  }
  tbSyncPlaceholders();
  tbUpdateOutput();
}

export function initThemeBuilder(): void {
  tbSyncPlaceholders();
  tbUpdateOutput();
  // Re-sync placeholders when the active theme changes so they reflect the new theme's values.
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-theme-id]")) {
    btn.addEventListener("click", () => requestAnimationFrame(tbSyncPlaceholders));
  }
}

function themeBuilderSection(): KlodsNode {
  return stack({ gap: 4 }, [
    h3({ id: "themes-builder" }, "Theme builder"),
    prose([
      p([
        "Edit any token below — changes apply live to this entire page.",
        " When you're happy, copy the generated ",
        code(":root { … }"),
        " block into your own stylesheet.",
        " Clearing a field restores the active theme's value.",
      ]),
    ]),
    el("div", { class: "tb__groups" }, TOKEN_GROUPS.map((group) =>
      el("div", { class: "tb__group" }, [
        el("p", { class: "tb__group-label" }, group.label),
        ...group.tokens.map(({ token, label }) =>
          el("label", { class: "tb__field", title: label }, [
            el("span", { class: "tb__field-token" }, token),
            el("input", {
              id: tbTokenId(token),
              type: "text",
              class: "klods-input tb__input",
              "data-token": token,
              spellcheck: "false",
              onInput: (e: Event) => {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) {
                  document.documentElement.style.setProperty(token, val);
                } else {
                  document.documentElement.style.removeProperty(token);
                }
                tbUpdateOutput();
              },
            }),
          ])
        ),
      ])
    )),
    el("div", { class: "tb__preview" }, [
      row({ gap: 4, style: "flex-wrap:wrap; align-items:flex-start" }, [
        card([
          cardTitle("Preview card"),
          cardBody([
            p({ class: "klods-muted" }, "Changes apply instantly — try editing accent, surface, or radius above."),
            row({ gap: 2, style: "margin-top:var(--klods-space-3)" }, [
              button("Default"),
              button({ variant: "primary" }, "Primary"),
              button({ variant: "danger" }, "Danger"),
            ]),
            row({ gap: 2, style: "margin-top:var(--klods-space-2)" }, [
              badge("Default"),
              badge({ variant: "accent" }, "Accent"),
              badge({ variant: "success" }, "Success"),
            ]),
          ]),
        ]),
      ]),
    ]),
    el("div", { class: "tb__output" }, [
      el("textarea", {
        id: "tb-output",
        class: "klods-input tb__textarea",
        spellcheck: "false",
      }),
      row({ gap: 3 }, [
        button({ id: "tb-copy", variant: "primary", onClick: tbCopy }, "Copy CSS"),
        button({ id: "tb-reset", onClick: tbReset }, "Reset"),
      ]),
    ]),
  ]);
}

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
    h3({ id: "themes-per-component" }, "Per-component theming"),
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
    h3({ id: "themes-compact" }, "Compact density"),
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
    h3({ id: "themes-reduced-motion" }, "Reduced motion"),
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
    h3({ id: "themes-print" }, "Print styles"),
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

    // ── Theme builder ──────────────────────────────────────────────────────
    themeBuilderSection(),
  ]);
}
