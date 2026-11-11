<!--
  SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
  SPDX-License-Identifier: Apache-2.0
-->

# Charts and data visualization

`@enovaui/web-tokens` ships no chart palette. This document fills that gap. Every
value is drawn from the raw colors in `@enovaui/core-tokens` and was **validated by
computation**, not by eye.

---

## 1. Keep the order

```css
/* one series → --app-chart-1; two → 1 and 2; three → 1, 2, 3 ... always from the front */
.series-1 { fill: var(--app-chart-1); }
.series-2 { fill: var(--app-chart-2); }
```

- **The slot order is the colorblind-safety mechanism.** The order was searched so
  that adjacent slot pairs stay apart under colorblind simulation. Reordering
  breaks that guarantee.
- **Never cycle.** A ninth series is not a new color. Fold it into "Other" or
  split into small multiples.
- **Color belongs to the entity.** If a filter reduces the series count, the
  survivors keep their colors.

## 2. Categorical palette (8 slots)

| Slot | Hue | light | dark | Primitive |
|---|---|---|---|---|
| 1 | blue | `#007cc3` | `#0397e9` | sky-blue 50 / 60 |
| 2 | mint | `#309876` | `#37ac85` | mint-green 40 / 45 |
| 3 | orange | `#d66c00` | `#d66c00` | orange 55 |
| 4 | teal | `#01918c` | `#01a298` | teal-green 55 / 60 |
| 5 | yellow | `#a87f00` | `#a87f00` | yellow 55 |
| 6 | magenta | `#f03d72` | `#f03d72` | heritage-red 55 |
| 7 | violet | `#957aff` | `#957aff` | violet 65 |
| 8 | clay | `#cb685a` | `#d97167` | red-brown 55 / 60 |

The CSS variables are `--app-chart-1` ... `--app-chart-8`. `enova-app-tokens.css`
swaps the dark values for you.

### Validation results

Reference surfaces: light `#ffffff`, dark `#000000`. Adjacent pairs (bars, lines, stacks).

| Check | light | dark |
|---|---|---|
| Lightness band (OKLCH L) | PASS, all 8 within 0.43-0.77 | PASS, all 8 within 0.48-0.67 |
| Chroma floor (OKLCH C ≥ 0.10) | PASS | PASS |
| Colorblind separation (OKLab ΔE×100, target ≥ 8) | PASS, worst adjacent 8.1 (yellow↔magenta, deutan) | PASS, worst 8.1 |
| Normal-vision separation (≥ 15) | PASS, worst 16.5 (blue↔mint) | PASS, worst 17.8 |
| Contrast vs surface (≥ 3:1) | PASS, all 8 | PASS, all 8 |

### Scatter, bubble and maps cap at three series

The table above tests **adjacent pairs only**, which is correct for bars, lines and
stacks, which touch only their neighbors. Scatter plots, bubble charts, maps and
small multiples put **every pair** on screen at once, so the bar is higher.

| Slots | All-pairs check |
|---|---|
| 2 | PASS |
| **3** | **PASS ← the cap** |
| 4 or more | FAIL (orange↔yellow collapses to normal-vision ΔE 9.0) |

→ If a scatter-type chart needs more than three, **facet it into small charts or fold
the tail into "Other"** rather than reaching for a fourth color.

## 3. Sequential (magnitude)

One hue, light to dark. `--app-chart-seq-1` ... `-5`.

| | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| light | `#5cc0ff` | `#0397e9` | `#007cc3` | `#005d95` | `#02406b` |
| dark | `#004a77` | `#006dab` | `#018bd6` | `#25b6ff` | `#b2dfff` |

Validation: lightness monotone PASS · adjacent ΔL ≥ 0.06 PASS · light-end contrast
vs surface 2.01 (light) / 2.25 (dark) PASS · single hue (spread 8° / 7°) PASS.

**Never use a rainbow palette.** Magnitude is expressed by the lightness of one hue.

## 4. Diverging (polarity)

Two hues plus a **neutral gray midpoint**.
`--app-chart-div-neg-2 / -neg-1 / -pos-1 / -pos-2`, with the midpoint as `--app-chart-div-mid-color`.

| | −2 | −1 | mid | +1 | +2 |
|---|---|---|---|---|---|
| light | `#a55401` | `#ff9d4c` | `#e6e1d6` | `#5cc0ff` | `#005d95` |
| dark | `#ffb77f` | `#d66c00` | `#5b6062` | `#018bd6` | `#80d0ff` |

