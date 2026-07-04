// Import the SCSS source directly so the docs site can run without a
// pre-built klods-css. In production consumers would just use `klods-css`.
import "klods-css/src/klods.scss";
import "./styles.css";

import { initThemeBuilder } from "./pages/themes.js";
import { shell } from "./shell.js";

// Restore theme from URL on load (before render so aria-pressed is correct)
const initialTheme = new URLSearchParams(location.search).get("theme") ?? "";
if (initialTheme) document.documentElement.setAttribute("data-theme", initialTheme);
else document.documentElement.removeAttribute("data-theme");

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app root");
// Replace the pre-rendered SSG content with the live JS-rendered version
// (which has event handlers). replaceChildren clears the static markup first.
root.replaceChildren(shell(initialTheme).render());
initThemeBuilder();
