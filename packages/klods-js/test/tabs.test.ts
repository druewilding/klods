import { describe, expect, it } from "vitest";

import { activateTab, tabPanel, tabs } from "../src/index.js";

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
