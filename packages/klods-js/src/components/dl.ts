import { builder } from "../core.js";

export type DlProps = {
  inline?: boolean;
};
export const dl = builder<DlProps>({
  tag: "dl",
  base: "klods-dl",
  modifiers: { inline: "klods-dl--inline" },
});
export const dt = builder({ tag: "dt", base: "klods-dt" });
export const dd = builder({ tag: "dd", base: "klods-dd" });
