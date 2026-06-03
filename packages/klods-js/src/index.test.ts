import { describe, expect, it } from "vitest";

import {
  alert,
  br,
  button,
  card,
  cardBody,
  cardTitle,
  code,
  content,
  el,
  footer,
  header,
  hr,
  img,
  li,
  p,
  page,
  pre,
  raw,
  sidebar,
  stack,
  strong,
  ul,
} from "./index.js";

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

describe("optional props ergonomics", () => {
  it("builders accept children-only as the first arg", () => {
    expect(cardTitle("Install").toString()).toBe('<h3 class="klods-card__title">Install</h3>');
  });

  it("builders accept an array of children as the first arg", () => {
    expect(cardTitle(["a", "b"]).toString()).toBe('<h3 class="klods-card__title">ab</h3>');
  });

  it("builders accept no arguments at all", () => {
    expect(cardBody().toString()).toBe('<div class="klods-card__body"></div>');
  });

  it("existing (props, children) call shape still works", () => {
    expect(cardTitle({ class: "extra" }, "x").toString()).toBe('<h3 class="klods-card__title extra">x</h3>');
    expect(cardTitle({}, "x").toString()).toBe('<h3 class="klods-card__title">x</h3>');
    expect(cardTitle(null, "x").toString()).toBe('<h3 class="klods-card__title">x</h3>');
  });

  it("hand-written wrappers (button, alert) accept children-only", () => {
    const btn = button("Save").toString();
    expect(btn).toContain('type="button"');
    expect(btn).toContain(">Save<");
    const a = alert("Heads up").toString();
    expect(a).toContain('role="alert"');
    expect(a).toContain(">Heads up<");
  });

  it("el() accepts children-only", () => {
    expect(el("code", "hi").toString()).toBe("<code>hi</code>");
    expect(el("p").toString()).toBe("<p></p>");
  });
});

describe("html tag shortcuts", () => {
  it("code() and pre() compose like el()", () => {
    expect(code("npm i klods").toString()).toBe("<code>npm i klods</code>");
    expect(pre(code("npm i klods")).toString()).toBe("<pre><code>npm i klods</code></pre>");
  });

  it("accept attrs + children", () => {
    expect(p({ class: "klods-muted" }, "hi").toString()).toBe('<p class="klods-muted">hi</p>');
  });

  it("compose lists", () => {
    const html = ul([li(strong("first")), li("second")]).toString();
    expect(html).toBe("<ul><li><strong>first</strong></li><li>second</li></ul>");
  });

  it("void tags drop accidental children at construction time", () => {
    // Stray children to a void tag must not appear in the DOM or HTML output —
    // this keeps `.render()` and `.toString()` in sync.
    expect(el("img", "alt-ish").toString()).toBe("<img />");
    expect(el("br", "x").toString()).toBe("<br />");
    expect(el("hr", { class: "k" }, "should-vanish").toString()).toBe('<hr class="k" />');

    const root = document.createElement("div");
    el("img", { src: "x.png" }, "drop-me").render(root);
    expect(root.querySelector("img")?.childNodes.length).toBe(0);
  });

  it("void tag shortcuts (br, hr, img) drop accidental children too", () => {
    // Same guarantee for tagBuilder()-produced shortcuts in html.ts —
    // the safeguard lives in the KlodsNode constructor, so any path through
    // the API gets it for free.
    expect(br("oops").toString()).toBe("<br />");
    expect(hr({ class: "k" }, "x").toString()).toBe('<hr class="k" />');
    expect(img({ src: "x.png", alt: "" }, "drop-me").toString()).toBe('<img src="x.png" alt="" />');
  });

  it("class instances are treated as children, not props", () => {
    // Date / URL / Map etc. shouldn't get mis-classified as props and silently
    // dropped. The runtime stringifies non-KlodsChild values via String(value),
    // so this should render the date as text rather than an empty <time></time>.
    const d = new Date("2026-06-03T00:00:00Z");
    expect(el("time", d as unknown as string).toString()).toBe(`<time>${String(d)}</time>`);

    const u = new URL("https://example.com/path");
    expect(el("span", u as unknown as string).toString()).toBe(`<span>${String(u)}</span>`);

    // raw() is a plain-shaped object but must still be a child, not props.
    expect(el("span", raw("<em>x</em>")).toString()).toBe("<span><em>x</em></span>");
  });
});
