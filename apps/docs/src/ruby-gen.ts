/**
 * Auto-convert a TypeScript klods render body to idiomatic Ruby.
 *
 * The conversion is best-effort and covers the patterns that actually appear in
 * the klods docs. For components that require JS-only APIs or are too complex to
 * auto-convert, pass `ruby: false` (to hide the pane) or `ruby: "..."` (manual
 * override) in the ExampleSpec.
 */

/** If the render body is a block statement ({ ... }), unwrap it and strip `const`/`return`/`;`. */
export function unwrapBlockBody(s: string): string {
  const trimmed = s.trimStart();
  if (!trimmed.startsWith("{")) return s;
  const inner = trimmed.slice(1, trimmed.lastIndexOf("}")).trim();
  return inner
    .replace(/\bconst\s+/g, "")
    .replace(/\breturn\s+/g, "")
    .replace(/;$/gm, "")
    .trim();
}

/** Remove TypeScript `as Type` casts: `expr as HTMLElement` → `expr`. */
export function removeTypeCasts(s: string): string {
  return s.replace(/\s+as\s+[A-Za-z][a-zA-Z0-9]*/g, "");
}

/** Remove TypeScript type annotations in function parameters: `(e: Event)` → `(e)`. */
export function removeTypeAnnotations(s: string): string {
  return s.replace(/(\b\w+)\s*:\s*[A-Z][a-zA-Z0-9<>\[\], |]*(?=[,)=\s])/g, "$1");
}

