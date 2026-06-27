import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, classNames, el, KlodsNode, normalizeArgs } from "../core.js";

export function codeBlock(): KlodsNode;
export function codeBlock(content: KlodsChild | KlodsChild[]): KlodsNode;
export function codeBlock(attrs: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode;
export function codeBlock(
  a?: KlodsAttrs | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [{ class: extraClass, ...attrs }, content] = normalizeArgs<KlodsAttrs>(a, b);
  return el(
    "pre",
    { ...attrs, class: classNames(["klods-pre", classNames(extraClass as KlodsAttrs["class"])]) || undefined },
    el("code", {}, content)
  );
}

export function inlineCode(): KlodsNode;
export function inlineCode(content: KlodsChild | KlodsChild[]): KlodsNode;
export function inlineCode(attrs: KlodsAttrs | null, content?: KlodsChild | KlodsChild[]): KlodsNode;
export function inlineCode(
  a?: KlodsAttrs | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [{ class: extraClass, ...attrs }, content] = normalizeArgs<KlodsAttrs>(a, b);
  return el(
    "code",
    { ...attrs, class: classNames(["klods-code", classNames(extraClass as KlodsAttrs["class"])]) || undefined },
    content
  );
}

export const kbd = builder({ tag: "kbd", base: "klods-kbd" });
export const samp = builder({ tag: "samp", base: "klods-samp" });
// Named `varEl` because `var` is a reserved word in TypeScript/JavaScript.
export const varEl = builder({ tag: "var", base: "klods-var" });
