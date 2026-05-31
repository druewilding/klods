import type { KlodsNode } from "klods-js";
import {
  button,
  card,
  cardFooter,
  cardTitle,
  checkbox,
  el,
  field,
  form,
  grid,
  input,
  option,
  push,
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
          textarea({ id, placeholder: "Your message…" }, "Too short")
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
          select({ id, disabled: true }, [
            option({ value: "" }, "Admin"),
            option({ selected: true, value: "viewer" }, "Viewer"),
          ])
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
            option({ selected: true, value: "dk" }, "Denmark"),
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
    title: "Form - Input types",
    description: "The `input` builder works with any native `type`. Each renders with the same base styling.",
    render: () =>
      grid({ fit: true, gap: 4 }, [
        field({ label: "Date" }, (id) => input({ id, type: "date" })),
        field({ label: "Time" }, (id) => input({ id, type: "time" })),
        field({ label: "Datetime-local" }, (id) => input({ id, type: "datetime-local" })),
        field({ label: "Number" }, (id) => input({ id, type: "number", min: "1", max: "100", value: "42" })),
        field({ label: "Range" }, (id) => input({ id, type: "range", min: "0", max: "100", value: "60" })),
        field({ label: "Color" }, (id) => input({ id, type: "color", value: "#6c63ff" })),
        field({ label: "Tel" }, (id) => input({ id, type: "tel", placeholder: "+45 12 34 56 78" })),
        field({ label: "File" }, (id) => input({ id, type: "file" })),
        field({ label: "URL" }, (id) => input({ id, type: "url", placeholder: "https://example.com" })),
      ]),
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
    description: 'Wrap radios with `radioGroup` for correct `role="group"` and aria labeling.',
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
    title: "Form - Switch reverse",
    description:
      "Use `reverse: true` to flip the layout — label on the left, toggle on the right. Useful inside settings panels where the label describes the setting.",
    render: () =>
      stack({ gap: 3 }, [
        switchInput({ label: "Dark mode", name: "dark-mode", reverse: true }),
        switchInput({ label: "Email notifications", name: "notifications", checked: true, reverse: true }),
        switchInput({ label: "This setting is locked", name: "locked", disabled: true, reverse: true }),
      ]),
  }),

  example({
    title: "Contact form example",
    description:
      "A complete form using `grid` to lay out pairs of fields side by side. Names and contact details share a row; the message and actions sit full-width below.",
    render: () =>
      card({}, [
        form({ onSubmit: (e: Event) => e.preventDefault() }, [
          grid({ cols: 2, gap: 4 }, [
            field({ label: "First name", required: true }, (id) => input({ id, type: "text", placeholder: "Jane" })),
            field({ label: "Last name", required: true }, (id) => input({ id, type: "text", placeholder: "Smith" })),
          ]),
          grid({ cols: 2, gap: 4 }, [
            field({ label: "Email address", required: true }, (id) =>
              input({ id, type: "email", placeholder: "jane@example.com" })
            ),
            field({ label: "Subject" }, (id) =>
              select({ id }, [
                option({ value: "" }, "— choose a topic —"),
                option({ value: "general" }, "General enquiry"),
                option({ value: "support" }, "Technical support"),
                option({ value: "billing" }, "Billing"),
              ])
            ),
          ]),
          field({ label: "Message", required: true }, (id) => textarea({ id, placeholder: "How can we help you?" })),
          spread({}, [
            checkbox({ label: "I agree to the privacy policy", name: "privacy", required: true }),
            button({ variant: "primary", type: "submit" }, "Send message"),
          ]),
        ]),
      ]),
  }),

  example({
    title: "Settings panel example",
    description:
      "A two-column settings card. Each column groups related settings under a `klods-label` heading. `reverse` switches keep the toggle on the right; `cardFooter` with `push` pins the save button to the right edge.",
    render: () =>
      card({}, [
        cardTitle({}, "Preferences"),
        grid({ cols: 2, gap: 5 }, [
          stack({ gap: 3 }, [
            el("p", { class: "klods-label" }, "Account"),
            switchInput({ label: "Public profile", name: "public" }),
            field({ label: "Language" }, (id) =>
              select({ id }, [
                option({ value: "en" }, "English"),
                option({ value: "da" }, "Dansk"),
                option({ value: "de" }, "Deutsch"),
              ])
            ),
          ]),
          stack({ gap: 3 }, [
            el("p", { class: "klods-label" }, "Notifications"),
            switchInput({ label: "Enable notifications", name: "notif", checked: true }),
            switchInput({ label: "Email digest", name: "digest" }),
            switchInput({ label: "Push alerts", name: "push", checked: true }),
          ]),
        ]),
        cardFooter({}, [push({}), button({ variant: "primary" }, "Save preferences")]),
      ]),
  }),

  example({
    title: "Search bar example",
    description: "An input paired with a button in a row.",
    render: () =>
      card(
        {},
        row({ gap: 2 }, [
          input({ type: "search", placeholder: "Search for anything…", "aria-label": "Search" }),
          button({ variant: "primary" }, "Search"),
        ])
      ),
  }),
];
