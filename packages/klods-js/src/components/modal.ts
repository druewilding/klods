import type { KlodsAttrs, KlodsChild } from "../core.js";
import { builder, classNames, el, KlodsNode, normalizeArgs } from "../core.js";
import type { ButtonProps } from "./button.js";
import { button } from "./button.js";

// Built on the native <dialog> element. Use openModal() / closeModal() to
// show and hide. openModal() calls .showModal() so the dialog is top-layer
// with a backdrop; closeModal() calls .close().

export type ModalProps = {
  /** When true, renders the dialog with the `open` attribute (non-modal inline display). */
  open?: boolean;
};
export function modal(): KlodsNode;
export function modal(children: KlodsChild | KlodsChild[]): KlodsNode;
export function modal(props: (ModalProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function modal(
  a?: (ModalProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ModalProps & KlodsAttrs>(a, b);
  const { open, class: extraClass, ...rest } = props ?? {};
  const attrs: KlodsAttrs = {
    ...rest,
    class: classNames(["klods-modal", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
  };
  if (open) attrs.open = true;
  return el("dialog", attrs, children ?? []);
}

export const modalPanel = builder({ tag: "div", base: "klods-modal__panel" });
export const modalHeader = builder({ tag: "div", base: "klods-modal__header" });
export const modalTitle = builder({ tag: "h2", base: "klods-modal__title" });
export const modalBody = builder({ tag: "div", base: "klods-modal__body" });
export const modalActions = builder({ tag: "div", base: "klods-modal__actions" });

/** Close button — the × icon is provided by CSS via a ::before mask-image. Closes the containing dialog automatically. */
export function modalClose(props?: Omit<KlodsAttrs, "onClick"> | null): KlodsNode {
  const { class: extraClass, ...rest } = props ?? {};
  return el("button", {
    type: "button",
    "aria-label": "Close",
    onClick: (e: Event) => closeModal(e.currentTarget as HTMLElement),
    ...rest,
    class: classNames(["klods-modal__close", classNames(extraClass as KlodsAttrs["class"])]) || undefined,
  });
}

/** Button that closes the containing `<dialog>` when clicked. Accepts the same props as `button`. */
export function modalDismiss(): KlodsNode;
export function modalDismiss(children: KlodsChild | KlodsChild[]): KlodsNode;
export function modalDismiss(props: (ButtonProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function modalDismiss(
  a?: (ButtonProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ButtonProps & KlodsAttrs>(a, b);
  return button(
    {
      onClick: (e: Event) => closeModal(e.currentTarget as HTMLElement),
      ...props,
    },
    children
  );
}

/** Button that opens the next sibling `<dialog>` as a modal when clicked. Accepts the same props as `button`. */
export function modalTrigger(): KlodsNode;
export function modalTrigger(children: KlodsChild | KlodsChild[]): KlodsNode;
export function modalTrigger(props: (ButtonProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function modalTrigger(
  a?: (ButtonProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<ButtonProps & KlodsAttrs>(a, b);
  return button(
    {
      onClick: (e: Event) => openModal((e.currentTarget as HTMLElement).nextElementSibling as HTMLElement),
      ...props,
    },
    children
  );
}

/**
 * Open a `.klods-modal` dialog as a modal overlay using the native `showModal()` API.
 * The element must already be mounted in the document (e.g. via `.render(document.body)`).
 * No-ops silently if the element is not a connected `<dialog>` or is already open.
 */
export function openModal(dialogEl: HTMLElement): void {
  if (!(dialogEl instanceof HTMLDialogElement) || !dialogEl.isConnected || dialogEl.open) return;
  dialogEl.showModal();
}

/**
 * Close a `.klods-modal` dialog. Pass the dialog element or any element inside it.
 */
export function closeModal(targetEl: HTMLElement): void {
  const dialogEl =
    targetEl instanceof HTMLDialogElement
      ? targetEl
      : (targetEl.closest("dialog.klods-modal") as HTMLDialogElement | null);
  if (!dialogEl?.open) return;
  dialogEl.close();
}
