import { describe, expect, it } from "vitest";

import { breadcrumbs, crumb } from "../src/index.js";

describe("breadcrumbs", () => {
  it("renders a nav > ol structure", () => {
    const html = breadcrumbs([crumb({ href: "/" }, "Home"), crumb("Now")]).toString();
    expect(html).toMatch(/^<nav /);
    expect(html).toContain("<ol ");
    expect(html).toContain("<li ");
  });

  it("nav has aria-label='Breadcrumb' by default", () => {
    const html = breadcrumbs([crumb("Only")]).toString();
    expect(html).toContain('aria-label="Breadcrumb"');
  });

  it("accepts a custom aria-label", () => {
    const html = breadcrumbs([crumb("Only")], { "aria-label": "You are here" }).toString();
    expect(html).toContain('aria-label="You are here"');
  });

  it("linked crumbs wrap their text in an <a>", () => {
    const html = breadcrumbs([crumb({ href: "/products" }, "Products"), crumb("Widget")]).toString();
    expect(html).toContain('href="/products"');
    expect(html).toContain('class="klods-breadcrumb__link"');
  });

  it("last crumb is never a link even when href is supplied", () => {
    const html = breadcrumbs([
      crumb({ href: "/" }, "Home"),
      crumb({ href: "/should-be-ignored" }, "Current"),
    ]).toString();
    // The last item must not contain an <a> tag.
    const items = html.split("<li");
    const lastItem = items[items.length - 1];
    expect(lastItem).not.toContain("<a ");
  });

  it("last crumb has aria-current='page'", () => {
    const html = breadcrumbs([crumb({ href: "/" }, "Home"), crumb("Now")]).toString();
    // Only the last <li> should carry aria-current.
    const liMatches = Array.from(html.matchAll(/<li [^>]*>/g)).map((m) => m[0]);
    const currentItems = liMatches.filter((tag) => tag.includes('aria-current="page"'));
    expect(currentItems).toHaveLength(1);
    // It must be the last <li>.
    expect(liMatches[liMatches.length - 1]).toContain('aria-current="page"');
  });

  it("non-last crumbs do not have aria-current", () => {
    const html = breadcrumbs([crumb({ href: "/" }, "Home"), crumb({ href: "/mid" }, "Mid"), crumb("End")]).toString();
    const liMatches = Array.from(html.matchAll(/<li [^>]*>/g)).map((m) => m[0]);
    // First two items must have no aria-current.
    expect(liMatches[0]).not.toContain("aria-current");
    expect(liMatches[1]).not.toContain("aria-current");
  });

  it("crumb() children are escaped", () => {
    const html = breadcrumbs([crumb("<script>"), crumb("End")]).toString();
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("items carry klods-breadcrumb__item class", () => {
    const html = breadcrumbs([crumb({ href: "/" }, "Home"), crumb("Page")]).toString();
    const count = (html.match(/klods-breadcrumb__item/g) ?? []).length;
    expect(count).toBe(2);
  });

  it("merges user class on the nav without losing it", () => {
    const html = breadcrumbs([crumb("Only")], { class: "my-trail" }).toString();
    expect(html).toContain("my-trail");
  });
});
