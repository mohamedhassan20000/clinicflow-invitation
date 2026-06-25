# ClinicFlow CRM — Physical Invitation Card

Print-ready artwork for the printed invitation. Design direction: **"Observatory" —
Midnight Blue + Silver** (matches the RSVP website).

> ⚠️ **DRAFT — QR pending.** The back currently shows a **QR placeholder**. The real
> QR is added only after the live RSVP URL is **confirmed and tested**, then the
> final print PDF is re-exported. Do not send to print until then.

## Files

| File | Purpose |
|---|---|
| `card.html` + `card.css` | **Source design file** — editable, version-controlled. Open in a browser to preview. |
| `exports/card-front.png` | Front preview image (1512×2088) |
| `exports/card-back.png` | Back preview image (1512×2088) |
| `exports/ClinicFlow-CRM-invitation-card.pdf` | 2-page print PDF (front, back), full bleed |
| `exports/ClinicFlow-CRM-card_GUIDES.pdf` | Same, with trim (green) + safe-area (pink) guides for the print shop |

## Print specification

- **Trim size:** 5 × 7 in (127 × 178 mm), portrait
- **Bleed:** 0.125 in (3 mm) all sides → **artboard 5.25 × 7.25 in** (PDF page size)
- **Safe area:** keep text ≥ 0.1875 in (≈5 mm) inside trim
- **No outer border** (by design — edge interest comes from the bleeding field + motif)
- **Stock (recommended):** 350 gsm soft-touch matte
- **Premium upgrade:** silver foil on the "ClinicFlow CRM" wordmark, CF monogram, and
  hairlines (biggest "doesn't look AI-generated" lever)
- **QR (back):** print **dark-on-ivory** (not silver-on-navy), ≥ 1.4 in, error-correction
  level H, ≥ 4-module quiet zone. Always keep the text URL fallback beneath it.

## Re-exporting

Requires Google Chrome. From this folder:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Front / back PNG previews
"$CHROME" --headless=new --force-device-scale-factor=3 --window-size=504,696 \
  --screenshot="exports/card-front.png" "file://$PWD/card.html?only=front"
"$CHROME" --headless=new --force-device-scale-factor=3 --window-size=504,696 \
  --screenshot="exports/card-back.png" "file://$PWD/card.html?only=back"

# Print-ready 2-page PDF
"$CHROME" --headless=new --no-pdf-header-footer \
  --print-to-pdf="exports/ClinicFlow-CRM-invitation-card.pdf" "file://$PWD/card.html"
```

URL params: `?guides=1` shows trim/safe overlay · `?only=front|back` isolates one side.

## Note on color (CMYK)

These exports are RGB (Chrome). Most local print shops accept high-res RGB PDF and
convert, but for a press run ask the shop whether they want CMYK — if so, the
`card.html` can be opened in Illustrator/Affinity/Inkscape and exported as CMYK
PDF/X-1a, using the CMYK values in the project design plan (Midnight ≈ C100 M86 Y34 K30;
Silver = Pantone 877 C for foil).
