import { describe, expect, it } from "vitest";

import {
  cleanEmptyHashes,
  convertArrowsToBlocks,
  convertCamelIdentifiers,
  expandShorthandProps,
  removeEventHandlers,
  removeTypeCasts,
  removeTypeAnnotations,
  tsToRuby,
  unwrapBlockBody,
} from "../src/ruby-gen.js";

// ─── Individual steps ─────────────────────────────────────────────────────────

describe("unwrapBlockBody", () => {
  it("passes through a plain expression unchanged", () => {
    expect(unwrapBlockBody('button("Hello")')).toBe('button("Hello")');
  });

  it("strips { }, const, return, and semicolons from a block body", () => {
    const src = `{
  const x = button("A");
  return div([x]);
}`;
    // Indentation relative to the original block is preserved
    expect(unwrapBlockBody(src)).toBe('x = button("A")\n  div([x])');
  });
});

describe("removeTypeCasts", () => {
  it("removes `as Type` casts", () => {
    expect(removeTypeCasts("e.currentTarget as HTMLElement")).toBe("e.currentTarget");
  });

  it("leaves ordinary code unchanged", () => {
    expect(removeTypeCasts('button("Save")')).toBe('button("Save")');
  });
});

describe("removeTypeAnnotations", () => {
  it("removes `: TypeName` in function params", () => {
    expect(removeTypeAnnotations("(e: Event) => e.preventDefault()")).toBe("(e) => e.preventDefault()");
  });

  it("leaves object literal values starting with lowercase/quotes unchanged", () => {
    expect(removeTypeAnnotations('{ label: "Full name" }')).toBe('{ label: "Full name" }');
    expect(removeTypeAnnotations("{ gap: 4 }")).toBe("{ gap: 4 }");
  });
});

describe("removeEventHandlers", () => {
  it("removes onClick prop (non-last)", () => {
    // Trailing whitespace before the stripped prop is also removed
    expect(removeEventHandlers('button({ variant: "primary", onClick: () => alert("x") }, "Save")')).toBe(
      'button({ variant: "primary"}, "Save")'
    );
  });

  it("removes onClick prop (last prop)", () => {
    expect(removeEventHandlers('button({ onClick: () => alert("x") }, "Cancel")')).toBe('button({ }, "Cancel")');
  });

  it("removes onSubmit prop", () => {
    expect(removeEventHandlers('form({ onSubmit: (e) => e.preventDefault() }, [child])')).toBe(
      "form({ }, [child])"
    );
  });

  it("leaves non-event props untouched", () => {
    expect(removeEventHandlers('button({ variant: "primary" }, "OK")')).toBe('button({ variant: "primary" }, "OK")');
  });

  it("does not match event-like words inside strings", () => {
    expect(removeEventHandlers('button({ label: "onClick handler" })')).toBe(
      'button({ label: "onClick handler" })'
    );
  });
});

describe("cleanEmptyHashes", () => {
  it("removes ({}, ... pattern", () => {
    expect(cleanEmptyHashes('button({}, "Save")')).toBe('button("Save")');
  });

  it("removes ({}) pattern", () => {
    expect(cleanEmptyHashes("modal_close({})")).toBe("modal_close()");
  });

  it("handles whitespace inside braces", () => {
    expect(cleanEmptyHashes('button({ }, "Save")')).toBe('button("Save")');
  });

  it("handles multiline empty hash", () => {
    // The regex consumes whitespace after the empty hash including the indent before the next arg
    expect(cleanEmptyHashes("button(\n  {\n  },\n  \"Save\"\n)")).toBe('button("Save"\n)');
  });
});

describe("expandShorthandProps", () => {
  it("expands { id, ... } shorthand", () => {
    expect(expandShorthandProps('input({ id, type: "text" })')).toBe('input({ id: id, type: "text" })');
  });

  it("expands { id } shorthand (only key)", () => {
    expect(expandShorthandProps("select({ id }, [...])")).toBe("select({ id: id }, [...])");
  });

  it("does not touch explicit { id: id }", () => {
    expect(expandShorthandProps("input({ id: id })")).toBe("input({ id: id })");
  });

  it("does not affect array elements", () => {
    expect(expandShorthandProps("[button, dialog]")).toBe("[button, dialog]");
  });
});

describe("convertArrowsToBlocks", () => {
  it("converts single-line callback to inline block", () => {
    const input = 'field({ label: "Name" }, (id) => input({ id: id, type: "text" }))';
    const output = 'field({ label: "Name" }) { |id| input({ id: id, type: "text" }) }';
    expect(convertArrowsToBlocks(input)).toBe(output);
  });

  it("converts multi-line callback to do…end block at column 0", () => {
    const input = 'field({ label: "Email" }, (id) =>\n  input({ id: id, type: "email" })\n)';
    // field is at column 0 → end at column 0, body at 2 spaces
    const output = 'field({ label: "Email" }) do |id|\n  input({ id: id, type: "email" })\nend';
    expect(convertArrowsToBlocks(input)).toBe(output);
  });

  it("indents do…end relative to the calling function's column", () => {
    // field is inside an array, indented 2 spaces
    const input = 'stack([\n  field({ label: "Name" }, (id) =>\n    input({ id: id, type: "text" })\n  )\n])';
    const result = convertArrowsToBlocks(input);
    // end must align with field (2 spaces), body at 4 spaces
    expect(result).toContain("  field({ label: \"Name\" }) do |id|");
    expect(result).toContain("    input({ id: id, type: \"text\" })");
    expect(result).toContain("  end");
  });

  it("handles multiple callbacks in the same source", () => {
    const input = [
      'field({ label: "A" }, (id) => input({ id: id }))',
      ",",
      'field({ label: "B" }, (id) => input({ id: id }))',
    ].join("\n  ");
    const output = convertArrowsToBlocks(input);
    expect(output).toContain("}) { |id| input({ id: id }) }");
  });
});

