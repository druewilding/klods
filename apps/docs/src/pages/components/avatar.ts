import type { KlodsNode } from "klods-js";
import { avatar, cluster } from "klods-js";

import { example } from "../../example.js";

export const label = "Avatar";
export const anchor = "avatar";

export const examples: KlodsNode[] = [
  example({
    title: "Avatar",
    description: "Without a `src`, the avatar displays initials derived from `name`.",
    render: () =>
      cluster({ gap: 3, align: "center" }, [
        avatar({ size: "small", name: "Ari Smith" }),
        avatar({ name: "Ari Smith" }),
        avatar({ size: "large", name: "Ari Smith" }),
      ]),
  }),

  example({
    title: "Avatar — with image",
    render: () =>
      cluster({ gap: 3, align: "center" }, [
        avatar({ size: "small", src: "https://i.pravatar.cc/96", name: "Ari Smith" }),
        avatar({ src: "https://i.pravatar.cc/96", name: "Ari Smith" }),
        avatar({ size: "large", src: "https://i.pravatar.cc/96", name: "Ari Smith" }),
      ]),
  }),

  example({
    title: "Avatar — icon fallback",
    description: "Omit both `src` and `name` to show a generic user icon.",
    render: () =>
      cluster({ gap: 3, align: "center" }, [avatar({ size: "small" }), avatar(), avatar({ size: "large" })]),
  }),
];
