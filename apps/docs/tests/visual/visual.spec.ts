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
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const examples = page.locator(".docs-example");
    const count = await examples.count();

    for (let i = 0; i < count; i++) {
      const example = examples.nth(i);
      const id = (await example.getAttribute("id")) ?? `example-${i}`;
      const preview = example.locator(".docs-example__preview");

      await preview.scrollIntoViewIfNeeded();
      // Each example sits wherever the examples above it end, often part way
      // through a pixel. Text and borders are drawn differently at different
      // fractions, so adding one example would change the screenshots of every
      // example below it. A margin of under a pixel moves each one down onto a
      // whole pixel, so its screenshot doesn't depend on what's above it.
      await preview.evaluate((el: HTMLElement) => {
        el.style.marginTop = "";
        // Its position on the page, not in the window: at the bottom of the
        // page the scroll position itself can be part way through a pixel
        const top = el.getBoundingClientRect().top + window.scrollY;
        el.style.marginTop = `${Math.ceil(top) - top}px`;
      });
      // Soft, so one run reports every changed example, not just the first
      await expect.soft(preview).toHaveScreenshot([theme, `${id}.png`]);
    }
  });
}
