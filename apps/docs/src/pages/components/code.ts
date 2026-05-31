import type { KlodsNode } from "klods-js";
import { codeBlock, el, inlineCode } from "klods-js";

import { example } from "../../example.js";

export const label = "Code";
export const anchor = "code-inline";

export const examples: KlodsNode[] = [
  example({
    title: "Code — inline",
    render: () => el("p", {}, ["Run ", inlineCode({}, "npm install klods-js klods-css"), " to get started."]),
  }),

  example({
    title: "Code — block",
    render: () =>
      codeBlock(
        {},
        'import { page, header, content } from "klods-js";\n\npage({}, [\n  header({}, "Hello"),\n  content({}, "World"),\n]).render(document.body);'
      ),
  }),
];
