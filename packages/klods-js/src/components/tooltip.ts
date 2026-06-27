import type { KlodsAttrs, KlodsChild } from "../core.js";
import { classNames, el, KlodsNode } from "../core.js";

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
