import type { KlodsNode } from "klods-js";
import { codeBlock, inlineCode, kbd, p, samp, varEl } from "klods-js";

import { example } from "../../example.js";

export const label = "Code";
export const anchor = "code-inline";

export const examples: KlodsNode[] = [
  example({
    title: "Code — inline",
    render: () => p(["Run ", inlineCode("npm install klods-js klods-css"), " to get started."]),
  }),

  example({
    title: "Code — block",
    render: () =>
      codeBlock(
        'import { page, header, content } from "klods-js";\n\npage([\n  header("Hello"),\n  content("World"),\n]).render(document.body);'
      ),
  }),

  example({
    title: "KBD — keyboard input",
    description: "Use `kbd` to denote keyboard keys or combinations. Renders with a key-cap style.",
    render: () => p(["Press ", kbd("Cmd"), " + ", kbd("Shift"), " + ", kbd("P"), " to open the command palette."]),
  }),

  example({
    title: "Samp — sample output",
    description: "Use `samp` for sample output from a program or command.",
    render: () => p(["The command returned: ", samp("Error: cannot find module 'klods-js'")]),
  }),

  example({
    title: "Var — variable name",
    description: "Use `varEl` to mark up a variable or placeholder in code or prose. Renders in italic monospace.",
    render: () => p(["If ", varEl("count"), " exceeds ", varEl("maxRetries"), " then the process will terminate."]),
  }),

  example({
    title: "Code — combined",
    description: "All five inline code helpers together in context.",
    render: () =>
      p([
        "To start the dev server, press ",
        kbd("F5"),
        " or run ",
        inlineCode("npm run dev"),
        ". The output ",
        samp("Local: http://localhost:5173/"),
        " will appear in the terminal. The port is stored in ",
        varEl("PORT"),
        ".",
      ]),
  }),
];
