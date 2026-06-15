import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  a,
  activateTab,
  alert,
  br,
  breadcrumbs,
  button,
  card,
  cardBody,
  cardTitle,
  clearToasts,
  code,
  content,
  crumb,
  el,
  footer,
  header,
  hideTooltip,
  hr,
  img,
  li,
  p,
  page,
  pre,
  raw,
  showToast,
  showTooltip,
  sidebar,
  span,
  stack,
  strong,
  tabPanel,
  tabs,
  tooltip,
  ul,
} from "./index.js";

describe("klods builders", () => {
  it("renders a basic page to HTML", () => {
    const tree = page([header("Hi"), content("Main"), footer("©")]);
    expect(tree.toString()).toBe(
      '<div class="klods-page">' +
        '<header class="klods-header">Hi</header>' +
        '<main class="klods-content">Main</main>' +
        '<footer class="klods-footer">©</footer>' +
        "</div>"
    );
  });

  it("applies modifier classes for sidebar and sidebar-trailing", () => {
    const html = page({ sidebar: true, sidebarPosition: "trailing" }, sidebar("S")).toString();
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
    expect(cardBody("<script>x</script>").toString()).toContain("&lt;script&gt;x&lt;/script&gt;");
    expect(cardBody(raw("<em>ok</em>")).toString()).toContain("<em>ok</em>");
  });

  it("button defaults to type=button and supports variants", () => {
    const html = button({ variant: "primary" }, "Save").toString();
    expect(html).toContain('type="button"');
    expect(html).toContain("klods-button--primary");
  });

  it("renders to DOM via render()", () => {
    const root = document.createElement("div");
    page({ sidebar: true }, [header(stack({ gap: 2 }, cardTitle("T"))), content("Main")]).render(root);
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

describe("tabs", () => {
  it("renders a tablist with one tab per panel", () => {
    const html = tabs([tabPanel({ label: "A" }, "a"), tabPanel({ label: "B" }, "b")]).toString();
    expect(html).toContain('role="tablist"');
    expect(html).toContain(">A<");
    expect(html).toContain(">B<");
  });

  it("first tab is active, rest have tabindex=-1", () => {
    const html = tabs([tabPanel({ label: "A" }, "a"), tabPanel({ label: "B" }, "b")]).toString();
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-selected="false"');
    expect(html).toContain('tabindex="-1"');
    // Active tab must NOT have tabindex="-1"
    const activeMatch = html.match(/aria-selected="true"[^>]*tabindex="-1"/);
    expect(activeMatch).toBeNull();
  });

  it("first panel is visible, remaining panels are hidden", () => {
    const html = tabs([
      tabPanel({ label: "A" }, "a"),
      tabPanel({ label: "B" }, "b"),
      tabPanel({ label: "C" }, "c"),
    ]).toString();
    // Boolean hidden serializes as the bare attribute (` hidden`), not `hidden=""`
    const hiddenCount = (html.match(/ hidden[ >]/g) ?? []).length;
    expect(hiddenCount).toBe(2);
  });

  it("wires aria-controls on tabs to matching panel ids", () => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    tabs([tabPanel({ label: "One" }, "x"), tabPanel({ label: "Two" }, "y")]).render(root);
    const tabEls = root.querySelectorAll("[role='tab']");
    tabEls.forEach((tab) => {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId!)).not.toBeNull();
    });
    document.body.removeChild(root);
  });

  it("panels carry role=tabpanel and aria-labelledby pointing at their tab", () => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    tabs([tabPanel({ label: "One" }, "x")]).render(root);
    const panel = root.querySelector("[role='tabpanel']")!;
    const labelledBy = panel.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).not.toBeNull();
    document.body.removeChild(root);
  });

  it("merges user class on the container without dropping klods-tabs", () => {
    const html = tabs({ class: "my-tabs" }, [tabPanel({ label: "A" }, "a")]).toString();
    expect(html).toContain("klods-tabs");
    expect(html).toContain("my-tabs");
  });

  it("merges user class on tabPanel without dropping klods-tabs__panel", () => {
    const html = tabs([tabPanel({ label: "A", class: "special" }, "a")]).toString();
    expect(html).toContain("klods-tabs__panel");
    expect(html).toContain("special");
  });

  it("activateTab() shows the target panel and hides others", () => {
    const root = document.createElement("div");
    tabs([tabPanel({ label: "A" }, "a"), tabPanel({ label: "B" }, "b")]).render(root);
    const tabEls = Array.from(root.querySelectorAll<HTMLElement>("[role='tab']"));
    activateTab(tabEls[1]);
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[role='tabpanel']"));
    expect(panels[0].hasAttribute("hidden")).toBe(true);
    expect(panels[1].hasAttribute("hidden")).toBe(false);
  });

  it("activateTab() updates aria-selected and active class", () => {
    const root = document.createElement("div");
    tabs([tabPanel({ label: "A" }, "a"), tabPanel({ label: "B" }, "b")]).render(root);
    const tabEls = Array.from(root.querySelectorAll<HTMLElement>("[role='tab']"));
    activateTab(tabEls[1]);
    expect(tabEls[0].getAttribute("aria-selected")).toBe("false");
    expect(tabEls[0].classList.contains("klods-tabs__tab--active")).toBe(false);
    expect(tabEls[1].getAttribute("aria-selected")).toBe("true");
    expect(tabEls[1].classList.contains("klods-tabs__tab--active")).toBe(true);
  });

  it("two tabs() widgets with same labels have non-colliding IDs", () => {
    const root = document.createElement("div");
    tabs({ id: "widget-a" }, [tabPanel({ label: "One" }, "x")]).render(root);
    tabs({ id: "widget-b" }, [tabPanel({ label: "One" }, "y")]).render(root);
    const allIds = Array.from(root.querySelectorAll("[id]")).map((el) => el.id);
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });
});

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

