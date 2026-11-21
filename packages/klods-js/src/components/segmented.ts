import type { KlodsAttrs } from "../core.js";
import { classNames, el, KlodsNode } from "../core.js";

/** An option's text, used as its value too, or its text and value separately. */
export type SegmentedOption = string | { label: string; value?: string; disabled?: boolean };

export type SegmentedProps = {
  /** The radio buttons' name, which the choice is sent under in a form. */
  name: string;
  options: SegmentedOption[];
  /** The value of the option that starts chosen. */
  value?: string;
  /**
   * Names the group for screen readers. Leave it out when a visible label names
   * the group instead, and pass that label's id as `aria-labelledby`.
   */
  label?: string;
  /** Turns off every option. */
  disabled?: boolean;
};

/**
 * A row of radio buttons drawn as one pill, for picking one of a few short
 * options. Arrow keys move between them, and the choice is sent with a form.
 */
export function segmented(props: SegmentedProps & KlodsAttrs): KlodsNode {
  const { name, options, value, label, disabled, class: extraClass, ...rest } = props;

  const items = options.map((option) => {
    const {
      label: text,
      value: optionValue = text,
      disabled: optionDisabled,
    } = typeof option === "string" ? { label: option } : option;
    const inputAttrs: KlodsAttrs = { type: "radio", class: "klods-segmented__input", name, value: optionValue };
    if (optionValue === value) inputAttrs.checked = true;
    if (disabled || optionDisabled) inputAttrs.disabled = true;
    return el("label", { class: "klods-segmented__option" }, [el("input", inputAttrs), text]);
  });

  return el(
    "div",
    {
      ...rest,
      role: "radiogroup",
      ...(label !== undefined ? { "aria-label": label } : {}),
      class: classNames(["klods-segmented", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
    },
    items
  );
}
