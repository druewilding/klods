import { describe, expect, it } from "vitest";

import { status } from "../src/index.js";

describe("status", () => {
  it("renders a span with the base class", () => {
    expect(status("Online").toString()).toBe('<span class="klods-status">Online</span>');
  });

  it("adds a variant modifier", () => {
    expect(status({ variant: "success" }, "Online").toString()).toBe(
      '<span class="klods-status klods-status--success">Online</span>'
    );
  });

  it("leaves out the modifier for the default variant", () => {
    expect(status({ variant: "default" }, "Offline").toString()).toBe('<span class="klods-status">Offline</span>');
  });

  it("adds the pulse modifier", () => {
    expect(status({ variant: "danger", pulse: true }, "Recording").toString()).toBe(
      '<span class="klods-status klods-status--danger klods-status--pulse">Recording</span>'
    );
  });

  it("passes other attributes through", () => {
    expect(status({ role: "status" }, "Your turn").toString()).toBe(
      '<span role="status" class="klods-status">Your turn</span>'
    );
  });
});