describe("showToast / clearToasts", () => {
  // Helpers to access the region element and individual toasts.
  function getRegion() {
    return document.querySelector<HTMLElement>(".klods-toast-region");
  }
  function getToasts() {
    return Array.from(document.querySelectorAll<HTMLElement>(".klods-toast"));
  }

  // Always start each test with a clean slate.
  beforeEach(() => {
    document.querySelectorAll(".klods-toast-region").forEach((r) => r.remove());
  });

  it("creates a .klods-toast-region on first call", () => {
    expect(getRegion()).toBeNull();
    showToast("Hello");
    expect(getRegion()).not.toBeNull();
  });

  it("reuses the same region across multiple calls", () => {
    showToast("First");
    showToast("Second");
    expect(document.querySelectorAll(".klods-toast-region").length).toBe(1);
    expect(getToasts().length).toBe(2);
  });

  it("region has role=region and aria-live=polite", () => {
    showToast("Hi");
    const region = getRegion()!;
    expect(region.getAttribute("role")).toBe("region");
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("aria-label")).toBe("Notifications");
  });

  it("renders a plain string message", () => {
    showToast("File saved.");
    const toast = getToasts()[0]!;
    expect(toast.querySelector(".klods-toast__body")?.textContent).toBe("File saved.");
  });

  it("renders a number message", () => {
    showToast(42);
    expect(getToasts()[0]!.querySelector(".klods-toast__body")?.textContent).toBe("42");
  });

  it("renders a raw() child without escaping", () => {
    showToast(raw("<em>bold</em>"));
    const body = getToasts()[0]!.querySelector(".klods-toast__body")!;
    expect(body.querySelector("em")?.textContent).toBe("bold");
  });

  it("renders a KlodsNode child", () => {
    showToast(strong("important"));
    const body = getToasts()[0]!.querySelector(".klods-toast__body")!;
    expect(body.querySelector("strong")?.textContent).toBe("important");
  });

  it("renders an array of mixed children", () => {
    showToast(["You have a ", a({ href: "#" }, "new message")]);
    const body = getToasts()[0]!.querySelector(".klods-toast__body")!;
    expect(body.textContent).toContain("You have a ");
    expect(body.querySelector("a")?.textContent).toBe("new message");
  });

  it("applies no variant modifier for the default variant", () => {
    showToast("Hi");
    const toast = getToasts()[0]!;
    expect(toast.className).toBe("klods-toast");
  });

  it.each(["info", "success", "warning", "danger"] as const)("applies .klods-toast--%s modifier", (variant) => {
    showToast({ variant }, "Hi");
    expect(getToasts()[0]!.classList.contains(`klods-toast--${variant}`)).toBe(true);
  });

  it("toast contains a dismiss button", () => {
    showToast("Hi");
    const btn = getToasts()[0]!.querySelector<HTMLElement>(".klods-toast__close");
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute("aria-label")).toBe("Dismiss");
  });

  it("clicking the dismiss button removes the toast", () => {
    showToast("Hi");
    const toast = getToasts()[0]!;
    const btn = toast.querySelector<HTMLElement>(".klods-toast__close")!;
    btn.click();
    // animationend won't fire in jsdom — the fallback timer removes it.
    // Advance time past the fallback window.
    vi.useFakeTimers();
    btn.click();
    vi.runAllTimers();
    vi.useRealTimers();
    expect(toast.isConnected).toBe(false);
  });

  it("auto-dismisses after the configured duration", () => {
    vi.useFakeTimers();
    showToast({ duration: 1000 }, "Bye");
    const toast = getToasts()[0]!;
    expect(toast.isConnected).toBe(true);
    vi.advanceTimersByTime(1000);
    // The auto-dismiss timer fires; animationend won't in jsdom so the fallback
    // timer (duration of --klods-transition + buffer) also needs to elapse.
    vi.runAllTimers();
    vi.useRealTimers();
    expect(toast.isConnected).toBe(false);
  });

  it("duration: 0 keeps the toast indefinitely", () => {
    vi.useFakeTimers();
    showToast({ duration: 0 }, "Sticky");
    const toast = getToasts()[0]!;
    vi.advanceTimersByTime(60_000);
    vi.useRealTimers();
    expect(toast.isConnected).toBe(true);
  });

  it("clearToasts() removes the region entirely", () => {
    showToast("First");
    showToast("Second");
    clearToasts();
    expect(getRegion()).toBeNull();
    expect(getToasts().length).toBe(0);
  });
});

