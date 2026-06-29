import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, classNames, el, KlodsNode, normalizeArgs, tagBuilder } from "../core.js";
import { slugId } from "./_utils.js";

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
          const hex = inp.value;
          const hexInp = inp.closest(".klods-input--color")?.querySelector<HTMLInputElement>(".klods-color-hex");
          if (hexInp) hexInp.value = hex;
          (userOninput as ((e: Event) => void) | undefined)?.(e);
        },
      }),
      el("input", {
        type: "text",
        class: "klods-color-hex",
        value: initial,
        maxlength: "7",
        spellcheck: "false",
        "aria-label": "Hex color value",
        oninput: (e: Event) => {
          const hexInp = e.target as HTMLInputElement;
          if (/^#[0-9a-fA-F]{6}$/.test(hexInp.value)) {
            const colorInp = hexInp
              .closest(".klods-input--color")
              ?.querySelector<HTMLInputElement>('[type="color"]');
            if (colorInp) {
              colorInp.value = hexInp.value;
              // Dispatch on the color input so userOninput fires with the right target.
              colorInp.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        },
      }),
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

// ── Checkbox ─────────────────────────────────────────────────────────────────

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

// ── Radio ─────────────────────────────────────────────────────────────────────

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

// ── Radio group ───────────────────────────────────────────────────────────────

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

// ── Switch ────────────────────────────────────────────────────────────────────

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
