/* =====================================================================
   ClinicFlow CRM — RSVP app
   Vanilla JS. Three-state flow + countdown + calendar + Apps Script POST.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var EVENT = CFG.EVENT || {};
  var STORAGE_KEY = "clinicflow_rsvp";

  /* ---------- tiny helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(2, "0"); }
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- element refs ---------- */
  var screens = {
    invite: $("screen-invite"),
    form: $("screen-form"),
    confirm: $("screen-confirm"),
  };
  var form = $("rsvp-form");
  var nameInput = $("guest-name");
  var nameError = $("name-error");
  var submitBtn = $("submit-btn");

  /* ---------- state machine ---------- */
  function show(state) {
    Object.keys(screens).forEach(function (key) {
      var el = screens[key];
      if (!el) return;
      if (key === state) {
        el.hidden = false;
        el.classList.add("is-active");
      } else {
        el.hidden = true;
        el.classList.remove("is-active");
      }
    });
    // restart entry animation
    if (screens[state]) {
      screens[state].classList.remove("is-active");
      void screens[state].offsetWidth; // reflow
      screens[state].classList.add("is-active");
    }
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }

  /* ---------- navigation ---------- */
  var toFormBtn = $("to-form-btn");
  if (toFormBtn) toFormBtn.addEventListener("click", function () { show("form"); nameInput.focus(); });

  var backBtn = $("back-btn");
  if (backBtn) backBtn.addEventListener("click", function () { show("invite"); });

  /* ---------- form submit ---------- */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      var honeypot = (form.querySelector('[name="company"]') || {}).value || "";

      if (!name) {
        nameError.hidden = false;
        nameInput.classList.add("is-invalid");
        nameInput.focus();
        return;
      }
      nameError.hidden = true;
      nameInput.classList.remove("is-invalid");

      if (honeypot) { return; } // silently drop bots

      sendRsvp(name);
      // Optimistic: move to confirmation immediately (opaque response).
      saveLocal(name);
      goToConfirmation(name);
    });

    nameInput.addEventListener("input", function () {
      if (nameInput.value.trim()) {
        nameError.hidden = true;
        nameInput.classList.remove("is-invalid");
      }
    });
  }

  /* ---------- RSVP network write (no-cors, fire-and-forget) ---------- */
  function sendRsvp(name) {
    if (!CFG.RSVP_ENDPOINT) {
      // DEMO mode — no endpoint configured.
      console.info("[ClinicFlow] DEMO mode: RSVP not sent (no RSVP_ENDPOINT). Name:", name);
      return;
    }
    submitBtn.classList.add("is-loading");

    var body = new URLSearchParams();
    body.append("name", name);
    body.append("source", "qr-card");
    body.append("userAgent", navigator.userAgent);

    fetch(CFG.RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString(),
    })
      .then(function () { markSynced(); })
      .catch(function () { toast("Saved on this device — will not block you."); })
      .finally(function () { submitBtn.classList.remove("is-loading"); });
  }

  /* ---------- localStorage backup ---------- */
  function saveLocal(name) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name, ts: Date.now(), synced: false }));
    } catch (e) { /* private mode — ignore */ }
  }
  function markSynced() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      data.synced = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }
  function getLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch (e) { return null; }
  }

  /* ---------- confirmation ---------- */
  var countdownTimer = null;

  function goToConfirmation(name) {
    var first = (name || "guest").split(/\s+/)[0];
    $("guest-welcome").textContent = first;
    buildCalendarLinks();
    show("confirm");
    startCountdown();
  }

  /* ---------- countdown ---------- */
  function startCountdown() {
    var target = new Date(EVENT.start).getTime();
    var live = $("countdown-live");
    var cd = $("countdown");

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        setNums(0, 0, 0, 0);
        cd.classList.add("is-live");
        live.textContent = "The presentation is starting — see you in Hall C-Aziz Sancar!";
        if (countdownTimer) clearInterval(countdownTimer);
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      setNums(d, h, m, s);
    }
    function setNums(d, h, m, s) {
      $("cd-days").textContent = pad(d);
      $("cd-hours").textContent = pad(h);
      $("cd-mins").textContent = pad(m);
      $("cd-secs").textContent = pad(s);
    }
    tick();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(tick, 1000);
    // announce once for screen readers
    var diff = target - Date.now();
    if (diff > 0) {
      live.textContent = Math.floor(diff / 86400000) + " days until the presentation.";
    }
  }

  /* ---------- calendar integration ---------- */
  function toUTCStamp(iso) {
    // -> YYYYMMDDTHHMMSSZ
    return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function calDescription() {
    return EVENT.title + "\n" + EVENT.description + "\nPresented by " + EVENT.presenter +
      " — " + EVENT.university + ".";
  }

  function buildCalendarLinks() {
    var start = toUTCStamp(EVENT.start);
    var end = toUTCStamp(EVENT.end);

    // Google Calendar
    var g = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(EVENT.project + " — Graduation Presentation") +
      "&dates=" + start + "/" + end +
      "&details=" + encodeURIComponent(calDescription()) +
      "&location=" + encodeURIComponent(EVENT.location) +
      "&ctz=Europe/Istanbul";
    var gbtn = $("gcal-btn");
    if (gbtn) gbtn.href = g;
  }

  function buildIcs() {
    var dtStamp = toUTCStamp(new Date().toISOString());
    var uid = "clinicflow-" + Date.parse(EVENT.start) + "@uskudar";
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ClinicFlow CRM//Graduation Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + dtStamp,
      "DTSTART:" + toUTCStamp(EVENT.start),
      "DTEND:" + toUTCStamp(EVENT.end),
      "SUMMARY:" + EVENT.project + " — Graduation Presentation",
      "DESCRIPTION:" + calDescription().replace(/\n/g, "\\n"),
      "LOCATION:" + EVENT.location,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    return lines.join("\r\n");
  }

  function downloadIcs() {
    var blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "clinicflow-crm-presentation.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /* ---------- toast ---------- */
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    setTimeout(function () { toastEl.classList.remove("is-visible"); }, 3200);
  }

  /* ---------- background constellation motif ---------- */
  function drawMotif() {
    var svg = document.querySelector(".motif__svg");
    if (!svg) return;
    var nodesG = svg.querySelector(".motif__nodes");
    var linesG = svg.querySelector(".motif__lines");
    var W = 600, H = 800, COUNT = 26;
    var pts = [];
    for (var i = 0; i < COUNT; i++) {
      pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.6 });
    }
    // connect near neighbours
    var frag = "";
    for (var a = 0; a < pts.length; a++) {
      for (var b = a + 1; b < pts.length; b++) {
        var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        if (Math.sqrt(dx * dx + dy * dy) < 150) {
          frag += '<line x1="' + pts[a].x.toFixed(1) + '" y1="' + pts[a].y.toFixed(1) +
            '" x2="' + pts[b].x.toFixed(1) + '" y2="' + pts[b].y.toFixed(1) +
            '" opacity="' + (0.5 - Math.sqrt(dx * dx + dy * dy) / 300).toFixed(2) + '"/>';
        }
      }
    }
    linesG.innerHTML = frag;
    var ndots = "";
    pts.forEach(function (p) {
      ndots += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + p.r.toFixed(1) + '" opacity="0.7"/>';
    });
    nodesG.innerHTML = ndots;
  }

  /* ---------- returning visitor: skip straight to confirmation ---------- */
  function restoreIfReturning() {
    var data = getLocal();
    if (data && data.name) {
      goToConfirmation(data.name);
    }
  }

  /* ---------- init ---------- */
  var icalBtn = $("ical-btn");
  if (icalBtn) icalBtn.addEventListener("click", downloadIcs);
  drawMotif();
  restoreIfReturning();
})();
