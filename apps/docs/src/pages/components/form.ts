import type { KlodsNode } from "klods-js";
import {
  button,
  card,
  checkbox,
  el,
  field,
  form,
  grid,
  input,
  option,
  radio,
  radioGroup,
  row,
  select,
  spread,
  stack,
  switchInput,
  textarea,
} from "klods-js";

import { example } from "../../example.js";

export const label = "Form";
export const anchor = "form-text-inputs";

export const examples: KlodsNode[] = [
  example({
    title: "Form - Text inputs",
    description: "Basic text controls with placeholder and label.",
    render: () =>
      stack({ gap: 4 }, [
        field({ label: "Full name" }, (id) => input({ id, type: "text", placeholder: "Jane Smith" })),
        field({ label: "Email address" }, (id) => input({ id, type: "email", placeholder: "jane@example.com" })),
        field({ label: "Password" }, (id) => input({ id, type: "password", placeholder: "••••••••" })),
      ]),
  }),

  example({
    title: "Form - Required field",
    description: "Add `required: true` to get the * marker and correct semantics.",
    render: () =>
      field({ label: "Username", required: true }, (id) =>
        input({ id, type: "text", placeholder: "yourname", required: true })
      ),
  }),

  example({
    title: "Form - Help text",
    description: "Use `help` to add a hint below the control.",
    render: () =>
      field({ label: "Email address", help: "We'll only use this to send your receipt." }, (id) =>
        input({ id, type: "email", placeholder: "jane@example.com" })
      ),
  }),

  example({
    title: "Form - Invalid state",
    description:
      "Set `error` to show a validation message and apply the invalid styling. `aria-invalid` and `aria-describedby` are wired automatically.",
    render: () =>
      stack({ gap: 4 }, [
        field({ label: "Email address", error: "Please enter a valid email address." }, (id) =>
          input({ id, type: "email", value: "not-an-email" })
        ),
        field({ label: "Message", error: "Message must be at least 20 characters." }, (id) =>
          textarea({ id, placeholder: "Your message…" })
        ),
      ]),
  }),

  example({
    title: "Form - Input disabled",
    description: "Pass `disabled` on the control itself.",
    render: () =>
      stack({ gap: 4 }, [
        field({ label: "Locked field" }, (id) => input({ id, type: "text", value: "Cannot edit", disabled: true })),
        field({ label: "Role" }, (id) =>
          select({ id, disabled: true }, [option({ value: "" }, "Admin"), option({ value: "viewer" }, "Viewer")])
        ),
      ]),
  }),

  example({
    title: "Form - Select and option",
    description: "Use `select` and `option` for dropdowns.",
    render: () =>
      stack({ gap: 4 }, [
        field({ label: "Country" }, (id) =>
          select({ id }, [
            option({ value: "" }, "— choose —"),
            option({ value: "dk" }, "Denmark"),
            option({ value: "de" }, "Germany"),
            option({ value: "se" }, "Sweden"),
            option({ value: "no" }, "Norway"),
          ])
        ),
        field({ label: "Role", help: "Controls what the user can see and do." }, (id) =>
          select({ id }, [
            option({ value: "admin" }, "Admin"),
            option({ value: "editor" }, "Editor"),
            option({ value: "viewer" }, "Viewer"),
          ])
        ),
      ]),
  }),

  example({
    title: "Form - Textarea",
    render: () =>
      field({ label: "Message", help: "Up to 500 characters." }, (id) =>
        textarea({ id, placeholder: "Write something nice…" })
      ),
  }),

  example({
    title: "Form - Checkbox",
    render: () =>
      stack({ gap: 2 }, [
        checkbox({ label: "I agree to the terms and conditions", name: "terms" }),
        checkbox({ label: "Subscribe to the newsletter", name: "newsletter", checked: true }),
        checkbox({ label: "This option is unavailable", name: "locked", disabled: true }),
      ]),
  }),

  example({
    title: "Form - Radio group",
    description: 'Wrap radios with `radioGroup` for correct `role="group"` and aria labelling.',
    render: () =>
      radioGroup({ legend: "Preferred contact method" }, [
        radio({ label: "Email", name: "contact", value: "email", checked: true }),
        radio({ label: "Phone", name: "contact", value: "phone" }),
        radio({ label: "Post", name: "contact", value: "post" }),
      ]),
  }),

  example({
    title: "Form - Switch",
    description: 'An accessible toggle. Uses `role="switch"` on the underlying checkbox.',
    render: () =>
      stack({ gap: 3 }, [
        switchInput({ label: "Dark mode", name: "dark-mode" }),
        switchInput({ label: "Email notifications", name: "notifications", checked: true }),
        switchInput({ label: "This setting is locked", name: "locked", disabled: true }),
      ]),
  }),

  example({
    title: "Contact form",
    description:
      "A complete form using `grid` to lay out pairs of fields side by side. Names and contact details share a row; the message and actions sit full-width below.",
    render: () =>
      card({}, [
        form({ onSubmit: (e: Event) => e.preventDefault() }, [
          grid({ cols: 2, gap: 4 }, [
            field({ label: "First name", required: true }, (id) =>
              input({ id, type: "text", placeholder: "Jane" }),
            ),
            field({ label: "Last name", required: true }, (id) =>
              input({ id, type: "text", placeholder: "Smith" }),
            ),
          ]),
          grid({ cols: 2, gap: 4 }, [
            field({ label: "Email address", required: true }, (id) =>
              input({ id, type: "email", placeholder: "jane@example.com" }),
            ),
            field({ label: "Subject" }, (id) =>
              select({ id }, [
                option({ value: "" }, "— choose a topic —"),
                option({ value: "general" }, "General enquiry"),
                option({ value: "support" }, "Technical support"),
                option({ value: "billing" }, "Billing"),
              ]),
            ),
          ]),
          field({ label: "Message", required: true }, (id) =>
            textarea({ id, placeholder: "How can we help you?" }),
          ),
          spread({}, [
            checkbox({ label: "I agree to the privacy policy", name: "privacy", required: true }),
            button({ variant: "primary", type: "submit" }, "Send message"),
          ]),
        ]),
      ]),
  }),

  example({
    title: "Settings panel",
    description: "Switches and selects side by side in a card.",
    render: () =>
      card({}, [
        el("h3", { class: "klods-card__title" }, "Preferences"),
        stack({ gap: 4 }, [
          switchInput({ label: "Enable notifications", name: "notif", checked: true }),
          switchInput({ label: "Auto-save drafts", name: "autosave", checked: true }),
          switchInput({ label: "Public profile", name: "public" }),
          field({ label: "Language" }, (id) =>
            select({ id }, [
              option({ value: "en" }, "English"),
              option({ value: "da" }, "Dansk"),
              option({ value: "de" }, "Deutsch"),
            ])
          ),
          el("div", {}, [button({ variant: "primary" }, "Save preferences")]),
        ]),
      ]),
  }),

  example({
    title: "Search bar",
    description: "An input paired with a button in a row.",
    render: () =>
      card(
        {},
        row({ gap: 2 }, [
          input({ type: "search", placeholder: "Search…", class: "klods-input" }),
          button({ variant: "primary" }, "Search"),
        ])
      ),
  }),
];
