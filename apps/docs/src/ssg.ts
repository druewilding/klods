// SSG entry point — runs under Node as a CJS bundle after the browser build.
//
// The only browser API touched during shell().toString() is
// document.documentElement.getAttribute("data-theme") inside themeSwitcher().
// Stubbing it to return null gives aria-pressed="true" on the Default button,
// which is the correct pre-rendered default state.
//
// All other DOM access (event handlers, initThemeBuilder, etc.) lives inside
// function bodies that are never called during .toString(), so no further
// stubs are needed.

const docStub = { documentElement: { getAttribute: (_: string): string | null => null } };
(globalThis as Record<string, unknown>)["document"] = docStub;

import { shell } from "./shell.js";

export function render(): string {
  return shell().toString();
}
