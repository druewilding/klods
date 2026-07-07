import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("accessibility — every example", async ({ page }) => {
  await page.goto("/klods/");

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

    expect(results.violations, `a11y violations in #${id}`).toEqual([]);
  }
});
