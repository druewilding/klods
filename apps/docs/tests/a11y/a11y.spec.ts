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

    const examples = page.locator(".docs-example");
    const count = await examples.count();

    for (let i = 0; i < count; i++) {
      const example = examples.nth(i);
      const id = (await example.getAttribute("id")) ?? `example-${i}`;

      const results = await new AxeBuilder({ page })
        .include(`#${id} .docs-example__preview`)
        // The docs page itself has a <main>, so layout examples that also use
        // <main> trigger false "duplicate landmark" warnings. These rules are
        // document-level and can't meaningfully apply to embedded previews.
        .disableRules(["landmark-main-is-top-level", "landmark-no-duplicate-main"])
        .analyze();

      expect.soft(results.violations, `a11y violations in #${id} (${theme} theme)`).toEqual([]);
    }
  });
}
