// First wave of components: nav, card, button, badge, alert, prose helpers.
// All match the BEM classes shipped by klods-css.

import type { KlodsAttrs, KlodsChild } from "./core.js";
import { builder, classNames, el, raw, KlodsNode } from "./core.js";

// ── Nav ──────────────────────────────────────────────────────────────────
export const nav = builder({ tag: "nav", base: "klods-nav" });
export const navList = builder({ tag: "ul", base: "klods-nav__list" });
export const buttonGroup = builder({ tag: "div", base: "klods-button-group" });

const HAMBURGER_ICON = raw(
  `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect y="3" width="20" height="2" rx="1" fill="currentColor"/><rect y="9" width="20" height="2" rx="1" fill="currentColor"/><rect y="15" width="20" height="2" rx="1" fill="currentColor"/></svg>`
);

/**
 * Hamburger toggle button for `.klods-nav--collapse`. Renders a default
 * three-line icon; pass children to override. Wire up with `toggleNav`.
 */
export function navToggle(
  attrs?: KlodsAttrs | null,
  children?: KlodsChild | KlodsChild[]
): KlodsNode {
  return el(
    "button",
    { type: "button", "aria-label": "Toggle navigation", class: "klods-nav__toggle", ...(attrs ?? {}) },
    children ?? (HAMBURGER_ICON as unknown as KlodsChild)
  );
}

/**
 * Toggle the open/closed state of a `.klods-nav--collapse` element.
 * Pass the toggle button element (or any element inside the nav) as the argument.
 *
 * @example
 * navToggle({ onClick: (e) => toggleNav(e.currentTarget as HTMLElement) })
 */
export function toggleNav(el: HTMLElement): void {
  const navEl = el.closest(".klods-nav--collapse") as HTMLElement | null;
  if (!navEl) return;
  if (navEl.hasAttribute("data-nav-open")) {
    navEl.removeAttribute("data-nav-open");
  } else {
    navEl.setAttribute("data-nav-open", "");
  }
}
export type TocProps = { sub?: boolean };
export const toc = builder<TocProps>({ tag: "ul", base: "klods-toc", modifiers: { sub: "klods-toc--sub" } });
export const tocItem = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("li", attrs ?? {}, children);
export const tocLink = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("a", attrs ?? {}, children);

export type NavLinkProps = {
  href?: string;
  active?: boolean;
};
const navLinkBuilder = builder<NavLinkProps>({
  tag: "a",
  base: "klods-nav__link",
  modifiers: { active: "klods-nav__link--active" },
});
export function navLink(props?: (NavLinkProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // Wrap each link in <li> so it's idiomatic inside <ul class="klods-nav__list">.
  return el("li", {}, [navLinkBuilder(props ?? null, children)]);
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
export function button(props?: (ButtonProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // Default `type="button"` so it never accidentally submits a form.
  const merged = { type: "button", ...(props ?? {}) } as ButtonProps & KlodsAttrs;
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
export function alert(props?: (AlertProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // role=alert by default for assistive tech, overridable.
  const merged = { role: "alert", ...(props ?? {}) } as AlertProps & KlodsAttrs;
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
export const thead = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("thead", attrs ?? {}, children);
export const tbody = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("tbody", attrs ?? {}, children);
export const tr = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("tr", attrs ?? {}, children);
export const th = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("th", attrs ?? {}, children);
export const td = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("td", attrs ?? {}, children);

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
export function select(attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode {
  // Wrap in a positioning parent so ::after can render the chevron arrow
  // via mask-image + var(--klods-color-muted) without a baked-in color.
  return el("div", { class: "klods-select-wrapper" }, selectEl(attrs, children));
}

export const option = (attrs?: KlodsAttrs | null, children?: KlodsChild | KlodsChild[]): KlodsNode =>
  el("option", attrs ?? {}, children);

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
export function codeBlock(attrs?: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode {
  return el("pre", attrs ?? {}, el("code", {}, content));
}
export function inlineCode(attrs?: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode {
  return el("code", attrs ?? {}, content);
}

// ── Box ──────────────────────────────────────────────────────────────────
export const box = builder({ tag: "div", base: "klods-box" });
