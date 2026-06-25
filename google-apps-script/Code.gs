/**
 * ClinicFlow CRM — RSVP collector (Google Apps Script Web App) — v2
 * --------------------------------------------------------------
 * Stores ONE row per attendee (keyed by clientId) and keeps the latest
 * RSVP status. Supports confirm + cancel (status changes, never deletes).
 *
 * Columns: First Seen | Name | Status | Last Updated | Client ID | Source | User Agent
 *
 * Works with `fetch(..., {mode:'no-cors'})` from a static GitHub Pages site.
 *
 * SETUP (full walkthrough in README.md):
 *   1. Google Sheet → Extensions → Apps Script. Paste this. Save.
 *   2. Deploy → New deployment → "Web app"
 *        Execute as: Me   |   Who has access: Anyone
 *   3. Copy the /exec URL into assets/js/config.js → RSVP_ENDPOINT.
 *   4. After ANY edit here: Deploy → Manage deployments → edit → New version.
 */

var SHEET_NAME = 'RSVPs';
var HEADERS = ['First Seen', 'Name', 'Status', 'Last Updated', 'Client ID', 'Source', 'User Agent'];
var COL = { firstSeen: 1, name: 2, status: 3, updated: 4, clientId: 5, source: 6, ua: 7 };

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var sheet = getSheet_();
    var p = (e && e.parameter) ? e.parameter : {};

    var name = String(p.name || '').trim().slice(0, 120);
    var clientId = String(p.clientId || '').trim().slice(0, 60);
    var action = String(p.action || 'confirm').toLowerCase();
    var status = action === 'cancel' ? 'Cancelled' : 'Attending';
    if (!name) return json_({ ok: false, error: 'missing name' });

    var now = new Date();
    var row = clientId ? findRowByClientId_(sheet, clientId) : 0;

    if (row > 0) {
      // update existing attendee — keep latest status
      sheet.getRange(row, COL.name).setValue(name);
      sheet.getRange(row, COL.status).setValue(status);
      sheet.getRange(row, COL.updated).setValue(now);
      sheet.getRange(row, COL.source).setValue(String(p.source || ''));
      sheet.getRange(row, COL.ua).setValue(String(p.userAgent || ''));
    } else {
      sheet.appendRow([
        now,                              // First Seen
        name,                             // Name
        status,                           // Status
        now,                              // Last Updated
        clientId,                         // Client ID
        String(p.source || ''),           // Source
        String(p.userAgent || '')         // User Agent
      ]);
    }
    return json_({ ok: true, status: status });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Open the /exec URL in a browser to confirm the service is live. */
function doGet() {
  return json_({ ok: true, service: 'ClinicFlow RSVP v2', time: new Date().toISOString() });
}

function findRowByClientId_(sheet, clientId) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var ids = sheet.getRange(2, COL.clientId, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === clientId) return i + 2;
  }
  return 0;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
