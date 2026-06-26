/* =====================================================================
   ClinicFlow CRM — Invitation / RSVP site configuration
   Single source of truth. Edit values here only.
   ===================================================================== */

window.CONFIG = {
  /* ------------------------------------------------------------------
     1) RSVP endpoint — your deployed Google Apps Script Web App URL.
        Looks like: https://script.google.com/macros/s/AKfy.../exec
        Leave as "" to run the site in DEMO mode (no network write;
        cancel/reconfirm still work locally via localStorage).
        See README.md → "Google Sheets + Apps Script setup".
     ------------------------------------------------------------------ */
  RSVP_ENDPOINT: "",

  /* ------------------------------------------------------------------
     2) Event details — keep in sync with the printed card.
        `start` / `end` are ISO 8601 with the +03:00 Türkiye offset.
     ------------------------------------------------------------------ */
  EVENT: {
    project: "ClinicFlow CRM",
    title: "ClinicFlow CRM – Clinic Management System",
    description: "Clinic Management CRM Web Application",
    presenters: ["Mohamed Ibrahim", "Osama Talal", "Mohamed Seif"],
    university: "Üsküdar University",
    location: "Hall C-Aziz Sancar, Üsküdar University",
    start: "2026-06-30T15:00:00+03:00", // 30 June 2026, 3:00 PM (TR)
    end: "2026-06-30T16:00:00+03:00",   // assumed ~1h — adjust if needed
  },

  /* Analytics: set to true once you add a GoatCounter script in index.html */
  ANALYTICS_ENABLED: false,
};
