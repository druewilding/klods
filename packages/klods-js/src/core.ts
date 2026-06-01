// Core — a tiny VDOM-ish node with two faces:
//   - .render(target?) → HTMLElement (uses real DOM)
//   - .toString()      → HTML string  (works in Node / Rails / SSR)
//
// Both are produced from the same KlodsNode tree, so the docs site can show the
// TS source, the rendered HTML and the live preview from one source of truth.

export type KlodsChild = string | number | bigint | boolean | null | undefined | KlodsNode | Node | RawHtml | KlodsChild[];

export type KlodsAttrs = {
  class?: string | string[] | Record<string, boolean | undefined> | undefined;
  id?: string | undefined;
  style?: string | Partial<CSSStyleDeclaration> | undefined;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
  // Allow any other HTML attribute or DOM event handler (onClick, onInput, …).
  [key: string]: unknown;
};

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

const RAW = Symbol("klods.raw");

export type RawHtml = { [RAW]: true; html: string };

/** Mark a string as already-escaped HTML; pass it as a child to inject as-is. */
export function raw(html: string): RawHtml {
  return { [RAW]: true, html };
}

function isRaw(value: unknown): value is RawHtml {
  return typeof value === "object" && value !== null && (value as { [RAW]?: unknown })[RAW] === true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Normalise a `class` value (string | array | record) into a clean string. */
export function classNames(input: KlodsAttrs["class"]): string {
  if (!input) return "";
  if (typeof input === "string") return input.trim();
  if (Array.isArray(input)) return input.filter(Boolean).join(" ").trim();
  return Object.entries(input)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k)
    .join(" ")
    .trim();
}

/** Merge two class values (used internally to combine builder defaults + user-supplied). */
export function mergeClasses(...inputs: Array<KlodsAttrs["class"]>): string {
  return inputs
    .map((c) => classNames(c))
    .filter(Boolean)
    .join(" ");
}

function styleToString(style: string | Partial<CSSStyleDeclaration>): string {
  if (typeof style === "string") return style;
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${String(v)}`)
    .join(";");
}

function flattenChildren(children: KlodsChild | KlodsChild[]): Array<Exclude<KlodsChild, KlodsChild[]>> {
  const out: Array<Exclude<KlodsChild, KlodsChild[]>> = [];
  const stack: KlodsChild[] = Array.isArray(children) ? [...children] : [children];
  while (stack.length) {
    const next = stack.shift();
    if (Array.isArray(next)) stack.unshift(...next);
    else if (next !== null && next !== undefined && next !== false && next !== true) out.push(next);
  }
  return out;
}

export class KlodsNode {
  readonly tag: string;
  readonly attrs: KlodsAttrs;
  readonly children: KlodsChild[];

  constructor(tag: string, attrs: KlodsAttrs = {}, children: KlodsChild | KlodsChild[] = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = Array.isArray(children) ? children : [children];
  }

  /** Render to a real DOM element. If `target` is given, append to it. */
  render(target?: Element | null): HTMLElement {
    const el = document.createElement(this.tag);
    for (const [name, value] of Object.entries(this.attrs)) {
      if (value === undefined || value === null || value === false) continue;
      if (name === "children") continue;
      if (name === "class") {
        const cls = classNames(value as KlodsAttrs["class"]);
        if (cls) el.setAttribute("class", cls);
        continue;
      }
      if (name === "style") {
        el.setAttribute("style", styleToString(value as string | Partial<CSSStyleDeclaration>));
        continue;
      }
      if (name.startsWith("on") && typeof value === "function") {
        el.addEventListener(name.slice(2).toLowerCase(), value as EventListener);
        continue;
      }
      if (value === true) {
        el.setAttribute(name, "");
        continue;
      }
      el.setAttribute(name, String(value));
    }
    for (const child of flattenChildren(this.children)) {
      if (child instanceof KlodsNode) el.appendChild(child.render());
      else if (typeof child === "object" && child !== null && "nodeType" in child) {
        el.appendChild(child as Node);
      } else if (isRaw(child)) {
        const tpl = document.createElement("template");
        tpl.innerHTML = child.html;
        el.appendChild(tpl.content);
      } else {
        el.appendChild(document.createTextNode(String(child)));
      }
    }
    if (target) target.appendChild(el);
    return el;
  }

  /** Render to a string of HTML. */
  toString(): string {
    const parts: string[] = [`<${this.tag}`];
    for (const [name, value] of Object.entries(this.attrs)) {
      if (value === undefined || value === null || value === false) continue;
      if (name === "children") continue;
      if (name.startsWith("on") && typeof value === "function") continue;
      if (name === "class") {
        const cls = classNames(value as KlodsAttrs["class"]);
        if (cls) parts.push(` class="${escapeAttr(cls)}"`);
        continue;
      }
      if (name === "style") {
        parts.push(` style="${escapeAttr(styleToString(value as string | Partial<CSSStyleDeclaration>))}"`);
        continue;
      }
      if (value === true) {
        parts.push(` ${name}`);
        continue;
      }
      parts.push(` ${name}="${escapeAttr(String(value))}"`);
    }
    if (VOID_TAGS.has(this.tag)) {
      parts.push(" />");
      return parts.join("");
    }
    parts.push(">");
    for (const child of flattenChildren(this.children)) {
      if (child instanceof KlodsNode) parts.push(child.toString());
      else if (isRaw(child)) parts.push(child.html);
      else if (typeof child === "object" && child !== null && "outerHTML" in child) {
        parts.push((child as Element).outerHTML);
      } else {
        parts.push(escapeHtml(String(child)));
      }
    }
    parts.push(`</${this.tag}>`);
    return parts.join("");
  }
}

/**
 * Generic element builder. Most consumers use the named builders (page, header, …)
 * rather than calling `el` directly, but it's exported as an escape hatch.
 */
export function el(tag: string, attrs: KlodsAttrs = {}, children: KlodsChild | KlodsChild[] = []): KlodsNode {
  return new KlodsNode(tag, attrs, children);
}

/**
 * Factory that produces a typed builder for a tag with a base class. Modifier
 * props are converted into `--modifier` BEM classes and stripped from the output
 * attributes; everything else passes through untouched, so consumers can attach
 * arbitrary `id`, `data-*`, `aria-*`, event handlers, `style`, etc.
 */
export function builder<P extends Record<string, unknown> = Record<never, never>>(options: {
  tag: string;
  base: string;
  /** Map of prop name → class (or function returning a class) when the prop is truthy. */
  modifiers?: { [K in keyof P]?: string | ((value: P[K]) => string | undefined) };
}): (props?: (P & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]) => KlodsNode {
  const { tag, base, modifiers = {} } = options;
  const modifierMap = modifiers as Record<string, string | ((value: unknown) => string | undefined) | undefined>;
  return (props, children) => {
    const userProps = (props ?? {}) as P & KlodsAttrs;
    const modClasses: string[] = [];
    const passthrough: KlodsAttrs = {};
    for (const [key, value] of Object.entries(userProps)) {
      const m = modifierMap[key];
      if (m !== undefined) {
        if (typeof m === "function") {
          const c = m(value);
          if (c) modClasses.push(c);
        } else if (value) {
          modClasses.push(m);
        }
      } else {
        passthrough[key] = value;
      }
    }
    const finalClass = mergeClasses(base, ...modClasses, userProps.class);
    const resolvedChildren =
      children !== undefined ? children : ((userProps.children as KlodsChild | KlodsChild[] | undefined) ?? []);
    delete passthrough.children;
    return new KlodsNode(tag, { ...passthrough, class: finalClass || undefined }, resolvedChildren);
  };
}
