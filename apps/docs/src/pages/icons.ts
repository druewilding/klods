import type { KlodsNode } from "klods-js";
import { h2, p, stack } from "klods-js";

export interface IconModule {
  label: string;
  anchor: string;
  examples: KlodsNode[];
}

const modules = import.meta.glob<IconModule>("./icons/*.ts", { eager: true });

const icons = Object.values(modules);

export type IconLink = { label: string; anchor: string };

export const iconLinks: IconLink[] = icons.map((m) => ({ label: m.label, anchor: m.anchor }));

export function renderIconsSection(): KlodsNode {
  return stack({ gap: 5 }, [
    h2("Icons"),
    p({ class: "klods-lead" }, "Built-in SVG icons that inherit color from context via currentColor."),
    ...icons.flatMap((m) => m.examples),
  ]);
}
