import { describe, expect, it } from "vitest";

import { button, card, cardBody, cardTitle, content, footer, header, page, raw, sidebar, stack } from "./index.js";

describe("klods builders", () => {
  it("renders a basic page to HTML", () => {
    const tree = page({}, [header({}, "Hi"), content({}, "Main"), footer({}, "©")]);
    expect(tree.toString()).toBe(
      '<div class="klods-page">' +
        '<header class="klods-header">Hi</header>' +
        '<main class="klods-content">Main</main>' +
        '<footer class="klods-footer">©</footer>' +
        "</div>"
    );
  });

  it("applies modifier classes for sidebar and sidebar-trailing", () => {
    const html = page({ sidebar: true, sidebarPosition: "trailing" }, [sidebar({}, "S")]).toString();
    expect(html).toContain("klods-page--with-sidebar");
    expect(html).toContain("klods-page--sidebar-trailing");
    expect(html).toContain('<aside class="klods-sidebar">S</aside>');
  });

  it("merges user-supplied class with builder defaults and passes data-*/aria-*", () => {
    const html = card(
      { elevated: true, class: "extra", id: "x", "data-track": "card", "aria-label": "hi" },
      "body"
    ).toString();
    expect(html).toContain('class="klods-card klods-card--elevated extra"');
    expect(html).toContain('id="x"');
    expect(html).toContain('data-track="card"');
    expect(html).toContain('aria-label="hi"');
  });

  it("escapes HTML in children but not in raw()", () => {
    expect(cardBody({}, "<script>x</script>").toString()).toContain("&lt;script&gt;x&lt;/script&gt;");
    expect(cardBody({}, raw("<em>ok</em>")).toString()).toContain("<em>ok</em>");
  });

  it("button defaults to type=button and supports variants", () => {
    const html = button({ variant: "primary" }, "Save").toString();
    expect(html).toContain('type="button"');
    expect(html).toContain("klods-button--primary");
  });

  it("renders to DOM via render()", () => {
    const root = document.createElement("div");
    page({ sidebar: true }, [header({}, [stack({ gap: 2 }, [cardTitle({}, "T")])]), content({}, "Main")]).render(root);
    expect(root.querySelector(".klods-page--with-sidebar")).not.toBeNull();
    expect(root.querySelector(".klods-stack--gap-2")).not.toBeNull();
    expect(root.querySelector(".klods-card__title")?.textContent).toBe("T");
  });
});
