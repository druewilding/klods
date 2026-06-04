/**
 * Vite plugin: inject pre-formatted render function source into example specs.
 *
 * Problem: fn.toString() in a bundled app returns esbuild's output, which
 * strips TypeScript types and reformats the code.
 *
 * Solution: run before esbuild (enforce: "pre"), use the TypeScript compiler
 * to find each `render: () => <body>` arrow function body, format it with
 * Prettier, and inject it as `_source: "..."` on the ExampleSpec object.
 * example.ts uses spec._source instead of fn.toString().
 */
import { format, resolveConfig } from "prettier";
import * as ts from "typescript";
import type { Plugin } from "vite";

export function exampleSourcePlugin(): Plugin {
  return {
    name: "klods-example-source",
    enforce: "pre",
    async transform(code: string, id: string) {
      const cleanId = id.split("?")[0];
      if (!cleanId.includes("/pages/") || !cleanId.endsWith(".ts")) return null;
      if (!code.includes("render:")) return null;
      try {
        return await injectSources(code, cleanId);
      } catch (e) {
        // Don't break the build — fall back to fn.toString() at runtime.
        console.warn(`[klods-example-source] Failed to process ${cleanId}:`, e);
        return null;
      }
    },
  };
}

async function injectSources(code: string, id: string): Promise<string | null> {
  const prettierConfig = (await resolveConfig(id)) ?? {};
  const sf = ts.createSourceFile("x.ts", code, ts.ScriptTarget.Latest, true);

  // Collect all render arrow function bodies.
  const entries: Array<{ insertAt: number; body: string }> = [];

  function visit(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "render" &&
      ts.isArrowFunction(node.initializer)
    ) {
      entries.push({
        insertAt: node.getStart(sf), // insert `_source:` just before `render:`
        body: node.initializer.body.getText(sf),
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  if (entries.length === 0) return null;

  // Process in reverse so insertions don't corrupt earlier positions.
  entries.reverse();

  let result = code;
  for (const { insertAt, body } of entries) {
    let formatted: string;
    try {
      formatted = (await format(body, { ...prettierConfig, parser: "typescript" })).trim();
    } catch {
      formatted = body.trim();
    }

    const lineStart = code.lastIndexOf("\n", insertAt) + 1;
    const indent = code.slice(lineStart, insertAt).match(/^[ \t]*/)?.[0] ?? "";
    const insertion = `_source: ${JSON.stringify(formatted)},\n${indent}`;
    result = result.slice(0, insertAt) + insertion + result.slice(insertAt);
  }

  return result;
}
