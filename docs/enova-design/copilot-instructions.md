# Enova design tokens: agent instructions

Copy this file to your repo as `.github/copilot-instructions.md` (GitHub Copilot),
or as `AGENTS.md`, or append it to your `CLAUDE.md`.

**Two placeholders to substitute, at seven sites. Change nothing else.**

| Placeholder | Sites | Replace with |
|---|---|---|
| `<docs/enova-design>` | 4 | where you put this guide folder, relative to the repo root |
| `<src>` | 3 | the app source path the validator should scan |

Do it with a command rather than by hand, so no site is missed. Everything above
the `---` below is written for you and not for the agent, so drop it in the copy:

```bash
GUIDE_PATH="docs/enova-design"          # adjust
SRC_PATH="src"                          # adjust

mkdir -p .github
sed -e "1,/^---$/d" \
    -e "s|<docs/enova-design>|$GUIDE_PATH|g" \
    -e "s|<src>|$SRC_PATH|g" \
    "$GUIDE_PATH/copilot-instructions.md" > .github/copilot-instructions.md
```

Then confirm none survived: `grep -n '<' .github/copilot-instructions.md` should
return nothing but the `<...>` inside code samples.

**Keep this file in step with `design.md`.** An earlier hand-written version of it
forbade `px` outright, while `design.md` rule 1 carves out plain geometry. An agent
followed the short version, rewrote a page's border widths and offsets as
`calc(var(--app-space-2) / 4)`, and turned a set of 1px borders into a mix of 1px
and 2px. If the two documents disagree, the agent follows this one, because it is
the one loaded into every session. That is why it ships from here.

---

## UI styling rules (Enova design tokens)

All UI in this project is styled from the Enova design tokens. The guide is in
`<docs/enova-design>/`.

Read `<docs/enova-design>/design.md` before writing any style, CSS or component
code. It is the authority. This file is a summary and does not replace it.

Reference material, as needed:

- color names and their measured values: `reference-color.md`
- card, button, table, badge and form code: `reference-patterns.md`
- chart colors and the evidence for them: `reference-charts.md`

### Must

1. **No hard-coded color, and no `--semantic-*` in a rule.** A rule reads
   `var(--app-*)`, or your project's own prefix. Those names are defined from
   `var(--semantic-color-*)` once, at `:root`. Layer 3 is also where the axes the
   semantic layer has no names for at all live: spacing, type, elevation, motion,
   status, charts. **On a component framework** (PrimeVue, MUI, Vuetify), its
   theme variables are layer 3: map them to `--semantic-color-*`, never to
   primitives, and read design.md section 3D before mapping any hover slot.
2. **Plain geometry may be a raw px.** Hairline border widths, a control's
   `min-height`, an icon box, SVG coordinates. Reach for a token first; if none
   fits, write the px. **Do not build geometry out of a spacing token**:
   `calc(var(--app-space-2) / 4)` is not a token, it is 2px written the long way.
3. **A layer-3 name has to add something.** `--my-text: var(--semantic-color-on-surface-main)`
   only renames, and gives you nothing to override. `--app-card-label-color` names a
   component and a part, so one card can change without moving every other
   component on that color. Where a name only repeats the semantic one, rename
   it; do not delete the layer. Naming a role the semantic layer has no word for
   (`--app-chart-axis-color`) is the same thing done for a value instead of a part.
4. **Load exactly one `color-semantic-*.css`.**
5. **Chart colors are `--app-chart-1` upward, in slot order.** Never on non-chart UI.
6. **`on-surface-X` is not the ink for `surface-X`.** 18 of the 21 same-named
   pairs fail contrast in at least one mode. Look the pair up in
   `reference-color.md`; do not assume.
7. **Status is never color alone.** An icon and a label ride along.
8. **Check light and dark.** Not one then assume the other.

**A name the token set has not published yet needs a fallback**, written into
the layer-3 definition rather than into the rule:
`--app-field-checkbox-radius: var(--semantic-radius-checkbox, var(--primitive-radius-4));`
Without the second argument the browser drops the declaration and the element
inherits something else, with no error anywhere.

### Eleven things the validator cannot see

Every one of these shipped on a page that passed every mechanical check. A clean
run is not evidence of a correct page.

