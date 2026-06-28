import type { KlodsAttrs } from "../core.js";
import { builder, tagBuilder } from "../core.js";

export type TocProps = { sub?: boolean };
export const toc = builder<TocProps>({ tag: "ul", base: "klods-toc", modifiers: { sub: "klods-toc--sub" } });
export const tocItem = tagBuilder("li");

export type TocLinkProps = { active?: boolean };
export const tocLink = builder<TocLinkProps & KlodsAttrs>({
  tag: "a",
  base: "klods-toc__link",
  modifiers: { active: "klods-toc__link--active" },
});
