# ClinicFlow CRM — Graduation Invitation RSVP Site

A premium, zero-backend RSVP website for the **ClinicFlow CRM** graduation
presentation by **Mohamed Ibrahim, Osama Talal & Mohamed Seif**, Üsküdar University
— **30 June 2026, 3:00 PM, Hall C-Aziz Sancar**. Built as a single static page (plain HTML/CSS/vanilla JS),
deployable directly from GitHub Pages, with attendance stored in a Google Sheet
via Google Apps Script.

Guests scan the QR on the printed card → land here → enter their name → confirm →
see a custom confirmation page with a live countdown and Add-to-Calendar actions.
They never see a Google form or leave the experience.

---

## 1. Project structure

```
invitation/
├── index.html               # Single page — 3 states (Invite → Form → Confirmation)
├── .nojekyll                # Tells GitHub Pages to serve assets/ as-is
├── assets/
│   ├── css/styles.css       # "Observatory" — Midnight Blue + Silver, dark-first
│   └── js/
│       ├── config.js        # ⚙️ EDIT HERE: RSVP endpoint + event details
│       └── app.js           # State machine, countdown, calendar, .ics, submit
├── google-apps-script/
│   └── Code.gs              # Paste into Apps Script (RSVP → Google Sheet)
└── README.md
```

**The only file you normally edit is [`assets/js/config.js`](assets/js/config.js).**

---

## 2. Run it locally

No build step. Any static server works:

```bash
# Python (preinstalled on macOS)
python3 -m http.server 5173
# then open http://localhost:5173
```

Opening `index.html` directly via `file://` mostly works, but a local server is
recommended so `fetch` and fonts behave like production.

Until you set `RSVP_ENDPOINT`, the site runs in **DEMO mode**: the confirmation
flow, countdown, and calendar all work; the name is only saved to `localStorage`
(nothing is written to a Sheet). The browser console logs the demo RSVP.

---

## 3. Google Sheets + Apps Script setup (RSVP storage)

This is what makes attendance actually get recorded — at zero cost.

1. **Create the Sheet** — go to <https://sheets.new>, name it e.g. `ClinicFlow RSVPs`.
2. **Open the script editor** — in the Sheet: **Extensions → Apps Script**.
3. **Paste the code** — delete the default `Code.gs` contents and paste everything
   from [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Click **Save**.
4. **Deploy as a Web App**:
   - Click **Deploy → New deployment**.
   - Click the gear icon → choose **Web app**.
   - **Description:** `ClinicFlow RSVP`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
   - Click **Deploy**, then **Authorize access** and approve the permissions
     (Google will warn it's an unverified app — this is your own script, click
     *Advanced → Go to … (unsafe)* → Allow).
5. **Copy the Web app URL** — it ends in `/exec`, e.g.
   `https://script.google.com/macros/s/AKfy.../exec`.
6. **Paste it** into [`assets/js/config.js`](assets/js/config.js):
   ```js
   RSVP_ENDPOINT: "https://script.google.com/macros/s/AKfy.../exec",
   ```
7. **Test** — open the site, submit a name, then check the Sheet: a new row
   (`First Seen`, `Name`, `Status`, `Last Updated`, `Client ID`, `Source`, `User Agent`)
   should appear within a second or two.

> **Re-deploying:** if you later edit `Code.gs`, do **Deploy → Manage deployments
> → edit (pencil) → Version: New version → Deploy**. The `/exec` URL stays the same.

### RSVP status: cancel & reconfirm
Attendees can change their mind from the confirmation page:
- **Cancel attendance** → status becomes `Cancelled` (the row is **never deleted**).
- **Confirm attendance again** → status returns to `Attending`.

The Sheet keeps **one row per attendee** (keyed by a random `Client ID` stored in the
visitor's browser) and always reflects the **latest status** plus a `Last Updated`
timestamp. So your guest list is simply the rows where `Status = Attending`.

### Why "no-cors" / optimistic UI
Apps Script web apps don't return CORS headers the browser can read, so the site
POSTs with `mode: "no-cors"`. The response is opaque (unreadable), so the site
treats a sent request as success, shows the confirmation immediately, and keeps a
`localStorage` backup. **The Google Sheet is the source of truth** for the final
guest list — verify it there.

---

## 4. Deploy to GitHub Pages

1. **Create a repo** on GitHub, e.g. `clinicflow-invite`.
2. **Push these files** to the `main` branch:
   ```bash
   cd /Users/mohamedhassan/Desktop/invitation
   git init
   git add .
   git commit -m "ClinicFlow CRM RSVP site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/clinicflow-invite.git
   git push -u origin main
   ```
3. **Enable Pages** — repo **Settings → Pages → Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` · **Folder:** `/ (root)` → **Save**.
4. Wait ~1 minute. Your site goes live at:
   `https://<your-username>.github.io/clinicflow-invite/`

> **Custom domain (optional):** Settings → Pages → Custom domain. Add a `CNAME`
> file with the domain and point DNS at GitHub. A short domain makes a cleaner
> printed fallback URL on the card.

---

## 5. Physical card

Final concept: **"Signal"** (front + integrated-QR back), in **nine personalised
versions** — for Dr. Kristin Surpuhi Benli, Dr. Salim Jibrin Danbatta, Eng. Ali Edris,
Eng. Abdelrahman Mohamed, advisor Dr. Faezeh Rohani, a general “Dear Guest” card, a
personal card for Gehad Ali, and **Arabic** cards (front & back) for the presenter's
mother and father. Each front carries a tailored
invitation message; the back (honour line + level-H QR → live RSVP site) is shared. **Download hub** with per-side
PDF buttons: [`card/index.html`](card/index.html). Source + details:
[`card/card.html`](card/card.html), [`card/README.md`](card/README.md).

---

## 6. Optional: analytics

Privacy-light and free. To add **GoatCounter**:
1. Create a site at <https://www.goatcounter.com>.
2. Add their `<script>` tag before `</body>` in `index.html`.
3. Set `ANALYTICS_ENABLED: true` in `config.js` (reserved for future custom events).

Or simply count rows in the Google Sheet — that's your RSVP total.

---

## 7. Editing event details

All copy lives in two synced places (keep them identical to the printed card):
- **`assets/js/config.js → EVENT`** drives the calendar links and countdown.
- **`index.html`** holds the visible text (hero, chips, confirmation card).

If the time/room changes, update both. The countdown targets
`EVENT.start` (`2026-06-30T15:00:00+03:00`).

---

## 8. Pre-event checklist

- [ ] `RSVP_ENDPOINT` set and a test submit appears in the Sheet
- [ ] Site loads on a real phone (iOS + Android), no horizontal scroll
- [ ] Google Calendar link opens prefilled; Apple `.ics` downloads & opens with
      correct title/time/location
- [ ] Countdown shows correct days remaining (TR time)
- [ ] Lighthouse: Performance & Accessibility ≥ 95
- [ ] Final URL locked → ready for QR generation
```
