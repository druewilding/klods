import type { KlodsAttrs, KlodsChild } from "../core.js";
import { classNames, el, KlodsNode, normalizeArgs } from "../core.js";
import { slugId } from "./_utils.js";

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
