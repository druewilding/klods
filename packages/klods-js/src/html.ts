// Bare HTML tag shortcut builders.
//
// Each export is a one-liner over `tagBuilder()` that lets you write
//   `code("npm i klods-js")` instead of `el("code", {}, "npm i klods-js")`.
//
// Names that collide with klods component or layout exports
// (e.g. `nav`, `button`, `form`, `header`, `footer`, `section`, `table`,
// `input`, `select`, `option`, `textarea`, `thead`, `tbody`, `tr`, `th`, `td`)
// are intentionally not re-exported here — use the BEM components instead.

import { tagBuilder } from "./core.js";

// Inline / phrasing
export const a = tagBuilder("a");
export const span = tagBuilder("span");
export const strong = tagBuilder("strong");
export const em = tagBuilder("em");
export const small = tagBuilder("small");
export const code = tagBuilder("code");
export const mark = tagBuilder("mark");
export const sub = tagBuilder("sub");
export const sup = tagBuilder("sup");
export const time = tagBuilder("time");

// Block / flow
export const div = tagBuilder("div");
export const p = tagBuilder("p");
export const pre = tagBuilder("pre");
export const blockquote = tagBuilder("blockquote");
export const article = tagBuilder("article");
export const figure = tagBuilder("figure");
export const figcaption = tagBuilder("figcaption");
export const hr = tagBuilder("hr");
export const br = tagBuilder("br");

// Headings
export const h1 = tagBuilder("h1");
export const h2 = tagBuilder("h2");
export const h3 = tagBuilder("h3");
export const h4 = tagBuilder("h4");
export const h5 = tagBuilder("h5");
export const h6 = tagBuilder("h6");

// Lists
export const ul = tagBuilder("ul");
export const ol = tagBuilder("ol");
export const li = tagBuilder("li");

// Form bits not already covered by BEM components
export const label = tagBuilder("label");
export const fieldset = tagBuilder("fieldset");
export const legend = tagBuilder("legend");

// Media / embedded
export const img = tagBuilder("img");
export const video = tagBuilder("video");
export const audio = tagBuilder("audio");
export const source = tagBuilder("source");
export const iframe = tagBuilder("iframe");
