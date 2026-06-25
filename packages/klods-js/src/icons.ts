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

export const checkCircleIcon = makeIcon(
  '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M5 8l2 2.5 4-4"/>',
  "0 0 16 16"
);

export const chevDownIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2 5l6 6 6-6"/>',
  "0 0 16 16"
);

export const chevLeftIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M11 2l-6 6 6 6"/>',
  "0 0 16 16"
);

export const chevRightIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 2l6 6-6 6"/>',
  "0 0 16 16"
);

export const chevUpIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2 11l6-6 6 6"/>',
  "0 0 16 16"
);

export const closeIcon = makeIcon(
  '<path stroke="currentColor" stroke-linecap="round" stroke-width="1.75" d="M4 4l8 8M12 4L4 12"/>',
  "0 0 16 16"
);

export const copyIcon = makeIcon(
  '<rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"/>',
  "0 0 16 16"
);

export const dangerCircleIcon = makeIcon(
  '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M5.5 5.5l5 5M10.5 5.5l-5 5"/>',
  "0 0 16 16"
);

export const editIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M11.3 2a2 2 0 112.8 2.8L5 13.8l-3.5 1 1-3.5L11.3 2z"/>',
  "0 0 16 16"
);

export const externalLinkIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M9 3h4v4M13 3L7 9"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M6 4H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-2"/>',
  "0 0 16 16"
);

export const eyeIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>',
  "0 0 16 16"
);

export const eyeOffIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l12 12"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M4 5.3C2.4 6.5 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M9 3.3C11.6 4 14.2 6.2 15 8a12 12 0 01-2 2.7"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M9.8 9.8A2 2 0 016.2 6.2"/>',
  "0 0 16 16"
);

export const infoCircleIcon = makeIcon(
  '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M8 7.5v3.5"/><circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>',
  "0 0 16 16"
);

export const menuIcon = makeIcon(
  '<rect y="3" width="20" height="2" rx="1" fill="currentColor"/><rect y="9" width="20" height="2" rx="1" fill="currentColor"/><rect y="15" width="20" height="2" rx="1" fill="currentColor"/>',
  "0 0 20 20"
);

export const plusIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8 3v10M3 8h10"/>',
  "0 0 16 16"
);

export const searchIcon = makeIcon(
  '<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M10.5 10.5L14 14"/>',
  "0 0 16 16"
);

export const trashIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M2 5h12M6 5V4a1 1 0 011-1h2a1 1 0 011 1v1"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M4.5 5l.7 7.5a1 1 0 001 .9h3.6a1 1 0 001-.9L11.5 5"/>',
  "0 0 16 16"
);

export const userIcon = makeIcon(
  '<circle cx="8" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2.5 14c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5"/>',
  "0 0 16 16"
);

export const warningIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 2L1.5 13.5h13L8 2z"/><path stroke="currentColor" stroke-width="1" stroke-linecap="round" d="M8 7v3"/><circle cx="8" cy="12" r="0.75" fill="currentColor"/>',
  "0 0 16 16"
);