/** Remove event handler props (`onClick: ...`, `onSubmit: ...`) from object literals. */
export function removeEventHandlers(source: string): string {
  const result: string[] = [];
  let i = 0;
  let inString = false;
  let strChar = "";

  while (i < source.length) {
    const c = source.charAt(i);

    if (inString) {
      result.push(c);
      if (c === "\\") {
        i++;
        result.push(source.charAt(i));
        i++;
        continue;
      }
      if (c === strChar) inString = false;
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      inString = true;
      strChar = c;
      result.push(c);
      i++;
      continue;
    }

    if (/^on[A-Z]/.test(source.slice(i)) && /[\s{,]|^$/.test(source.charAt(i - 1))) {
      let j = i;
      while (j < source.length && source.charAt(j) !== ":") j++;
      j++;
      while (j < source.length && /[ \t]/.test(source.charAt(j))) j++;

      let depth = 0;
      let inStr2 = false;
      let strChar2 = "";
      while (j < source.length) {
        const ch = source.charAt(j);
        if (inStr2) {
          if (ch === "\\") j++;
          else if (ch === strChar2) inStr2 = false;
        } else {
          if (ch === '"' || ch === "'" || ch === "`") {
            inStr2 = true;
            strChar2 = ch;
          } else if ("([{".includes(ch)) {
            depth++;
          } else if (")]}".includes(ch)) {
            if (depth === 0) break;
            depth--;
          } else if (ch === "," && depth === 0) {
            break;
          }
        }
        j++;
      }

      if (source.charAt(j) === ",") j++;
      while (j < source.length && /[ \t\n\r]/.test(source.charAt(j))) j++;

      // Strip trailing comma from result if this was the last prop
      const resStr = result.join("");
      const nextCh = source.charAt(j);
      if (resStr.match(/,\s*$/) && (j >= source.length || nextCh === "}" || nextCh === ")")) {
        result.length = 0;
        result.push(resStr.replace(/,\s*$/, ""));
      }

      i = j;
    } else {
      result.push(source.charAt(i++));
    }
  }

  return result.join("");
}

/** Remove `({})` or `({},` when hash is now empty — leaves just `()` or `(`. */
export function cleanEmptyHashes(s: string): string {
  s = s.replace(/\(\s*\{\s*\}\s*,\s*/g, "(");
  s = s.replace(/\(\s*\{\s*\}\s*\)/g, "()");
  return s;
}

/**
 * Expand the `id` JS shorthand prop to explicit `id: id`.
 * This is the only shorthand that appears in the klods docs
 * (it comes from `(id) => builder({ id, ... })`).
 *
 * Uses `[ \t]*` (not `\s*`) so it never matches across a newline and
 * accidentally collapses a multi-line object literal to a single line.
 */
export function expandShorthandProps(s: string): string {
  // Same-line: { id, ... } → { id: id, ... }
  s = s.replace(/\{[ \t]*id(?!\s*:)([ \t]*,)/g, "{ id: id$1");
  // Same-line: { id } → { id: id }
  s = s.replace(/\{[ \t]*id(?!\s*:)[ \t]*\}/g, "{ id: id }");
  // Multi-line: id on its own line as a shorthand prop (followed by ,)
  s = s.replace(/^([ \t]*)id\b(?![ \t]*:)(?=[ \t]*,)/gm, "$1id: id");
  return s;
}

/** Convert `, (param) => body)` (last callback arg) to `) { |param| body }` or `do…end`. */
export function convertArrowsToBlocks(source: string): string {
  const result: string[] = [];
  let i = 0;

  while (i < source.length) {
    const rest = source.slice(i);
    const m = /^,(\s*)\((\w+)\)\s*=>\s*/.exec(rest);

    if (m) {
      const [fullMatch, , param] = m;
      const bodyStart = i + fullMatch.length;

      let j = bodyStart;
      let depth = 0;
      let inStr = false;
      let strChar = "";

      while (j < source.length) {
        const ch = source.charAt(j);
        if (inStr) {
          if (ch === "\\") j++;
          else if (ch === strChar) inStr = false;
        } else {
          if (ch === '"' || ch === "'" || ch === "`") {
            inStr = true;
            strChar = ch;
          } else if ("([{".includes(ch)) {
            depth++;
          } else if (")]}".includes(ch)) {
            if (depth === 0) break;
            depth--;
          }
        }
        j++;
      }

      const body = source.slice(bodyStart, j);
      const isMultiLine = fullMatch.includes("\n") || body.includes("\n");

      if (isMultiLine) {
        // Scan backward through the accumulated output to find the `(` that
        // opens the enclosing function call. That line's indentation is the
        // correct base for `end` and the block body — using the last line
        // of the output would be wrong when the options hash spans multiple
        // lines (e.g. the last line before the callback would be `  }`, not
        // the `field(` line).
        const sofar = result.join("");
        let scanDepth = 0;
        let indent = "";
        for (let k = sofar.length - 1; k >= 0; k--) {
          const ch = sofar.charAt(k);
          if (ch === ")" || ch === "]" || ch === "}") {
            scanDepth++;
          } else if (ch === "(" || ch === "[" || ch === "{") {
            if (scanDepth === 0 && ch === "(") {
              const prevNl = sofar.lastIndexOf("\n", k - 1);
              const lineText = sofar.slice(prevNl + 1, k);
              indent = /^[ \t]*/.exec(lineText)?.[0] ?? "";
              break;
            }
            if (scanDepth > 0) scanDepth--;
          }
        }
        const innerIndent = indent + "  ";

        // The arrow regex consumed the trailing `\n<indent>` before the body,
        // so the body starts directly with the expression (no leading newline).
        // Recover the original first-line indent from what the match consumed.
        const lastNlInMatch = fullMatch.lastIndexOf("\n");
        const firstLineIndentLen = lastNlInMatch >= 0 ? fullMatch.length - lastNlInMatch - 1 : 0;
        const bodyLines = body.trim().split("\n");
        const indented = bodyLines
          .map((l, idx) => {
            if (idx === 0) return innerIndent + l.trimStart();
            // Subsequent lines: remove the original leading indent, then add innerIndent
            const stripped = l.length >= firstLineIndentLen ? l.slice(firstLineIndentLen) : l.trimStart();
            return innerIndent + stripped;
          })
          .join("\n");

        result.push(`) do |${param}|\n${indented}\n${indent}end`);
      } else {
        result.push(`) { |${param}| ${body.trim()} }`);
      }

      i = j + 1;
    } else {
      result.push(source.charAt(i++));
    }
  }

  return result.join("");
}

/** Convert camelCase identifiers to snake_case, leaving string literals untouched. */
export function convertCamelIdentifiers(source: string): string {
  function toSnake(s: string): string {
    return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
  }

  let result = "";
  let i = 0;

  while (i < source.length) {
    const c = source.charAt(i);

    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < source.length) {
        if (source.charAt(j) === "\\") {
          j += 2;
          continue;
        }
        if (source.charAt(j) === c) {
          j++;
          break;
        }
        j++;
      }
      result += source.slice(i, j);
      i = j;
    } else {
      const idMatch = /^[a-z][a-zA-Z0-9]*/.exec(source.slice(i));
      if (idMatch) {
        const id = idMatch[0];
        result += /[A-Z]/.test(id) ? toSnake(id) : id;
        i += id.length;
      } else {
        result += c;
        i++;
      }
    }
  }

  return result;
}

/** Auto-convert a TypeScript render body to idiomatic Ruby. */
export function tsToRuby(tsSource: string): string {
  let s = tsSource;
  s = unwrapBlockBody(s);
  s = removeTypeCasts(s);
  s = removeTypeAnnotations(s);
  s = removeEventHandlers(s);
  s = cleanEmptyHashes(s);
  s = expandShorthandProps(s);
  s = convertArrowsToBlocks(s);
  s = convertCamelIdentifiers(s);
  s = s.replace(/\bnull\b/g, "nil");
  s = s.trim();
  // Prettier formats the render body as a TS statement (adds ";"); strip it.
  s = s.replace(/;$/, "");
  return s;
}
