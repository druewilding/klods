/**
 * klods.js — interactive helpers for vanilla HTML pages.
 *
 * A tiny companion to klods-css that wires up sidebar and nav toggling
 * without requiring a build step or klods-js.
 *
 * Usage:
 *   <script src="https://unpkg.com/klods-css/dist/klods.js"></script>
 *
 * The helpers are exposed on `window.klods`:
 *   klods.toggleSidebar(buttonEl)
 *   klods.toggleNav(buttonEl)
 */
(function (global) {
  "use strict";

  /**
   * Toggle the open/closed state of the sidebar drawer.
   * Pass the toggle button element (or any element inside .klods-page).
   *
   * On first call per page element, auto-wires:
   *  - Clicking a link inside the sidebar closes the drawer.
   *  - Clicking the backdrop (outside sidebar and header) closes the drawer.
   */
  function toggleSidebar(targetEl) {
    var pageEl = targetEl.closest(".klods-page");
    if (!pageEl) return;

    if (!pageEl.hasAttribute("data-sidebar-wired")) {
      pageEl.setAttribute("data-sidebar-wired", "");
      var sidebarEl = pageEl.querySelector(":scope > .klods-sidebar");
      if (sidebarEl) {
        sidebarEl.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        sidebarEl.addEventListener("click", function (e) {
          if (e.target.closest("a")) pageEl.removeAttribute("data-sidebar-open");
        });
      }
      pageEl.addEventListener("click", function (e) {
        if (!pageEl.hasAttribute("data-sidebar-open")) return;
        var headerEl = pageEl.querySelector(":scope > .klods-header");
        if (headerEl && headerEl.contains(e.target)) return;
        pageEl.removeAttribute("data-sidebar-open");
      });
    }

    if (pageEl.hasAttribute("data-sidebar-open")) {
      pageEl.removeAttribute("data-sidebar-open");
    } else {
      pageEl.setAttribute("data-sidebar-open", "");
    }
  }

  /**
   * Toggle the open/closed state of a .klods-nav--collapse element.
   * Pass the toggle button element (or any element inside the nav).
   */
  function toggleNav(targetEl) {
    var navEl = targetEl.closest(".klods-nav--collapse");
    if (!navEl) return;
    if (navEl.hasAttribute("data-nav-open")) {
      navEl.removeAttribute("data-nav-open");
    } else {
      navEl.setAttribute("data-nav-open", "");
    }
  }

  global.klods = { toggleSidebar: toggleSidebar, toggleNav: toggleNav };
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
