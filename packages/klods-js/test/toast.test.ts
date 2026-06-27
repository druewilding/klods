import { beforeEach, describe, expect, it, vi } from "vitest";

import { a, clearToasts, raw, showToast, span, strong } from "../src/index.js";

describe("showToast / clearToasts", () => {
  // Helpers to access the region element and individual toasts.
  function getRegion() {
    return document.querySelector<HTMLElement>(".klods-toast-region");
  }
  function getToasts() {
    return Array.from(document.querySelectorAll<HTMLElement>(".klods-toast"));
  }

  // Always start each test with a clean slate.
  beforeEach(() => {
    document.querySelectorAll(".klods-toast-region").forEach((r) => r.remove());
  });

  it("creates a .klods-toast-region on first call", () => {
    expect(getRegion()).toBeNull();
    showToast("Hello");
    expect(getRegion()).not.toBeNull();
  });

  it("reuses the same region across multiple calls", () => {
    showToast("First");
    showToast("Second");
    expect(document.querySelectorAll(".klods-toast-region").length).toBe(1);
    expect(getToasts().length).toBe(2);
  });

  it("region has role=region and aria-live=polite", () => {
    showToast("Hi");
    const region = getRegion()!;
    expect(region.getAttribute("role")).toBe("region");
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("aria-label")).toBe("Notifications");
  });

  it("renders a plain string message", () => {
    showToast("File saved.");
    const toast = getToasts()[0]!;
    expect(toast.querySelector(".klods-toast__body")?.textContent).toBe("File saved.");
  });

  it("renders a number message", () => {
    showToast(42);
    expect(getToasts()[0]!.querySelector(".klods-toast__body")?.textContent).toBe("42");
  });

  it("renders a raw() child without escaping", () => {
    showToast(raw("<em>bold</em>"));
    const body = getToasts()[0]!.querySelector(".klods-toast__body")!;
    expect(body.querySelector("em")?.textContent).toBe("bold");
  });

  it("renders a KlodsNode child", () => {
    showToast(strong("important"));
    const body = getToasts()[0]!.querySelector(".klods-toast__body")!;
    expect(body.querySelector("strong")?.textContent).toBe("important");
  });

  it("renders an array of mixed children", () => {
    showToast(["You have a ", a({ href: "#" }, "new message")]);
    const body = getToasts()[0]!.querySelector(".klods-toast__body")!;
    expect(body.textContent).toContain("You have a ");
    expect(body.querySelector("a")?.textContent).toBe("new message");
  });

  it("applies no variant modifier for the default variant", () => {
    showToast("Hi");
    const toast = getToasts()[0]!;
    expect(toast.className).toBe("klods-toast");
  });

  it.each(["info", "success", "warning", "danger"] as const)("applies .klods-toast--%s modifier", (variant) => {
    showToast({ variant }, "Hi");
    expect(getToasts()[0]!.classList.contains(`klods-toast--${variant}`)).toBe(true);
  });

  it("toast contains a dismiss button", () => {
    showToast("Hi");
    const btn = getToasts()[0]!.querySelector<HTMLElement>(".klods-toast__close");
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute("aria-label")).toBe("Dismiss");
  });

  it("clicking the dismiss button removes the toast", () => {
    showToast("Hi");
    const toast = getToasts()[0]!;
    const btn = toast.querySelector<HTMLElement>(".klods-toast__close")!;
    btn.click();
    // animationend won't fire in jsdom — the fallback timer removes it.
    // Advance time past the fallback window.
    vi.useFakeTimers();
    btn.click();
    vi.runAllTimers();
    vi.useRealTimers();
    expect(toast.isConnected).toBe(false);
  });

  it("auto-dismisses after the configured duration", () => {
    vi.useFakeTimers();
    showToast({ duration: 1000 }, "Bye");
    const toast = getToasts()[0]!;
    expect(toast.isConnected).toBe(true);
    vi.advanceTimersByTime(1000);
    // The auto-dismiss timer fires; animationend won't in jsdom so the fallback
    // timer (duration of --klods-transition + buffer) also needs to elapse.
    vi.runAllTimers();
    vi.useRealTimers();
    expect(toast.isConnected).toBe(false);
  });

  it("duration: 0 keeps the toast indefinitely", () => {
    vi.useFakeTimers();
    showToast({ duration: 0 }, "Sticky");
    const toast = getToasts()[0]!;
    vi.advanceTimersByTime(60_000);
    vi.useRealTimers();
    expect(toast.isConnected).toBe(true);
  });

  it("clearToasts() removes the region entirely", () => {
    showToast("First");
    showToast("Second");
    clearToasts();
    expect(getRegion()).toBeNull();
    expect(getToasts().length).toBe(0);
  });
});
