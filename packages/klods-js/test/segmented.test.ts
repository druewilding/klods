import { describe, expect, it } from "vitest";

import { segmented } from "../src/index.js";

const option = (value: string, extra = "") =>
  `<label class="klods-segmented__option"><input type="radio" class="klods-segmented__input" name="view" value="${value}"${extra} />${value}</label>`;

describe("segmented", () => {
  it("renders a radio group with an option for each string", () => {
    expect(segmented({ name: "view", options: ["Day", "Week"] }).toString()).toBe(
      `<div role="radiogroup" class="klods-segmented">${option("Day")}${option("Week")}</div>`
    );
  });

  it("checks the option matching value", () => {
    expect(segmented({ name: "view", options: ["Day", "Week"], value: "Week" }).toString()).toBe(
      `<div role="radiogroup" class="klods-segmented">${option("Day")}${option("Week", " checked")}</div>`
    );
  });

  it("names the group with label", () => {
    expect(segmented({ name: "view", options: ["Day"], label: "View" }).toString()).toBe(
      `<div role="radiogroup" aria-label="View" class="klods-segmented">${option("Day")}</div>`
    );
  });

  it("takes options with a separate value, and disabled options", () => {
    const html = segmented({
      name: "theme",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Dark", value: "dark", disabled: true },
      ],
      value: "auto",
    }).toString();
    expect(html).toContain('value="auto" checked />Auto</label>');
    expect(html).toContain('value="dark" disabled />Dark</label>');
  });

  it("disables every option", () => {
    const html = segmented({ name: "view", options: ["Day", "Week"], disabled: true }).toString();
    expect(html.match(/disabled/g)).toHaveLength(2);
  });

  it("passes other attributes and classes through to the group", () => {
    expect(segmented({ name: "view", options: [], "aria-labelledby": "view-label", class: "toolbar" }).toString()).toBe(
      '<div aria-labelledby="view-label" role="radiogroup" class="klods-segmented toolbar"></div>'
    );
  });

  it("escapes option text", () => {
    expect(segmented({ name: "x", options: ["<b>"] }).toString()).toContain("&lt;b&gt;</label>");
  });
});
