import type { KlodsAttrs } from "../core.js";
import { classNames, el, KlodsNode } from "../core.js";
import { userIcon } from "../icons.js";

export type AvatarProps = {
  /** Image URL. When present renders an <img>; otherwise falls back to initials or a generic icon. */
  src?: string;
  /** Accessible name. Used as alt text for images and to derive initials when no src is given. */
  name?: string;
  size?: "small" | "medium" | "large";
};

export function avatar(props?: (AvatarProps & KlodsAttrs) | null): KlodsNode {
  const { src, name, size = "medium", class: extraClass, ...rest } = props ?? {};
  const hasInitials = !src && !!name;
  const cls =
    classNames([
      "klods-avatar",
      size !== "medium" ? `klods-avatar--${size}` : "",
      hasInitials ? "klods-avatar--initials" : "",
      classNames(extraClass as KlodsAttrs["class"]),
    ]) || undefined;

  let content: KlodsNode;
  if (src) {
    content = el("img", { src, alt: name ?? "", class: "klods-avatar__img" });
  } else if (name) {
    const initials = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
    content = el("span", { "aria-hidden": "true" }, initials);
  } else {
    content = userIcon({ size: size === "small" ? "small" : "medium" });
  }

  return el(
    "span",
    {
      ...rest,
      class: cls,
      ...(hasInitials ? { role: "img", "aria-label": name } : {}),
    },
    content
  );
}
