import type { KlodsNode } from "klods-js";
import { h2, p, stack } from "klods-js";

export interface ComponentModule {
  label: string;
  anchor: string;
  examples: KlodsNode[];
}

// Eagerly import all component files; Vite sorts keys by path (alphabetical by filename).
const modules = import.meta.glob<ComponentModule>("./components/*.ts", { eager: true });

const components = Object.values(modules);

export type ComponentLink = { label: string; anchor: string };

export const componentLinks: ComponentLink[] = components.map((m) => ({ label: m.label, anchor: m.anchor }));

export function renderComponentsSection(): KlodsNode {
  return stack({ gap: 5 }, [
    h2("Components"),
    p({ class: "klods-lead" }, "Opinionated defaults; extend any of them with class, id, data-* etc."),
    ...components.flatMap((m) => m.examples),
  ]);
}
