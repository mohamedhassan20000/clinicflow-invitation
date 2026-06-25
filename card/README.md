# ClinicFlow CRM — Physical Invitation Card (FINAL)

Print artwork for the printed invitation. Concept: **"Signal"** — data-stream /
tech-launch, **Midnight Blue + Silver**, matching the RSVP website. **No QR code.**

## Files

| File | Purpose |
|---|---|
| `card.html` + `card.css` | **Source design file** — final front + back. Open in a browser to preview. |
| `exports/card-front.png` | Front preview (1512×2088) |
| `exports/card-back.png` | Back preview (1512×2088) |
| `exports/ClinicFlow-CRM-invitation-card.pdf` | **Print-ready** 2-page PDF (front, back), full bleed |
| `exports/ClinicFlow-CRM-card_GUIDES.pdf` | Same, with trim (green) + safe (pink) guides for the print shop |
| `concepts/` | The 3 explored concepts + previews (reference / history) |

## Design

- **Front (Signal):** status badge → kicker → gradient "ClinicFlow **CRM**" wordmark →
  subtitle → presenter chips (Mohamed Ibrahim · Osama Talal · Mohamed Seif) → glass
  logistics strip with **minimalist line icons** for Date / Time / Location. Subtle
  flowing data-stream lines + soft lighting in the background.
- **Back (branding):** CF monogram → wordmark → tagline → event line
  (Graduation Showcase · 29 June 2026 · Üsküdar University) → Hall C-Aziz Sancar.

## Print specification

- **Trim:** 5 × 7 in (127 × 178 mm), portrait
- **Bleed:** 0.125 in (3 mm) all sides → **artboard 5.25 × 7.25 in** (PDF page size) ✓ verified
- **Safe area:** text kept ≥ 0.1875 in (≈5 mm) inside trim
- **No outer border · No QR**
- **Stock:** 350 gsm soft-touch matte recommended
- **Premium upgrade:** silver foil on the wordmark, monogram, and hairlines

## Re-exporting

Requires Google Chrome:

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

Exports are RGB (Chrome). Most local print shops accept high-res RGB PDF and convert.
For a press run, open `card.html` in Illustrator/Affinity/Inkscape and export CMYK
PDF/X-1a (Midnight ≈ C100 M86 Y34 K30; Silver = Pantone 877 C for foil).
