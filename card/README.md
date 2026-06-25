# ClinicFlow CRM — Physical Invitation Card (FINAL)

Print artwork for the printed invitation. Concept: **"Signal"** — data-flow /
tech-launch, **Midnight Blue + Silver**, matching the RSVP website.

## Files

| File | Purpose |
|---|---|
| `card.html` + `card.css` | **Source design file** — final front + back. Open in a browser to preview. |
| `qr/clinicflow-qr.svg` / `.png` | QR code (level H) → the live RSVP site. Embedded on the back. |
| `assets/flowfield-front.svg` / `-back.svg` | Generated flow-field background graphics. |
| `exports/card-front.png` | Front preview (1512×2088) |
| `exports/card-back.png` | Back preview (1512×2088) |
| `exports/ClinicFlow-CRM-invitation-card.pdf` | **Print-ready** 2-page PDF (front, back), full bleed |
| `exports/ClinicFlow-CRM-card_GUIDES.pdf` | Same, with trim (green) + safe (pink) guides for the print shop |
| `concepts/` | The 3 explored concepts + previews (reference / history) |

## Design

- **Front (Signal):** refined "Graduation Showcase 2026" lockup → kicker → gradient
  "ClinicFlow **CRM**" wordmark → subtitle → **centered presenter medallions**
  (Mohamed Ibrahim · Osama Talal · Mohamed Seif) → glass logistics strip with
  **minimalist line icons** for Date / Time / Location. Generated **flow-field**
  data-flow background + soft lighting.
- **Back (integrated QR):** CF monogram → wordmark → framed QR plate with corner
  brackets and an embedded CF mark → scan text + URL fallback → event line →
  Hall C-Aziz Sancar. Flow-field bands top & bottom, centre kept clear for the QR.

## QR code

- Encodes **https://mohamedhassan20000.github.io/clinicflow-invitation/**
- **Error-correction level H** (version 7, 45×45 modules) — survives the centre logo.
- Dark `#0A1733` modules on an ivory `#F4F6FA` tile → **16.4:1 contrast** (verified).
- ✅ Decodes correctly from the exported back artwork, including with the CF logo.
- To re-generate (e.g. if the URL changes): see `qr/` and use the `qrcode` npm package
  at level H, then re-export. **Reprinting is the only costly mistake — keep the URL stable.**

## Print specification

- **Trim:** 5 × 7 in (127 × 178 mm), portrait
- **Bleed:** 0.125 in (3 mm) all sides → **artboard 5.25 × 7.25 in** (PDF page size) ✓ verified
- **Safe area:** text kept ≥ 0.1875 in (≈5 mm) inside trim ✓ verified via guides
- **No outer border**
- **Stock:** 350 gsm soft-touch matte recommended
- **Premium upgrade:** silver foil on the wordmark, monogram, and hairlines (keep the
  QR as flat dark ink on ivory — do **not** foil the QR, it harms scanning)

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