9. **Hover and focus, not just the resting state.** For a row or card hover, reach
   for **`--app-table-row-container-hover-color`** (item 14) and there is nothing else to do: it darkens
   in both modes, so every ink stays readable.

   `surface-main-hover` is the name that looks right and it is a trap:
   **near-white in both modes**, `#f0ece4` light and `#eff1f4` dark, the one
   surface that does not invert. If you use it anyway, every ink on that area has
   to move with it, links included, and it has to move to **`on-surface-black`**
   (17.82 light, 16.69 dark). Not `on-surface-main`: that is `#f7f8fa` in dark and
   measures **1.06** there, which is invisible.

   ```css
   /* preferred */
   tr:hover { background: var(--app-table-row-container-hover-color); }

   /* if you must use surface-main-hover, move every ink too, through a token */
   :root { --app-table-row-label-hover-color: var(--semantic-color-on-surface-black); }
   tr:hover, tr:hover td, tr:hover a { color: var(--app-table-row-label-hover-color); }
   ```
10. **Accent ink is near-white in dark.** `on-surface-accent` is `#ea1917` in light
    and `#e1e2e5` in dark, which is the same color as body text. Do not use accent
    to mark a link unless you also override it per design.md 8.2.
11. **Accent appears once per view, in static emphasis.** If the headline, the
    call to action and a paragraph lead are all accent, none of them is. Pick one
    and let the rest be `on-surface-main` or `on-background-sub`.

    **This budget covers static text emphasis only. It does not apply to:**
    - **State feedback.** A hover underline, a hover border, a selected row, a
      focus ring. State needs a color channel, these are UI elements at the 3:1
      floor rather than text, and accent is the right choice there. Removing it
      leaves an affordance that does nothing. Check that a hover style actually
      differs from the resting style: an audited page set the hover border to the
      same `stroke-sub` the resting border already used, so hovering changed
      nothing.
    - **A brand surface.** A table header band or a primary button fill is the
      page's signature, not competing emphasis. Leave it.
12. **Apply a type role.** Loading `typography-semantic.css` does nothing by
    itself. Use `.app-body`, `.app-title-xl` and so on, or set the sizes from
    `--app-text-*`. A page with no `font-size` anywhere is at the browser default.

    **The page title is `.app-title-xl`** (32/700), once, on the `h1`.
    `.app-title-lg` (24/600) is a section heading inside the page. An audited page
    used title-lg for its `h1`, dropped from the browser default 32 to 24, and the
    title stopped reading as one.
13. **Give the page a gutter.** `enova-app-tokens.css` resets
    `body { margin: 0 }`, which removes the 8px the browser gives it. Use
    `.app-page` or `.app-container`, or your own padding.

    An **iframe** page sets `background-color: transparent` so the parent's ground
    shows through, but **still needs its own inset unless the parent supplies
    one**. Open the parent and look: an audited page's parent renders the frame
    full-bleed with `padding: 0`, so dropping the gutter put the content flush
    against the frame edge. Do not assume.
14. **Four roles come from layer 3, because the semantic layer has no name for
    them:** `--app-link-label-color` for links, `--app-table-row-container-alt-color` for striping,
    `--app-table-row-container-hover-color` for row hover, `--app-chip-container-color` for a neutral filled chip. The
    names that look right are all wrong in dark: `on-surface-accent` is a
    near-white gray, `surface-sub` is *lighter* than the card,
    `surface-main-hover` is near-white, and `surface-selection-active` is the
    brand red. The row tokens darken in both modes and are measured so that
    `--app-link-label-color` and body ink both clear 4.5 on the card, the stripe and the
    hover row, so **no ink has to change on hover**.
15. **`surface-selection-active` is the brand red**, the same `#ea1917` as
    `surface-button-primary` despite the neutral-sounding name, and it is not a
    status color. For a neutral filled chip, a file type, a tag, or a row of
    equal-weight actions, use **`.app-btn--chip`**. An audited page filled 36
    chips with the selection token and got 36 red chips. `--primary` is for the
    one action on the view that matters most.
