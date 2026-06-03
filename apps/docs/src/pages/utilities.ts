import type { KlodsNode } from "klods-js";
import { h2, p, stack } from "klods-js";

export interface UtilityModule {
  label: string;
  anchor: string;
  examples: KlodsNode[];
}

// Eagerly import all utility files; numbered prefixes (01-, 02-…) preserve intentional order.
const modules = import.meta.glob<UtilityModule>("./utilities/*.ts", { eager: true });

const utilities = Object.values(modules);

export type UtilityLink = { label: string; anchor: string };

export const utilityLinks: UtilityLink[] = utilities.map((m) => ({ label: m.label, anchor: m.anchor }));

export function renderUtilitiesSection(): KlodsNode {
  return stack({ gap: 5 }, [
    h2("Utilities"),
    p({ class: "klods-lead" }, "The “I always forget how to do this in CSS” classes."),
    ...utilities.flatMap((m) => m.examples),
  ]);
}