describe("tooltip", () => {
  it("renders a .klods-tooltip wrapper containing the trigger and a tip span", () => {
    const html = tooltip({ tip: "Save now" }, button("Save")).toString();
    expect(html).toContain("klods-tooltip");
    expect(html).toContain('role="tooltip"');
    expect(html).toContain("klods-tooltip__tip");
    expect(html).toContain("Save now");
  });

  it("tip id matches aria-describedby on the focusable child", () => {
    const html = tooltip({ tip: "Hint" }, button("Go")).toString();
    const tipId = html.match(/id="([^"]+)"[^>]*role="tooltip"/)?.[1];
    expect(tipId).toBeTruthy();
    expect(html).toContain(`aria-describedby="${tipId}"`);
    // aria-describedby must be on the <button>, not on the wrapper <span>
    const wrapperTag = html.match(/^<span[^>]*>/)?.[0] ?? "";
    expect(wrapperTag).not.toContain("aria-describedby");
    const buttonTag = html.match(/<button[^>]*>/)?.[0] ?? "";
    expect(buttonTag).toContain(`aria-describedby="${tipId}"`);
  });

  it("adds tabindex=0 and aria-describedby on the wrapper for non-focusable content", () => {
    const html = tooltip({ tip: "Info" }, span("hover me")).toString();
    const wrapperTag = html.match(/^<span[^>]*>/)?.[0] ?? "";
    expect(wrapperTag).toContain('tabindex="0"');
    expect(wrapperTag).toContain("aria-describedby");
  });

  it("does not add tabindex when wrapping a focusable element", () => {
    const html = tooltip({ tip: "Info" }, button("Click")).toString();
    const wrapperTag = html.match(/^<span[^>]*>/)?.[0] ?? "";
    expect(wrapperTag).not.toContain("tabindex");
  });

  it("applies the position modifier class", () => {
    expect(tooltip({ tip: "T", position: "above" }, span("x")).toString()).toContain("klods-tooltip__tip--above");
    expect(tooltip({ tip: "T", position: "below" }, span("x")).toString()).toContain("klods-tooltip__tip--below");
    expect(tooltip({ tip: "T", position: "start" }, span("x")).toString()).toContain("klods-tooltip__tip--start");
    expect(tooltip({ tip: "T", position: "end" }, span("x")).toString()).toContain("klods-tooltip__tip--end");
  });

  it("defaults to position above", () => {
    const html = tooltip({ tip: "T" }, span("x")).toString();
    expect(html).toContain("klods-tooltip__tip--above");
  });

  it("appends to existing aria-describedby on the focusable child", () => {
    const html = tooltip({ tip: "Extra" }, button({ "aria-describedby": "existing-id" }, "Go")).toString();
    const buttonTag = html.match(/<button[^>]*>/)?.[0] ?? "";
    expect(buttonTag).toContain("existing-id");
    expect(buttonTag).toMatch(/aria-describedby="existing-id [^"]+"/);
  });

  it("showTooltip sets data-open on the tip element", () => {
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    expect(tipEl.hasAttribute("data-open")).toBe(false);
    showTooltip(tipEl);
    expect(tipEl.hasAttribute("data-open")).toBe(true);
  });

  it("hideTooltip removes data-open immediately when delay is 0", () => {
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    expect(tipEl.hasAttribute("data-open")).toBe(true);
    hideTooltip(tipEl, 0);
    expect(tipEl.hasAttribute("data-open")).toBe(false);
  });

  it("hideTooltip removes data-open after the default delay", () => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    hideTooltip(tipEl);
    expect(tipEl.hasAttribute("data-open")).toBe(true); // still open during delay
    vi.runAllTimers();
    vi.useRealTimers();
    expect(tipEl.hasAttribute("data-open")).toBe(false);
  });

  it("showTooltip cancels a pending hideTooltip", () => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    hideTooltip(tipEl); // schedule a hide
    showTooltip(tipEl); // cancel it
    vi.runAllTimers();
    vi.useRealTimers();
    expect(tipEl.hasAttribute("data-open")).toBe(true);
  });

  it("rapid hideTooltip calls don't accumulate stale timers", () => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    tooltip({ tip: "Hi" }, span("x")).render(root);
    const tipEl = root.querySelector<HTMLElement>("[role='tooltip']")!;
    showTooltip(tipEl);
    hideTooltip(tipEl);
    hideTooltip(tipEl); // second call cancels the first timer
    showTooltip(tipEl); // cancel current timer
    vi.runAllTimers();
    vi.useRealTimers();
    expect(tipEl.hasAttribute("data-open")).toBe(true);
  });

  it("showTooltip and hideTooltip no-op on non-tip elements", () => {
    const div = document.createElement("div");
    expect(() => showTooltip(div)).not.toThrow();
    expect(() => hideTooltip(div, 0)).not.toThrow();
  });
});
