import type { KlodsNode } from "klods-js";
import {
  alert,
  badge,
  button,
  buttonGroup,
  card,
  cardBody,
  cardTitle,
  code,
  el,
  field,
  h2,
  h3,
  input,
  lead,
  li,
  muted,
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
type TokenDef = { token: string; label: string; kind: "color" | "text" };

const TOKEN_GROUPS: Array<{ label: string; tokens: TokenDef[] }> = [
  {
    label: "Colors",
    tokens: [
      { token: "--klods-color-bg", label: "Background", kind: "color" },
      { token: "--klods-color-fg", label: "Foreground", kind: "color" },
      { token: "--klods-color-muted", label: "Muted text", kind: "color" },
      { token: "--klods-color-surface", label: "Surface", kind: "color" },
      { token: "--klods-color-surface-2", label: "Surface 2", kind: "color" },
      { token: "--klods-color-border", label: "Border", kind: "color" },
      { token: "--klods-color-accent", label: "Accent", kind: "color" },
      { token: "--klods-color-accent-fg", label: "Accent text", kind: "color" },
      { token: "--klods-color-danger", label: "Danger", kind: "color" },
      { token: "--klods-color-success", label: "Success", kind: "color" },
      { token: "--klods-color-warning", label: "Warning", kind: "color" },
      { token: "--klods-color-info", label: "Info", kind: "color" },
    ],
  },
  {
    label: "Radius",
    tokens: [
      { token: "--klods-radius-sm", label: "Small", kind: "text" },
      { token: "--klods-radius-md", label: "Medium", kind: "text" },
      { token: "--klods-radius-lg", label: "Large", kind: "text" },
      { token: "--klods-radius-pill", label: "Pill", kind: "text" },
    ],
  },
  {
    label: "Typography",
    tokens: [
      { token: "--klods-font-sans", label: "Sans font", kind: "text" },
      { token: "--klods-font-mono", label: "Mono font", kind: "text" },
      { token: "--klods-font-size-base", label: "Base size", kind: "text" },
    ],
  },
];

const ALL_TOKEN_DEFS = TOKEN_GROUPS.flatMap((g) => g.tokens);

function tbTokenId(token: string): string {
  return `tb-${token.slice(2)}`; // "--klods-color-bg" → "tb-klods-color-bg"
}

function cssColorToHex(color: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "#000000";
  ctx.fillStyle = "#000000";
  ctx.fillStyle = color; // may be oklch, rgb, hex — browser normalises it
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return "#" + [r ?? 0, g ?? 0, b ?? 0].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function tbUpdateOutput(): void {
  const overrides = ALL_TOKEN_DEFS.map(({ token }) => ({
    token,
    val: document.documentElement.style.getPropertyValue(token).trim(),
  })).filter(({ val }) => val !== "");

  const textarea = document.getElementById("tb-output") as HTMLTextAreaElement | null;
  if (!textarea) return;

  textarea.value = overrides.length
    ? `:root {\n${overrides.map(({ token, val }) => `  ${token}: ${val};`).join("\n")}\n}`
    : "/* No overrides yet — change a token above */";
}

function tbSetColorInputValue(token: string, hex: string): void {
  const inp = document.getElementById(tbTokenId(token)) as HTMLInputElement | null;
  if (!inp) return;
  inp.value = hex;
  const hexInp = inp.closest(".klods-input--color")?.querySelector<HTMLInputElement>(".klods-color-hex");
  if (hexInp) hexInp.value = hex;
}

function tbSyncValues(): void {
  const cs = getComputedStyle(document.documentElement);
  for (const { token, kind } of ALL_TOKEN_DEFS) {
    const hasOverride = document.documentElement.style.getPropertyValue(token).trim() !== "";
    if (hasOverride) continue; // don't clobber user's active override
    const raw = cs.getPropertyValue(token).trim();
    if (kind === "color") {
      tbSetColorInputValue(token, cssColorToHex(raw));
    } else {
      const inp = document.getElementById(tbTokenId(token)) as HTMLInputElement | null;
      if (inp) inp.value = raw;
    }
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
  for (const { token, kind } of ALL_TOKEN_DEFS) {
    document.documentElement.style.removeProperty(token);
    if (kind === "text") {
      const inp = document.getElementById(tbTokenId(token)) as HTMLInputElement | null;
      if (inp) inp.value = "";
    }
  }
  tbSyncValues();
  tbUpdateOutput();
}

export function initThemeBuilder(): void {
  tbSyncValues();
  tbUpdateOutput();
  // Re-sync values when the active theme changes so pickers reflect the new theme.
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-theme-id]")) {
    btn.addEventListener("click", () => requestAnimationFrame(tbSyncValues));
  }
}

function tokenField({ token, label, kind }: TokenDef): KlodsNode {
  return field({ label, id: tbTokenId(token), class: "tb__token-field" }, (id) =>
    input({
      id,
      type: kind,
      // Use camelCase onInput so it goes into ...rest and reaches the DOM
      // directly — the form builder only destructures lowercase `oninput`.
      onInput: (e: Event) => {
        const inp = e.target as HTMLInputElement;
        const val = inp.value.trim();
        if (kind === "text" && !val) {
          document.documentElement.style.removeProperty(token);
        } else if (val) {
          document.documentElement.style.setProperty(token, val);
        }
        tbUpdateOutput();
      },
      ...(kind === "text" ? { class: "tb__text-input" } : {}),
    })
  );
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
        " Clearing a text field restores the active theme's value.",
        " Switching themes re-syncs the color pickers.",
      ]),
    ]),
    el(
      "div",
      { class: "tb__groups" },
      TOKEN_GROUPS.map((group) =>
        el("div", { class: "tb__group" }, [
          el("p", { class: "tb__group-label" }, group.label),
          el(
            "div",
            { class: group.label === "Colors" ? "tb__fields-grid" : "tb__fields" },
            group.tokens.map(tokenField)
          ),
        ])
      )
    ),
    el("div", { class: "tb__preview" }, [
      card([
        cardTitle("Preview card"),
        cardBody([
          prose([
            lead("Changes apply instantly."),
            muted("Try editing some of the values above and see the changes here."),
          ]),
          stack({ gap: 2, style: "margin-top:var(--klods-space-4)" }, [
            alert({ variant: "info" }, "Info alert"),
            alert({ variant: "success" }, "Success alert"),
            alert({ variant: "warning" }, "Warning alert"),
            alert({ variant: "danger" }, "Danger alert"),
          ]),
          row({ gap: 2, style: "margin-top:var(--klods-space-4)" }, [
            button("Default button"),
            button({ variant: "primary" }, "Primary button"),
            button({ variant: "danger" }, "Danger button"),
            button({ variant: "ghost" }, "Ghost button"),
          ]),
          row({ gap: 2, style: "margin-top:var(--klods-space-4)" }, [
            badge("Default badge"),
            badge({ variant: "accent" }, "Accent badge"),
            badge({ variant: "success" }, "Success badge"),
            badge({ variant: "danger" }, "Danger badge"),
          ]),
          row({ gap: 2, style: "margin-top:var(--klods-space-4)" }, [
            buttonGroup({ role: "group", "aria-label": "View" }, [
              button({ variant: "ghost", "aria-pressed": "true" }, "Active"),
              button({ variant: "ghost", "aria-pressed": "false" }, "Inactive"),
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
