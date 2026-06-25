// First wave of components: nav, card, button, badge, alert, prose helpers.
// All match the BEM classes shipped by klods-css.

import type { KlodsAttrs, KlodsChild } from "./core.js";
import { builder, classNames, el, KlodsNode, normalizeArgs, raw, tagBuilder } from "./core.js";

// ── Nav ──────────────────────────────────────────────────────────────────
export const nav = builder({ tag: "nav", base: "klods-nav" });
export const navList = builder({ tag: "ul", base: "klods-nav__list" });
export const buttonGroup = builder({ tag: "div", base: "klods-button-group" });

const HAMBURGER_ICON = raw(
  '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect y="3" width="20" height="2" rx="1" fill="currentColor"/><rect y="9" width="20" height="2" rx="1" fill="currentColor"/><rect y="15" width="20" height="2" rx="1" fill="currentColor"/></svg>'
);

/**
 * Hamburger toggle button for `.klods-nav--collapse`. Renders a default
 * three-line icon; pass children to override. Wire up with `toggleNav`.
 */
export function navToggle(): KlodsNode;
export function navToggle(children: KlodsChild | KlodsChild[]): KlodsNode;
export function navToggle(attrs: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function navToggle(a?: KlodsAttrs | KlodsChild | KlodsChild[] | null, b?: KlodsChild | KlodsChild[]): KlodsNode {
  const [attrs, children] = normalizeArgs<KlodsAttrs>(a, b);
  return el(
    "button",
    { type: "button", "aria-label": "Toggle navigation", class: "klods-nav__toggle", ...attrs },
    children ?? HAMBURGER_ICON
  );
}

/**
 * Toggle the open/closed state of a `.klods-nav--collapse` element.
 * Pass the toggle button element (or any element inside the nav) as the argument.
 *
 * @example
 * navToggle({ onClick: (e) => toggleNav(e.currentTarget as HTMLElement) })
 */
export function toggleNav(targetEl: HTMLElement): void {
  const navEl = targetEl.closest(".klods-nav--collapse") as HTMLElement | null;
  if (!navEl) return;
  if (navEl.hasAttribute("data-nav-open")) {
    navEl.removeAttribute("data-nav-open");
  } else {
    navEl.setAttribute("data-nav-open", "");
  }
}
export type TocProps = { sub?: boolean };
export const toc = builder<TocProps>({ tag: "ul", base: "klods-toc", modifiers: { sub: "klods-toc--sub" } });
export const tocItem = tagBuilder("li");
export const tocLink = tagBuilder("a");

export type NavLinkProps = {
  href?: string;
  active?: boolean;
};
const navLinkBuilder = builder<NavLinkProps>({
  tag: "a",
  base: "klods-nav__link",
  modifiers: { active: "klods-nav__link--active" },
});
export function navLink(props?: (NavLinkProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function navLink(children: KlodsChild | KlodsChild[]): KlodsNode;
export function navLink(
  a?: (NavLinkProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<NavLinkProps & KlodsAttrs>(a, b);
  // Wrap each link in <li> so it's idiomatic inside <ul class="klods-nav__list">.
  return el("li", {}, [navLinkBuilder(props, children)]);
}

// ── Card ─────────────────────────────────────────────────────────────────
export type CardProps = {
  elevated?: boolean;
};
export const card = builder<CardProps>({
  tag: "div",
  base: "klods-card",
  modifiers: { elevated: "klods-card--elevated" },
});
export const cardTitle = builder({ tag: "h3", base: "klods-card__title" });
export const cardBody = builder({ tag: "div", base: "klods-card__body" });
export const cardFooter = builder({ tag: "div", base: "klods-card__footer" });

// ── Button ───────────────────────────────────────────────────────────────
export type ButtonProps = {
  variant?: "default" | "primary" | "danger" | "ghost";
  type?: "button" | "submit" | "reset";
};
const buttonBase = builder<ButtonProps>({
  tag: "button",
  base: "klods-button",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-button--${v}` : undefined),
  },
});
export function button(): KlodsNode;
export function button(children: KlodsChild | KlodsChild[]): KlodsNode;
export function button(props: (ButtonProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function button(
  a?: (ButtonProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ButtonProps & KlodsAttrs>(a, b);
  // Default `type="button"` so it never accidentally submits a form.
  const merged = { type: "button", ...props } as ButtonProps & KlodsAttrs;
  return buttonBase(merged, children);
}

// ── Badge ────────────────────────────────────────────────────────────────
export type BadgeProps = {
  variant?: "default" | "accent" | "success" | "danger";
};
export const badge = builder<BadgeProps>({
  tag: "span",
  base: "klods-badge",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-badge--${v}` : undefined),
  },
});

// ── Alert ────────────────────────────────────────────────────────────────
export type AlertProps = {
  variant?: "default" | "info" | "success" | "warning" | "danger";
};
const alertBase = builder<AlertProps>({
  tag: "div",
  base: "klods-alert",
  modifiers: {
    variant: (v) => (v && v !== "default" ? `klods-alert--${v}` : undefined),
  },
});
export function alert(): KlodsNode;
export function alert(children: KlodsChild | KlodsChild[]): KlodsNode;
export function alert(props: (AlertProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function alert(
  a?: (AlertProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<AlertProps & KlodsAttrs>(a, b);
  // role=alert by default for assistive tech, overridable.
  const merged = { role: "alert", ...props } as AlertProps & KlodsAttrs;
  return alertBase(merged, children);
}

// ── Prose helpers ────────────────────────────────────────────────────────
export const prose = builder({ tag: "div", base: "klods-prose" });
export const muted = builder({ tag: "span", base: "klods-muted" });
export const lead = builder({ tag: "p", base: "klods-lead" });
export const textCenter = builder({ tag: "div", base: "klods-text-center" });

// ── Table ────────────────────────────────────────────────────────────────
export type TableProps = {
  striped?: boolean;
  dense?: boolean;
};
export const tableWrap = builder({ tag: "div", base: "klods-table-wrap" });
export const table = builder<TableProps>({
  tag: "table",
  base: "klods-table",
  modifiers: {
    striped: "klods-table--striped",
    dense: "klods-table--dense",
  },
});
export const thead = tagBuilder("thead");
export const tbody = tagBuilder("tbody");
export const tr = tagBuilder("tr");
export const th = tagBuilder("th");
export const td = tagBuilder("td");

// ── Forms ────────────────────────────────────────────────────────────────

// Converts a label string to a stable, URL-safe id segment.
// "Email address" → "email-address", "First name" → "first-name"
// Falls back to a djb2 hash when the label produces no alphanumeric slug
// (e.g. empty string or all-symbol text), keeping IDs deterministic.
function slugId(prefix: string, text: string): string {
  const safe = text ?? "";
  const slug = safe
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (slug) return `${prefix}-${slug}`;
  let h = 5381;
  for (let i = 0; i < safe.length; i++) h = ((h << 5) + h + safe.charCodeAt(i)) | 0;
  return `${prefix}-${(h >>> 0).toString(36)}`;
}

export const form = builder({ tag: "form", base: "klods-form" });

export type FieldProps = {
  /** Label text shown above the control. */
  label: string;
  /** Explicit id for the control. Auto-generated when omitted. */
  id?: string;
  /** Hint text shown below the control. Hidden when the field is invalid. */
  help?: string;
  /** Validation error. When present the field is rendered in its invalid state. */
  error?: string;
  /** Appends a * marker to the label. */
  required?: boolean;
  /** Force invalid state without providing error text. */
  invalid?: boolean;
};

// Form controls that can directly carry aria-describedby / aria-invalid.
const FORM_CONTROLS = new Set(["input", "select", "textarea"]);

// Injects aria attrs onto the node itself if it's a form control, or onto the
// first form-control child if it's a wrapper (e.g. the range / color wrappers).
function patchAriaAttrs(node: KlodsNode, attrs: KlodsAttrs): KlodsNode {
  if (FORM_CONTROLS.has(node.tag)) {
    return new KlodsNode(node.tag, { ...node.attrs, ...attrs }, node.children);
  }
  const patchedChildren = node.children.map((child) =>
    child instanceof KlodsNode && FORM_CONTROLS.has(child.tag)
      ? new KlodsNode(child.tag, { ...child.attrs, ...attrs }, child.children)
      : child
  );
  return new KlodsNode(node.tag, node.attrs, patchedChildren);
}

/**
 * Opinionated field wrapper. Renders a label, the control, and optional
 * help / error text. Automatically wires `for`, `id`, `aria-describedby`,
 * and `aria-invalid` so you don't have to.
 *
 * Pass a render function that receives the generated (or explicit) `id`:
 * ```ts
 * field({ label: "Email", required: true }, (id) =>
 *   input({ id, type: "email" }),
 * )
 * ```
 */
export function field(props: FieldProps & KlodsAttrs, renderInput: (id: string) => KlodsNode): KlodsNode {
  const { label: labelText, id: explicitId, help, error, required, invalid, class: extraClass, ...rest } = props;
  const id = explicitId ?? slugId("klods-field", labelText);
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const isInvalid = invalid ?? !!error;

  // When invalid, .klods-help is hidden by CSS — only reference the visible error.
  // When valid, .klods-error is absent — only reference help text if present.
  const describedBy = isInvalid ? errorId : helpId;

  // Inject aria attrs onto the control (or its first form-control child for wrappers).
  const inputNode = renderInput(id);
  const patchedInput = patchAriaAttrs(inputNode, {
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(isInvalid ? { "aria-invalid": "true" } : {}),
  });

  const fieldClass = classNames([
    "klods-field",
    isInvalid ? "klods-field--invalid" : "",
    classNames(extraClass as KlodsAttrs["class"]),
  ]);

  const children: KlodsNode[] = [
    el("label", { for: id, class: `klods-label${required ? " klods-label--required" : ""}` }, labelText),
    patchedInput,
  ];
  if (help) children.push(el("p", { id: helpId, class: "klods-help" }, help));
  if (error) children.push(el("p", { id: errorId, class: "klods-error", role: "alert" }, error));

  return el("div", { ...rest, class: fieldClass || undefined }, children);
}

export type InputProps = {
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "range"
    | "color"
    | "file"
    | "hidden";
};
export function input(props: InputProps & KlodsAttrs): KlodsNode {
  const { type, class: extraClass, oninput: userOninput, ...rest } = props;
  const cls = (extra: string) =>
    classNames(["klods-input", extra, classNames(extraClass as KlodsAttrs["class"])]) || undefined;

  const id =
    (rest.id as string | undefined) ??
    slugId(
      "klods-input",
      (rest["aria-label"] as string | undefined) ?? (rest.placeholder as string | undefined) ?? type ?? "field"
    );

  if (type === "range") {
    const initial = (rest.value as string) ?? "50";
    return el("span", { class: cls("klods-input--range") }, [
      el("input", {
        type: "range",
        ...rest,
        id,
        oninput: (e: Event) => {
          const inp = e.target as HTMLInputElement;
          inp.closest(".klods-input--range")?.querySelector("output")?.textContent !== undefined &&
            (inp.closest(".klods-input--range")!.querySelector("output")!.textContent = inp.value);
          (userOninput as ((e: Event) => void) | undefined)?.(e);
        },
      }),
      el("output", { for: id }, initial),
    ]);
  }

  if (type === "color") {
    const initial = (rest.value as string) ?? "#000000";
    return el("span", { class: cls("klods-input--color") }, [
      el("input", {
        type: "color",
        ...rest,
        id,
        oninput: (e: Event) => {
          const inp = e.target as HTMLInputElement;
          inp.closest(".klods-input--color")?.querySelector("output")?.textContent !== undefined &&
            (inp.closest(".klods-input--color")!.querySelector("output")!.textContent = inp.value);
          (userOninput as ((e: Event) => void) | undefined)?.(e);
        },
      }),
      el("output", { for: id }, initial),
    ]);
  }

  return new KlodsNode("input", {
    type,
    ...rest,
    id,
    class: cls(""),
  });
}

const selectEl = builder({ tag: "select", base: "klods-select" });
export function select(): KlodsNode;
export function select(children: KlodsChild | KlodsChild[]): KlodsNode;
export function select(attrs: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function select(a?: KlodsAttrs | KlodsChild | KlodsChild[] | null, b?: KlodsChild | KlodsChild[]): KlodsNode {
  const [attrs, children] = normalizeArgs<KlodsAttrs>(a, b);
  // Wrap in a positioning parent so ::after can render the chevron arrow
  // via mask-image + var(--klods-color-muted) without a baked-in color.
  return el("div", { class: "klods-select-wrapper" }, selectEl(attrs, children));
}

export const option = tagBuilder("option");

export const textarea = builder({ tag: "textarea", base: "klods-textarea" });

// ── Checkbox ─────────────────────────────────────────────────────────────

export type CheckboxProps = {
  label: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
};
export function checkbox(props: CheckboxProps & KlodsAttrs): KlodsNode {
  const {
    label: labelText,
    name,
    value,
    checked,
    disabled,
    required,
    form,
    autofocus,
    class: extraClass,
    ...rest
  } = props as CheckboxProps & KlodsAttrs & { required?: boolean; form?: string; autofocus?: boolean };
  const inputAttrs: KlodsAttrs = { type: "checkbox" };
  if (name !== undefined) inputAttrs.name = name;
  if (value !== undefined) inputAttrs.value = value;
  if (checked) inputAttrs.checked = true;
  if (disabled) inputAttrs.disabled = true;
  if (required) inputAttrs.required = true;
  if (form !== undefined) inputAttrs.form = form;
  if (autofocus) inputAttrs.autofocus = true;

  return el(
    "label",
    { ...rest, class: classNames(["klods-checkbox", classNames(extraClass as KlodsAttrs["class"])]) || undefined },
    [el("input", inputAttrs), el("span", {}, labelText)]
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────

export type RadioProps = {
  label: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
};
export function radio(props: RadioProps & KlodsAttrs): KlodsNode {
  const {
    label: labelText,
    name,
    value,
    checked,
    disabled,
    required,
    form,
    autofocus,
    class: extraClass,
    ...rest
  } = props as RadioProps & KlodsAttrs & { required?: boolean; form?: string; autofocus?: boolean };
  const inputAttrs: KlodsAttrs = { type: "radio" };
  if (name !== undefined) inputAttrs.name = name;
  if (value !== undefined) inputAttrs.value = value;
  if (checked) inputAttrs.checked = true;
  if (disabled) inputAttrs.disabled = true;
  if (required) inputAttrs.required = true;
  if (form !== undefined) inputAttrs.form = form;
  if (autofocus) inputAttrs.autofocus = true;

  return el(
    "label",
    { ...rest, class: classNames(["klods-radio", classNames(extraClass as KlodsAttrs["class"])]) || undefined },
    [el("input", inputAttrs), el("span", {}, labelText)]
  );
}

// ── Radio group ───────────────────────────────────────────────────────────

export type RadioGroupProps = {
  /** Text shown as the group heading (maps to a styled `<p>` with aria-labelledby). */
  legend?: string;
};
export function radioGroup(props: RadioGroupProps & KlodsAttrs, children: KlodsNode[]): KlodsNode {
  const { legend: legendText, class: extraClass, ...rest } = props;
  const legendId = legendText ? slugId("klods-rg", legendText) : undefined;
  const cls = classNames(["klods-field", classNames(extraClass as KlodsAttrs["class"])]) || undefined;
  return el("div", { ...rest, class: cls, role: "group", ...(legendId ? { "aria-labelledby": legendId } : {}) }, [
    legendText ? el("p", { id: legendId, class: "klods-label" }, legendText) : null,
    ...children,
  ]);
}

// ── Switch ────────────────────────────────────────────────────────────────

export type SwitchProps = {
  label: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  /** Flips the layout: label on the left, track on the right. Ideal for settings panels. */
  reverse?: boolean;
};
export function switchInput(props: SwitchProps & KlodsAttrs): KlodsNode {
  const { label: labelText, name, value, checked, disabled, reverse, class: extraClass, ...rest } = props;
  const inputAttrs: KlodsAttrs = {
    type: "checkbox",
    class: "klods-switch__input",
    role: "switch",
  };
  if (name !== undefined) inputAttrs.name = name;
  if (value !== undefined) inputAttrs.value = value;
  if (checked) inputAttrs.checked = true;
  if (disabled) inputAttrs.disabled = true;

  return el(
    "label",
    {
      ...rest,
      class:
        classNames([
          "klods-switch",
          reverse ? "klods-switch--reverse" : "",
          classNames(extraClass as KlodsAttrs["class"]),
        ]) || undefined,
    },
    [
      el("input", inputAttrs),
      el("span", { class: "klods-switch__track" }),
      el("span", { class: "klods-switch__label" }, labelText),
    ]
  );
}

// ── Code ─────────────────────────────────────────────────────────────────
export function codeBlock(): KlodsNode;
export function codeBlock(content: KlodsChild | KlodsChild[]): KlodsNode;
export function codeBlock(attrs: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode;
export function codeBlock(a?: KlodsAttrs | KlodsChild | KlodsChild[] | null, b?: KlodsChild | KlodsChild[]): KlodsNode {
  const [attrs, content] = normalizeArgs<KlodsAttrs>(a, b);
  return el("pre", attrs, el("code", {}, content));
}

// ── Modal ─────────────────────────────────────────────────────────────────
// Built on the native <dialog> element. Use openModal() / closeModal() to
// show and hide. openModal() calls .showModal() so the dialog is top-layer
// with a backdrop; closeModal() calls .close().

export type ModalProps = {
  /** When true, renders the dialog with the `open` attribute (non-modal inline display). */
  open?: boolean;
};
export function modal(): KlodsNode;
export function modal(children: KlodsChild | KlodsChild[]): KlodsNode;
export function modal(props: (ModalProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function modal(
  a?: (ModalProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ModalProps & KlodsAttrs>(a, b);
  const { open, class: extraClass, ...rest } = props ?? {};
  const attrs: KlodsAttrs = {
    ...rest,
    class: classNames(["klods-modal", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
  };
  if (open) attrs.open = true;
  return el("dialog", attrs, children ?? []);
}

export const modalPanel = builder({ tag: "div", base: "klods-modal__panel" });
export const modalHeader = builder({ tag: "div", base: "klods-modal__header" });
export const modalTitle = builder({ tag: "h2", base: "klods-modal__title" });
export const modalBody = builder({ tag: "div", base: "klods-modal__body" });
export const modalActions = builder({ tag: "div", base: "klods-modal__actions" });

/** Close button — the × icon is provided by CSS via a ::before mask-image. */
export function modalClose(props?: KlodsAttrs | null): KlodsNode {
  const { class: extraClass, ...rest } = props ?? {};
  return el("button", {
    type: "button",
    "aria-label": "Close",
    ...rest,
    class: classNames(["klods-modal__close", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
  });
}

/**
 * Open a `.klods-modal` dialog as a modal overlay using the native `showModal()` API.
 * The element must already be mounted in the document (e.g. via `.render(document.body)`).
 * No-ops silently if the element is not a connected `<dialog>` or is already open.
 */
export function openModal(dialogEl: HTMLElement): void {
  if (!(dialogEl instanceof HTMLDialogElement) || !dialogEl.isConnected || dialogEl.open) return;
  dialogEl.showModal();
}

/**
 * Close a `.klods-modal` dialog. Pass the dialog element or any element inside it.
 */
export function closeModal(targetEl: HTMLElement): void {
  const dialogEl =
    targetEl instanceof HTMLDialogElement
      ? targetEl
      : (targetEl.closest("dialog.klods-modal") as HTMLDialogElement | null);
  if (!dialogEl?.open) return;
  dialogEl.close();
}
export function inlineCode(): KlodsNode;
export function inlineCode(content: KlodsChild | KlodsChild[]): KlodsNode;
export function inlineCode(attrs: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode;
export function inlineCode(
  a?: KlodsAttrs | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [attrs, content] = normalizeArgs<KlodsAttrs>(a, b);
  return el("code", attrs, content);
}

// ── Box ──────────────────────────────────────────────────────────────────
export const box = builder({ tag: "div", base: "klods-box" });

// ── Tabs ─────────────────────────────────────────────────────────────────

export type TabPanelProps = {
  /** Label shown in the tab list button for this panel. */
  label?: string;
};

/**
 * One panel in a tabs widget. Pass an array of these to `tabs([...])`.
 * The `label` prop becomes the button text in the tab list.
 */
export function tabPanel(): KlodsNode;
export function tabPanel(children: KlodsChild | KlodsChild[]): KlodsNode;
export function tabPanel(props: (TabPanelProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function tabPanel(
  a?: (TabPanelProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<TabPanelProps & KlodsAttrs>(a, b);
  const { label, ...rest } = props ?? {};
  // Store label as a data attribute so tabs() can read it back from the node.
  return el("div", { "data-tab-label": label, ...rest }, children);
}

/**
 * Activate a tab button — updates `aria-selected`, the active class, and
 * shows/hides the associated panels. Called automatically by `tabs()`; only
 * export needed when wiring up tabs manually without the builder.
 */
export function activateTab(tabEl: HTMLElement): void {
  const tabList = tabEl.closest("[role='tablist']") as HTMLElement | null;
  if (!tabList) return;
  const container = tabList.closest(".klods-tabs") as HTMLElement | null;
  if (!container) return;

  const allTabs = Array.from(tabList.querySelectorAll<HTMLElement>("[role='tab']"));
  allTabs.forEach((t) => {
    t.setAttribute("aria-selected", "false");
    t.classList.remove("klods-tabs__tab--active");
    t.setAttribute("tabindex", "-1");
  });

  tabEl.setAttribute("aria-selected", "true");
  tabEl.classList.add("klods-tabs__tab--active");
  tabEl.removeAttribute("tabindex");

  const panelId = tabEl.getAttribute("aria-controls");
  // :scope > limits the query to direct children of this container,
  // so nested tabs() instances are never touched.
  container.querySelectorAll<HTMLElement>(":scope > .klods-tabs__panel[role='tabpanel']").forEach((p) => {
    if (p.id === panelId) {
      p.removeAttribute("hidden");
    } else {
      p.setAttribute("hidden", "");
    }
  });
}

function handleTabKeydown(e: KeyboardEvent): void {
  const tabEl = e.currentTarget as HTMLElement;
  const tabList = tabEl.closest("[role='tablist']") as HTMLElement | null;
  if (!tabList) return;
  const allTabs = Array.from(tabList.querySelectorAll<HTMLElement>("[role='tab']"));
  const idx = allTabs.indexOf(tabEl);
  let next: number | null = null;

  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = (idx + 1) % allTabs.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = (idx - 1 + allTabs.length) % allTabs.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = allTabs.length - 1;
      break;
    default:
      return;
  }

  e.preventDefault();
  const nextTab = allTabs[next!];
  if (!nextTab) return;
  activateTab(nextTab);
  nextTab.focus();
}

/**
 * Accessible tabs widget. Pass an array of `tabPanel()` nodes; the builder
 * wires up the tablist, ARIA roles, keyboard navigation, and show/hide logic.
 *
 * @example
 * tabs([
 *   tabPanel({ label: "Account" }, p("Account settings")),
 *   tabPanel({ label: "Security" }, p("Security settings")),
 * ])
 */
export function tabs(): KlodsNode;
export function tabs(children: KlodsChild | KlodsChild[]): KlodsNode;
export function tabs(attrs: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function tabs(a?: KlodsAttrs | KlodsChild | KlodsChild[] | null, b?: KlodsChild | KlodsChild[]): KlodsNode {
  const [attrs, rawChildren] = normalizeArgs<KlodsAttrs>(a, b);
  const panels = (Array.isArray(rawChildren) ? rawChildren : rawChildren ? [rawChildren] : []).filter(
    (c): c is KlodsNode => c instanceof KlodsNode
  );

  const ns = attrs?.id ? slugId("klods-tabs", String(attrs.id)) : "klods-tabs";

  const items = panels.map((panel, i) => {
    const label = (panel.attrs["data-tab-label"] as string | undefined) ?? `Tab ${i + 1}`;
    const tabId = slugId(`${ns}-tab`, `${label}-${i + 1}`);
    const panelId = slugId(`${ns}-panel`, `${label}-${i + 1}`);
    return { panel, label, tabId, panelId, active: i === 0 };
  });

  const tabList = el(
    "div",
    { class: "klods-tabs__list", role: "tablist" },
    items.map(({ label, tabId, panelId, active }) =>
      el(
        "button",
        {
          type: "button",
          role: "tab",
          id: tabId,
          "aria-selected": String(active),
          "aria-controls": panelId,
          class: active ? "klods-tabs__tab klods-tabs__tab--active" : "klods-tabs__tab",
          tabindex: active ? undefined : "-1",
          onClick: (e: Event) => activateTab(e.currentTarget as HTMLElement),
          onKeydown: (e: KeyboardEvent) => handleTabKeydown(e),
        },
        label
      )
    )
  );

  const panelNodes = items.map(({ panel, tabId, panelId, active }) => {
    const {
      "data-tab-label": _label,
      class: panelExtraClass,
      ...panelAttrs
    } = panel.attrs as KlodsAttrs & {
      "data-tab-label"?: string;
    };
    return new KlodsNode(
      "div",
      {
        ...panelAttrs,
        class: classNames(["klods-tabs__panel", classNames(panelExtraClass as KlodsAttrs["class"])]) || undefined,
        role: "tabpanel",
        id: panelId,
        "aria-labelledby": tabId,
        ...(active ? {} : { hidden: true }),
      },
      panel.children
    );
  });

  const { class: extraClass, ...restAttrs } = attrs ?? {};
  return el(
    "div",
    { ...restAttrs, class: classNames(["klods-tabs", classNames(extraClass as KlodsAttrs["class"])]) || undefined },
    [tabList, ...panelNodes]
  );
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────

export type CrumbProps = {
  /** Href for linked crumbs. Omit for the current (last) crumb. */
  href?: string;
};

/**
 * One item in a breadcrumb trail. Pass to `breadcrumbs([...])`.
 * Supply `href` for linked ancestors; omit for the current page crumb.
 */
export function crumb(): KlodsNode;
export function crumb(children: KlodsChild | KlodsChild[]): KlodsNode;
export function crumb(props: (CrumbProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function crumb(
  a?: (CrumbProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<CrumbProps & KlodsAttrs>(a, b);
  const { href, ...rest } = props ?? {};
  // Store href as a data attribute so breadcrumbs() can read it back.
  return el("li", { "data-crumb-href": href, ...rest }, children);
}

/**
 * Accessible breadcrumb trail. Pass an array of `crumb()` nodes.
 * The last crumb is automatically marked with `aria-current="page"`.
 *
 * @example
 * breadcrumbs([
 *   crumb({ href: "/" }, "Home"),
 *   crumb({ href: "/products" }, "Products"),
 *   crumb("Widget"),
 * ])
 */
export function breadcrumbs(crumbs: KlodsNode[], attrs?: KlodsAttrs): KlodsNode {
  const items = crumbs.map((crumbNode, i) => {
    const isLast = i === crumbs.length - 1;
    const href = crumbNode.attrs["data-crumb-href"] as string | undefined;
    const {
      "data-crumb-href": _href,
      class: extraClass,
      ...restAttrs
    } = crumbNode.attrs as KlodsAttrs & {
      "data-crumb-href"?: string;
    };
    const content: KlodsChild[] =
      href && !isLast ? [el("a", { href, class: "klods-breadcrumb__link" }, crumbNode.children)] : crumbNode.children;
    return new KlodsNode(
      "li",
      {
        ...restAttrs,
        class: classNames(["klods-breadcrumb__item", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
        ...(isLast ? { "aria-current": "page" } : {}),
      },
      content
    );
  });

  const { class: extraClass, "aria-label": ariaLabel, ...restAttrs } = attrs ?? {};
  return el(
    "nav",
    {
      ...restAttrs,
      "aria-label": (ariaLabel as string | undefined) ?? "Breadcrumb",
      class: classNames(extraClass as KlodsAttrs["class"]) || undefined,
    },
    el("ol", { class: "klods-breadcrumb__list" }, items)
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────
// showToast() appends a toast into a .klods-toast-region at the bottom of
// <body>, creating the region on first call. The toast auto-dismisses after
// `duration` ms (default 5 s). Dismissal plays the exit animation then
// removes the element from the DOM.

export type ToastOptions = {
  /** Visual style. Defaults to "default" (no accent border). */
  variant?: "default" | "info" | "success" | "warning" | "danger";
  /** Auto-dismiss delay in milliseconds. Defaults to 5000. Pass 0 to keep indefinitely. */
  duration?: number;
};

function getOrCreateRegion(): HTMLElement {
  const existing = document.querySelector<HTMLElement>(".klods-toast-region");
  if (existing) return existing;
  const region = document.createElement("div");
  region.className = "klods-toast-region";
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "false");
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", "Notifications");
  document.body.appendChild(region);
  return region;
}

function dismissToast(toastEl: HTMLElement): void {
  toastEl.setAttribute("data-dismissing", "");

  // Read the actual animation duration from the --klods-transition token so the
  // fallback respects user overrides. Parse "150ms" / "0.15s" → milliseconds.
  const raw = getComputedStyle(toastEl).getPropertyValue("--klods-transition").trim();
  const ms = raw.endsWith("ms") ? parseFloat(raw) : parseFloat(raw) * 1000;
  const fallbackMs = (Number.isFinite(ms) ? ms : 150) + 50; // small buffer past end

  // Cancel the fallback as soon as the animation fires naturally.
  const fallback = setTimeout(() => toastEl.remove(), fallbackMs);
  toastEl.addEventListener(
    "animationend",
    () => {
      clearTimeout(fallback);
      toastEl.remove();
    },
    { once: true }
  );
}

/**
 * Display a transient notification toast. Creates a `.klods-toast-region`
 * at the bottom-right of the viewport on first call.
 *
 * @example
 * showToast("File saved.")
 * showToast({ variant: "success" }, "Changes saved.")
 * showToast({ variant: "info" }, ["You have a ", a({ href: "/inbox" }, "new message.")])
 */
export function showToast(message: KlodsChild | KlodsChild[]): void;
export function showToast(options: ToastOptions, message: KlodsChild | KlodsChild[]): void;
export function showToast(a: ToastOptions | KlodsChild | KlodsChild[], b?: KlodsChild | KlodsChild[]): void {
  const [options, message] = normalizeArgs<ToastOptions>(a, b);
  const { variant = "default", duration = 5000 } = options;

  const region = getOrCreateRegion();

  const toastEl = document.createElement("div");
  toastEl.className = variant === "default" ? "klods-toast" : `klods-toast klods-toast--${variant}`;
  toastEl.setAttribute("role", "status");

  const body = document.createElement("span");
  body.className = "klods-toast__body";
  if (typeof message === "string" || typeof message === "number") {
    body.textContent = String(message);
  } else {
    el("span", {}, message).render(body);
  }
  toastEl.appendChild(body);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "klods-toast__close";
  closeBtn.setAttribute("aria-label", "Dismiss");
  closeBtn.addEventListener("click", () => dismissToast(toastEl));
  toastEl.appendChild(closeBtn);

  region.appendChild(toastEl);

  if (duration > 0) {
    setTimeout(() => dismissToast(toastEl), duration);
  }
}

/**
 * Remove all currently visible toasts immediately (no animation).
 * Useful for cleanup in docs previews or test environments.
 */
export function clearToasts(): void {
  document.querySelectorAll<HTMLElement>(".klods-toast-region").forEach((r) => r.remove());
}

// ── Tooltip ───────────────────────────────────────────────────────────────
// Absolutely positioned relative to .klods-tooltip (position: relative).
// Visibility is toggled via data-open — consistent with data-nav-open and
// data-sidebar-open elsewhere in klods. Event handlers are wired by the
// builder; call showTooltip / hideTooltip directly for programmatic control.

let _tooltipCounter = 0;

// WeakMap lets us cancel a pending hide when the mouse re-enters the wrapper
// before the delay expires (handles the visual gap between trigger and tip).
const _hideTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

function _doHideTooltip(tipEl: HTMLElement): void {
  tipEl.removeAttribute("data-open");
}

/**
 * Show a `.klods-tooltip__tip` element by setting `data-open`.
 * Cancels any pending hide timer so the tip stays visible if the pointer
 * re-enters before the delay expires.
 */
export function showTooltip(tipEl: HTMLElement): void {
  if (!tipEl?.classList.contains("klods-tooltip__tip")) return;
  const pending = _hideTimers.get(tipEl);
  if (pending !== undefined) {
    clearTimeout(pending);
    _hideTimers.delete(tipEl);
  }
  tipEl.setAttribute("data-open", "");
}

/**
 * Hide a `.klods-tooltip__tip` element after an optional delay (default 80 ms).
 * The delay gives the mouse time to travel from the trigger into the tip area
 * before the hide fires; `showTooltip` cancels it if the pointer re-enters.
 * Pass `delay: 0` to hide immediately.
 */
export function hideTooltip(tipEl: HTMLElement, delay = 80): void {
  if (!tipEl?.classList.contains("klods-tooltip__tip")) return;
  const pending = _hideTimers.get(tipEl);
  if (pending !== undefined) {
    clearTimeout(pending);
    _hideTimers.delete(tipEl);
  }
  if (delay > 0) {
    const timer = setTimeout(() => {
      _hideTimers.delete(tipEl);
      _doHideTooltip(tipEl);
    }, delay);
    _hideTimers.set(tipEl, timer);
  } else {
    _doHideTooltip(tipEl);
  }
}

export type TooltipProps = {
  /** Tooltip content — text or markup shown in the tip bubble. */
  tip: KlodsChild | KlodsChild[];
  /**
   * Preferred placement relative to the trigger. Defaults to `"above"`.
   * In browsers with CSS Anchor Positioning the tip auto-flips if it would
   * overflow the viewport; in fallback mode the absolute offset is fixed.
   */
  position?: "above" | "below" | "start" | "end";
};

// Tags that are natively keyboard-focusable (tabindex not required).
const FOCUSABLE_TAGS = new Set(["a", "button", "input", "select", "textarea", "summary"]);

function hasFocusableChild(children: KlodsChild | KlodsChild[]): boolean {
  const nodes = Array.isArray(children) ? children : [children];
  for (const child of nodes) {
    if (child instanceof KlodsNode) {
      if (FOCUSABLE_TAGS.has(child.tag)) return true;
      if (hasFocusableChild(child.children)) return true;
    }
  }
  return false;
}

/**
 * Accessible tooltip. Wraps any inline content; shows a tip bubble on hover
 * and keyboard focus. The tip is absolutely positioned relative to the wrapper;
 * visibility is toggled with `data-open`.
 *
 * @example
 * tooltip({ tip: "Saved to your account" }, button("Save"))
 * tooltip({ tip: "Required field", position: "end" }, span("*"))
 */
export function tooltip(props: TooltipProps & KlodsAttrs, children: KlodsChild | KlodsChild[]): KlodsNode {
  const { tip, position = "above", class: extraClass, ...rest } = props;
  const id = `klods-tip-${++_tooltipCounter}`;

  // If the children don't already contain a naturally focusable element,
  // make the wrapper itself focusable so keyboard users can reach the tip.
  const needsTabindex = !hasFocusableChild(children) && !("tabindex" in rest);

  // aria-describedby must be on the element that actually receives focus.
  // When the trigger is a single focusable KlodsNode, patch it directly so
  // assistive tech associates the tooltip with the focused control.
  let triggerChildren: KlodsChild | KlodsChild[] = children;
  if (!needsTabindex && children instanceof KlodsNode && FOCUSABLE_TAGS.has(children.tag)) {
    const existing = (children.attrs as KlodsAttrs)["aria-describedby"];
    const describedBy = existing ? `${String(existing)} ${id}` : id;
    triggerChildren = new KlodsNode(
      children.tag,
      { ...children.attrs, "aria-describedby": describedBy },
      children.children
    );
  }

  // Tip is absolutely positioned inside .klods-tooltip (position: relative).
  // Visibility is toggled via data-open, same as data-nav-open / data-sidebar-open.
  const tipNode = el(
    "span",
    {
      id,
      role: "tooltip",
      class: `klods-tooltip__tip klods-tooltip__tip--${position}`,
    },
    tip
  );

  return el(
    "span",
    {
      ...rest,
      class: classNames(["klods-tooltip", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
      // Only put aria-describedby on the wrapper when it is the focus target.
      // Otherwise it lives on the patched focusable child above.
      ...(needsTabindex ? { "aria-describedby": id, tabindex: "0" } : {}),
      // Show on pointer enter / keyboard focus-in.
      onMouseenter: (e: Event) => {
        const tip = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[role='tooltip']");
        if (tip) showTooltip(tip);
      },
      // Hide on pointer leave — a short delay lets the mouse cross the gap
      // between trigger and tip before the popover dismisses.
      onMouseleave: (e: Event) => {
        const tip = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[role='tooltip']");
        if (tip) hideTooltip(tip);
      },
      // Keyboard: show when any child (or the wrapper itself) receives focus.
      onFocusin: (e: Event) => {
        const tip = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[role='tooltip']");
        if (tip) showTooltip(tip);
      },
      // Keyboard: hide only when focus leaves the wrapper entirely.
      onFocusout: (e: Event) => {
        const wrapper = e.currentTarget as HTMLElement;
        const fe = e as FocusEvent;
        if (!wrapper.contains(fe.relatedTarget as Node | null)) {
          const tip = wrapper.querySelector<HTMLElement>("[role='tooltip']");
          if (tip) hideTooltip(tip, 0);
        }
      },
    },
    [triggerChildren, tipNode]
  );
}

// ── List ─────────────────────────────────────────────────────────────────
export type ListProps = {
  flush?: boolean;
};
export const list = builder<ListProps>({
  tag: "ul",
  base: "klods-list",
  modifiers: {
    flush: "klods-list--flush",
  },
});

export type ListItemProps = {
  /** Content for the leading slot (icon, avatar, badge, etc.). */
  lead?: KlodsChild | KlodsChild[];
  /** Content for the trailing slot (badge, action, status, etc.). */
  trail?: KlodsChild | KlodsChild[];
  /** When set, the item renders as a full-row link. */
  href?: string;
};
export function listItem(): KlodsNode;
export function listItem(children: KlodsChild | KlodsChild[]): KlodsNode;
export function listItem(props: (ListItemProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function listItem(
  a?: (ListItemProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ListItemProps & KlodsAttrs>(a, b);
  const { lead, trail, href, class: extraClass, ...rest } = props ?? {};
  const liCls =
    classNames([
      "klods-list__item",
      href !== undefined ? "klods-list__item--link" : "",
      classNames(extraClass as KlodsAttrs["class"]),
    ]) || undefined;

  const hasSlots = lead !== undefined || trail !== undefined;
  const buildSlots = (): KlodsChild[] => {
    const parts: KlodsChild[] = [];
    if (lead !== undefined) parts.push(el("span", { class: "klods-list__lead" }, lead as KlodsChild));
    parts.push(el("span", { class: "klods-list__content" }, children ?? []));
    if (trail !== undefined) parts.push(el("span", { class: "klods-list__trail" }, trail as KlodsChild));
    return parts;
  };

  if (href !== undefined) {
    const linkContent = hasSlots ? buildSlots() : (children ?? []);
    return el("li", { class: liCls }, [el("a", { href, class: "klods-list__link", ...rest }, linkContent)]);
  }
  if (hasSlots) return el("li", { ...rest, class: liCls }, buildSlots());
  return el("li", { ...rest, class: liCls }, children ?? []);
}

// ── Details ───────────────────────────────────────────────────────────────
// Thin builders over the native <details>/<summary> elements.
// No JS required — the browser handles open/close natively.
export type DetailsProps = { open?: boolean };
export const details = builder<DetailsProps>({ tag: "details", base: "klods-details" });
export const summary = tagBuilder("summary");
