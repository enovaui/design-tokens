<!--
  SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
  SPDX-License-Identifier: Apache-2.0
-->

# Enova Design Guide: how to apply it

> ### Where to start
>
> - **If you are a person writing the code yourself**, keep reading. This page is how to put
>   the folder into a project.
> - **If you are a person having an AI tool write the code**, read section 1, then go straight
>   to **[section 4](#4-building-with-an-ai-tool-most-of-you)**. The tool reads the rules; your
>   job is to install the folder where it will look.
> - **If you are an AI coding tool**, skip this page and go to **[design.md](./design.md)**.
>   The rules, the token values and the pitfalls are all there. This page is `cp` and `npm i`
>   instructions and will not help you.
> - **Claude Code** enters at [SKILL.md](./SKILL.md). Install the folder as a skill and it is
>   picked up automatically (section 4.1).

This is how to build web pages and dashboards on the LG design system (Enova) tokens.
**You copy this folder into your project**, and that is the whole installation.

Any framework works: plain HTML and CSS, React, Vue, Svelte, or a component framework such as
PrimeVue or MUI (section 3.5).

> **This page covers how to apply the guide, and nothing else.**
> The rules, token values and pitfalls live in [design.md](./design.md). This page points at
> them rather than repeating them. Where the two disagree, **design.md is right.**

---

## 1. Getting the guide, and keeping it current

There is no package to install for the guide. The token packages are installed or loaded from
a CDN as usual, and this folder is copied next to your code.

- **Copy from a release tag, not from `main`.** The repository is tagged at every token
  release (`3.9.0`, for example). At a tag, every value the guide quotes has been checked by
  CI against the tokens in the same commit. Write the tag down next to your token pin, so both
  move together.
- **Commit the folder and the instructions file to your repository.** Your AI tool reads them
  on every session, and so does everyone else's. A copy kept only on one machine goes stale
  quietly: in the pilot, both adopting repositories kept the folder and
  `.github/copilot-instructions.md` out of git, and two months later those local copies were
  still teaching a rule the guide had since reversed, while the committed CSS was current.
- **Never edit the copied files.** Your component tokens and overrides go in your own stylesheet,
  loaded after `enova-app-tokens.css`. Project rules for your AI tool go in a file of their own.
  That is what makes the upgrade below a plain overwrite.

### Upgrading when the tokens change

Your project holds three things from here, and an upgrade replaces all three from the **same tag**:

| What | Where it lives in your project | Replace by |
|---|---|---|
| the token version | the CDN URLs, or `package.json` | editing the pin |
| `enova-app-tokens.css` | wherever your page loads it from | copying the file over yours |
| the guide folder and the instructions file | `docs/enova-design/`, `.github/copilot-instructions.md` | copying the folder over yours, then re-running the `sed` command in section 4.2 |

Then, in this order:

1. **Bump the token pin in a commit of its own**, so a color change is not read as a side
   effect of something else. Moving the pin is a design change: the names stay, the values do
   not ([design.md, "Moving the version pin"](./design.md#moving-the-version-pin-is-a-design-change)).
2. **Overwrite the three items above.** If you have not edited them, this is safe by
   construction. `git diff` should show only lines that came from the guide.
3. **Run the validator** (section 5). If a token you use was renamed or removed, check 3 names
   it and, where it can, the replacement. This is the step that catches a breaking change.
4. **Look at the page in light and dark**, resting and hover. A value change passes every check
   and can still change what the page says.

`enova-app-tokens.css` is the one file that breaks a page when it is out of date. The documents
only go out of date. To see whether yours is stale, compare it with the tag you are on:

```bash
diff ./css/enova-app-tokens.css <design-tokens>/docs/enova-design/enova-app-tokens.css
```

---

## 2. What is in the folder

**Copy into your project:**

| File | When | What it is |
|---|---|---|
| `enova-app-tokens.css` | **always** | The CSS you actually use: type ramp, spacing, elevation, chart colors, status inks and the component tokens |
| `enova-theme.js` | if the page switches between light and dark | Keeps the one loaded `color-semantic-*.css` and the `data-theme` attribute in step. See below |
| `copilot-instructions.md` | **if you build with an AI tool** | Becomes `.github/copilot-instructions.md`, `AGENTS.md` or your tool's rules file (section 4.2) |
| `starter/index.html` | to start from | A finished page that opens in a browser with no build step |

**Read, do not copy:**

| File | What it is |
|---|---|
| `design.md` | The six rules, installation, mode switching and the pitfalls |
| `reference-*.md` | Look-ups: 158 color values with a contrast audit, the chart palette, component recipes (section 3.4) |
| `SKILL.md` | The AI entry point (section 4) |
| `validate-tokens.mjs` | Run it from here before shipping (section 5) |

**For whoever maintains this folder.** An adopting project does not need these:

| File | What it is |
|---|---|
| `generate-color-reference.mjs` | Writes `reference-color.md` from the token files |
| `verify-guide-claims.mjs` | Checks every hex value and contrast ratio the guide quotes against the tokens |
| `token-values.mjs` | Shared by the two above, so they cannot disagree about a value |

**In practice the file you copy is `enova-app-tokens.css`.** The rest explains how to use it.

### Why `enova-theme.js` exists

All five mode files write to a bare `:root`, so loading two does not merge them: the last one
parsed wins for all 158 names. Switching modes therefore means swapping one `<link>`, and that
swap has to stay in step with the `data-theme` attribute, which `enova-app-tokens.css` reads for
the chart colors and elevation. The file does both. It ships two ways:

- **import the module** (`initTheme`, `setTheme`, `toggleTheme`), or
- **paste the IIFE** from the bottom of the file into `<head>`, before any content, so the page
  never paints in the wrong mode.

`starter/index.html` uses the second way and does not load the file at all. Its copy of the
IIFE is extended: it also wires a `[data-theme-toggle]` button to `window.enovaToggleTheme()`
and sets the button's text. Start from that copy if your page has a toggle, and change the
text line if your button shows an icon instead.

---

## 3. Applying it

### 3.1 A static page with no build tool (the fastest way)

```bash
cp <design-tokens>/docs/enova-design/starter/index.html   ./
cp <design-tokens>/docs/enova-design/enova-app-tokens.css ./
```

Then change one line in `index.html`: `href="../enova-app-tokens.css"` becomes
`href="enova-app-tokens.css"`. In the guide folder the starter sits one level below the CSS;
side by side, the `../` points nowhere and the page loses the whole app layer.

Open `index.html` in a browser and it works. Change the content from there.
If your network blocks unpkg, point every token URL in `index.html` at your internal host: the
`TOKEN_BASE` line, which loads the color mode file, and the static `<link>`s above it, which load
the primitives and the non-color semantic files.

### 3.2 A project with a bundler (Vite, Next, webpack)

```bash
npm i @enovaui/core-tokens @enovaui/web-tokens
cp <design-tokens>/docs/enova-design/enova-app-tokens.css ./src/
```

Then paste the `@import` block from [design.md section 3A](./design.md#a-with-a-bundler-recommended)
into `src/app.css`, **in the same order**. In the wrong order the values do not resolve.

> Load **exactly one** `color-semantic-*.css`. All five modes write to `:root`, so with two
> loaded the later one overwrites all 158 colors.
> ([design.md rule 3](./design.md#rule-3-load-exactly-one-color-semantic-file))

### 3.3 How you write CSS from here

```css
:root {
	/* This component's tokens. This is where you override it */
	--my-panel-container-color: var(--semantic-color-surface-main);
	--my-panel-label-color: var(--semantic-color-on-surface-main);
}

.my-panel {
	background-color: var(--my-panel-container-color);
	color: var(--my-panel-label-color);
	padding: var(--app-space-5);
	border-radius: var(--app-radius-xl);
	box-shadow: var(--app-elevation-1);
}
```

There is no border on purpose. The surface itself separates the panel from the page (1.18 plus a
shadow in light, 2.27 in dark). Use `.app-card--outlined` only where a surface cannot separate,
such as a card inside a card or a white panel on a white page.

**Do not read `--semantic-color-*` in a rule.** If you do, there is no way to change this panel's
color alone: overriding `--semantic-color-surface-main` moves every card, table and other panel
that uses it too. Semantic names appear **only as the value of a component token**, and rules
read the component token
([design.md rule 2](./design.md#rule-2-name-the-component-do-not-rename-the-role)).

Names are `<component>-<part>-<property>`. For parts, `container`, `label`, `icon` and `border`
are usually enough. Spacing, radius and type are not colors, so use `--app-*` for them directly.

- Which colors exist: "The 20 you will actually use" in [reference-color.md](./reference-color.md)
- Charts: [reference-charts.md](./reference-charts.md) (there is a reason not to pick colors freely)
- Different colors, dark mode, what to watch for: [design.md](./design.md) sections 1, 5 and 8

> **Building a landing page?** Move the type up one step; the default ramp is sized for
> dashboards. Headline `.app-hero`, body `.app-body-lg`, header links `.app-body`. Without it a
> marketing headline comes out 40% too small.
> [design.md section 4](./design.md#dashboards-and-landing-pages-are-different-densities)

### 3.4 Components: copy the ones that exist, build the ones that do not

[reference-patterns.md](./reference-patterns.md) is **not a component library.** It is working
**CSS recipes** for ten common pieces. No JavaScript and no dependencies; you copy the classes.

> App shell, card, KPI tile, button, status badge, table, form field, alert, toast, empty state

**Building a component that is not on the list is expected.** Tabs, modals, dropdowns,
pagination, trees and calendars are all missing. The list is not meant to be the whole page.

- If it **is on the list**, copy it. There is no reason to rebuild it by hand
- If it **is not**, build it in the order below

#### Why copy one that exists

Each recipe already avoids the measured pitfalls in [design.md section 8](./design.md#8-pitfalls).

- **Button**: in dark, primary, secondary and tertiary all get the **same** fill, `#767c7f`.
  The recipe builds the hierarchy from border and weight instead
- **Card hover**: `surface-main-hover` is near-white in dark (`#eff1f4`), so the card would
  invert. The recipe does not use that token; it responds with shadow and movement
- **Badge**: filling the background breaks contrast, so only the text and border are colored
- **Toast**: `surface-toast` **inverts** between modes, so the text color is set per mode

#### The order for building a missing component

1. **Pick the surface first.** `surface-main` (on a card), `background-main` (the page ground),
   `surface-sub` (a weak separation). This decides everything else.
2. **Do not pick the text color by its name.** `on-surface-X` does **not** mean the ink for
   `surface-X`. Of the 21 pairs whose names match, **18 fall short of 4.5:1, and 7 are 1.00**
   (ink and ground are the same color).
   [design.md 8.7](./design.md#87-an-on-surface-name-is-not-the-ink-for-the-surface-of-the-same-name)
   For body text, `on-surface-main` / `-sub` (on a card) and `on-background-main` / `-sub` (on
   the page) are the safe defaults. Check any other pairing in
   [reference-color.md](./reference-color.md#contrast-audit-wcag) before using it.
3. **Spacing, radius and type come from `--app-*`.** Before reaching for a primitive, see whether
   `--app-space-*`, `--app-radius-*` or `.app-title-*` already does it.
4. **Status is `--app-status-good-color`, `-warning` and `-critical`.** The semantic status
   tokens lack contrast on a card (8.4). And never say status with color alone: add an icon and
   text.
5. **Do not build hover or selection from a border alone.** Some `*-hover` tokens invert in dark
   (8.5), and `stroke-*` never reaches 3:1 (8.6). Combine shadow, movement and weight.
6. **Do not tell icons, tags or tiles apart by color.** The chart palette is verified only on
   the plot surface, with no guarantee on a card. **Same tile, different glyph** is the answer
   ([reference-charts.md section 6](./reference-charts.md#6-category-color-outside-a-chart)).

When it is built, **look at light and dark both**, then run the validator in section 5.
The fastest route is to open the closest existing recipe and copy its structure. The "Common
mistakes" table at the end of `reference-patterns.md` lists frequent mistakes and what to do
instead.

### 3.5 On a component framework (PrimeVue, MUI, Vuetify, shadcn)

The framework's theme variables are your component layer. Map them to semantic roles in one
theme file, `--p-button-primary-background: var(--semantic-color-surface-button-primary)`, and
keep `enova-app-tokens.css` for what the semantic layer does not have: status, charts, links
and elevation. Map to semantics, never to primitives, and read section 8 before mapping any
hover or selected slot. The full rules are in
[design.md section 3D](./design.md#d-through-a-component-frameworks-theme-primevue-mui-vuetify-shadcn).

---

## 4. Building with an AI tool (most of you)

If an AI writes your frontend, **what matters is that it reads this folder.** The documents are
read and the CSS and JS are copied, which an AI handles fine.

### 4.1 Claude Code

Copy the whole folder into the skills location.

```bash
mkdir -p .claude/skills
cp -r <design-tokens>/docs/enova-design .claude/skills/
```

That is all. For a request such as "build me a dashboard", Claude finds and reads it on its own.
`SKILL.md` is the entry point, and it reads only the references a task needs.

### 4.2 GitHub Copilot

`SKILL.md` is a Claude Code convention that Copilot does not recognize. Instead, Copilot **reads
`.github/copilot-instructions.md` automatically** and attaches it to every chat and suggestion.
So copy this folder into the project and point at it from that file.

**Step 1.** Copy the folder.

```bash
# mkdir first: without an existing docs/, cp -r would put the files in docs/ itself
mkdir -p docs
cp -r <design-tokens>/docs/enova-design docs/
```

**Step 2.** Create `.github/copilot-instructions.md` from this folder's
[`copilot-instructions.md`](./copilot-instructions.md).

There are **two placeholders, in seven places** (`<docs/enova-design>` four times, `<src>` three
times). By hand you will miss one, so use a command. Everything down to the first `---` is a
header for people and is removed from the copy.

```bash
GUIDE_PATH="docs/enova-design"     # where you put the folder in step 1
SRC_PATH="src"                     # the app source the validator scans

mkdir -p .github
sed -e "1,/^---$/d" \
    -e "s|<docs/enova-design>|$GUIDE_PATH|g" \
    -e "s|<src>|$SRC_PATH|g" \
    "$GUIDE_PATH/copilot-instructions.md" > .github/copilot-instructions.md

# Check: this should print nothing but the last line
grep -n "<docs/enova-design>\|<src>" .github/copilot-instructions.md || echo "placeholders replaced"
```

**Change nothing else.**

> **Do not write your own summary instead.** An earlier version of this page said to paste a
> summary here, and that summary banned `px` outright, which contradicts design.md rule 1 (plain
> geometry may be px). In a real adoption Copilot followed the shorter file and rewrote border
> widths and offsets in twelve places as `calc(var(--app-space-2) / 4)` and the like, so the 1px
> borders came out as a mix of 1px and 2px. When two documents disagree, an agent follows the
> one loaded every session. That is why this file now ships inside the guide folder.

> If the path does not match step 1, Copilot cannot find the documents and answers as if it had.

**Step 3.** Open Copilot Chat in VS Code and ask "what are this project's style rules?". If it
answers with a summary of the rules above, it is reading them. If the answer is off, check the
path first.

> If the file seems to have no effect, check that
> `github.copilot.chat.codeGeneration.useInstructionFiles` is on in the VS Code settings.

### 4.3 Cursor and other AI tools

Copy the same [`copilot-instructions.md`](./copilot-instructions.md) under the file name each tool
reads. The content is not tool-specific.

- **Cursor**: `.cursor/rules/enova-design.mdc`
- **Others**: without a dedicated rules file, `AGENTS.md` at the project root is usually read
- **Claude Code**: appending to `CLAUDE.md` works, but the skill from 4.1 is better

### 4.4 Pasting into a web UI (claude.ai, ChatGPT and so on)

With no project folder, paste just these two into the conversation:

1. all of `design.md`
2. all of `enova-app-tokens.css`

Add `reference-charts.md` if there is a chart. `reference-color.md` is a 158-row table, so paste
it only when you are asking about a specific color.

### 4.5 What AI tools get wrong most often

In order of frequency. The validator in section 5 catches the first four.

| | Why it matters |
|---|---|
| **Removing the `<link>` to `enova-app-tokens.css`** | **The most destructive.** Every `--app-*` becomes empty, and the browser silently drops every declaration that used one. Padding, radius, elevation and type roles all vanish at once, with no error. One adoption left the file in `css/` and removed only the link. Check 8 catches it ([section 3](./design.md#b-from-a-cdn-no-build-step)) |
| `surface-*` used as a text color, `on-*` as a background | **The most common mistake in real adoptions.** `surface-*` is the paint, `on-*` is what goes on top of it. One line gives pure red in light and invisible text in dark at the same time ([rule 6](./design.md#rule-6-a-fill-is-not-an-ink)) |
| Hard-coded hex or px | The page stops matching the others. Preventing that is why the tokens exist |
| Giving a color token a second name of your own | A misspelled name raises no error, so it breaks quietly and hides the role reversal above ([rule 2](./design.md#rule-2-name-the-component-do-not-rename-the-role)) |
| Loading two `color-semantic-*.css` files | The later one overwrites all 158 colors |
| Picking chart colors freely | Color-vision safety breaks. Only in order from `--app-chart-1` |
| Never looking at dark mode | mono-black has traps ([design.md section 8](./design.md#8-pitfalls)) |

> **Fixing a page that already uses the tokens?** Read
> [design.md "Migrating an existing page"](./design.md#migrating-an-existing-page) before the
> list above. An existing component layer is **sorted, not deleted**: names that only rename a
> role are replaced with component tokens, and the rest stay.

#### What the validator cannot see (look with your eyes)

Each item below **reached the edge of shipping on a page that passed every check.** Passing the
validator is not evidence that the screen is right.

| | Why it matters |
|---|---|
| Looking only at the resting state, never at hover | Give a hovered row or card **`--app-table-row-container-hover-color`**. It darkens in both modes, so no text color has to change. The name that looks right, `surface-main-hover`, is **near-white in both light and dark**; with it every text color on the row has to move to `on-surface-black`, and `on-surface-main` drops to **1.06** in dark and disappears ([8.5](./design.md#85-surface-main-hover-is-nearly-white-in-dark)) |
| Links invisible in dark | `on-surface-accent` is `#ea1917` in light and `#e1e2e5` in dark. In dark it is the body text color, so nothing says it is a link ([8.1](./design.md#81-accent-red-cannot-carry-body-text-light)) |
| Accent everywhere | If the headline, the buttons and the body emphasis are all red, the emphasis points at nothing. **Static emphasis once per view.** **State feedback** (hover, focus, selected) and **brand surfaces** such as a table header band are outside that budget, because state needs a color channel |
| No type role applied | Loading `typography-semantic.css` does nothing on its own. Use `.app-body` and `.app-title-xl`, or set `--app-text-*` directly. With no `font-size` anywhere, you get the browser default |
| `.app-title-lg` on the page title | The page title is **`.app-title-xl`** (32/700); `.app-title-lg` (24/600) is a section heading inside the page. Mix them and the title no longer reads as one ([4.7](./design.md#dashboards-and-landing-pages-are-different-densities)) |
| Neutral chips and tags filled with `surface-selection-active` | In lg-brand this token is **`#ea1917`**, the same as `surface-button-primary`. Only the name sounds neutral. In one adoption all 36 chips turned red. For file types, tags and groups of equally weighted actions, use **`.app-btn--chip`** (`--app-chip-container-color`) ([8.11](./design.md#811-surface-selection-active-is-the-brand-red-and-is-not-a-status)) |
| Button hover built from `*-button-*-hover` | In lg-brand, primary and secondary **swap places** on hover; in mono-black `on-surface-button-secondary-hover` is white on a near-white fill, **1.30**. Lay one scrim step over the resting fill instead ([8.3](./design.md#83-primary-secondary-and-tertiary-buttons-are-the-same-color-in-dark)) |
| A data-URI icon recolored with `currentColor` | **It does not work.** A data-URI SVG is a separate document and cannot see your CSS, so `currentColor` resolves to the SVG's own initial value, **black**. Measured: a select with `color: #f7f8fa` rendered its arrow pixel as `rgba(0,0,0,255)`. Use `var(--app-select-arrow)` ([rule 1](./design.md#rule-1-never-write-a-raw-value)) |
| No page gutter | `enova-app-tokens.css` resets `body { margin: 0 }`. Use `.app-page` or `.app-container`, or pad it yourself. An iframe page is the exception: no gutter, `background-color: transparent` |
| Click targets that shrink | WCAG 2.2 SC 2.5.8 sets a floor of **24x24 CSS px**, and `.app-btn` is 40px. A small variant lowers `min-height`, but **must not set `min-height: auto`**. The chip recipe once did, produced a 20px box, and made a button that used to be 30px harder to hit. **Measure the rendered box**, not the padding ([8.13](./design.md#813-a-restyle-must-not-shrink-the-click-target-or-drop-what-color-was-saying)) |
| Removing a color that carried information | Before repainting an existing screen, **write down what each color is saying.** On one dashboard green meant "artifact found" and gray meant "not found"; both were merged into the neutral `--app-chip-container-color`, and a whole column stopped meaning anything. The neutral chip is for equally weighted actions **with no state**. Where a fill carries state, keep the page's color, build it on `--app-status-*`, and own the ink in both modes ([8.13](./design.md#813-a-restyle-must-not-shrink-the-click-target-or-drop-what-color-was-saying)) |

---

## 5. Check before shipping (required)

```bash
node <design-tokens>/docs/enova-design/validate-tokens.mjs ./src

# if enova-app-tokens.css sits outside the scanned folder
node <design-tokens>/docs/enova-design/validate-tokens.mjs ./src --define ./public/css/enova-app-tokens.css
```

**A static page that loads from a CDN** has no token packages on disk, so the validator has
nothing to compare against and exits with code 2. That is exactly the installation this guide
recommends, and **both real adoptions stopped here once.** Copy the block below whole.

```bash
# if you have design-tokens cloned, point at its packages and you are done
node .../validate-tokens.mjs ./src --tokens <design-tokens>/packages
```

Without a clone, fetch the packages separately, just for checking. **Do not install them inside
the project you are checking**: the leftover `node_modules` changes what gets scanned and
produces errors that are not there.

```bash
# once: fetch the token packages outside the project
TOKENS="${TMPDIR:-/tmp}/enova-tokens"
mkdir -p "$TOKENS" && (cd "$TOKENS" \
  && npm init -y >/dev/null \
  && npm i --no-save @enovaui/core-tokens@3.9.0 @enovaui/web-tokens@3.9.0 >/dev/null)

# every time after: from the project root
node .../validate-tokens.mjs ./src --tokens "$TOKENS/node_modules/@enovaui"
```

Match the version to the one your page pins. If `npm i` dies with a permission error, the
problem is the cache, not the registry: run `export npm_config_cache="$TOKENS/npm-cache"` before
installing.

**CSS raises no error for a misspelled variable name.** The declaration is dropped silently and an
inherited value shows instead. An audit of a page that adopted the tokens before this guide
existed found **14 dead variables**, shipped, with nobody aware. The validator was run on that
code and caught all 14.

Three of them were **not typos but names that really exist, in another platform's package.** So
**never confirm a token name by grepping the repository.** See
[design.md rule 2, "The platform trap"](./design.md#the-platform-trap).

If you deliberately use a value the tokens do not have, give it a fallback. The page renders
correctly, so it passes.

```css
color: var(--my-experiment, #123456);
```

---

## 6. Maintaining this folder

Written against `@enovaui/core-tokens` and `@enovaui/web-tokens` **3.9.0**.

**The guide checks itself in CI.** On every pull request that touches the token files or this
folder, `.github/workflows/token-validation.yml` does three things:

1. Runs `generate-color-reference.mjs` and fails if `reference-color.md` changes, which means the
   token values moved and the reference was not regenerated.
2. Runs `verify-guide-claims.mjs`, which re-derives every hex value and contrast ratio the
   documents quote from the tokens on disk and fails on any that no longer match. A stale ratio
   that says a pairing is safe is worse than none, so this blocks rather than warns.
3. Runs `validate-tokens.mjs` on this folder, which fails if a token the guide names no longer
   exists. Steps 1 and 2 cannot see a removal: the reference regenerates without the token and
   every remaining claim still matches, while `enova-app-tokens.css` keeps naming it.

So a Figma sync that moves or removes a token the guide depends on cannot merge until the guide
is updated. The sync bot does not update the guide itself: whoever reviews the sync pull request
runs the commands below and fixes the lines they name. What this does not cover: a value the guide describes in words without quoting it, and
any judgment the guide makes on top of a number. Read the failing section, not just the number.

When you move the token version:

- Regenerate the reference with `node docs/enova-design/generate-color-reference.mjs`. It is
  generated from the token CSS and must not be edited by hand.
- Run `node docs/enova-design/verify-guide-claims.mjs` locally before pushing, and fix each line
  it names.
- Update the version in the CDN links and in the "written against" lines (`design.md`,
  `SKILL.md`, `starter/index.html`, `enova-theme.js`, this page).

**Spelling.** The documents use American spelling, to match the CSS property names they sit next
to (`color`, `gray`).

---

## 7. When you are stuck

| Looking for | Where |
|---|---|
| The rules and why | [design.md](./design.md) |
| Color names and their values | [reference-color.md](./reference-color.md) |
| Chart colors | [reference-charts.md](./reference-charts.md) |
| Component code (card, button, table, form) | [reference-patterns.md](./reference-patterns.md) |
| A working example | [starter/index.html](./starter/index.html) |
| A component framework's theme | [design.md section 3D](./design.md#d-through-a-component-frameworks-theme-primevue-mui-vuetify-shadcn) |

If you need a component the documents do not have, follow **the order in section 3.4**.
**Do not invent new values**: that is the only rule.
