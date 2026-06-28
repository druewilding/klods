import { builder } from "../core.js";

export type LinkProps = {
  plain?: boolean;
};

export const link = builder<LinkProps>({
  tag: "a",
  base: "klods-link",
  modifiers: {
    plain: "klods-link--plain",
  },
});
