---
name: enova-design
description: Build web pages and dashboards with the LG Enova design system (@enovaui/core-tokens + @enovaui/web-tokens, lg-brand light / mono-black dark). Use whenever styling a web page, dashboard, admin panel, chart, or sample app that must match the Enova look and feel, including picking colors, type sizes, spacing, chart palettes, or wiring light/dark mode. Triggers on "Enova", "design token", "enovaui", "lg-brand", "internal dashboard", "사내 대시보드", "사내 웹페이지", or any request to make a page look like the LG/Enova UI.
---

# Enova Design: web pages and dashboards

Rules and values for building web pages and dashboards from the `@enovaui` design
tokens.

This file is the AI entry point. Everything it references sits beside it in the
same folder, so the folder works standalone: drop it in a project as
`.claude/skills/enova-design/` for Claude Code, or point any other AI tool at
`design.md`.

## Read this first

Read [design.md](./design.md) **before writing any code**. It has the three-layer
model, the six rules, the load order, mode switching, and twelve measured pitfalls.

Two of those rules are the ones adopters actually break, and neither is about
spelling: **`surface-*` is a background and `on-*` is a text color, never the
reverse** (Rule 6), and **your CSS reads `--app-*`, not `--semantic-color-*`,
because a component needs somewhere of its own to be overridden** (Rule 2).
If you are changing a page that already uses the tokens, read
[Migrating an existing page](./design.md#migrating-an-existing-page) too.

Then read only what the task needs.

| Need | File |
|---|---|
| Actual values of the 158 color tokens, contrast audit | [reference-color.md](./reference-color.md) |
| Chart and graph colors, with the rules | [reference-charts.md](./reference-charts.md) |
| Card, KPI, button, badge, table, form, toast recipes | [reference-patterns.md](./reference-patterns.md) |
| CSS to copy into the project | [enova-app-tokens.css](./enova-app-tokens.css) |
| Light/dark switching | [enova-theme.js](./enova-theme.js) |
| A page that already works | [starter/index.html](./starter/index.html) |
| Setup manual for app developers | [README.md](./README.md) |
| Rule file to drop into a repo for Copilot / Cursor / AGENTS.md | [copilot-instructions.md](./copilot-instructions.md) |

## Never break these

1. **Invent no values.** Every color, space, radius and type size comes from a
   token, and **color has no exceptions**. Plain geometry is the one carve-out:
   a hairline border width, a control's `min-height`, an icon box, SVG
   coordinates. Reach for a token first; if none fits, a raw px for pure geometry
   is fine. Do not build geometry out of a spacing token instead:
   `calc(var(--app-space-2) / 4)` is not a token, it is 2px written the long way.
2. **Your CSS reads layer 3, never `--semantic-*`.** A rule names `var(--app-*)`,
   or your own prefix, and that name is defined from the semantic token once, at
   `:root`. A component wired straight to a semantic name renders correctly and
   has nowhere of its own to be overridden, so changing one card means changing
   every component that shares the color. What rule 2 forbids is a layer-3 name
   that only repeats the semantic one: `--app-surface-default` adds nothing,
   `--app-card-container-color` says which component and which part. The early adopter
   who shipped 14 dead variables is why check 3 exists; it is not a reason to go
   without the layer. **On a component framework** (PrimeVue, MUI, Vuetify), the
   framework's theme variables are layer 3: map them to semantics, never to
   primitives, and read design.md section 3D before mapping any hover slot.
3. **Load exactly one `color-semantic-*.css`.** All five modes write to a bare
   `:root`, so a second file overwrites all 158 names. Switching modes means
   swapping the `<link>`.
4. **Give unpublished tokens a fallback**, in the layer-3 definition rather than
   in the rule.
   `--app-field-checkbox-radius: var(--semantic-radius-checkbox, var(--primitive-radius-4));`
5. **Chart colors go in slot order from `--app-chart-1`.** The slot order is the
   colorblind-safety mechanism. Do not reorder it and do not edit the values.
   Scatter, bubble and map forms cap at three series.
6. **Status is never color alone.** Always ship an icon and a text label with it.
7. **Check both modes.** mono-black has traps: accent turns gray, all three
   button surfaces collapse to one color, `surface-main-hover` is nearly white,
   and the semantic status colors drop below 4.5:1 on a card. See design.md §8.
8. **Keep the `<link>` to `enova-app-tokens.css` in the document.** Every
   `--app-*` name comes from it. Delete the link and the browser discards every
   declaration that uses one, so the page loses all spacing, radius, elevation and
   type roles with no error. A page did this while the file sat in its `css/`
   folder. See design.md §3 and check 8.
9. **Check hover, not just the resting state.** A hovered row or card takes
   `--app-table-row-container-hover-color`, which darkens in both modes, so no ink
   has to change. Do not use `surface-main-hover`: it is near-white in **both**
   modes, and if you use it anyway every ink on it has to move to
   `on-surface-black` (`on-surface-main` measures 1.06 there). See design.md 8.5.
10. **Accent once per view in static emphasis, and never as the only link cue.**
    `on-surface-accent` is near-white in dark, the same color as body text.
    Underline the link. The one-per-view budget does **not** cover hover, focus and
    selected states, or a brand surface like a table header band: state needs a
    color channel. See design.md §8.1.
11. **Four roles live in layer 3, not layer 2:** `--app-link-label-color`, `--app-table-row-container-alt-color`,
    `--app-table-row-container-hover-color`, `--app-chip-container-color`. The semantic names that look right are all
    wrong in dark, and `surface-selection-active` is the brand red rather than a
    neutral. See design.md §8.10 and §8.11.
12. **Never build a button hover from `*-button-*-hover`.** In mono-black
    `on-surface-button-secondary-hover` is white on a near-white fill: **1.30**.
    Take a scrim step off the resting fill. See design.md §8.3.
13. **Apply a type role and give the page a gutter.** Loading
    `typography-semantic.css` does nothing on its own, and the app layer resets
    `body { margin: 0 }`. A page with no `font-size` and no `.app-page` looks
    unstyled and flush to the edge.

## Order of work

1. Read design.md.
2. Copy `enova-app-tokens.css` into the project and load it in the order given
   in design.md §3.
3. Take what you need from reference-patterns.md. Build anything missing from
   semantic tokens.
4. If there is a chart, read reference-charts.md first.
5. Validate before calling it done.

```bash
node validate-tokens.mjs <project source path>
```

On a CDN-only page there is no `node_modules` to compare against, so stage the
packages once and pass `--tokens`. The exact commands are in design.md §9.

**Read past the first line.** `[OK] No dead token references` covers checks 1 to 5
only. Checks 6 to 9 print their own verdict, and rules 9 to 13 above print
nothing at all: the validator cannot see them, so walk the §9 checklist by hand.

**Check 9 counts the rules still reading `--semantic-*` directly**, on every axis.
It reports and passes, so a part-finished adoption stays green; a finished one
reads zero and locks it with `--strict-layer`. **Check 7 is color only**, so a
layer-3 name that merely renames a weight or a radius is not reported by
anything; that one is yours to judge.

## Version

Written against `@enovaui/core-tokens` and `@enovaui/web-tokens` **3.9.0**.
**Pin the version** when loading from a CDN, and revisit the pin, since one early
adopter is still on a pre-1.0 release.

**Moving the pin is a visual change.** Semantic names are stable, their values are
not: between `0.8.2` and `3.5.0`, `surface-selection-active` went `#333333` to
`#ea1917` and `surface-button-secondary` went `#dbd7ce` to `#ffffff`. A page whose
CSS did not change looked different, and every check still passed because every
name still resolved. Review the screen in both modes after an upgrade. See
design.md §3-B.
