import hljs from "highlight.js/lib/core";
import hljsTs from "highlight.js/lib/languages/typescript";
import hljsXml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("typescript", hljsTs);
hljs.registerLanguage("xml", hljsXml);

export default hljs;
