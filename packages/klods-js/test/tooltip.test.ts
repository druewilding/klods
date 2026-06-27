import { describe, expect, it, vi } from "vitest";

import { button, hideTooltip, showTooltip, span, tooltip } from "../src/index.js";

describe("tooltip", () => {
  it("renders a .klods-tooltip wrapper containing the trigger and a tip span", () => {
    const html = tooltip({ tip: "Save now" }, button("Save")).toString();
    expect(html).toContain("klods-tooltip");
    expect(html).toContain('role="tooltip"');
    expect(html).toContain("klods-tooltip__tip");
    expect(html).toContain("Save now");
  });

  it("tip id matches aria-describedby on the focusable child", () => {
    const html = tooltip({ tip: "Hint" }, button("Go")).toString();
    const tipId = html.match(/id="([^"]+)"[^>]*role="tooltip"/)?.[1];
    expect(tipId).toBeTruthy();
    expect(html).toContain(`aria-describedby="${tipId}"`);
    // aria-describedby must be on the <button>, not on the wrapper <span>
    const wrapperTag = html.match(/^<span[^>]*>/)?.[0] ?? "";
    expect(wrapperTag).not.toContain("aria-describedby");
    const buttonTag = html.match(/<button[^>]*>/)?.[0] ?? "";
    expect(buttonTag).toContain(`aria-describedby="${tipId}"`);
  });

  it("adds tabindex=0 and aria-describedby on the wrapper for non-focusable content", () => {
    const html = tooltip({ tip: "Info" }, span("hover me")).toString();
    const wrapperTag = html.match(/^<span[^>]*>/)?.[0] ?? "";
    expect(wrapperTag).toContain('tabindex="0"');
    expect(wrapperTag).toContain("aria-describedby");
  });

  it("does not add tabindex when wrapping a focusable element", () => {
    const html = tooltip({ tip: "Info" }, button("Click")).toString();
    const wrapperTag = html.match(/^<span[^>]*>/)?.[0] ?? "";
    expect(wrapperTag).not.toContain("tabindex");
  });

  it("applies the position modifier class", () => {
    expect(tooltip({ tip: "T", position: "above" }, span("x")).toString()).toContain("klods-tooltip__tip--above");
    expect(tooltip({ tip: "T", position: "below" }, span("x")).toString()).toContain("klods-tooltip__tip--below");
    expect(tooltip({ tip: "T", position: "start" }, span("x")).toString()).toContain("klods-tooltip__tip--start");
    expect(tooltip({ tip: "T", position: "end" }, span("x")).toString()).toContain("klods-tooltip__tip--end");
  });

  it("defaults to position above", () => {
    const html = tooltip({ tip: "T" }, span("x")).toString();
    expect(html).toContain("klods-tooltip__tip--above");
  });

  it("appends to existing aria-describedby on the focusable child", () => {
    const html = tooltip({ tip: "Extra" }, button({ "aria-describedby": "existing-id" }, "Go")).toString();
    const buttonTag = html.match(/<button[^>]*>/)?.[0] ?? "";
    expect(buttonTag).toContain("existing-id");
    expect(buttonTag).toMatch(/aria-describedby="existing-id [^"]+"/);
  });

  it("showTooltip sets data-open on the tip element", () => {
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    expect(tipEl.hasAttribute("data-open")).toBe(false);
    showTooltip(tipEl);
    expect(tipEl.hasAttribute("data-open")).toBe(true);
  });

  it("hideTooltip removes data-open immediately when delay is 0", () => {
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    expect(tipEl.hasAttribute("data-open")).toBe(true);
    hideTooltip(tipEl, 0);
    expect(tipEl.hasAttribute("data-open")).toBe(false);
  });

  it("hideTooltip removes data-open after the default delay", () => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    hideTooltip(tipEl);
    expect(tipEl.hasAttribute("data-open")).toBe(true); // still open during delay
    vi.runAllTimers();
    vi.useRealTimers();
    expect(tipEl.hasAttribute("data-open")).toBe(false);
  });

  it("showTooltip cancels a pending hideTooltip", () => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    hideTooltip(tipEl); // schedule a hide
    showTooltip(tipEl); // cancel it
    vi.runAllTimers();
    vi.useRealTimers();
    expect(tipEl.hasAttribute("data-open")).toBe(true);
  });

  it("rapid hideTooltip calls don't accumulate stale timers", () => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    hideTooltip(tipEl);
    hideTooltip(tipEl); // second call cancels the first timer
    showTooltip(tipEl); // cancel current timer
    vi.runAllTimers();
    vi.useRealTimers();
    expect(tipEl.hasAttribute("data-open")).toBe(true);
  });

  it("showTooltip and hideTooltip no-op on non-tip elements", () => {
    const div = document.createElement("div");
    expect(() => showTooltip(div)).not.toThrow();
    expect(() => hideTooltip(div, 0)).not.toThrow();
  });
});
