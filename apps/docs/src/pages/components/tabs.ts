import type { KlodsNode } from "klods-js";
import { box, p, stack, switchInput, tabPanel, tabs } from "klods-js";

import { example } from "../../example.js";

export const label = "Tabs";
export const anchor = "tabs";

export const examples: KlodsNode[] = [
  example({
    title: "Tabs",
    render: () =>
      tabs([
        tabPanel(
          { label: "Account" },
          stack({ gap: 3 }, [p("Manage your account settings and preferences."), box("Profile information goes here.")])
        ),
        tabPanel(
          { label: "Security" },
          stack({ gap: 3 }, [
            p("Update your password and security settings."),
            switchInput({ label: "Two-factor authentication", name: "2fa" }),
          ])
        ),
        tabPanel({ label: "Notifications" }, p("Configure how and when you receive notifications.")),
      ]),
  }),
];
