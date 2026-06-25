/* =====================================================================
   ClinicFlow CRM — RSVP app (v2)
   Vanilla JS. Premium landing + 3-state flow + RSVP status management
   (confirm / cancel / reconfirm) + countdown + calendar + data-flow bg.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var EVENT = CFG.EVENT || {};
  var STORAGE_KEY = "clinicflow_rsvp";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(2, "0"); }

  /* =================================================================
     Animated data-flow background (network + travelling pulses)
     ================================================================= */
  function initBackground() {
    var canvas = $("bg-canvas");
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext("2d");
    var W, H, DPR, nodes = [], pulses = [], raf;

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }
    function build() {
      var count = Math.max(28, Math.min(64, Math.round((W * H) / 26000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() * 1.5 + 0.6,
        });
      }
    }
    function spawnPulse() {
      if (nodes.length < 2) return;
      var a = (Math.random() * nodes.length) | 0;
      var b = nearest(a);
      if (b < 0) return;
      pulses.push({ a: a, b: b, t: 0, sp: 0.006 + Math.random() * 0.01 });
    }
    function nearest(i) {
      var best = -1, bd = 170 * 170;
      for (var j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        var d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = j; }
      }
      return best;
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      // edges
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            var o = (1 - dist / 150) * 0.22;
            ctx.strokeStyle = "rgba(160,180,220," + o.toFixed(3) + ")";
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      // nodes
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.fillStyle = "rgba(199,206,219,0.5)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      // travelling pulses (data-flow)
      for (var q = pulses.length - 1; q >= 0; q--) {
        var pu = pulses[q]; pu.t += pu.sp;
        if (pu.t >= 1) { pulses.splice(q, 1); continue; }
        var A = nodes[pu.a], B = nodes[pu.b];
        if (!A || !B) { pulses.splice(q, 1); continue; }
        var x = A.x + (B.x - A.x) * pu.t, y = A.y + (B.y - A.y) * pu.t;
        var glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
        glow.addColorStop(0, "rgba(120,170,255,0.9)");
        glow.addColorStop(1, "rgba(120,170,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    window.addEventListener("resize", debounce(size, 200));
    setInterval(spawnPulse, 900);
    frame();
  }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* =================================================================
     State machine
     ================================================================= */
  var screens = { invite: $("screen-invite"), form: $("screen-form"), confirm: $("screen-confirm") };

  function show(state) {
    Object.keys(screens).forEach(function (key) {
      var el = screens[key]; if (!el) return;
      el.hidden = key !== state;
      el.classList.toggle("is-active", key === state);
    });
    if (screens[state]) {
      screens[state].classList.remove("is-active");
      void screens[state].offsetWidth;
      screens[state].classList.add("is-active");
    }
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }

  /* =================================================================
     Identity + persistence
     ================================================================= */
  function uid() {
    return "cf-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }
  function getLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch (e) { return null; }
  }
  function setLocal(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  var rsvp = getLocal() || null; // { clientId, name, status, updatedAt }

  /* =================================================================
     Navigation
     ================================================================= */
  var toFormBtn = $("to-form-btn");
  if (toFormBtn) toFormBtn.addEventListener("click", function () { show("form"); setTimeout(function () { $("guest-name").focus(); }, 350); });
  var backBtn = $("back-btn");
  if (backBtn) backBtn.addEventListener("click", function () { show("invite"); });

  /* =================================================================
     Form submit (initial confirm)
     ================================================================= */
  var form = $("rsvp-form"), nameInput = $("guest-name"), nameError = $("name-error"), submitBtn = $("submit-btn");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      var honeypot = (form.querySelector('[name="company"]') || {}).value || "";
      if (!name) { nameError.hidden = false; nameInput.classList.add("is-invalid"); nameInput.focus(); return; }
      nameError.hidden = true; nameInput.classList.remove("is-invalid");
      if (honeypot) return;

      rsvp = { clientId: (rsvp && rsvp.clientId) || uid(), name: name, status: "attending", updatedAt: Date.now() };
      setLocal(rsvp);
      sendRsvp("confirm", submitBtn);
      goToConfirmation();
    });
    nameInput.addEventListener("input", function () {
      if (nameInput.value.trim()) { nameError.hidden = true; nameInput.classList.remove("is-invalid"); }
    });
  }

  /* =================================================================
     RSVP network write (no-cors, optimistic) — confirm | cancel
     ================================================================= */
  function sendRsvp(action, btn) {
    var status = action === "cancel" ? "cancelled" : "attending";
    if (rsvp) { rsvp.status = status; rsvp.updatedAt = Date.now(); setLocal(rsvp); }

    if (!CFG.RSVP_ENDPOINT) {
      console.info("[ClinicFlow] DEMO mode — RSVP not sent. action:", action, rsvp);
      return Promise.resolve();
    }
    if (btn) btn.classList.add("is-loading");

    var body = new URLSearchParams();
    body.append("action", action);
    body.append("clientId", rsvp.clientId);
    body.append("name", rsvp.name);
    body.append("status", status);
    body.append("source", "qr-card");
    body.append("userAgent", navigator.userAgent);

    return fetch(CFG.RSVP_ENDPOINT, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString(),
    }).catch(function () {
      toast("Saved on this device.");
    }).finally(function () {
      if (btn) btn.classList.remove("is-loading");
    });
  }

  /* =================================================================
     Confirmation screen + status rendering
     ================================================================= */
  var panel = $("screen-confirm") ? $("screen-confirm").querySelector(".panel--confirm") : null;
  var badge = $("status-badge"), badgeText = $("status-badge-text");
  var welcomeEl = $("guest-welcome"), confirmHeading = $("confirm-heading"), confirmSub = $("confirm-sub");
  var cancelBtn = $("cancel-btn"), reconfirmBtn = $("reconfirm-btn"), rsvpHint = $("rsvp-hint");
  var thankYou = $("thank-you"), calActions = $("cal-actions");

  function goToConfirmation() {
    var first = (rsvp.name || "guest").split(/\s+/)[0];
    welcomeEl.textContent = first;
    buildCalendarLinks();
    renderStatus(false);
    show("confirm");
    startCountdown();
  }

  function renderStatus(animate) {
    var attending = rsvp.status !== "cancelled";
    var apply = function () {
      if (panel) panel.setAttribute("data-status", attending ? "attending" : "cancelled");
      badge.setAttribute("data-status", attending ? "attending" : "cancelled");
      badgeText.textContent = attending ? "Attending" : "Cancelled";

      if (attending) {
        confirmHeading.innerHTML = "You’re in, <span id=\"guest-welcome\">" + escapeHtml(firstName()) + "</span>";
        confirmSub.innerHTML = "Thank you for confirming. We can’t wait to present <strong>ClinicFlow CRM</strong> to you.";
        thankYou.textContent = "We look forward to seeing you there.";
        rsvpHint.textContent = "Changed your plans? You can update your RSVP anytime.";
        rsvpHint.style.color = "";
        cancelBtn.hidden = false; reconfirmBtn.hidden = true;
        if (calActions) calActions.classList.remove("is-dimmed");
      } else {
        confirmHeading.innerHTML = "Your RSVP is cancelled";
        confirmSub.innerHTML = "No problem, <strong>" + escapeHtml(firstName()) + "</strong> — your seat has been released. You can reconfirm anytime before the event.";
        thankYou.textContent = "Hope to still see you there.";
        rsvpHint.textContent = "Changed your mind? Reconfirm to get your seat back.";
        cancelBtn.hidden = true; reconfirmBtn.hidden = false;
        if (calActions) calActions.classList.add("is-dimmed");
      }
    };
    if (animate && !prefersReduced) {
      var content = panel;
      content.classList.add("swap", "is-out");
      setTimeout(function () { apply(); content.classList.remove("is-out"); }, 200);
    } else { apply(); }
  }
  function firstName() { return (rsvp.name || "guest").split(/\s+/)[0]; }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  if (cancelBtn) cancelBtn.addEventListener("click", function () {
    sendRsvp("cancel", cancelBtn);
    renderStatus(true);
    toast("Attendance cancelled.");
  });
  if (reconfirmBtn) reconfirmBtn.addEventListener("click", function () {
    sendRsvp("confirm", reconfirmBtn);
    renderStatus(true);
    replaySuccess();
    toast("You’re attending again!");
  });

  function replaySuccess() {
    var mark = $("success-mark"); if (!mark || prefersReduced) return;
    mark.style.animation = "none"; void mark.offsetWidth;
    mark.querySelectorAll("circle, path").forEach(function (el) {
      el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
    });
  }

  /* =================================================================
     Countdown
     ================================================================= */
  var countdownTimer = null;
  function startCountdown() {
    var target = new Date(EVENT.start).getTime();
    var live = $("countdown-live"), cd = $("countdown");
    function set(d, h, m, s) { $("cd-days").textContent = pad(d); $("cd-hours").textContent = pad(h); $("cd-mins").textContent = pad(m); $("cd-secs").textContent = pad(s); }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        set(0, 0, 0, 0); cd.classList.add("is-live");
        live.textContent = "The presentation is starting — see you in Hall C-Aziz Sancar!";
        if (countdownTimer) clearInterval(countdownTimer); return;
      }
      set(Math.floor(diff / 86400000), Math.floor((diff % 86400000) / 3600000), Math.floor((diff % 3600000) / 60000), Math.floor((diff % 60000) / 1000));
    }
    tick();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(tick, 1000);
    var diff = target - Date.now();
    if (diff > 0) live.textContent = Math.floor(diff / 86400000) + " days until the presentation.";
  }

  /* =================================================================
     Calendar
     ================================================================= */
  function toUTCStamp(iso) { return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function calDescription() {
    return EVENT.title + "\n" + EVENT.description + "\nPresented by " +
      (EVENT.presenters || []).join(", ") + " — " + EVENT.university + ".";
  }
  function buildCalendarLinks() {
    var g = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(EVENT.project + " — Graduation Showcase") +
      "&dates=" + toUTCStamp(EVENT.start) + "/" + toUTCStamp(EVENT.end) +
      "&details=" + encodeURIComponent(calDescription()) +
      "&location=" + encodeURIComponent(EVENT.location) + "&ctz=Europe/Istanbul";
    var gbtn = $("gcal-btn"); if (gbtn) gbtn.href = g;
  }
  function buildIcs() {
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ClinicFlow CRM//Graduation//EN",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:clinicflow-" + Date.parse(EVENT.start) + "@uskudar",
      "DTSTAMP:" + toUTCStamp(new Date().toISOString()),
      "DTSTART:" + toUTCStamp(EVENT.start), "DTEND:" + toUTCStamp(EVENT.end),
      "SUMMARY:" + EVENT.project + " — Graduation Showcase",
      "DESCRIPTION:" + calDescription().replace(/\n/g, "\\n"),
      "LOCATION:" + EVENT.location, "STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
  }
  function downloadIcs() {
    var blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "clinicflow-crm-showcase.ics";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /* =================================================================
     Toast
     ================================================================= */
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-visible");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 3000);
  }

  /* =================================================================
     Returning visitor → straight to confirmation with saved status
     ================================================================= */
  function restoreIfReturning() {
    if (rsvp && rsvp.name) { goToConfirmation(); }
  }

  /* ---------- init ---------- */
  var icalBtn = $("ical-btn");
  if (icalBtn) icalBtn.addEventListener("click", downloadIcs);
  initBackground();
  restoreIfReturning();
})();
