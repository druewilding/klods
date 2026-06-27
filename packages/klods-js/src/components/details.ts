import { builder, tagBuilder } from "../core.js";

export type DetailsProps = { open?: boolean };
export const details = builder<DetailsProps>({ tag: "details", base: "klods-details" });
export const summary = tagBuilder("summary");