describe("convertCamelIdentifiers", () => {
  it("converts camelCase builder names to snake_case", () => {
    expect(convertCamelIdentifiers('cardTitle("Hello")')).toBe('card_title("Hello")');
    expect(convertCamelIdentifiers("switchInput({})")).toBe("switch_input({})");
    expect(convertCamelIdentifiers("radioGroup({}, [])")).toBe("radio_group({}, [])");
  });

  it("does not modify string contents", () => {
    expect(convertCamelIdentifiers('button({ class: "myButtonClass" })')).toBe(
      'button({ class: "myButtonClass" })'
    );
  });

  it("does not modify lowercase-only identifiers", () => {
    expect(convertCamelIdentifiers('button({ variant: "primary" })')).toBe('button({ variant: "primary" })');
  });
});

// ─── Full pipeline ─────────────────────────────────────────────────────────────

describe("tsToRuby (full pipeline)", () => {
  it("converts a simple button example", () => {
    const ts = `cluster([
  button("Default"),
  button({ variant: "primary" }, "Primary"),
])`;
    const ruby = `cluster([
  button("Default"),
  button({ variant: "primary" }, "Primary"),
])`;
    expect(tsToRuby(ts)).toBe(ruby);
  });

  it("removes onClick and converts camelCase", () => {
    const ts = `button({ variant: "primary", onClick: () => alert("x") }, "Save")`;
    const ruby = tsToRuby(ts);
    // Trailing whitespace before the removed prop is also stripped
    expect(ruby).toBe('button({ variant: "primary"}, "Save")');
  });

  it("converts card example with sub-components", () => {
    const ts = `card([
  cardTitle("Hello"),
  cardBody("World"),
])`;
    expect(tsToRuby(ts)).toBe(`card([
  card_title("Hello"),
  card_body("World"),
])`);
  });

  it("converts field callbacks to Ruby blocks (single-line)", () => {
    const ts = `stack({ gap: 4 }, [
  field({ label: "Name" }, (id) => input({ id, type: "text" })),
])`;
    const ruby = tsToRuby(ts);
    expect(ruby).toContain('field({ label: "Name" }) { |id| input({ id: id, type: "text" }) }');
  });

  it("converts field callbacks to do…end blocks (multi-line)", () => {
    const ts = `field({ label: "Email", required: true }, (id) =>
  input({ id, type: "email", placeholder: "ari@example.com" })
)`;
    const ruby = tsToRuby(ts);
    expect(ruby).toBe(`field({ label: "Email", required: true }) do |id|
  input({ id: id, type: "email", placeholder: "ari@example.com" })
end`);
  });

  it("removes onSubmit from form and keeps children", () => {
    const ts = `form({ onSubmit: (e: Event) => e.preventDefault() }, [child])`;
    expect(tsToRuby(ts)).toBe("form([child])");
  });

  it("converts switchInput and radioGroup names", () => {
    expect(tsToRuby('switchInput({ label: "Dark mode", name: "dark-mode" })')).toBe(
      'switch_input({ label: "Dark mode", name: "dark-mode" })'
    );
    expect(tsToRuby('radioGroup({ legend: "Method" }, [])')).toBe('radio_group({ legend: "Method" }, [])');
  });

  it("unwraps block bodies and converts them", () => {
    const ts = `{
  const x = card(cardTitle("Hi"));
  return div([x]);
}`;
    const ruby = tsToRuby(ts);
    // Indentation relative to the original block is preserved
    expect(ruby).toBe(`x = card(card_title("Hi"))
  div([x])`);
  });

  it("replaces null with nil", () => {
    expect(tsToRuby("el(null)")).toBe("el(nil)");
  });

  it("strips the trailing semicolon Prettier adds to the expression", () => {
    // Prettier formats render bodies as TS statements, adding a trailing ";"
    expect(tsToRuby("stack([]);")).toBe("stack([])");
    expect(tsToRuby("button({ variant: \"primary\" }, \"Save\");")).toBe(
      "button({ variant: \"primary\" }, \"Save\")"
    );
  });

  it("converts field callbacks with correct do…end indentation inside an array", () => {
    const ts = `stack({ gap: 4 }, [
  field({ label: "Full name" }, (id) =>
    input({ id, type: "text", placeholder: "Ari Smith" })
  ),
  field({ label: "Email address" }, (id) =>
    input({ id, type: "email", placeholder: "ari@example.com" })
  ),
]);`;
    const ruby = tsToRuby(ts);
    expect(ruby).toContain("  field({ label: \"Full name\" }) do |id|");
    expect(ruby).toContain("    input({ id: id, type: \"text\", placeholder: \"Ari Smith\" })");
    expect(ruby).toContain("  end,");
    expect(ruby).toContain("  field({ label: \"Email address\" }) do |id|");
    expect(ruby).not.toContain(";");
  });
});
