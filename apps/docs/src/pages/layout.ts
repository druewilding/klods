import type { KlodsNode } from "klods-js";
import { el, stack } from "klods-js";

export interface LayoutModule {
  label: string;
  anchor: string;
  examples: KlodsNode[];
}

// Eagerly import all layout files; numbered prefixes (01-, 02-…) preserve intentional order.
const modules = import.meta.glob<LayoutModule>("./layout/*.ts", { eager: true });

const layouts = Object.values(modules);

export type LayoutLink = { label: string; anchor: string };

export const layoutLinks: LayoutLink[] = layouts.map((m) => ({ label: m.label, anchor: m.anchor }));

export function renderLayoutSection(): KlodsNode {
  return stack({ gap: 5 }, [
    el("h2", {}, "Layout"),
    el("p", { class: "klods-lead" }, "The four corners of every page: header, sidebar, content, footer."),
    ...layouts.flatMap((m) => m.examples),
  ]);
}
