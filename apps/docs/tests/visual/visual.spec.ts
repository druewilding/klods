import { expect, test } from "@playwright/test";

const THEMES = [
  { name: "default", param: "" },
  { name: "dark", param: "dark" },
  { name: "playful", param: "playful" },
  { name: "brutalist", param: "brutalist" },
] as const;

for (const { name: theme, param } of THEMES) {
  test(`${theme} theme`, async ({ page }) => {
    const url = param ? `/klods/?theme=${param}` : "/klods/";
    await page.goto(url);

    const examples = page.locator(".docs-example");
    const count = await examples.count();

    for (let i = 0; i < count; i++) {
      const example = examples.nth(i);
      const id = (await example.getAttribute("id")) ?? `example-${i}`;
      const preview = example.locator(".docs-example__preview");

      await preview.scrollIntoViewIfNeeded();
      await expect(preview).toHaveScreenshot([theme, `${id}.png`]);
    }
  });
}
