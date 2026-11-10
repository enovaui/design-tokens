<!--
  SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
  SPDX-License-Identifier: Apache-2.0
-->

# Component recipes

Copy-ready CSS for the parts a page usually needs: a shell, a card, buttons, a
table, a form field, the small feedback components. Not dashboard-only; the same
set carries an admin tool or a landing page.

**This is a document, not a library.** The CSS below is text to paste into your
own stylesheet. Only `.app-card` and `.app-card--outlined` ship as real rules, in
`enova-app-tokens.css`; writing `class="app-btn"` on its own does nothing until
you have copied the button recipe.

**Load `enova-app-tokens.css` first.** Every recipe reads `--app-*` component
tokens that are defined there, which is what lets you move one component without
touching any other ([Rule 2](./design.md#rule-2-name-the-component-do-not-rename-the-role)).
Paste a recipe without that file and each `var(--app-*)` resolves to nothing, the
browser drops the whole declaration, and there is no error to tell you.

**This is not the list of components you are allowed to build.** Tabs, dropdowns,
pagination, trees and calendars are not here, and writing one is normal. Follow
the rules in [design.md](./design.md), give it component tokens the same way
these do, and check both modes. Copying the structure of the closest recipe below
is usually the fastest start.

All of these already avoid the pitfalls in [design.md §8](./design.md#8-pitfalls)
in both modes. Framework does not matter: keep the class names and the same CSS
works in React, Vue, Svelte or plain HTML.

---

## App shell

```html
<header class="app-header">
  <div class="app-container app-header__inner">
    <a class="app-header__brand app-title-sm" href="/">Build Portal</a>
    <nav class="app-header__nav">
      <a class="app-header__link" href="/reports">Reports</a>
      <a class="app-header__link" aria-current="page" href="/builds">Builds</a>
    </nav>
    <button class="app-btn app-btn--tertiary" type="button" data-theme-toggle>Dark mode</button>
  </div>
</header>

<main class="app-container" style="padding-block: var(--app-space-6)">
  <h1 class="app-title-xl">Build dashboard</h1>
  <!-- ... -->
</main>
```

```css
.app-header {
	position: sticky;
	top: 0;
	z-index: var(--app-z-header);
	height: var(--app-header-height);
	background-color: var(--app-header-container-color);
	border-bottom: 1px solid var(--app-header-border-color);
}

.app-header__inner {
	display: flex;
	align-items: center;
	gap: var(--app-space-5);
	height: 100%;
}

.app-header__brand {
	color: var(--app-header-brand-label-color);
	text-decoration: none;
	margin-inline-end: auto;
}

.app-header__nav {
	display: flex;
	gap: var(--app-space-4);
}

.app-header__link {
	color: var(--app-header-link-label-color);
	text-decoration: none;
	font-size: var(--app-text-body-sm-size);
	padding-block: var(--app-space-2);
	border-bottom: 2px solid transparent;
	transition: color var(--app-duration-fast) var(--app-ease-standard);
}

.app-header__link:hover {
	color: var(--app-header-link-label-hover-color);
}

/* The current page is not marked by color alone; an underline rides along. */
.app-header__link[aria-current="page"] {
	color: var(--app-header-link-current-label-color);
	border-bottom-color: var(--app-header-link-current-border-color);
	font-weight: var(--app-header-link-current-weight);
}
```

> For a translucent header with `backdrop-filter: blur()`, use
> `color-mix(in srgb, var(--semantic-color-surface-main) 85%, transparent)` instead of an
> `rgba()` literal. An early adopter hard-coded `rgba(255,255,255,.85)` and ended up
> with a white header in dark mode.

---

## Card

`.app-card` already ships in `enova-app-tokens.css`. It draws **no border**: the
surface reads against the page on its own, measured at 1.18 in light with
elevation-1 on top and 2.27 in dark, where elevation-1 is a heavier shadow
that separates a card from a table of the same fill. Drawing a stroke as
well made every card look heavy, and in light it doubled up with the shadow.

Add `.app-card--outlined` only where a card sits on a surface of its own color,
so the surface cannot separate them: a card inside a card, or a white panel on
white.

Only the hover state needs care.

```css
.app-card--interactive {
	cursor: pointer;
	transition:
		border-color var(--app-duration-normal) var(--app-ease-standard),
		box-shadow var(--app-duration-normal) var(--app-ease-standard),
		transform var(--app-duration-normal) var(--app-ease-standard);
}

.app-card--interactive:hover {
	/* surface-main-hover is nearly white (#eff1f4) in dark, so do not use it.
	 * Lift the shadow and nudge the card instead. */
	box-shadow: var(--app-elevation-2);
	transform: translateY(-2px);
	/* Dark keeps the shadow, but a black scrim on a near-black ground carries less
	 * of the lift than it does in light, so the hover gets a second signal there:
	 * the token is transparent in light and a border color in dark. */
	border-color: var(--app-card-interactive-border-hover-color);
}
```

---

## KPI tile (a single number)

When there is one number to show, the answer is a tile, not a chart.

```html
<div class="app-card app-stat">
  <p class="app-caption app-ink-sub">Successful builds</p>
  <p class="app-display app-stat__value">1,284</p>
  <p class="app-stat__delta app-caption" data-trend="up">
    <span aria-hidden="true">▲</span> 4.2% vs last week
  </p>
</div>
```

```css
.app-stat {
	display: flex;
	flex-direction: column;
	gap: var(--app-space-1);
}

.app-stat__value {
	color: var(--app-stat-value-label-color);
	font-variant-numeric: tabular-nums;   /* fixed digit width, no jitter on refresh */
}

/* Trend uses color AND a glyph. Direction is never stated by color alone.
 *
 * These names describe SENTIMENT, not arithmetic direction. "up" means good news.
 * A falling failure count is good news, so it is data-trend="up" with a down
 * glyph. Pick the value by what the number means, not by which way it moved. */
.app-stat__delta[data-trend="up"]   { color: var(--app-status-good-color); }
.app-stat__delta[data-trend="down"] { color: var(--app-status-critical-color); }
.app-stat__delta[data-trend="flat"] { color: var(--app-stat-delta-label-flat-color); }
```

To lay several out, `.app-grid` is enough.

```html
<div class="app-grid">
  <div class="app-card app-stat">...</div>
  <div class="app-card app-stat">...</div>
</div>
```

---

## Buttons

In light mode the hierarchy comes from the background, but **in dark all three
button surfaces are `#767c7f`**
([design.md §8.3](./design.md#83-primary-secondary-and-tertiary-buttons-are-the-same-color-in-dark)).
So this recipe builds the hierarchy from border and weight in dark.

```html
<button class="app-btn app-btn--primary" type="button">Run build</button>
<button class="app-btn app-btn--secondary" type="button">Settings</button>
<button class="app-btn app-btn--tertiary" type="button">Cancel</button>
<button class="app-btn app-btn--primary" type="button" disabled>Running...</button>

<!-- a row of equal-weight actions, or a file-type tag -->
<button class="app-btn app-btn--chip" type="button">ext4</button>
<button class="app-btn app-btn--chip" type="button">package</button>
<button class="app-btn app-btn--chip" type="button" disabled>cve</button>
```

**`--primary` is for the one action on the view that matters most.** A row of
twelve download links is not twelve primary actions: use `--chip`. An adopted
dashboard filled 36 of them with a brand-red token and the page read as an alarm.

```css
.app-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--app-space-2);
	min-height: 40px;
	padding-inline: var(--app-space-4);
	border: 1px solid transparent;
	border-radius: var(--app-radius-md);
	font-family: inherit;
	font-size: var(--app-text-body-sm-size);
	font-weight: var(--app-btn-weight);
	line-height: 1;
	cursor: pointer;
	transition:
		background-color var(--app-duration-fast) var(--app-ease-standard),
		border-color var(--app-duration-fast) var(--app-ease-standard);
}

.app-btn:disabled {
	cursor: not-allowed;
	background-color: var(--app-btn-container-disabled-color);
	color: var(--app-btn-label-disabled-color);
	border-color: transparent;
}

.app-btn--primary {
	background-color: var(--app-btn-primary-container-color);
	color: var(--app-btn-primary-label-color);
	/* Dark makes all three button surfaces the same gray, so these two carry the
	 * hierarchy there and are inert in light. */
	border-color: var(--app-btn-primary-border-color);
	font-weight: var(--app-btn-primary-weight);
}

.app-btn--secondary {
	background-color: var(--app-btn-secondary-container-color);
	color: var(--app-btn-secondary-label-color);
	border-color: var(--app-btn-secondary-border-color);
}

.app-btn--tertiary {
	background-color: transparent;
	color: var(--app-btn-tertiary-label-color);
}

.app-btn--tertiary:hover {
	background-color: var(--app-btn-tertiary-container-hover-color);
}

/* Hover, and why it is not built from the *-hover token names.
 *
 * This recipe used to define a hover for --tertiary only, so an adopter needing
 * one for the other two reached for the obvious names and shipped a button whose
 * label vanished. Measured as ink on fill:
 *
 *                      light                    dark
 *   primary-hover      #ffffff / #000000  21     #e1e2e5 / #44484a  7.14
 *   secondary-hover    #ea1917 / #ffffff  4.52   #e1e2e5 / #ffffff  1.30  <-
 *
 * Two problems. In lg-brand primary and secondary *trade places* on hover, so a
 * red button turns white and a white button turns brand red, which is not what a
 * hover should say. And in mono-black on-surface-button-secondary-hover is
 * #ffffff where the primary equivalent is correctly #44484a, so the secondary
 * pair is unusable: 1.30. See design.md 8.3.
 *
 * So hover here is a scrim step on the resting fill, which keeps the resting ink
 * valid by construction and works the same way in both modes. */
.app-btn--primary:hover:not(:disabled) {
	background-color: var(--app-btn-primary-container-hover-color);
}

.app-btn--secondary:hover:not(:disabled) {
	background-color: var(--app-btn-secondary-container-hover-color);
	border-color: var(--app-btn-secondary-border-hover-color);
}

/* Chip: a neutral filled block. A file type, a tag, or a row of equal-weight
 * actions. --app-chip-container-color is solid and inverts between modes, because the semantic
 * layer has no dark surface in light mode and cannot express this at all
 * (design.md 8.11). Label 13.77 light / 14.58 dark on the chip.
 *
 * A chip is smaller than a button but it is still something you have to hit, so
 * it keeps a floor of 28px instead of dropping min-height. This recipe first
 * shipped as min-height: auto with 2px of padding, which rendered a 20px box.
 * That is under the 24px minimum in WCAG 2.2 SC 2.5.8, and on the page that
 * adopted it the chips came out smaller than the ones they replaced and were
 * reported as harder to click. See design.md 8.13. */
.app-btn--chip {
	min-height: 28px;
	padding: 4px var(--app-space-3);
	border-radius: var(--app-radius-sm);
	font-size: var(--app-text-caption-size);
	background-color: var(--app-chip-container-color);
	color: var(--app-chip-label-color);
}

.app-btn--chip:hover:not(:disabled) {
	background-color: var(--app-chip-container-hover-color);
}

/* Disabled is an outline, not a fill. --app-table-row-container-hover-color was the first answer and it
 * is a row-background step, not a chip fill: an 8% scrim in light, which
 * composites to #e1e1e1 on a striped row and leaves a chip at 1.20 against the
 * row it sits in, which is to say invisible. A chip with no fill composites the
 * same way on every row it can land on. The outline is deliberately quiet, 2.41
 * light and 2.22 dark, which is the most stroke-sub can do (8.6) and is allowed
 * here because WCAG exempts an inactive control from both 1.4.3 and 1.4.11. */
.app-btn--chip:disabled {
	background-color: transparent;
	border-color: var(--app-chip-border-disabled-color);
	color: var(--app-chip-label-disabled-color);
}


```

---

## Status badge

```html
<span class="app-badge app-badge--good"><span aria-hidden="true">●</span> PASSED</span>
<span class="app-badge app-badge--warning"><span aria-hidden="true">▲</span> UNSTABLE</span>
<span class="app-badge app-badge--critical"><span aria-hidden="true">■</span> FAILED</span>
<span class="app-badge app-badge--neutral">SKIPPED</span>
```

```css
.app-badge {
	display: inline-flex;
	align-items: center;
	gap: var(--app-space-1);
	padding: 2px var(--app-space-2);
	border: 1px solid currentColor;
	border-radius: var(--app-radius-full);
	font-size: var(--app-text-caption-size);
	font-weight: var(--app-badge-weight);
	white-space: nowrap;
}

/* No filled background, just type and border color. --app-status-* was chosen
 * against the card surface (design.md §8.4), so both modes clear 4.5:1.
 * A text label is always present, so color is never the only signal. */
.app-badge--good     { color: var(--app-status-good-color); }
.app-badge--warning  { color: var(--app-status-warning-color); }
.app-badge--critical { color: var(--app-status-critical-color); }
.app-badge--neutral  { color: var(--app-badge-neutral-label-color); }
```

> Measured contrast (text on card, 4.5:1 floor): good 5.22 / 5.04 · warning 5.42 / 6.04 ·
> critical 4.52 / 5.37 (light / dark). The badge still carries **a glyph and a label**.
> Color is only a secondary signal.

---

## Table

```html
<div class="app-card" style="padding: 0; overflow: hidden">
  <table class="app-table">
    <caption class="app-caption app-ink-sub">Last 20 builds</caption>
    <thead>
      <tr><th scope="col">Branch</th><th scope="col">Status</th><th scope="col" class="app-table__num">Duration</th></tr>
    </thead>
    <tbody>
      <tr><td>release-1</td><td><span class="app-badge app-badge--good">●&nbsp;PASSED</span></td><td class="app-table__num">12m 04s</td></tr>
    </tbody>
  </table>
</div>
```

```css
.app-table {
	width: 100%;
	border-collapse: collapse;
	font-size: var(--app-text-body-sm-size);
	line-height: var(--app-text-body-sm-leading);
}

.app-table caption {
	text-align: start;
	padding: var(--app-space-4) var(--app-space-5) var(--app-space-2);
}

.app-table th,
.app-table td {
	padding: var(--app-space-3) var(--app-space-5);
	text-align: start;
	border-bottom: 1px solid var(--app-table-border-color);
}

/* No sticky header. A sticky thead resolves its offset against the nearest
 * scrolling ancestor, and the card above wraps the table in overflow, so the
 * band lands inside the card and sits on top of the first row rather than at
 * the top of the viewport. Measured at 22.6px of overlap on an adopted page.
 * If you want one, the table cannot be inside a clipping card. starter/index.html
 * is the version that renders, and it has no sticky either. */
.app-table thead th {
	background-color: var(--app-table-head-container-color);
	color: var(--app-table-head-label-color);
	font-size: var(--app-text-caption-size);
	font-weight: var(--app-table-head-weight);
	text-transform: uppercase;
	letter-spacing: 0.04em;
}

.app-table tbody tr:last-child td {
	border-bottom: 0;
}

/* Striping is optional and has one correct value: --app-table-row-container-alt-color,
 * which design.md 8.10 measures against all six grounds. Do not reach for a
 * surface step instead; in dark they sit too close to the card and the table
 * reads as blotching. The bottom border alone separates rows well enough, so
 * the starter page ships without stripes.
 *
 * And no shadow on the hover. An adopted page added one and had to take it back
 * out: a row in a border-collapse table has no gap around it, so every pixel of
 * blur lands on the row above and the row below, and the hover reads as a smudge
 * instead of a lift. This is not a matter of choosing a smaller value, since
 * 0 4px 12px and 0 2px 8px both showed it. A shadow needs somewhere to fall,
 * which a card has and a table row does not. The background step is the whole
 * hover. See design.md 8.12. */
.app-table tbody tr:hover td {
	background-color: var(--app-table-row-container-hover-color);
}

/* Qualified with th/td on purpose. A bare `.app-table__num` loses to
 * `.app-table th, .app-table td` above, which is one element more specific, and
 * the alignment silently never applies. */
.app-table th.app-table__num,
.app-table td.app-table__num {
	text-align: end;
	font-variant-numeric: tabular-nums;
}
```

---

## Form field

```html
<div class="app-field">
  <label class="app-field__label app-body-sm" for="branch">Branch</label>
  <input class="app-field__input" id="branch" type="text" value="release-1">
  <p class="app-field__help app-caption">A branch that exists on the remote</p>
</div>

<div class="app-field" data-invalid>
  <label class="app-field__label app-body-sm" for="rev">Revision</label>
  <input class="app-field__input" id="rev" type="text" aria-invalid="true" aria-describedby="rev-err">
  <p class="app-field__error app-caption" id="rev-err">
    <span aria-hidden="true">■</span> Not a 40-character SHA
  </p>
</div>
```

```css
.app-field {
	display: flex;
	flex-direction: column;
	gap: var(--app-space-1);
	margin-block-end: var(--app-space-4);
}

.app-field__label {
	color: var(--app-field-label-color);
	font-weight: var(--app-field-label-weight);
}

.app-field__input {
	min-height: 40px;
	padding-inline: var(--app-space-3);
	font-family: inherit;
	font-size: var(--app-text-body-sm-size);
	color: var(--app-field-input-label-color);
	background-color: var(--app-field-input-container-color);
	border: 1px solid var(--app-field-input-border-color);
	border-radius: var(--app-field-input-radius);
}

/* One indicator: the border turns the focus color and doubles to 2px. The inset
 * shadow carries the second pixel so the layout does not move. A ring outside
 * the border as well reads as two boxes with a gap, so the app layer's global
 * ring is switched off here. */
.app-field__input:focus-visible {
	border-color: var(--app-field-input-border-focus-color);
	box-shadow: inset 0 0 0 1px var(--app-field-input-border-focus-color);
	outline: none;
}

.app-field__input:disabled {
	background-color: var(--app-field-input-container-disabled-color);
	border-color: var(--app-field-input-border-disabled-color);
	color: var(--app-field-input-label-disabled-color);
}

.app-field__help {
	color: var(--app-field-help-label-color);
}

/* An error says it four ways: border color, icon, sentence, aria-invalid.
 * The stroke tokens never reach 3:1 (design.md §8.6), so a border is not enough. */
.app-field[data-invalid] .app-field__input {
	border-color: var(--app-field-input-border-invalid-color);
}

.app-field__error {
	display: flex;
	align-items: center;
	gap: var(--app-space-1);
	color: var(--app-field-error-label-color);
}
```

---

## Alert

```html
<div class="app-alert app-alert--critical" role="alert">
  <span aria-hidden="true">■</span>
  <div>
    <p class="app-title-sm">Build failed</p>
    <p class="app-body-sm">A compile error occurred in release-2/common.</p>
  </div>
</div>
```

```css
.app-alert {
	display: flex;
	gap: var(--app-space-3);
	padding: var(--app-space-4);
	border: 1px solid currentColor;
	border-radius: var(--app-radius-lg);
	/* The background is the card color. --app-status-* was validated against the
	 * card, so 4.5:1 only holds here. On the page background
	 * (background-main #f0ece4) light measures good 4.43 / critical 3.83, below the floor. */
	background-color: var(--app-alert-container-color);
}

.app-alert > div     { color: var(--app-alert-label-color); }
.app-alert--good     { color: var(--app-status-good-color); }
.app-alert--warning  { color: var(--app-status-warning-color); }
.app-alert--critical { color: var(--app-status-critical-color); }
```

### Toast

A toast uses `surface-toast`, and **that token inverts between modes**: light
`#262626` (dark) versus dark `#8e9394` (light). So the text color cannot be one
token. This is the only pairing that measures clean.

```css
.app-toast {
	position: fixed;
	inset-block-end: var(--app-space-5);
	inset-inline-start: 50%;
	translate: -50% 0;
	z-index: var(--app-z-toast);
	padding: var(--app-space-3) var(--app-space-5);
	border-radius: var(--app-toast-radius);
	background-color: var(--app-toast-container-color);
	/* surface-toast inverts between modes, so the ink has to as well:
	 * 15.13 on #262626 in light, 6.07 on #8e9394 in dark. */
	color: var(--app-toast-label-color);
}
```

Leaving `on-surface-white` in place measures 3.11 in dark, below the floor.

---

## Modal dialog

**Do not use `surface-dialog-popup` for the panel.** In light it resolves to
`#f0ece4`, which is the page background, and `--app-status-*` is short of contrast
there (design.md section 8.8). Put the panel on `surface-main`, the same surface as
a card, which is what the status colors were validated against.

```html
<dialog class="app-dialog" id="detail" aria-labelledby="detail-title">
  <div class="app-dialog__head">
    <h2 class="app-title-sm" id="detail-title">Build #2814</h2>
    <span class="app-badge app-badge--good"><span aria-hidden="true">&#9679;</span> PASSED</span>
  </div>
  <div class="app-dialog__body app-body-sm">
    <p>Anything you like.</p>
  </div>
  <div class="app-dialog__foot">
    <button class="app-btn app-btn--secondary" type="button" data-close>Close</button>
  </div>
</dialog>
```

```css
.app-dialog {
	max-inline-size: min(520px, calc(100vw - var(--app-space-6)));
	padding: 0;
	border: 1px solid var(--app-dialog-border-color);
	border-radius: var(--app-dialog-radius);
	background-color: var(--app-dialog-container-color);
	color: var(--app-dialog-label-color);
	box-shadow: var(--app-elevation-3);
}

/* The dim. Custom properties inherit into ::backdrop in current browsers; older
 * ones simply render no dim, which degrades cleanly. */
.app-dialog::backdrop {
	background-color: var(--app-dialog-backdrop-container-color);
	opacity: var(--primitive-opacity-a50);
}

.app-dialog__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--app-space-4);
	padding: var(--app-space-5);
	border-bottom: 1px solid var(--app-dialog-head-border-color);
}

.app-dialog__body {
	padding: var(--app-space-5);
}

.app-dialog__foot {
	display: flex;
	justify-content: flex-end;
	padding: var(--app-space-4) var(--app-space-5);
	border-top: 1px solid var(--app-dialog-foot-border-color);
}
```

```js
const dialog = document.getElementById('detail');

// showModal() gives Escape, the backdrop and the focus trap for free.
openButton.addEventListener('click', () => dialog.showModal());
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());

// A click that lands on the element itself is a click on the dim, not the panel.
dialog.addEventListener('click', (e) => {
	if (e.target === dialog) dialog.close();
});
```

Use `<dialog>` with `showModal()` rather than a hand-built overlay: Escape,
the backdrop, the focus trap and returning focus to the opener all come for free.

---

## Footer

Two traps here, both about picking the token whose name looks right.

`surface-default-placeholder` is not a footer surface. On it, white text measures
**2.37 light / 3.11 dark**. There is a `surface-footer` for exactly this, dark in
both modes, and white on it measures **12.63 / 9.24**. In mono-black it is the
same `mist-gray-30` as `surface-main`, so the footer separates from the page
ground rather than from the cards. That is the intended look, not a bug.

And do not reach for `on-surface-footer` to pair with it: that one is a dark ink
(`#4a4946` / `#2d2d2d`), so on `surface-footer` it lands at **1.40 / 1.49**. See
[design.md §8.7](./design.md#87-an-on-surface-name-is-not-the-ink-for-the-surface-of-the-same-name).

```css
.app-footer {
	padding-block: var(--app-space-7);
	background-color: var(--app-footer-container-color);
	text-align: center;
}

.app-footer__text {
	color: var(--app-footer-text-label-color);
}
```

---

## Empty state

```html
<div class="app-card app-empty">
  <p class="app-title-sm">No builds to show</p>
  <p class="app-body-sm app-ink-sub">Widen the filter or pick another branch.</p>
  <button class="app-btn app-btn--secondary" type="button">Reset filters</button>
</div>
```

```css
.app-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--app-space-3);
	padding-block: var(--app-space-7);
	text-align: center;
}
```

---

## Common mistakes

| Mistake | Instead |
|---|---|
| `rgba(255,255,255,.85)` for a translucent surface | A layer-3 token holding `color-mix(in srgb, var(--semantic-color-surface-main) 85%, transparent)` |
| `surface-main-hover` or `surface-sub` for a dark row hover | `--app-table-row-container-hover-color`. In dark `surface-sub` is **lighter** than the card, so half the rows lift. See design.md 8.10 |
| Striping from a surface step | `--app-table-row-container-alt-color`, or no stripes at all |
| Status by color alone | Color + glyph + label |
| Error-colored text on a dark card | Put it on a card with `--app-status-*`, or use a bordered badge |
| `text-align: right` on numbers without `font-variant-numeric` | Always `tabular-nums` |
| Button hierarchy from background alone | In dark, add border and weight |
| Semantic status tokens for status on a card | `--app-status-good-color / -warning / -critical` |
| `surface-default-placeholder` for a footer | `surface-footer`, and white ink rather than `on-surface-footer` |
| Assuming `on-surface-X` is the ink for `surface-X` | Measure it. 18 of the 21 name pairs fail, 7 of them at 1.00 |
| The chart palette for service icons or tags | Same tile for all of them; the glyph is the differentiator |
| A border on every card | None by default. `.app-card--outlined` only when the surface cannot separate them |
| `surface-dialog-popup` for a modal panel | `surface-main`, the surface the status colors were validated on |
| A bare `.app-table__num` for number alignment | Qualify it as `th.app-table__num, td.app-table__num` or it loses on specificity |
