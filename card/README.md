# ClinicFlow CRM — Physical Invitation Card

Print artwork for the printed invitation. Design language: **Midnight Blue + Silver**,
matching the RSVP website.

> **Current status: choosing a concept.** The card was **redesigned from scratch** and
> the **QR code has been removed** — the card now stands on its own as a premium
> invitation piece. Three concepts are in [`concepts/`](concepts/); once one is chosen,
> it becomes the final `card.html` and the print-ready PDF is exported.

## Concepts (front side) — pick one

| Concept | Direction | Preview |
|---|---|---|
| **1 — Aperture** | Centered keynote; deep negative space; luminous focal mark | `concepts/previews/concept-c1.png` |
| **2 — Editorial Index** | Asymmetric magazine; oversized wordmark; numbered presenters | `concepts/previews/concept-c2.png` |
| **3 — Signal** *(recommended)* | Data-stream / tech-launch; presenter chips; matches the website | `concepts/previews/concept-c3.png` |

Source: [`concepts/concepts.html`](concepts/concepts.html) + [`concepts/concepts.css`](concepts/concepts.css).
View all three in a browser, or isolate one with `?only=c1|c2|c3`.

## Print specification (applies to the final card)

- **Trim:** 5 × 7 in (127 × 178 mm), portrait
- **Bleed:** 0.125 in (3 mm) all sides → **artboard 5.25 × 7.25 in** (PDF page size)
- **Safe area:** keep text ≥ 0.1875 in (≈5 mm) inside trim
- **No outer border**, **no QR**
- **Logistics** (Date / Time / Location) carry **minimalist line icons**
- **Stock:** 350 gsm soft-touch matte recommended
- **Premium upgrade:** silver foil on the wordmark + hairlines

## Re-exporting (after a concept is chosen)

Requires Google Chrome:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# Front preview PNG (per concept)
"$CHROME" --headless=new --force-device-scale-factor=2.5 --window-size=504,696 \
  --screenshot="concepts/previews/concept-c3.png" "file://$PWD/concepts/concepts.html?only=c3"
```

## Deprecated

`card.html`, `card.css`, and `exports/` contain the **older single-presenter version
with a QR placeholder** and are kept only for reference. They will be replaced by the
chosen concept. Do not print them.
