import type { KlodsChild } from "../core.js";
import { el, normalizeArgs } from "../core.js";

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
