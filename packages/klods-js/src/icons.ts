// Built-in icon builders. Each returns a <span class="klods-icon"> wrapping an inline SVG
// so the icon inherits currentColor from its context and can be sized via the `size` prop.

import type { KlodsAttrs } from "./core.js";
import { classNames, el, KlodsNode, raw } from "./core.js";

export type IconProps = {
  size?: "small" | "medium" | "large";
  /** Accessible label for non-decorative icons. Omit for decorative use (aria-hidden). */
  label?: string;
};

const SIZE_PX = { small: 12, medium: 20, large: 32 } as const;

function makeIcon(svgInner: string, viewBox: string) {
  return function (props?: (IconProps & KlodsAttrs) | null): KlodsNode {
    const { size = "medium", label, class: extraClass, ...rest } = props ?? {};
    const px = SIZE_PX[size];
    const aria: KlodsAttrs = label ? { "aria-label": label, role: "img" } : { "aria-hidden": "true" };
    return el(
      "span",
      {
        ...rest,
        ...aria,
        class: classNames(["klods-icon", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
      },
      raw(
        `<svg width="${px}" height="${px}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">${svgInner}</svg>`
      )
    );
  };
}

export const menuIcon = makeIcon(
  '<rect y="3" width="20" height="2" rx="1" fill="currentColor"/><rect y="9" width="20" height="2" rx="1" fill="currentColor"/><rect y="15" width="20" height="2" rx="1" fill="currentColor"/>',
  "0 0 20 20"
);

export const chevRightIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 2l6 6-6 6"/>',
  "0 0 16 16"
);

export const chevDownIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2 5l6 6 6-6"/>',
  "0 0 16 16"
);

export const closeIcon = makeIcon(
  '<path stroke="currentColor" stroke-linecap="round" stroke-width="1.75" d="M4 4l8 8M12 4L4 12"/>',
  "0 0 16 16"
);
