import hljs from "highlight.js/lib/core";
import hljsRuby from "highlight.js/lib/languages/ruby";
import hljsTs from "highlight.js/lib/languages/typescript";
import hljsXml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("typescript", hljsTs);
hljs.registerLanguage("ruby", hljsRuby);
hljs.registerLanguage("xml", hljsXml);

export default hljs;
