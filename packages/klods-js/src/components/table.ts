import { builder, tagBuilder } from "../core.js";

export type TableProps = {
  striped?: boolean;
  dense?: boolean;
};
export const tableWrap = builder({ tag: "div", base: "klods-table-wrap" });
export const table = builder<TableProps>({
  tag: "table",
  base: "klods-table",
  modifiers: {
    striped: "klods-table--striped",
    dense: "klods-table--dense",
  },
});
export const thead = tagBuilder("thead");
export const tbody = tagBuilder("tbody");
export const tr = tagBuilder("tr");
export const th = tagBuilder("th");
export const td = tagBuilder("td");