**Never put a hue at the midpoint.** If zero carries a color, the polarity stops reading.

## 5. Status colors are reserved

```css
--app-status-good-color
--app-status-warning-color
--app-status-critical-color
```

| | light | dark |
|---|---|---|
| good | `#287d00` (yellow-green-40) | `#5cd59b` (green-80) |
| warning | `#866500` (yellow-45) | `#ffca28` (yellow-80) |
| critical | `#ea1917` (active-red-50) | `#ffb2ab` (active-red-80) |

**Why these do not simply reuse the semantic status tokens.** Those values are tuned
for the page background and collapse on a card. Measured as text on a card:

| Semantic token | light card | dark card |
|---|---|---|
| `on-surface-main-success` | 5.22 ✅ | **3.98 ❌** |
| `surface-default-warning` | **1.88 ❌** | 6.04 ✅ |
| `on-surface-main-error` | 4.52 ✅ | **2.91 ❌** |

No single step clears 4.5:1 on both a white card (`#ffffff`) and a dark card
(`#44484a`), so `--app-status-*` carries per-mode values. Both modes clear
**4.5:1 as text on a card and 3:1 as a mark on the plot surface** (dark measures
5.04-6.04 on card, 11.45-13.73 on plot).

- **Never reuse them as a series color.** "Series 4 is red" reads as an error.
- **Always ship an icon and a text label.** Status is never expressed by color alone.

## 6. Category color outside a chart

**Do not use the categorical palette for UI that is not a chart.** Service icons,
nav tiles, tags, avatars: not charts.

The palette is validated against `#ffffff` and `#000000`, the plot surfaces. A card
is `#ffffff` in light but `#44484a` in dark, which is neither, so nothing about
contrast or colorblind separation is guaranteed there. Borrowing the slots anyway
throws away the only thing that made them trustworthy.

**Distinguish by glyph and label instead.** An icon plus its name identifies a
service better than a hue does, it survives both modes, and it needs no palette.
This is the sanctioned answer, not a workaround.

```css
/* Every tile the same. The glyph is the differentiator. */
.app-tile {
	background-color: var(--app-tile-container-color);
	color: var(--app-tile-label-color);   /* 3.46 light / 4.92 dark, UI floor is 3:1 */
}
```

If a set genuinely needs color to be read at a glance, a heat map or a legend
keyed to a chart, then it is a chart: put it on `--app-chart-surface-color` and use the
slots in order.

## 7. Marks and axes

```css
--app-chart-surface-color   /* plot background. light #ffffff, dark #000000 */
--app-chart-grid-color      /* grid lines = stroke-main */
--app-chart-axis-color      /* axis labels = on-surface-sub */
--app-chart-ink-color       /* value labels = on-surface-main */
```

Why the dark plot background is page black (`#000000`) rather than the card color
(`#44484a`): mono-black's `surface-main` is mist-gray-30, too light to hold a
palette that passes validation. So in dark mode the chart becomes a **dark inset
well** inside the card.

- 2px lines, markers at least 8px across, 4px rounded data ends
- A 2px surface-colored gap between fills, for stacked segments and adjacent bars alike
- Grid and axes recede. Grid in one direction only.
- **Value labels wear text colors.** `--app-chart-ink-color` / `--app-chart-axis-color`. Never put a
  series color on type.

## 8. Do not

- **No dual y-axis.** Two measures of different scale go in two charts, or get
  indexed to a common base. This is the single most common dashboard mistake.
- **One axis.** Never overlay two scales on one axis.
- **No number on every point.** Direct labels are selective, and only at four series or fewer.
- **A legend is always present at two or more series.** With one series the title names
  it, so no legend box is needed.
- **No pie chart past five slices**. Use bars.
- **It may not be a chart at all.** A single number is better as a KPI tile
  (reference-patterns.md).

## 9. Accessibility

- At four series or fewer, pair the legend with direct labels so identity never
  rests on color alone
- Always offer a table view
- Dark is not an automatic inversion; it is the **separate values in the tables above**
- Under `prefers-contrast: high` and `forced-colors`, reinforce with pattern or texture

## 10. If you want to change a value

Do not change it by hand. Make it pass the validator. That is how this palette
was chosen.

```bash
node <dataviz-skill>/scripts/validate_palette.js \
  "#007cc3,#309876,#d66c00,#01918c,#a87f00,#f03d72,#957aff,#cb685a" \
  --mode light --surface "#ffffff"
```

Run it again with `--mode dark --surface "#000000"`, and add `--pairs all` when the
target is a scatter-type chart.
