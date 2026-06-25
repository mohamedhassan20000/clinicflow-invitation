/**
 * ClinicFlow CRM — RSVP collector (Google Apps Script Web App)
 * --------------------------------------------------------------
 * Receives an x-www-form-urlencoded POST from the RSVP site and appends
 * one row to the bound Google Sheet. Designed for `fetch(..., {mode:'no-cors'})`
 * from a static GitHub Pages site (the browser cannot read the response, so we
 * keep it simple and just write the row).
 *
 * SETUP (see README.md for the full walkthrough):
 *   1. Create a Google Sheet. Extensions → Apps Script.
 *   2. Paste this file. Save.
 *   3. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the /exec URL into assets/js/config.js → RSVP_ENDPOINT.
 *
 * Re-deploy a NEW VERSION whenever you change this script.
 */

var SHEET_NAME = 'RSVPs';

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(20000); // avoid race conditions on concurrent submits

    var sheet = getSheet_();
    var params = (e && e.parameter) ? e.parameter : {};

    var name = String(params.name || '').trim().slice(0, 120);
    if (!name) {
      return json_({ ok: false, error: 'missing name' });
    }

    sheet.appendRow([
      new Date(),                       // timestamp (server time)
      name,                             // attendee name
      String(params.source || ''),      // e.g. "qr-card"
      String(params.userAgent || '')    // device hint
    ]);

    lock.releaseLock();
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Optional: lets you open the /exec URL in a browser to confirm it's live. */
function doGet() {
  return json_({ ok: true, service: 'ClinicFlow RSVP', time: new Date().toISOString() });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Source', 'User Agent']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
