# ClinicFlow CRM — Physical Invitation Cards (FINAL)

Print artwork for the printed invitation. Concept **"Signal"**, **Midnight Blue + Silver**,
matching the RSVP website. Three personalised versions, each a front + back.

## ⬇️ Download hubs

- **5 × 7 in** (127 × 178 mm): **[`card/index.html`](index.html)** → `…/clinicflow-invitation/card/`
- **A6** (105 × 148 mm): **[`card/a6.html`](a6.html)** → `…/clinicflow-invitation/card/a6.html`

Each version has separate **Front PDF** and **Back PDF** buttons (plus a “both sides” combined
PDF). A6 files live in [`card/exports/a6/`](exports/a6/) — 111 × 154 mm pages (trim + 3 mm bleed),
~360 dpi, generated from the same design as the 5×7 cards.

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
| **Talal Ali** (`?v=talalali`) | Eng. Talal Ali | Formal invitation + supervision line. |
| **Anas** (`?v=anas`) | Anas Talal | Formal invitation + supervision line. |
| **Rasha** (`?v=rasha`) | Rasha Said | Formal invitation + supervision line. |
| **Hana** (`?v=hana`) | Hana Ashraf | Formal invitation + supervision line. |
| **Mohamed Ali** (`?v=mohamedali`) | Eng. Mohamed Ali | Formal invitation + supervision line. |
| **Ahmet** (`?v=ahmet`) | Eng. Ahmet Aslan | Formal invitation + supervision line. |
| **Yusuf** (`?v=yusuf`) | Eng. Yusuf Abdelmalek | Formal invitation + supervision line. |
| **Mohamed Amin** (`?v=mohamedamin`) | Eng. Mohamed Amin (friend & brother) | Warm invitation + supervision line. |
| **Hossam** (`?v=hossam`) | Eng. Hossam Hassan (brother) | Warm invitation to his brother + supervision line. |
| **Khaled** (`?v=khaled`) | Khaled Hassan (brother) | Warm invitation to his brother + supervision line. |
| **Gehad** (`?v=gehad`) | Gehad Ali (life partner & future wife) | Personal, heartfelt invitation + supervision line. |
| **Mother** (`?v=mother`) | أمي الحبيبة (my beloved mother) | **Arabic** (RTL, Amiri) heartfelt invitation — **front & back** + supervision line. |
| **Father** (`?v=father`) | أبي الحبيب (my beloved father) | **Arabic** (RTL, Amiri) heartfelt invitation — **front & back** + supervision line. |
| **Sheikh** (`?v=sheikh`) | الشيخ أبو صهيب التابعي الأثري | **Arabic** (RTL, Amiri) heartfelt invitation — **front & back** + supervision line. |

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

- **Size (no bleed):** exactly **5 × 7 in (127 × 178 mm)** — `exports/` — or **A6 105 × 148 mm** — `exports/a6/`. Portrait.
- The design **fills the page edge-to-edge — no white border**. Print at **actual size / 100 %** (not “fit to page”).
- **No outer border**, no bleed (the earlier 3 mm-bleed versions were replaced).
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
