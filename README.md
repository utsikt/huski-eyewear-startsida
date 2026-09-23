# HUSKI EYEWEAR website, version 2.0

Built 2026-09-16. NOT pushed. NOT published anywhere.

`../forhandsvisning/` is version 1.0 and is untouched. It is the rollback:
it is the folder that is wired to the git repo and to Vercel. This folder is a
plain copy plus the changes listed below, so the two can be opened side by side
and compared, and v1 can be restored by doing nothing at all.

## What the client asked for, and where it landed

| Client request | Date | Where it is now |
|---|---|---|
| All the nerd detail must be visible: lenses, weight, material | 2026-09-08 | New `#lenses` section and new `#tech` section |
| Lens category must be obvious per colour | 2026-09-03 and 2026-09-08 | Badge on every product card, own column in `#lenses`, own row in the spec list |
| Retailers, four stores, with Instagram | 2026-09-08 | New `#retailers` section |
| Price 1490 | 2026-09-08 | `1 490 kr` everywhere, cart total in kr |
| Real product photography instead of AI mockups | 2026-09-02 | Six real WebP shots, front and side |

## Changes against v1, file by file

**Images.** All six product shots are rebuilt from the retouched masters in
`02_assets_project/produkt/foto_studio_2026-09-10/frilagt/normaliserat/`.
Each is 1600x960 WebP, `RGBA`, real transparency. Six files, 312 KB together.
v1 carried three files at 1 279 KB, so the page now has twice the images at a
quarter of the weight.

| File | Used where |
|---|---|
| `chocolata.webp` `criollo.webp` `cola.webp` | product cards, cart thumbnails |
| `chocolata-side.webp` `criollo-side.webp` `cola-side.webp` | the lens section |

**Price.** `180 €` became `1 490 kr`, in the cards, in the cart lines and in the
cart total. The JavaScript constant `PRICE` is `1490` and the total is formatted
with a hard space, so `2 980 kr` never breaks across two lines.

**Navigation.** `SHOP / ABOUT / CART` became `SHOP / TECH / STORES / ABOUT / CART`.
Below 520 px `STORES` and `ABOUT` hide, because five items do not fit next to the
logo on a phone. Both sections are still reachable by scrolling.

**Page order.** hero, products, lenses, tech, numbers and about, retailers,
closing image, footer. `#tech` and the existing black `.nums` band share one
continuous dark field, separated by the same hairline the page already uses, so
they read as one chapter and not as two stacked black boxes.

## Two things in here are deliberately unfinished

1. **The COMPLIANCE row in the spec list.** It reads
   `CE compliant and tested to applicable European sunglass standards`.
   It carries an HTML comment marked `LEGAL HOLD`. It must not go live until the
   EU declaration of conformity and the technical file exist in HUSKI EYEWEAR's
   own name. `CE` stamped on the frame is not enough. Asked from the client
   2026-09-16.

2. **The Instagram links in the retailers section.** The client listed four
   stores but supplied no handles. They are rendered as visible placeholders
   marked `data-pending="instagram-handle"` and must not be guessed. Asked from
   the client 2026-09-16.

Search the file for `LEGAL HOLD` and `PENDING` to find both.

## How to look at it

```
open index.html                    # version 2.0
open ../forhandsvisning/index.html # version 1.0, for comparison
```

## Taking a screenshot of this page

A naive headless screenshot comes out blank paper, and it is not a bug in the page.
Two things cause it:

1. The hero is `height: calc(100svh - var(--barh))`. A tall capture window makes the
   hero as tall as the window, so it eats the whole image.
2. The reveal animations use `animation-timeline: view()`. A one-shot headless
   capture never advances that timeline, so those elements stay at their `from`
   state, which is `opacity: 0`.

Chrome on macOS also refuses to open a window narrower than about 485 CSS pixels,
so `--window-size=390` renders at 485 and then crops the image to 390. The right
edge is lost and the page looks broken when it is not.

To get a true picture, build a throwaway copy of `index.html` with an appended
override that sets `.hero { height: 820px !important }` and switches every
animation off, then capture that. For a real phone width, put that copy in an
`<iframe>` exactly 390 px wide: an iframe gets its own viewport, so the media
queries inside answer to 390 and not to the window.

Both checks were run on 2026-09-16 at 1440 px and at 390 px. Measured in the page:
`document.scrollWidth` equals the viewport at 390, 820 and 1440 px, so there is no
sideways scroll, and every product image sits inside its box with even margins.
