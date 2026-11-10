<!--
  SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
  SPDX-License-Identifier: Apache-2.0
-->

# Enova Design Guide: web pages and dashboards

**Audience**: anyone building a web page, dashboard, admin tool or sample on the
Enova design tokens, by hand or with an AI coding tool.
**Goal**: make separately-built pages share one look and feel, using nothing but
the `@enovaui` design tokens.
**Prerequisites**: none. Plain HTML/CSS, React, Vue, Svelte and Lit all work.
No framework and no component library is required.

The tokens are on npm under Apache-2.0, so nothing here depends on being inside
one organization. Two items are environment-specific and flagged where they come
up: vendoring the CSS when a network policy blocks the CDN ([§3-C](#c-vendoring-when-a-network-policy-blocks-unpkg)),
and the LG Smart UI brand face, which is not on a public CDN and falls back to the
next font in the stack.

Written against **@enovaui/core-tokens 3.9.0** and **@enovaui/web-tokens 3.9.0**.

Setup manual for app developers: [README.md](./README.md).

---

## 1. The three layers

```
layer 1  --primitive-*   @enovaui/core-tokens    raw values    color 522 · font-size 63 · spacing 66 · radius 34
layer 2  --semantic-*    @enovaui/web-tokens     meaning       color 158 × 5 modes · radius 59 · font-weight 9
layer 3  --app-*         enova-app-tokens.css    what you use  roles for the gaps · component tokens
```

- **Layer 3 is the one your CSS reads.** A rule that names `--semantic-color-*`
  directly has nowhere to be overridden: changing it means changing the semantic
  token, and that moves every other component sharing it. See
  [Rule 2](#rule-2-name-the-component-do-not-rename-the-role).
- **Layer 2 is still where color comes from**, with no exceptions. It is the
  value your layer 3 tokens resolve to, not the name your rules quote.
- Layer 1 is used directly only on the axes layer 2 does not cover (font-size, spacing).
- **Layer 3 holds two kinds of token**, told apart by the first word of the name:
  **roles** for what layer 2 has no word for at all (`--app-status-good-color`,
  `--app-space-4`, `--app-elevation-2`), and **component tokens** that give one
  component somewhere to be moved (`--app-chip-container-color`, `--app-card-border-color`).
  What it never holds is a third kind, a second name for a layer 2 role.

Two modes are in use.

| | File | Character |
|---|---|---|
| light | `color-semantic-lg-brand.css` | LG brand. Warm gray ground, active red accent |
| dark | `color-semantic-mono-black.css` | Mono black. The dark pair for lg-brand |

All five modes (`lg-brand`, `web`, `mono-white`, `mono-black`, `mobile`) define **the
same 158 keys**. That is why a mode switch is a one-line file swap, and why your
CSS never has to know which mode is active.

### Want different colors? Change the mode, not the package

Those five files are the whole color choice, and swapping between them costs one
line. Note that `color-semantic-mobile.css` is a **web-tokens** file: a mobile-ish
palette for web, not the mobile package.

Reaching for `@enovaui/mobile-tokens` instead is a different thing, and for a
dashboard it is a downgrade:

| | web-tokens | mobile-tokens |
|---|---|---|
| semantic colors (lg-brand) | **158** | **58** (only 44 shared) |
| `radius-semantic.css` | yes | **no** |
| `typography-semantic.css` | yes | **no** |

Switching loses 114 color names, and without the radius and font-weight
semantics `--app-radius-*` and the whole type ramp stop resolving. The validator
follows whichever package you actually load, so it will tell you exactly which
names you lost, but the answer is almost always "pick another mode".

---

## 2. The six rules

### Rule 1. Never write a raw value

```css
/* NO */   color: #646464;   padding: 16px;   border-radius: 12px;
/* YES */  color: var(--app-ink-sub-color);
           padding: var(--app-space-4);
           border-radius: var(--app-radius-lg);
```

**Color has no exceptions.** Every color comes from a token, always.

Plain geometry is the one carve-out: hairline border widths, a control's
`min-height`, an icon or swatch box, SVG coordinates. There are no tokens for
those, and this folder's own CSS writes them as px. Reach for a token first, and
if none fits, a raw px for pure geometry is fine. The validator only reports
colors, for the same reason.

**Do not manufacture geometry out of a spacing token.** `calc(var(--app-space-2)
/ 4)` is not a token, it is 2px written the long way, and it silently changes if
the scale ever moves. An adopted page did this in twelve places and turned a set
of 1px borders into a mix of 1px and 2px. If the value is geometry, write the px.

**A color inside a data-URI icon is a case of its own, and `currentColor` does
not solve it.** A `fill='%23666'` inside
`background-image: url("data:image/svg+xml,...")` is reported by check 5. Two
wrong ways to answer it, both seen on the same adopted page:

- **Deleting the icon.** It shipped a dropdown with no arrow and no affordance.
- **`fill='currentColor'`.** This is the one that looks correct, which is what
  makes it worse. **A data-URI SVG is a separate document and never sees your
  CSS**, so `currentColor` resolves against the SVG's own initial color, which
  is black. Measured on that select: its own `color` was `#f7f8fa` and the
  rendered arrow pixel came back `rgba(0, 0, 0, 255)`. Silently black in dark,
  and coincidentally right in light, which is how it passed review.

**A `var()` cannot go inside the url() either**, for the same reason. So make the
whole `url()` the token and inline the hex in the app layer, where a documented
value is what layer 3 is for:

```css
select {
	appearance: none;
	background-image: var(--app-select-arrow);   /* per mode, in enova-app-tokens.css */
}
```

`currentColor` is fine in an **inline** `<svg>` in the markup, which is in your
document and does see your CSS. A `mask-image` plus a token `background-color`
also works, where the shape can be masked without hiding the element's text.

### Rule 2. Name the component, do not rename the role

**Your CSS should not read `--semantic-color-*` directly.** Between the semantic
layer and your rules there is a component layer, and that is the one your
components consume:

```css
:root {
	--app-button-fill-container-color: var(--semantic-color-surface-button-primary);
	--app-button-fill-label-color: var(--semantic-color-on-surface-button-primary);
}
.app-btn--primary {
	background-color: var(--app-button-fill-container-color);
	color: var(--app-button-fill-label-color);
}
```

What this rule forbids is a layer that only **renames**:

```css
--app-surface-default: var(--semantic-color-surface-main);   /* NO, a second name */
--app-surface-button-primary: var(--semantic-color-surface-button-primary);  /* NO */
```

The second one is the trap. It has "button" in it, so it sounds like a component
token, but `surface-button-primary` is a role the semantic layer already names
and this is that name with a prefix bolted on. Every primary button still moves
as one block, which is what it did before the layer existed.

**The test is the first word.**

| Starts with | Example | What it is |
|---|---|---|
| a component | `--app-button-fill-container-color` | a **component token**. Override it to change one component |
| a role layer 2 already names, `surface` `on-surface` `stroke` `background` | `--app-surface-button-primary` | a **rename**. Remove it |
| something layer 2 has no word for at all | `--app-status-good-color`, `--app-chart-axis-color` | a **role token**. Keep it, see [8.9](#89-axes-the-semantic-layer-does-not-have) and [8.10](#810-link-row-stripe-and-row-hover-are-layer-3-roles) |

Layer 3 holds the first and the third. A role token carries a value that has to
have one definition, such as a contrast figure measured on a card; a component
token points at one and gives a single component somewhere to be overridden:

```css
--app-status-good-color: var(--primitive-color-yellow-green-40);  /* role: measured once */
--app-badge-good-label-color: var(--app-status-good-color);       /* component: the override point */
```

#### Why the layer has to exist

**So one component can be changed on its own.** If a button's label reads
`--semantic-color-on-surface-main` directly, the only way to change that label is
to override the semantic token, which changes every card title, every table cell
and every paragraph that also uses it. With `--app-button-fill-label-color` the change
is one line and it reaches one component.

**So the design file and the code have the same names.** The Figma component
guide defines each element with a named component variable, `button/fill/label`.
A codebase with no component layer has nothing for that name to land on, and the
mapping has to be carried in someone's head.

#### What a rename costs

`--app-surface-default` for `surface-main` is a second name for one color, and a
reader now has to learn both. It says nothing the semantic name did not, and it
cannot be overridden usefully either, because everything that used `surface-main`
still moves together.

#### Dead references are why the layer must be checked

A layer is not free, and a hand-written one goes wrong quietly. A page that
adopted the tokens before this guide existed built its own, and an audit found
**14 dead variables** in it.

| Broken reference | Real name |
|---|---|
| `--primitive-font-weight-300/400/500/600/700` (5) | `--semantic-font-weight-300...700`, or `--primitive-font-weight-light/regular/medium/semibold/bold` |
| `--semantic-color-on-surface-button` | `on-surface-button-primary` / `-secondary` / `-tertiary` |
| `--semantic-color-on-surface-default-error` | `on-surface-main-error` |
| `--semantic-color-on-surface-default-success` | `on-surface-main-success` |
| 6 further names in the page's own `--<prefix>-*` layer | never defined at all |

**A misspelled custom property does not raise an error.** The declaration is
dropped and the element inherits something else. The symptoms here were only
"font weight doesn't apply" and "the focus ring is missing", so nobody noticed.

That is an argument for running the [validator](#9-pre-ship-checklist), not for
going without the layer. Check 7 separates the two cases: a **rename**, which
this rule is about, from a **component token**, which is expected and is what
layer 3 is for.

#### Already have one? Rename it, do not delete it

The instinct when adopting this guide on a working page is either to keep the
layer as it is or to throw it out. Neither is right. Go through it entry by
entry: the ones that name a component and a part stay, the ones that rename a
role are replaced by component tokens. See
[Migrating an existing page](#migrating-an-existing-page).

#### The platform trap

Those three `--semantic-color-*` names are not typos. They are **real tokens, in
`mobile-tokens`.** They are not in `web-tokens`, which is what that page loaded.

```
--semantic-color-on-surface-button            -> mobile-tokens only
--semantic-color-on-surface-default-error     -> mobile-tokens, webos-m-tokens
--semantic-color-on-surface-default-success   -> mobile-tokens only
```

This is the worst failure mode in the whole guide, because the name greps clean
in the monorepo and looks verified. **207 token names exist for a platform other
than web.** Never confirm a token by grepping the monorepo.

The validator handles this by detecting which packages your source actually loads
(from the `@import` and `<link>` paths) and checking against those. So it is not a
policy about web being the only allowed package. If you deliberately load
mobile-tokens, those names pass and the web-only ones get flagged instead. What it
will not do is let a name through that has no value at runtime.

### Rule 3. Load exactly one color-semantic file

All five mode files declare on a bare `:root`. Loading two does not merge them:
**whichever parses last wins for all 158 names.**

```css
/* NO: mono-black overwrites lg-brand completely */
@import "@enovaui/web-tokens/css/color-semantic-lg-brand.css";
@import "@enovaui/web-tokens/css/color-semantic-mono-black.css";
```

A mode switch is a `<link>` swap. See [§5](#5-mode-switching).

### Rule 4. Give unpublished tokens a fallback

The Enova components use this pattern too. If a name is not in the published set
yet, always pass a second argument.

```css
:root { --app-field-checkbox-radius: var(--semantic-radius-checkbox, var(--primitive-radius-4)); }
```

### Rule 5. Check contrast

4.5:1 for body text, 3:1 for large text (24px, or 18.66px bold) and UI elements.
The traps are collected in [§8](#8-pitfalls).

### Rule 6. A fill is not an ink

A `surface-*` token belongs in `background`. An `on-*` token belongs in `color`.
Swapping them is always a mistake, and the token names carry the distinction, so
there is no need to look a value up. See
[How the color names work](#how-the-color-names-work).

```css
/* NO */   td a { color: var(--semantic-color-surface-button-primary); }
/* YES */  td a { color: var(--app-ink-accent-color); }
```

This is the newest rule and it is here because a page passed every other check
while doing it. That one declaration turned every link on the page into
saturated brand red under lg-brand, and under mono-black, where the same name is
a mid gray, the links sank into the background. **One declaration, and the two
modes failed in opposite directions.**

Nothing caught it. The name is real, it is published, it resolves, it is not
hard-coded. Checks 1 to 5 of the validator all passed. The page was reviewed and
shipped to review with a clean report.

Two things make this easy to get wrong, so neither is a lapse in judgment:

- **A fill token has a perfectly good color in it.** `surface-button-primary` is
  the brand red, and if what you want is a red link, it is the only name in the
  set that obviously contains red. `on-surface-accent` does not read as "red" in
  the way that `button-primary` does.
- **It usually looks fine in whichever mode you are working in.** The failure is
  in the mode you did not open, because the two palettes assign very different
  colors to the same fill name.

Check 6 of the validator now reports it, and follows your own custom properties
to do so, so an alias layer does not hide it.

---

## 3. Installation

### A. With a bundler (recommended)

```bash
npm i @enovaui/core-tokens @enovaui/web-tokens
```

```css
/* app.css: this order matters */
@import "@enovaui/core-tokens/css/color-primitive.css";
@import "@enovaui/core-tokens/css/typography-primitive.css";
@import "@enovaui/core-tokens/css/spacing-primitive.css";
@import "@enovaui/core-tokens/css/radius-primitive.css";
@import "@enovaui/core-tokens/css/opacity-primitive.css";

@import "@enovaui/web-tokens/css/typography-semantic.css";
@import "@enovaui/web-tokens/css/radius-semantic.css";
@import "@enovaui/web-tokens/css/color-semantic-lg-brand.css";   /* only one! */

@import "./enova-app-tokens.css";
```

`@import "@enovaui/..."` inside CSS is a **bare specifier**, so it needs a bundler to
resolve. Vite, webpack (css-loader) and Next handle it as written.

### B. From a CDN (no build step)

For a static page with no build tooling, fetch the files with `<link>`. Bare
specifiers do not work in the browser, so use CDN URLs.

```html
<link rel="stylesheet" href="https://unpkg.com/@enovaui/core-tokens@3.9.0/css/color-primitive.css">
<link rel="stylesheet" href="https://unpkg.com/@enovaui/core-tokens@3.9.0/css/typography-primitive.css">
<link rel="stylesheet" href="https://unpkg.com/@enovaui/core-tokens@3.9.0/css/spacing-primitive.css">
<link rel="stylesheet" href="https://unpkg.com/@enovaui/core-tokens@3.9.0/css/radius-primitive.css">
<link rel="stylesheet" href="https://unpkg.com/@enovaui/core-tokens@3.9.0/css/opacity-primitive.css">
<link rel="stylesheet" href="https://unpkg.com/@enovaui/web-tokens@3.9.0/css/typography-semantic.css">
<link rel="stylesheet" href="https://unpkg.com/@enovaui/web-tokens@3.9.0/css/radius-semantic.css">
<!-- the inline script below injects the color-semantic-*.css link -->
<script>/* paste the no-build IIFE from the bottom of enova-theme.js */</script>
<link rel="stylesheet" href="enova-app-tokens.css">
```

**Pin the version.** One early adopter is still pinned to a pre-1.0 release, many
minor versions behind. Pin it, but write the pin down somewhere you will revisit.
An unpinned URL breaks silently one day, and a forgotten pin quietly rots.

**Moving the pin is a visual change, not a maintenance change.** Semantic names
are stable; their values are not. Measured across the upgrade one adopted page
made, `0.8.2` to `3.5.0`, in lg-brand:

| Token | 0.8.2 | 3.5.0 | |
|---|---|---|---|
| `surface-selection-active` | `#333333` | `#ea1917` | near-black to **brand red** |
| `surface-button-secondary` | `#dbd7ce` | `#ffffff` | beige-gray to **white** |
| `surface-sub` | `#dbd7ce` | `#e6e1d6` | a step lighter |
| `on-surface-accent` | `#ff5449` | `#ea1917` | a step deeper |

Nothing in that page's CSS changed, and its download chips went from dark neutral
to full brand red, while its disabled chip went from gray to white on white. The
checker cannot see any of it, because every name still resolves.

→ **When you move the pin, look at the screen in both modes.** Treat it like a
design review, not a dependency bump.

**The last line is the one that goes missing.** `enova-app-tokens.css` defines
every `--app-*` name, including the type-role classes. Without it, each
`var(--app-*)` resolves to nothing, the browser discards the entire declaration
it sits in, and the page loses all spacing, radius, elevation and typography at
once. There is no error anywhere. An adopted dashboard dropped exactly this line,
kept the file in its `css/` folder, and rendered with zero cell padding and no
card. If you edit the `<head>`, come back and check this line is still there.
[Check 8](#9-pre-ship-checklist) exists for this.

> **Three failed requests in the console are expected, and the primitive `<link>`
> tags above are what makes them harmless.**
>
> The three web-tokens files this path loads, `typography-semantic`,
> `radius-semantic` and one `color-semantic-*`, each begin with an internal
> `@import "@enovaui/core-tokens/css/...";`. That is a bare specifier, so only a
> bundler can resolve it. The browser resolves it against the stylesheet URL
> instead and requests a path that does not exist:
>
> ```
> https://unpkg.com/@enovaui/web-tokens@3.9.0/css/@enovaui/core-tokens/css/color-primitive.css
> ```
>
> unpkg answers with an HTML 404 page, and Chrome blocks that as an opaque
> response, so the console line is **not** a `404` and searching for one will
> not find it. The exact wording moves with the browser version: some builds say
> `net::ERR_BLOCKED_BY_ORB`, others "Response was blocked by CORB". Match on the
> unpkg URL rather than on the message. **Three is the count before any mode
> switch.** Each `color-semantic-*.css` swapped in at runtime drags in its own
> blocked import, so expect one more after the first toggle.
>
> **This is harmless only because you loaded the primitives yourself.** The values
> are already in, so nothing is missing. If you trim the five `core-tokens`
> `<link>` tags on the grounds that web-tokens imports them anyway, every
> `--primitive-*` reference inside the semantic layer resolves to nothing, the
> browser discards each declaration that used one, and the page loses its colors
> with no error to explain why. Keep all five.
>
> Path A does not show this, because a bundler resolves the import. Reported to
> the token owners as ATL-26826.

### C. Vendoring (when a network policy blocks unpkg)

Copy `packages/core-tokens/css/` and `packages/web-tokens/css/` as-is, serve them
from your own host, and change only the URLs from B. The `@import` lines inside the
web-tokens files are bare package specifiers, the same ones B describes, so they
fail from your host too. That is harmless as long as you link the primitive files
yourself, as B does; the failed requests show in the console and nothing else.

### D. Through a component framework's theme (PrimeVue, MUI, Vuetify, shadcn)

If your components come from a framework, **its theme variables are your
component layer.** Rule 2 does not ask for a second one on top. Map the
framework's names to semantic roles in one theme file, and let the framework's
components read them:

```css
:root {
	--p-button-primary-background: var(--semantic-color-surface-button-primary);
	--p-button-primary-color: var(--semantic-color-on-surface-button-primary);
	--p-card-background: var(--semantic-color-surface-main);
}
```

This is the shape a real internal adopter arrived at on its own, with PrimeVue,
before this guide existed: `--p-button-primary-hover-background`, component first
and property last, the same shape as `--app-btn-primary-container-hover-color`.
The validator reads such a file as a
component layer, so check 9 counts only the rules outside it.

Four things still apply:

- **Map to semantics, not primitives.** Pointing a framework's palette scale at
  primitives, `--blue-50: var(--primitive-color-cobalt-blue-99)`, skips layer 2,
  so the mode file can no longer change it and dark mode silently stops at that
  scale. The validator does not flag this, because a primitive reference is a
  legal reference.
- **Rule 3 still holds.** Load exactly one `color-semantic-*.css`, and switch
  modes with [section 5](#5-mode-switching), not with the framework's own dark
  mode toggle, or the two will disagree.
- **Do not forward the state tokens blindly.** Mapping each framework hover slot
  to its `*-hover` semantic name is the obvious move and it is where the known
  traps are: the same PrimeVue page was measured at **1.30** on its secondary
  button hover in mono-black, exactly the figure in
  [8.3](#83-primary-secondary-and-tertiary-buttons-are-the-same-color-in-dark).
  Read section 8 before mapping any hover, active or selected slot.
- **Take `--app-*` for what layer 2 does not have.** Status inks, chart colors,
  the link color and elevation come from `enova-app-tokens.css` whatever renders
  the components.
- **Give the framework's own focus indicator the color, and add nothing.** A
  framework input that already thickens its border on focus, as MUI's outlined
  input does, takes `--app-field-input-border-focus-color` for that border. Do
  not add the field recipe's ring or `--app-focus-ring-*` on top: the two draw a
  double box with a gap between them.

Scan the theme file and your own source with the validator, not the build
output. A framework bundle is full of hard-coded colors that are the
framework's, not yours.

This guide ships no ready-made preset for any framework. The mapping is
short, and writing it is where you decide which hover and selected slots need
the section 8 treatment.

### Migrating an existing page

A page that already loads the tokens is not a smaller job than a new one, it is a
different one. The rules above say what to build; this says what to sort out
first, and in what order.

**1. Sort the color layer, do not delete it.** A page that adopted the tokens
early usually has a `--<prefix>-*` color block. Go through it entry by entry
with the [first-word test](#rule-2-name-the-component-do-not-rename-the-role):

- **Starts with a component**, `--x-card-container-color`: a component token. Keep it,
  and check that every rule for that component reads it rather than reaching past
  it to `--semantic-color-*`.
- **Starts with a role layer 2 already names**, `--x-surface-default`: a rename.
  Replace it with component tokens for the components that were using it. This is
  where the work is, and one rename usually becomes two or three component
  tokens, which is the point: those components can now move separately.
- **Starts with a word layer 2 does not have**, `--x-chart-axis-color`: a role token.
  Keep it.

Deleting the block and letting each rule name `--semantic-color-*` directly is
the fast way out, and it is wrong. It leaves the page with no override point at
all, so changing one component means overriding a semantic token and moving
everything else that shares it.

**2. Delete private scales, but keep a component's own values.** A
`--<prefix>-spacing-*` in raw rem, a `--<prefix>-radius-*`, font sizes that are
not on the ramp: replace them with `--app-space-*`, `--app-radius-*` and the
`.app-*` type classes. The test is whether the value is a rung on a ladder or one
component's decision. `--x-font-size-3xl` is a rung and goes. A 30px cap on one
heading below one breakpoint is that heading's own value, and becomes
`--x-hero-title-size`.

**3. Then check roles, not just names.** With the layer sorted, each component
token says which surface or ink it stands for, and a `surface-*` sitting behind a
`color` becomes visible. Doing this before step 1 means reviewing indirection
instead of color.

**4. Expect the page to change.** A migration that leaves the page pixel-identical
usually means the tokens were bent to match the old design. Contrast fixes and
removed borders are the guide working, not a regression. Decide those on the
result, not during the edit.

**5. Run the validator and read past the first line.** `[OK] No dead token
references` is checks 1 to 5. Checks 6, 7 and 9 are reported separately and are
the ones that speak to this section. **Check 9 is the migration's progress bar**:
it counts the rules still reading `--semantic-*` directly. It reports and passes,
so work the count down, then pass `--strict-layer` to keep it there.

#### Moving the version pin is a design change

An old pin is the usual reason a page looks unlike the rest. Between `0.8.2` and
`3.5.0`, `lg-brand` went from 55 semantic color names to 158, and of the 55 that
existed in both, **24 changed value.** One example, from a real migration:

| | 0.8.2 | 3.5.0 |
|---|---|---|
| `surface-selection-active` | `warm-gray-15`, a pale gray | `active-red-50`, brand red |
| `on-surface-sub` | `mist-gray-50` | `warm-gray-35` |

So a page can be using a token correctly, change nothing but the pin, and look
different. Two consequences worth planning for:

- **Bump the pin in its own commit**, so a color change is not read as a side
  effect of your edits.
- **A misused token is latent until the pin moves.** A fill used as text keeps
  whatever color that fill happened to have. It is not wrong-looking, it is
  wrong, waiting for the palette to move under it.

Chasing the difference by picking whichever token restores the old appearance is
the failure mode here. Pick by role, then judge the result.

---

## 4. Cheat sheet

The semantic names to put in your component tokens, never in a rule (rule 2). The
full list is in [reference-color.md](./reference-color.md).

### How the color names work

Read this once and most of the table below stops needing to be looked up. Every
one of the 158 color names is in exactly one of three families, and the family
tells you which CSS property it belongs to.

| Family | Is | Goes in |
|---|---|---|
| `surface-*`, `background-*`, `scrim-*` | **a fill**, an area of color | `background`, `background-color` |
| `on-*` | **an ink**, what you put on top of a fill | `color`, `fill` |
| `stroke-*` | **a line**, the edge between two areas | `border-color`, `outline-color` |

`on-surface-accent` is ink, `surface-button-primary` is a fill. They are not two
shades of the same thing and they are not interchangeable, which is
[Rule 6](#rule-6-a-fill-is-not-an-ink).

| For | Token |
|---|---|
| Page background | `var(--semantic-color-background-main)` |
| Card background | `var(--semantic-color-surface-main)` |
| Body text | `var(--semantic-color-on-surface-main)` |
| Secondary text | `var(--semantic-color-on-surface-sub)` |
| Link / accent | `var(--semantic-color-on-surface-accent)` |
| Border | `var(--semantic-color-stroke-main)` |
| Primary button | `surface-button-primary` + `on-surface-button-primary` |
| Success / warning / error | `var(--app-status-good-color / -warning / -critical)`. The semantic status tokens fail on a card, see §8.4 |
| Footer surface | `var(--semantic-color-surface-footer)` with `on-surface-white`, never `surface-default-placeholder` |
| Modal dim | `var(--semantic-color-scrim-default)` at `var(--primitive-opacity-a50)` |

| Axis | Scale |
|---|---|
| Type | `.app-hero` `.app-display` `.app-title-lg` `.app-title-md` `.app-title-sm` `.app-body` `.app-body-lg` `.app-body-sm` `.app-caption` `.app-code` |
| Space | `--app-space-1`...`8` = 4 · 8 · 12 · 16 · 24 · 32 · 40 · 64px |
| Radius | `--app-radius-sm/md/lg/xl/full` = 4 · 8 · 12 · 16 · 999px |
| Elevation | `--app-elevation-0/1/2/3` (a real shadow in both modes, a heavier scrim in dark, see [8.12](#812-what-a-dark-shadow-is-actually-separating)) |
| Motion | `--app-duration-fast/normal/slow` + `--app-ease-standard` |

### Where the type ramp comes from

`typography-semantic.css` is **nine font-weight aliases and nothing else**. There
is no type scale, and font-size exists only as 63 raw primitives. So layer 3
defines the ramp.

The steps were not picked freely. They are the subset the Enova UI Kit already
leans on, so a page built from this ramp stays in tune with anything else built on
the same design system:

| Axis | Steps used |
|---|---|
| font-size | 12 · 14 · 16 · 18 · 20 · 24, plus 36 for a hero figure |
| font-weight | regular · medium · semibold · bold |
| spacing | 4 · 8 · 12 · 16 · 24 · 32 · 40 |

Everything outside those steps is available as a primitive, but reach for it only
when a layout genuinely needs it.

### Dashboards and landing pages are different densities

The ramp above is tuned for a dashboard. A landing page wants the same tokens one
step up, and that difference is large enough to look like a mistake if you miss it:
applying the dashboard density to a marketing page shrank its headline by 40%.

| | Dashboard (default) | Landing page |
|---|---|---|
| The page title, once at the top | **`.app-title-xl`** (32) | **`.app-hero`** (clamp 32 to 56) |
| Section heading inside the page | `.app-title-lg` (24) | `.app-title-lg` (24) |
| Running text | `.app-body` (16) | **`.app-body-lg`** (18) |
| Header links | `.app-body-sm` (14) | `.app-body` (16) |
| `--app-header-height` | 64px, brand mark to about 40px | 72px, brand mark to about 48px |

**The page title and a section heading are different roles.** This table used to
give `.app-title-lg` for both, and an adopted dashboard followed it: its one `h1`
went from the browser default 32/700 to 24/600 and stopped reading as the title of
anything. The ramp had nothing between 36 and 24, so `.app-title-xl` (32/700) now
fills it. Use it once per page, on the `h1`.

`.app-hero` is the only responsive role in the ramp. It has to be: a fixed 56px is
wrong on a phone. `.app-display` (36) stays what it is, a KPI figure, not a headline.

---

## 5. Mode switching

light = lg-brand, dark = mono-black. Two things have to agree.

1. Which `color-semantic-*.css` is loaded (the 158 layer-2 colors)
2. The `data-theme` attribute on `<html>` (the layer-3 chart palette and elevation)

If they diverge you get a page where only the charts are dark.
[enova-theme.js](./enova-theme.js) owns both halves so they cannot drift.

```js
import {initTheme, setTheme, toggleTheme} from './enova-theme.js';

initTheme({base: 'https://unpkg.com/@enovaui/web-tokens@3.9.0/css/'});

setTheme('dark');     // 'light' | 'dark' | 'system'
toggleTheme();
```

- The default is `system`: `data-theme` stays unset so the `prefers-color-scheme`
  block applies.
- An explicit choice is stored in `localStorage` and beats the OS setting.
- On a page with no build step, inline the IIFE at the bottom of `enova-theme.js`
  into `<head>` to avoid a flash of the wrong mode.

**If you do not need dark mode**, pin lg-brand with a plain `<link>`, drop the
script, **and put `data-theme="light"` on the `<html>` element**.

That attribute is not optional and dropping it is the trap this section opened
with. `enova-app-tokens.css` guards its dark block with
`@media (prefers-color-scheme: dark) { :root:where(:not([data-theme="light"])) }`,
so with no script nothing ever sets the attribute, and on a machine whose OS is
in dark mode **layer 3 flips while layer 2 stays light**. Measured on a page
built exactly as the sentence above describes: `surface-main` is `#ffffff` and
the card renders white, while `--app-link-label-color` becomes `#5cc0ff`, the value
meant for a dark ground, which is **2.01** on that white card. The chart
palette, the elevation scrim and `--app-chip-container-color` go with it. One
attribute pins layer 3 to light as well.

---

## 6. Component recipes

Cards, KPI tiles, tables, buttons, badges, forms, toasts and an app shell are in
[reference-patterns.md](./reference-patterns.md), ready to copy.
`.app-card`, `.app-container`, `.app-grid` and the type classes already ship in
`enova-app-tokens.css`.

---

## 7. Charts

An 8-slot categorical palette plus sequential, diverging and status sets are
defined for dashboards. The values **pass every computable check in both modes**:
lightness band, chroma floor, colorblind separation (CVD ΔE), normal-vision
separation, and contrast. **The slot order is itself the safety mechanism, so do
not reorder it and do not edit the values.**

```css
.series-1 { fill: var(--app-chart-1); }   /* then --app-chart-2, 3 ... in order */
```

Rules, evidence, and the series cap for scatter plots: [reference-charts.md](./reference-charts.md).

---

## 8. Pitfalls

All measured. The contrast numbers are tabulated in
[reference-color.md](./reference-color.md#contrast-audit-wcag).

### 8.1 Accent red cannot carry body text (light)

`on-background-accent` `#ea1917` on `background-main` `#f0ece4` = **3.83** → below
the 4.5 body-text floor. On a white card (`surface-main` `#ffffff`) it is 4.52,
which just passes.

→ Use brand red for **text on white**, or for large text, icons and UI elements.

**"Large text" is a number, not a feeling.** It clears the 3:1 floor only at
**24px, or 18.66px at weight 700 or above.** Anything smaller needs 4.5 and cannot
be accent on the page ground. An audited page had two links in the same class,
same color, one at 24px/700 and one at **18px/700**. The first passes at 3.83.
The second needs 4.5 and fails, by 0.66px of font size. Round up or change the
color; do not eyeball it.

**In practice this is almost always a link.** Every audited page put accent on a
link and at least one landed on 3.83. It is the most common way to meet this
pitfall, because a link is the one piece of body-sized text people reach for an
accent color for.

```css
/* The value choice now lives in the definition, which is the whole reason the
   layer is there: the page overrides one name and every link moves with it. */

/* NO */   :root { --app-link-label-color: var(--semantic-color-on-background-accent); }  /* fails on the page ground */

/* YES */  :root { --app-link-label-color: var(--semantic-color-on-background-sub); }     /* 5.02 */

/* YES, but read the two paragraphs below before using this one */
           :root { --app-link-label-color: var(--semantic-color-on-surface-accent); }     /* 4.52 on white */

           .page a, .card a {
             color: var(--app-link-label-color);
             text-decoration: underline;
           }
```

**Underline it.** The underline is not decoration here, it is the part that still
works when the color does not. Both of the failures below are invisible on an
underlined link and fatal on a bare one.

**The accent link has two failure modes the 4.52 does not show.**

**One: it is not an accent in dark.** `on-surface-accent` is `#e1e2e5` in
mono-black, and body ink is `#f7f8fa`. Side by side that is **1.22**, so the link
is the same near-white as the text around it. The contrast against the card is a
comfortable 7.14, so nothing fails, and the link is still unfindable. Either
override the accent per [8.2](#82-brand-red-disappears-in-dark) or do not use
accent to mark a link.

**Two: it fails on hover, in both modes.** A hovered row or card becomes
`surface-main-hover`, which is **near-white in light and dark alike** and is the
one surface that does not invert. See
[8.5](#85-surface-main-hover-is-nearly-white-in-dark).

| accent link | at rest | on hover |
|---|---|---|
| light, on `surface-main` `#ffffff` | 4.52 ✅ | **3.83 ❌** on `#f0ece4` |
| dark, on `surface-main` `#44484a` | 7.14 ✅ | **1.14 ❌** on `#eff1f4` |

Light's hover ground `#f0ece4` is the same value this section opened with. If a
row or card hovers, transition the link color with it:

```css
tr:hover a, .app-card:hover a {
	color: var(--app-table-row-label-hover-color);   /* rides the near-white hover ground */
}
```

**Accent is a scarcity budget: one per view.** This section says when accent is
*safe*, and adopters read that as when it is *warranted*. Two audited pages put
accent on the headline, the call to action, the table header band and a rule, then
reported the result as painful to look at. Pick the one thing that should pull the
eye, and let everything else be `on-surface-main` or `on-background-sub`. A link
does not have to be the accent color to read as a link.

**The budget is for static emphasis, and only that.** Said as a bare rule, "once
per view" gets applied to everything colored, which is worse than not saying it.
On the next round the same page stripped accent from its nav hover underline and
its card hover border, and both affordances went dead: the underline measured
**1.30** against the nav and the hover border was set to the same `stroke-sub` the
resting border already used, so hovering changed nothing at all. Two things are
outside the budget:

- **State feedback.** Hover, active, selected, focus. State needs a color channel,
  and these are UI elements at the 3:1 floor rather than body text, so accent is
  the right answer. [8.6](#86-stroke-main-never-reaches-31) says never to express
  state with a border *alone*; this is the opposite error, taking the color out of
  state entirely. When you change a state style, check it still differs from the
  resting style.
- **A brand surface.** A table header band, a primary button fill. That is the
  page's signature, not emphasis competing for the eye.

### 8.2 Brand red disappears in dark

| | light | dark |
|---|---|---|
| `on-surface-accent` | `#ea1917` | `#e1e2e5` (near white) |
| `surface-accent` | `#ea1917` | `#767c7f` (gray) |

mono-black is achromatic by design, so the accent is gray.

**On a page where the brand is part of the content, treat the override as
required, not optional.** A headline that is brand red in light and mid-gray in
dark reads as a bug to everyone except the person who knows the token set.
Override just those tokens in the dark blocks, and keep the value inside the red
ramp so it stays a token.

Override every accent role the page uses, in **both** dark scopes, or the OS-driven
path and the explicit toggle will disagree.

**The page and a card need different steps.** The page ground is `#000000` and a
card is `#44484a`, so one red cannot serve both: `active-red-60` measures 6.62 on
the page but only 2.91 on a card, which fails even the 3:1 UI floor.

```css
@media (prefers-color-scheme: dark) {
	:root:where(:not([data-theme="light"])) {
		/* on the page ground: 6.62 */
		--semantic-color-on-background-accent: var(--primitive-color-active-red-60);
		/* on a card: 4.68, so it clears body text there too */
		--semantic-color-on-surface-accent: var(--primitive-color-active-red-75);
		--semantic-color-stroke-accent: var(--primitive-color-active-red-75);
	}
}

:root[data-theme="dark"] {
	--semantic-color-on-background-accent: var(--primitive-color-active-red-60);
	--semantic-color-on-surface-accent: var(--primitive-color-active-red-75);
	--semantic-color-stroke-accent: var(--primitive-color-active-red-75);
}
```

| Step | on `#000000` page | on `#44484a` card |
|---|---|---|
| `active-red-50` (the light-mode brand red) | 4.65 | **2.05** |
| `active-red-60` | 6.62 | **2.91** |
| `active-red-75` | 10.64 | 4.68 |

### 8.3 Primary, secondary and tertiary buttons are the same color in dark

All three surface tokens resolve to `#767c7f` (mist-gray-50) in mono-black.
Background alone cannot express the hierarchy.

→ In dark, build the hierarchy from the border (`stroke-button` `#eff1f4`) and font
weight. The recipe is in the button section of reference-patterns.md.

**The resting label on that fill is under the floor.** All three variants pair
`#767c7f` with `on-surface-button-*` `#ffffff`. It is a short bold label rather
than body copy, so it is not a hard failure, but do not add to it: no `opacity`,
no lighter weight, and do not put a second gray on top of it.

**And the hover pairs do not behave.** Measured as ink on fill:

| | light | dark |
|---|---|---|
| `primary` rest | `#ea1917` / `#ffffff` 4.52 | `#767c7f` / `#ffffff` **4.23** |
| `primary-hover` | `#ffffff` / `#000000` 21 | `#e1e2e5` / `#44484a` 7.14 |
| `secondary` rest | `#ffffff` / `#000000` 21 | `#767c7f` / `#ffffff` **4.23** |
| `secondary-hover` | `#ea1917` / `#ffffff` 4.52 | `#e1e2e5` / `#ffffff` **1.30 ❌** |

Two separate things are wrong here.

- **In lg-brand, primary and secondary trade places on hover.** A red button turns
  white and a white button turns brand red. Both pass contrast and neither says
  "hover".
- **In mono-black, `on-surface-button-secondary-hover` is `#ffffff`**, where
  `on-surface-button-primary-hover` in the same file is correctly `#44484a`. Same
  inversion, one ink not flipped, so the secondary label is white on a near-white
  fill. There is also a `surface-button-secondary-pressed` with **no matching
  ink token at all**. Treat both as defects in the token set rather than
  something to design around, and raise them.

→ **Do not build a hover from the `*-hover` names.** Take a scrim step off the
resting fill instead, which keeps the resting ink valid by construction and reads
the same way in both modes. The button section of reference-patterns.md now does
exactly that, for primary and secondary both.

### 8.4 The semantic status colors break on a card, so use `--app-status-*`

The semantic status tokens are tuned for the **page** background. Measured as text
on a card, three of them fail.

| Semantic token | light card `#ffffff` | dark card `#44484a` |
|---|---|---|
| `on-surface-main-success` | 5.22 ✅ | **3.98 ❌** |
| `surface-default-warning` | **1.88 ❌** | 6.04 ✅ |
| `on-surface-main-error` | 4.52 ✅ | **2.91 ❌** |

No single step clears 4.5:1 on both card colors, so layer 3 carries per-mode values.

```css
color: var(--app-status-critical-color);   /* light #ea1917 · dark #ffb2ab, 4.52 / 5.37 on card */
```

`--app-status-good-color`, `-warning` and `-critical` clear **4.5:1 as text on a card and
3:1 as a mark on the plot surface** in both modes. Do not use the semantic status
tokens directly for status on a card.

### 8.5 `surface-main-hover` is nearly white in dark

`surface-main` `#44484a` → `surface-main-hover` `#eff1f4`. Hovering a card inverts it.

→ **Use [`--app-table-row-container-hover-color`](#810-link-row-stripe-and-row-hover-are-layer-3-roles)
and this pitfall goes away.** It darkens in both modes, so no ink has to change.
The rest of this section is for the case where you use the semantic name anyway.

**It is the one surface that does not invert between modes**: `#f0ece4` in light
and `#eff1f4` in dark, near-white in both. Every other surface flips, so a page
that reasons "the hover ground is a step off the card ground" is right in light and
wrong in dark.

**If you use it anyway, every ink on that row has to come with it.** Not just the
body text. An audited page did switch its cell text to `on-surface-black` on hover,
correctly, and then a separate `td a:hover` rule kept the accent color, so the
links alone dropped to **1.14** and vanished. Whatever sits on the hovered area
needs the same treatment:

```css
tr:hover, tr:hover td, tr:hover a {
	color: var(--app-table-row-label-hover-color);   /* 17.82 light, 16.69 dark */
}
```

**`on-surface-black` is the ink, and `on-surface-main` is not.** On the next round
the same page moved every ink together, correctly in structure, and picked
`on-surface-main`. That is `#f7f8fa` in dark against a `#eff1f4` ground: **1.06**,
worse than the bug it replaced. The hover ground is near-white in both modes, so
the ink on it has to be dark in both modes, which is what `on-surface-black`
(`#000000` light, `#111111` dark) is for. Nothing else in the set does that.

The link case is worked through in [8.1](#81-accent-red-cannot-carry-body-text-light).

### 8.6 `stroke-main` never reaches 3:1

Contrast on a card is 1.67 (light) and 2.18 (dark). It is a **decorative edge**, not
a state channel. Never express selection or error with a border alone.

### 8.7 An on-surface name is not the ink for the surface of the same name

This is the most misleading thing in the token set, and the guide got it wrong
first. 21 `surface-X` names have an exactly matching `on-surface-X`. It looks like
a pairing convention. It is not.

Measured as text on its same-named surface, **18 of the 21 fail 4.5:1 in at least
one mode, and 7 are at 1.00, meaning the ink is the same color as the surface.**

| Pair | light | dark |
|---|---|---|
| `surface-badge-red` / `on-surface-badge-red` | **1.00** | **1.00** |
| `surface-white` / `on-surface-white` | **1.00** | **1.00** |
| `surface-footer` / `on-surface-footer` | **1.40** | **1.49** |
| `surface-card-gray` / `on-surface-card-gray` | **1.85** | 7.03 |
| `surface-main` / `on-surface-main` | 21.00 ✅ | 8.70 ✅ |

The three that work in both modes are `surface-main`, `surface-button-primary-hover`
and `surface-card-orange`.

`on-surface-badge-red` means "red ink for a badge, on a normal surface". It was
never meant to go on top of `surface-badge-red`. Read the `on-` prefix as *the
character of the ink*, not *the surface it belongs to*.

**So: choose the surface, then choose the ink by measuring, not by matching names.**
For body text on a card or a page, `on-surface-main` / `-sub` and
`on-background-main` / `-sub` are the safe defaults, and
[reference-color.md](./reference-color.md#contrast-audit-wcag) has the numbers.

### 8.8 `surface-toast` inverts between modes

light `#262626` (dark) → dark `#8e9394` (light). The text color cannot be a single
token. Leaving `on-surface-white` in place gives **3.11 ❌** in dark. Split it:
`on-surface-white` (15.13) for light, `on-surface-black` (6.07) for dark. The
recipe is in the toast section of reference-patterns.md.

For the same reason, status alerts sit **on a card (`surface-main`), not on the page
background**. On `background-main` (`#f0ece4`), `--app-status-good-color` is 4.43 and
`-critical` is 3.83. Both are below the floor.

### 8.9 Axes the semantic layer does not have

No spacing semantics, no type scale, no web elevation, no motion, no z-index, no
breakpoints, no focus ring, no chart palette, **no link color, no row striping
and no row hover** (see [8.10](#810-link-row-stripe-and-row-hover-are-layer-3-roles)).
That is what layer 3 is for. **Do not invent values. Use `--app-*`.**

### 8.10 Link, row stripe and row hover are layer 3 roles

Three things a dashboard always needs, none of which the semantic layer names.
Each has a semantic name that looks like the answer and is wrong in mono-black,
and all three were found on the same real table.

| Role | The name that looks right | Why it fails in dark | Use |
|---|---|---|---|
| link | `on-surface-accent` | `#e1e2e5`, the same near-white as body ink. 1.22 side by side | **`--app-link-label-color`** |
| stripe | `surface-sub` | `#5b6062`, **lighter** than the `#44484a` card, so half the rows lift and the table reads washed out | **`--app-table-row-container-alt-color`** |
| row hover | `surface-main-hover` | `#eff1f4`, near-white, [8.5](#85-surface-main-hover-is-nearly-white-in-dark) | **`--app-table-row-container-hover-color`** |
| neutral chip | `surface-selection-active` | the brand red, [8.11](#811-surface-selection-active-is-the-brand-red-and-is-not-a-status) | **`--app-chip-container-color`** |

**The chip is the clearest case of a role the semantic layer cannot express.**
Every surface in lg-brand is light, so a solid dark chip would mean using an
`on-*` ink as a fill, which is the role reversal check 6 exists to catch. The
three button fills are the brand red, white and transparent. There is no fourth.
`--app-chip-container-color` is solid and inverts between modes: `#2d2d2d` with white type in
light, `#e1e2e5` with `#111111` in dark. Label 13.77 / 14.58, and the chip clears
7:1 against the card, the stripe and the hover row in both modes. The recipe is
`.app-btn--chip`.

**There is no link color in the token set and there cannot be one.** mono-black
is achromatic by design, so any accent resolves to gray there. A link is not an
accent, it is its own role, and layer 3 carries it: `#006dab` light, `#5cc0ff`
dark, both clear of the chart slots so a link never collides with a series.

**The stripe and the hover both darken, in both modes**, and hover is always one
step past the stripe. That is what makes the group work: darkening moves away from
the ink in dark and stays close to the card in light, so **no ink has to change on
hover**, which is the trap 8.5 describes. Measured on all six grounds:

| | light card | stripe | hover | dark card | stripe | hover |
|---|---|---|---|---|---|---|
| body ink | 21.00 | 19.26 | 17.62 | 8.70 | 10.83 | 12.34 |
| `--app-link-label-color` | 5.56 | 5.10 | 4.67 | 4.60 | 5.72 | 6.52 |
| `--app-status-good-color` | 5.22 | 4.79 | **4.38** | 5.04 | 6.27 | 7.15 |
| `--app-status-warning-color` | 5.42 | 4.97 | 4.55 | 6.04 | 7.52 | 8.57 |
| `--app-status-critical-color` | 4.52 | **4.14** | **3.79** | 5.37 | 6.69 | 7.62 |

**The status inks are the ones to watch, and only in light.** Section 8.4
measures them on a card, where all three clear 4.5. Put the same ink on the
stripe or the hover row this section hands you and two of them drop below it.
The asymmetry is the scrim: in light the ground darkens **toward** a dark ink,
in dark it darkens **away** from a light one, which is why every dark figure
improves and the light ones fall. Nothing warns you, because the two recipes
that collide here live in different sections.

Three ways out, in the order to try them:

1. **Drop the stripe.** The table recipe already ships without one, and at rest
   on the card the figures go back to 4.52 and 5.22. This is the fix for the
   stripe column and it costs nothing.
2. **Judge the hover.** 3.79 is a real miss, on a state that lasts as long as
   the pointer does, for a cell where [8.13](#813-a-restyle-must-not-shrink-the-click-target-or-drop-what-color-was-saying)
   already requires a glyph and a label beside the color. If the information is
   encoded three ways, the color being weak for a moment is a judgment, not a
   defect. Make it deliberately rather than by not knowing.
3. **If you need strict AA on the hover row**, one step darker clears it:
   `active-red-45` `#d40b14` measures 5.44 on the card and 4.57 on the hover,
   and `yellow-green-35` `#316d15` measures 6.31 and 5.29. Override
   `--app-status-critical-color` and `--app-status-good-color` in your own layer 3. They are
   not changed here, because that would move the color on every page already
   using them.

```css
td a          { color: var(--app-link-label-color); text-decoration: underline; }
td a:hover    { color: var(--app-link-label-hover-color); }
tr:nth-child(even) { background: var(--app-table-row-container-alt-color); }
tr:hover      { background: var(--app-table-row-container-hover-color); }   /* no ink change needed */
```

The page this came from had hard-coded `#2980b9` for its links. Removing the
hard-coded color was right; replacing it with accent was not, because the token
set had nowhere else to go. Now it does.

### 8.11 `surface-selection-active` is the brand red, and is not a status

In lg-brand at 3.9.0 it resolves to **`#ea1917`, the same value as
`surface-button-primary`.** The name suggests a neutral active state; it is the
accent.

It is also not a status color. An adopted page used it as the fill of a
"present" chip, three per row across twelve rows, and got 36 brand-red chips. The
same page had it looking like a dark neutral chip one version earlier, when the
token was `#333333`, which is how the choice survived review for so long. See the
version table in [§3-B](#b-from-a-cdn-no-build-step).

**For a filled action chip, the answer is `.app-btn--chip`, not primary.** A solid
neutral that inverts between modes, `#2d2d2d` in light and `#e1e2e5` in dark
([8.10](#810-link-row-stripe-and-row-hover-are-layer-3-roles)).
Thirty-six neutral chips read as a set; thirty-six red ones read as an alarm.
`--primary` is for the one action on the view that matters most, which is the same
scarcity argument as [8.1](#81-accent-red-cannot-carry-body-text-light) applied to
a fill rather than to ink.

**And note the badge recipe is outline-only on purpose.** `.app-badge` in
reference-patterns.md is border plus colored type with no fill, because
`--app-status-*` was measured as an ink against the card, not as a background. If
you want a filled status chip you own the ink for both modes, since the status
fills are dark in light and light in dark.

### 8.12 What a dark shadow is actually separating

`--app-elevation-1` through `-3` are a real shadow in both modes, just a heavier
scrim in dark. Use them rather than writing your own, and the mode difference is
handled.

**This one took two wrong answers to get right, and the reasoning is worth having
because it is easy to repeat.** The dark values were first `none`, on the argument
that a black shadow cannot read against the `#000000` page ground. That is true
and irrelevant. They were then a hairline ring, which doubled up with the border
the same table already had and gave no sense of depth at all.

Both came from asking the wrong question. Measured on the page that prompted it,
the table and the card underneath are **the same value**, `#44484a` against
`#44484a`, ratio **1.00**. That is the pair a shadow separates, and a dark shadow
on a mid-gray surface reads perfectly well. The card against the page ground is
2.25 and never needed help.

→ Before deciding a shadow "will not show in dark", find the two surfaces it sits
between and measure that pair. It is usually not the one against the page.

Three related facts:

- `stroke-sub` and `stroke-main` are **the same `#767c7f`** in mono-black, so a
  dark-mode hierarchy cannot be built from the stroke color. Use width, the scrim
  shadow, or `--app-table-row-container-alt-color`.
- `box-shadow: 0 0 0 1px` on an element that already has a `border` paints a
  second line one pixel out from the first. It looks like a rendering bug. If you
  want a ring, drop the border.
- **A row hover gets no shadow.** A `<tr>` in a `border-collapse: collapse` table
  has no gap around it, so every pixel of blur lands on the row above and the row
  below and the hover reads as a smudge rather than a lift. Shrinking the value
  does not fix it, it only shrinks the smudge: an adopted page showed it at both
  `0 4px 12px` and `0 2px 8px`. A shadow needs somewhere to fall, which a card has
  and a table row does not, so `--app-table-row-container-hover-color` is the whole hover. The table
  recipe in `reference-patterns.md` is written that way.

### 8.13 A restyle must not shrink the click target, or drop what color was saying

Two ways an adoption can measure clean and still leave the page worse than it
found it. Both happened on the same dashboard, and neither is something the
validator can see.

**The target.** This is a sizing rule rather than a token rule, and it is here
because the guide ships the numbers: `.app-btn` sets `min-height: 40px` and the
chip variant 28px. The chip is meant to be the smaller of the two, and the first
version of that recipe reached for `min-height: auto` with 2px of padding, which
renders a **20px** box. WCAG 2.2 SC 2.5.8 puts the floor at **24 by 24 CSS px**,
and the chips this replaced were about 30px tall, so the restyle handed back a
control measurably harder to hit than the one it removed. If you shrink any
target below the button default, measure the rendered box rather than trusting
the padding.

**The information.** The same page used two fills to say something: green where a
build artifact had been found, gray where it had not. Both were mapped onto the
one neutral `--app-chip-container-color`, and forty-eight chips came out identical. Nothing in the
guide was violated and a column of the table stopped carrying meaning.

→ A neutral chip is the default for **equal-weight actions with no status**. Where
a fill is encoding state, the page keeps its own color and owns the ink for both
modes, which is the same point [8.11](#811-surface-selection-active-is-the-brand-red-and-is-not-a-status)
makes about filled status chips. `--app-status-good-color/warning/critical` are the
values to build it from, not `surface-selection-active`, which is the brand red in
light and would give you the alarm back.

→ Before applying the guide to a page that already works, write down what each
color on it is currently saying. Anything you cannot restate in tokens is a
decision to bring back to the page owner, not a value to flatten.

---

## 9. Pre-ship checklist

Point it at whatever directory holds your source. A page with no build step
has no `./src`, and `.` from the project root is the right argument there.

```bash
node docs/enova-design/validate-tokens.mjs ./src

# if enova-app-tokens.css lives outside the scanned directory
node docs/enova-design/validate-tokens.mjs ./src --define ./public/css/enova-app-tokens.css

# if you already have a design-tokens checkout
node docs/enova-design/validate-tokens.mjs ./src --tokens <design-tokens>/packages
```

**On a CDN-only page there is no `node_modules` to compare against.** This is the
setup the guide recommends, so it is the common case, and it is where both pilot
runs stalled. Fetch the two packages into a scratch directory and point at it.
Copy this as one block:

```bash
# one-time: stage the token packages somewhere outside the project
TOKENS="${TMPDIR:-/tmp}/enova-tokens"
mkdir -p "$TOKENS" && (cd "$TOKENS" \
  && npm init -y >/dev/null \
  && npm i --no-save @enovaui/core-tokens@3.9.0 @enovaui/web-tokens@3.9.0 >/dev/null)

# then, from your project root, for every run
node docs/enova-design/validate-tokens.mjs ./src --tokens "$TOKENS/node_modules/@enovaui"
```

Pin the same versions your page pins. If `npm i` fails with a cache permission
error, the cache is the problem and not the registry:
`export npm_config_cache="$TOKENS/npm-cache"` before the install. Do not install
into the project you are checking: a stray `node_modules` changes what gets
scanned.

Nine checks, in two groups. **Checks 1 to 5 ask whether a name resolves. Checks
6 to 9 ask whether it was the right name, whether the page can see it, and
whether it was read from the right layer**, which are different questions and the
ones that have mattered more in practice.

1. `--primitive-*` / `--semantic-*` that nothing publishes
2. names that exist **only in a package you do not load**, the trap above. The
   package set is detected from your `@import` / `<link>` paths, so this follows
   your actual choice rather than assuming web
3. any other custom property used but never defined, whatever prefix the project
   uses (`--app-*`, or your own prefix)
4. references that survive only because of a fallback
5. hard-coded colors, including a `%23` hex inside a data URI
6. a token used in the wrong role, [Rule 6](#rule-6-a-fill-is-not-an-ink). It
   follows your own custom properties, so an alias layer does not hide it
7. **color only**: a layer-3 name that only **renames** the semantic name it
   points at,
   [Rule 2](#rule-2-name-the-component-do-not-rename-the-role). The layer is
   required, so only a name that adds nothing is a finding; a component token is
   reported below the verdict as expected
8. **a name the document uses, the project defines, and the document never
   loads.** Checks 1 to 3 look at the whole scanned tree. This one asks per
   document, because a page that deletes its `<link>` to `enova-app-tokens.css`
   keeps every `--app-*` resolvable in the folder and loses all of them in the
   browser. Reachability counts a stylesheet whose path or file name appears
   anywhere in the document, so `<link>`, `@import` and a script-injected
   stylesheet all pass. `--define` asserts the file is loaded, so its names are
   exempt
9. **a rule reading `--semantic-*` directly, past layer 3**, on every axis and
   not only color. This is the other half of Rule 2: check 7 asks whether your
   layer-3 names earn their place, and 9 asks whether your CSS reads them at all.
   A rule wired straight to a semantic name renders correctly today and leaves
   that component with no override point, so nothing is visibly wrong until
   somebody needs one card to differ from every other card.

   **This is the one check that reads your markdown**, because a document is
   where the wrong layer gets taught rather than merely shipped. It looks only
   inside fenced code, so prose is not scanned, and it skips any line whose CSS
   comment opens with `/* NO` or is `/* wrong */`. Mark your counter-examples
   that way and they stay quiet. Three real cases were hiding behind the old
   blanket exemption: an adopted README that went on recommending
   `var(--semantic-color-*)` in a rule after its own CSS had stopped, and both
   of this guide's entry points

Checks 1-3, 6, 8, and the renames in 7 fail the build. Hard-coded colors are
reported and pass, and if you deliberately want a value the token set has no name
for, a fallback (`var(--whatever, #123456)`) moves it to check 4. The page still
renders, so it is not treated as broken. `--allow-hex` and `--allow-alias` turn
off 5 and the failing half of 7, the second one for a migration in progress.
There is no flag for 8: a page that cannot see its own tokens is not a state
worth allowing.

**Check 9 reports and passes by default.** A page part-way through adoption has
not built its layer-3 tokens yet, and a build that turns red on day one gets the
check switched off rather than the page fixed. Work the list down, then pass
`--strict-layer` to hold it at zero.

**Read past the first line of output.** `[OK] No dead token references` covers
checks 1 to 5 only; 6 to 9 print their own verdict. Three audited pages were
clean on 1 to 5 and wrong in ways only 6 to 8 report, which is why they exist.
Check 8 was added after the worst of the three: the page below still held
`enova-app-tokens.css` in its `css/` folder, referenced `var(--app-*)` 31 times,
and rendered with no padding, no radius, no elevation and no type roles, while
every mechanical check reported zero.

Verified against real adopted code whose defects were known independently: it
reports all 14 dead references and nothing spurious, and reproduces both of the
later role and alias findings.

- [ ] Exactly **one** `color-semantic-*.css` is loaded
- [ ] CDN versions are pinned
- [ ] `validate-tokens.mjs` passes, **including checks 6 and 7**, and check 9
      reads zero. One `[4]` line is expected on every clean run:
      `enova-app-tokens.css` gives `--semantic-radius-checkbox` a fallback
      because the token set has not published it, which is rule 4 working
- [ ] No `surface-*` in a `color`, no `on-*` in a `background`
- [ ] Both light and dark checked by eye, especially §8.2 through §8.5
- [ ] The focus ring is visible when tabbing
- [ ] Body text contrast is at least 4.5:1
- [ ] Status is not expressed by color alone; an icon and a label ride along
- [ ] Chart series use `--app-chart-1` onward, in order
- [ ] `prefers-reduced-motion` respected (already in the app layer)

The validator reports none of the next six. Every one of them shipped on a page
that had passed every check, so walk them by hand:

- [ ] **Hover and focus states checked, not just the resting state.** A hovered row
  or card takes `--app-table-row-container-hover-color` and no ink changes. If it
  uses `surface-main-hover` instead, that is near-white in both modes and every
  ink on it has to move to `on-surface-black` (8.5)
- [ ] **Every state style actually differs from its resting style.** Setting a
  hover border to the token the resting border already uses leaves an affordance
  that does nothing (§8.1)
- [ ] **Links are findable in dark.** Accent ink is near-white there, so an accent
  link is the same color as the text around it (§8.1)
- [ ] **The accent appears once.** If the headline, the call to action and a header
  band are all accent, none of them is (§8.1)
- [ ] **A type role is actually applied.** Loading `typography-semantic.css` does
  nothing on its own. If the page sets no `font-size` anywhere, it is at the
  browser default and section 4 never happened
- [ ] **The page has a gutter.** The app layer resets `body { margin: 0 }`, so
  content needs `.app-page` or `.app-container` (or your own padding) or it sits
  flush against the viewport edge

---

## 10. Files

| File | Role |
|---|---|
| [README.md](./README.md) | Setup manual for app developers. Start here to apply it |
| [SKILL.md](./SKILL.md) | AI entry point. Copy the folder to `.claude/skills/enova-design/` for Claude Code |
| [copilot-instructions.md](./copilot-instructions.md) | Drop-in `.github/copilot-instructions.md` / `AGENTS.md`. The short rule set an agent loads every session |
| [design.md](./design.md) | This document. Rules and installation |
| [enova-app-tokens.css](./enova-app-tokens.css) | Layer 3 tokens. The one CSS file you copy |
| [enova-theme.js](./enova-theme.js) | Light/dark switching |
| [reference-color.md](./reference-color.md) | 158 color tokens × 2 modes, plus a contrast audit |
| [reference-charts.md](./reference-charts.md) | Chart palette and the evidence for it |
| [reference-patterns.md](./reference-patterns.md) | Component recipes, copy-ready |
| [validate-tokens.mjs](./validate-tokens.mjs) | Dead-token check |
| [starter/index.html](./starter/index.html) | Opens in a browser with no build step |
| [generate-color-reference.mjs](./generate-color-reference.mjs) | Maintainers only. Writes `reference-color.md` from the token files |
| [verify-guide-claims.mjs](./verify-guide-claims.mjs) | Maintainers only. Checks every hex and contrast ratio the guide quotes against the tokens |
| [token-values.mjs](./token-values.mjs) | Maintainers only. Shared by the two above, so they cannot disagree about a value |

`reference-color.md` is generated from the token files. Regenerate it rather than
editing by hand. The last three files run in this repository's CI on every pull
request that touches the token files or this folder, so a token sync that moves
a quoted value fails until the guide is updated. An adopting project does not need them.

The whole folder is self-contained: every link above is a sibling, so copying
`docs/enova-design/` into another project keeps it working.