16. **Do not build a button hover from the `*-button-*-hover` names.** In
    lg-brand primary and secondary trade places on hover, and in mono-black
    `on-surface-button-secondary-hover` is `#ffffff` on an `#e1e2e5` fill, which
    measures **1.30**. Take a scrim step off the resting fill instead. The button
    section of `reference-patterns.md` does this for primary, secondary and chip.
    See design.md 8.3.
17. **If you change the pinned token version, review the screen.** Semantic names
    are stable, their values are not. Between `0.8.2` and `3.5.0`,
    `surface-selection-active` went `#333333` to `#ea1917` and
    `surface-button-secondary` went `#dbd7ce` to `#ffffff`. No CSS changed and the
    page looked different. Every check still passes, because every name resolves.
18. **Do not shrink a click target below 24px.** WCAG 2.2 SC 2.5.8 is the floor
    and `.app-btn` sits at 40px. A smaller variant sets a smaller `min-height`,
    never `min-height: auto`: the chip recipe did that once with 2px of padding
    and rendered a 20px box on a page whose own buttons had been 30px. Measure the
    rendered box, not the padding. See design.md 8.13.
19. **Do not flatten a color that was carrying information.** Before you restyle
    an existing page, write down what each color on it is currently saying. One
    dashboard used green for "artifact found" and gray for "not found", both were
    mapped onto the single neutral `--app-chip-container-color`, and a column stopped meaning
    anything. A neutral chip is for equal-weight actions with **no** status; where
    a fill encodes state, keep the page's own color and build it from
    `--app-status-*`, owning the ink for both modes. See design.md 8.13.

### Never remove the app layer from the page

`enova-app-tokens.css` defines every `--app-*` name. **Keep its `<link>` in the
document, before your own stylesheet and before your inline `<style>`.** If it is
missing, every `var(--app-*)` resolves to nothing and the browser silently drops
the whole declaration, so the page loses all padding, radius, elevation and its
type roles at once, and `.app-body` and `.app-title-lg` stop existing.

This happened. A page kept the file in its `css/` folder, deleted the `<link>`,
and still wrote `var(--app-*)` 31 times. Check 8 exists to catch it now, but do
not rely on the checker: if you touch the `<head>`, re-read the load order in
design.md section 3 before you finish.

### Do not silence a finding by deleting the thing it points at

- A `fill='%23666'` inside a data-URI icon is a real color finding. **Do not delete
  the icon**, and **do not change it to `currentColor`**: a data-URI SVG is a
  separate document that never sees your CSS, so `currentColor` resolves to black.
  Measured on an audited select whose own color was `#f7f8fa`, the rendered arrow
  pixel was `rgba(0,0,0,255)`. Use `background-image: var(--app-select-arrow)`, or
  an inline `<svg>` in the markup, where `currentColor` does work.
- Aliases that name a new role are allowed and are reported below the verdict, not
  as findings. **Do not delete `--app-*` tokens to reach a zero count.**
- A `--app-*` name reported by check 8 means the page does not load the file that
  defines it. **Add the stylesheet back. Do not delete the declarations that use
  the name**, and do not inline copies of the values.

### Before finishing, run the validator

Replace `<src>` with this project's source path.

```bash
node <docs/enova-design>/validate-tokens.mjs <src>
```

On a CDN-only page there is no `node_modules` to compare against, so stage the
token packages once, pinned to the versions the page pins:

```bash
TOKENS="${TMPDIR:-/tmp}/enova-tokens"
mkdir -p "$TOKENS" && (cd "$TOKENS" \
  && npm init -y >/dev/null \
  && npm i --no-save @enovaui/core-tokens@3.9.0 @enovaui/web-tokens@3.9.0 >/dev/null)

node <docs/enova-design>/validate-tokens.mjs <src> --tokens "$TOKENS/node_modules/@enovaui"
```

If `npm i` fails on a cache permission error, set
`export npm_config_cache="$TOKENS/npm-cache"` first. Do not install into the
project you are checking.

**Read past the first line of output.** `[OK] No dead token references` covers
checks 1 to 5 only. Checks 6 to 9 print their own verdict, and items 9 to 19
above print nothing at all.

**Check 9 lists every rule still reading `--semantic-*` directly**, on every axis
including `font-weight` and the rest. Each one needs an `--app-*` token between
the rule and the semantic name. It reports and passes today; once the count is
zero, add `--strict-layer` so it stays there.
