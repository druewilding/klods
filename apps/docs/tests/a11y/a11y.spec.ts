import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const THEMES = [
  { name: "default", param: "" },
  { name: "dark", param: "dark" },
  { name: "playful", param: "playful" },
  { name: "brutalist", param: "brutalist" },
] as const;

for (const { name: theme, param } of THEMES) {
  test(`accessibility — ${theme} theme`, async ({ page }) => {
    const url = param ? `/klods/?theme=${param}` : "/klods/";
    await page.goto(url);

    // One axe run over every preview is much faster than one run per example,
    // because each run sets axe up again and walks the whole document.
    const results = await new AxeBuilder({ page })
      .include(".docs-example__preview")
      // The docs page itself has a <main>, so layout examples that also use
      // <main> trigger false "duplicate landmark" warnings. And several
      // examples show the same landmark (two breadcrumb <nav>s, say), which
      // is fine because each one stands for a page of its own. These rules
      // are document-level and can't meaningfully apply to embedded previews.
      .disableRules(["landmark-main-is-top-level", "landmark-no-duplicate-main", "landmark-unique"])
      .analyze();

    // Group the problems by the example they're in, so failures still say where
    const byExample = new Map<string, typeof results.violations>();
    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        const selector = node.target.join(" ");
        const id = await page.evaluate(
          (sel) => document.querySelector(sel)?.closest(".docs-example")?.id ?? "unknown",
          selector
        );
        const list = byExample.get(id) ?? [];
        const existing = list.find((v) => v.id === violation.id);
        if (existing) existing.nodes.push(node);
        else list.push({ ...violation, nodes: [node] });
        byExample.set(id, list);
      }
    }

    for (const [id, violations] of byExample) {
      expect.soft(violations, `a11y violations in #${id} (${theme} theme)`).toEqual([]);
    }
  });
}
