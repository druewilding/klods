import { builder } from "../core.js";

export type CardProps = {
  elevated?: boolean;
};
export const card = builder<CardProps>({
  tag: "div",
  base: "klods-card",
  modifiers: { elevated: "klods-card--elevated" },
});
export const cardTitle = builder({ tag: "h3", base: "klods-card__title" });
export const cardBody = builder({ tag: "div", base: "klods-card__body" });
export const cardFooter = builder({ tag: "div", base: "klods-card__footer" });
