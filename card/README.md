# ClinicFlow CRM — Physical Invitation Cards (FINAL)

Print artwork for the printed invitation. Concept **"Signal"**, **Midnight Blue + Silver**,
matching the RSVP website. Three personalised versions, each a front + back.

## ⬇️ Download hub

Open **[`card/index.html`](index.html)** in a browser (or on the live site at
`…/clinicflow-invitation/card/`) to download every card. Each version has separate
**Front PDF** and **Back PDF** buttons (plus a “both sides” combined PDF).

## The versions

| Version | Addressed to | Front message |
|---|---|---|
| **Kristin** (`?v=kristin`) | Dr. Kristin Surpuhi Benli | Formal invitation + *“Under the supervision of Dr. Faezeh Rohani.”* |
| **Salim** (`?v=salim`) | Dr. Salim Jibrin Danbatta | Formal invitation + supervision line. |
| **Faezeh** (`?v=faezeh`) | Dr. Faezeh Rohani (advisor) | Gratitude-led invitation addressed to her directly (no supervision line). |
| **General** (`?v=general`) | “Dear Guest” | General invitation + supervision line. |
| **Ali** (`?v=ali`) | Eng. Ali Edris | Formal invitation + supervision line. |
| **Abdelrahman** (`?v=abdelrahman`) | Eng. Abdelrahman Mohamed | Formal invitation + supervision line. |
| **Abdelrahman Khaled** (`?v=abdelrahmankhaled`) | Eng. Abdelrahman Khaled | Formal invitation + supervision line. |
| **Hossam** (`?v=hossam`) | Eng. Hossam Hassan (brother) | Warm invitation to his brother + supervision line. |
| **Khaled** (`?v=khaled`) | Khaled Hassan (brother) | Warm invitation to his brother + supervision line. |
| **Gehad** (`?v=gehad`) | Gehad Ali (life partner & future wife) | Personal, heartfelt invitation + supervision line. |
| **Mother** (`?v=mother`) | أمي الحبيبة (my beloved mother) | **Arabic** (RTL, Amiri) heartfelt invitation — **front & back** + supervision line. |
| **Father** (`?v=father`) | أبي الحبيب (my beloved father) | **Arabic** (RTL, Amiri) heartfelt invitation — **front & back** + supervision line. |

The **back is identical** on all three: CF monogram, an honour line, the QR code
(level H → live RSVP site), and the event footer.

## Files

| File | Purpose |
|---|---|
| `card.html` + `card.css` | Source design. `?v=kristin\|faezeh\|general` selects the version; `?only=front\|back` isolates a side; `?guides=1` shows trim/safe guides. |
| `index.html` | Download hub (previews + per-side PDF buttons). |
| `qr/clinicflow-qr.svg` / `.png` | QR (level H) → live RSVP site. |
| `assets/flowfield-front.svg` / `-back.svg` | Signal-arc background graphics. |
| `assets/photos/*-portrait.jpg` | Cropped presenter portraits (originals kept local via `.gitignore`). |
| `exports/<version>-front.pdf` / `-back.pdf` | **Print-ready single-side PDFs** (5.25×7.25 in). |
| `exports/<version>-card.pdf` | Combined 2-page PDF (front+back). |
| `exports/<version>-front.png` / `-back.png` | Preview images. |
| `exports/general-guides.pdf` | Proof with trim (green) + safe (pink) guides for the print shop. |

## Print specification

- **Trim:** 5 × 7 in (127 × 178 mm), portrait
- **Bleed:** 0.125 in (3 mm) → **artboard 5.25 × 7.25 in** ✓ verified
- **Safe area:** text ≥ 0.1875 in inside trim ✓
- **No outer border**
- **Stock:** 350 gsm soft-touch matte recommended
- **Premium upgrade:** silver foil on wordmark/monogram/hairlines — keep the **QR as flat
  dark ink on ivory** (don’t foil it; foil harms scanning).

## QR code

Encodes **https://mohamedhassan20000.github.io/clinicflow-invitation/** · level H · 16.4:1
contrast · ✅ decodes from the exported artwork (incl. the centre CF mark). If the URL ever
changes, regenerate the QR (`qrcode` npm, level H) and re-export.

## Re-exporting

Requires Google Chrome. Example (loop over `general kristin faezeh`):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
v=kristin
"$CHROME" --headless=new --no-pdf-header-footer \
  --print-to-pdf="exports/$v-front.pdf" "file://$PWD/card.html?v=$v&only=front"
"$CHROME" --headless=new --no-pdf-header-footer \
  --print-to-pdf="exports/$v-back.pdf"  "file://$PWD/card.html?v=$v&only=back"
```
