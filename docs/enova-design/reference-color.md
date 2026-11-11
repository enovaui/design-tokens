<!--
  SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
  SPDX-License-Identifier: Apache-2.0

  GENERATED from @enovaui/web-tokens + @enovaui/core-tokens v3.9.0.
  Regenerate rather than hand-editing; these values change with every Figma sync.
-->

# Color token reference: lg-brand (light) / mono-black (dark)

The two modes define **exactly the same 158 keys**. That is what makes a mode switch
a file swap.

In CSS, a semantic name appears only as the value of a component token, such as
`--app-card-container-color: var(--semantic-color-surface-main)`, and your rules read
the component token (design.md rule 2). The mode file resolves it. This table is
for looking values up, not for copying hexes into code.

## The 20 you will actually use

| For | Token (`--semantic-color-` omitted) | light | dark |
|---|---|---|---|
| Page background | `background-main` | `#f0ece4` | `#000000` |
| Card / panel background | `surface-main` | `#ffffff` | `#44484a` |
| Card hover | `surface-main-hover` | `#f0ece4` | `#eff1f4` |
| Body text | `on-surface-main` | `#000000` | `#f7f8fa` |
| Secondary text | `on-surface-sub` | `#646464` | `#b3b7b8` |
| Accent text / link | `on-surface-accent` | `#ea1917` | `#e1e2e5` |
| Border | `stroke-main` | `#cbc8c2` | `#767c7f` |
| Subtle border | `stroke-sub` | `#aba8a2` | `#767c7f` |
| Focus ring | `stroke-main-focused` | `#5c5b5a` | `#ffffff` |
| Primary button surface | `surface-button-primary` | `#ea1917` | `#767c7f` |
| Primary button label | `on-surface-button-primary` | `#ffffff` | `#ffffff` |
| Secondary button surface | `surface-button-secondary` | `#ffffff` | `#767c7f` |
| Secondary button label | `on-surface-button-secondary` | `#000000` | `#ffffff` |
| Disabled surface | `surface-main-disabled` | `#e0e0e0` | `#44484a` |
| Disabled label | `on-surface-default-disabled` | `#a19e99` | `#767c7f` |
| Success text | `on-surface-main-success` | `#287d00` | `#46bf85` |
| Warning surface | `surface-default-warning` | `#eeb404` | `#ffca28` |
| Error text | `on-surface-main-error` | `#ea1917` | `#ff5449` |
| Input border | `stroke-text-field` | `#828586` | `#e1e2e5` |
| Modal dim | `scrim-default` | `#000000` | `#000000` |

## Contrast audit (WCAG)

Body text needs 4.5:1. Large text (24px, or 18.66px bold) and UI elements need 3:1.

| Pair | light | dark |
|---|---|---|
| on-surface-main / surface-main | 21.00 ✅ | 8.70 ✅ |
| on-surface-sub / surface-main | 5.92 ✅ | 4.57 ✅ |
| on-surface-accent / surface-main | 4.52 ✅ | 7.14 ✅ |
| on-background-main / background-main | 17.82 ✅ | 19.76 ✅ |
| on-background-sub / background-main | 5.02 ✅ | 12.48 ✅ |
| on-background-accent / background-main | 3.83 ⚠️ 3:1 only | 4.96 ✅ |
| on-surface-button-primary / surface-button-primary | 4.52 ✅ | 4.23 ⚠️ 3:1 only |
| on-surface-button-secondary / surface-button-secondary | 21.00 ✅ | 4.23 ⚠️ 3:1 only |
| on-surface-main-error / surface-main | 4.52 ✅ | 2.91 ❌ |
| on-surface-main-success / surface-main | 5.22 ✅ | 3.98 ⚠️ 3:1 only |
| on-surface-default-disabled / surface-main | 2.67 ❌ | 2.18 ❌ |
| stroke-main / surface-main | 1.67 ❌ | 2.18 ❌ |
| on-surface-card-gray / surface-card-gray | 1.85 ❌ | 7.03 ✅ |
| on-surface-white / surface-toast | 15.13 ✅ | 3.11 ⚠️ 3:1 only |

Every ❌ and ⚠️ above is explained, with the workaround, in [design.md §8](./design.md#8-pitfalls).

## The surface / on-surface trap

21 `surface-X` names have an exactly matching `on-surface-X`, which looks
like a pairing convention. It is not. Measured as text on its same-named surface,
**only 3 of 21 clear 4.5:1 in both modes**, and the ones at 1.00 are ink the
same color as the surface.

Read `on-` as the character of the ink, not the surface it belongs to.
`on-surface-badge-red` is red ink for a badge, not ink to put on `surface-badge-red`.

| Pair (`surface-` / `on-surface-`) | light | dark |
|---|---|---|
| `accent` | 1.00 ❌ | 3.27 ⚠️ 3:1 only |
| `badge-red` | 1.00 ❌ | 1.00 ❌ |
| `badge-orange` | 1.00 ❌ | 1.00 ❌ |
| `badge-green` | 1.00 ❌ | 1.00 ❌ |
| `badge-magenta` | 1.00 ❌ | 1.00 ❌ |
| `selection-active-disabled` | 1.00 ❌ | 1.00 ❌ |
| `white` | 1.00 ❌ | 1.00 ❌ |
| `black` | 1.39 ❌ | 1.00 ❌ |
| `button-secondary-hover` | 4.52 ✅ | 1.30 ❌ |
| `footer` | 1.40 ❌ | 1.49 ❌ |
| `badge-dark-gray` | 1.78 ❌ | 2.51 ❌ |
| `card-gray` | 1.85 ❌ | 7.03 ✅ |
| `sub-supporting` | 8.04 ✅ | 2.73 ❌ |
| `sub` | 4.54 ✅ | 3.15 ⚠️ 3:1 only |
| `button-primary` | 4.52 ✅ | 4.23 ⚠️ 3:1 only |
| `button-primary-disabled` | 21.00 ✅ | 4.23 ⚠️ 3:1 only |
| `button-secondary` | 21.00 ✅ | 4.23 ⚠️ 3:1 only |
| `button-tertiary` | 21.00 ✅ | 4.23 ⚠️ 3:1 only |
| `card-orange` | 5.68 ✅ | 5.01 ✅ |
| `button-primary-hover` | 21.00 ✅ | 7.14 ✅ |
| `main` | 21.00 ✅ | 8.70 ✅ |

The safe defaults are `on-surface-main` / `-sub` on a card and
`on-background-main` / `-sub` on the page. See [design.md §8.7](./design.md#87-an-on-surface-name-is-not-the-ink-for-the-surface-of-the-same-name).

## All 158

### Background (6)

| Token | light primitive | light | dark primitive | dark |
|---|---|---|---|---|
| `background-main` | warm-gray-85 | `#f0ece4` | black | `#000000` |
| `background-sub` | neutral-gray-95 | `#f2f2f2` | mist-gray-30 | `#44484a` |
| `background-white` | white | `#ffffff` | white | `#ffffff` |
| `background-black` | black | `#000000` | black | `#000000` |
| `background-dark-gray` | warm-gray-15 | `#333333` | warm-gray-15 | `#333333` |
| `background-main-dark` | warm-gray-80 | `#e6e1d6` | black | `#000000` |

### On Background (6)

| Token | light primitive | light | dark primitive | dark |
|---|---|---|---|---|
| `on-background-main` | black | `#000000` | mist-gray-99 | `#f7f8fa` |
| `on-background-main-supporting` | warm-gray-15 | `#333333` | mist-gray-85 | `#d3d4d7` |
| `on-background-sub` | warm-gray-35 | `#646464` | mist-gray-80 | `#c5c8c9` |
| `on-background-accent` | active-red-50 | `#ea1917` | mist-gray-50 | `#767c7f` |
| `on-background-highlight` | heritage-red-35 | `#a50034` | mist-gray-95 | `#eff1f4` |
| `on-background-white` | white | `#ffffff` | white | `#ffffff` |

### Surface (72)

| Token | light primitive | light | dark primitive | dark |
|---|---|---|---|---|
| `surface-default-error` | neutral-gray-15 | `#303030` | active-red-60 | `#ff5449` |
| `surface-default-handle` | warm-gray-35 | `#646464` | mist-gray-60 | `#8e9394` |
| `surface-default-indicator` | active-red-50 | `#ea1917` | mist-gray-90 | `#e1e2e5` |
| `surface-default-notification` | active-red-50 | `#ea1917` | red-orange-60 | `#ff5330` |
| `surface-default-placeholder` | warm-gray-60 | `#aba8a2` | mist-gray-60 | `#8e9394` |
| `surface-default-success` | teal-green-40 | `#006a63` | green-70 | `#46bf85` |
| `surface-default-track` | warm-gray-70 | `#cbc8c2` | mist-gray-40 | `#5b6062` |
| `surface-default-warning` | yellow-70 | `#eeb404` | yellow-80 | `#ffca28` |
| `surface-main` | white | `#ffffff` | mist-gray-30 | `#44484a` |
| `surface-main-hover` | warm-gray-85 | `#f0ece4` | mist-gray-95 | `#eff1f4` |
| `surface-main-pressed` | warm-gray-75 | `#dbd7ce` | mist-gray-90 | `#e1e2e5` |
| `surface-main-disabled` | neutral-gray-90 | `#e0e0e0` | mist-gray-30 | `#44484a` |
| `surface-sub` | warm-gray-80 | `#e6e1d6` | mist-gray-40 | `#5b6062` |
| `surface-accent` | active-red-50 | `#ea1917` | mist-gray-50 | `#767c7f` |
| `surface-badge-gradient-start` | deep-orange-45 | `#ff6224` | deep-orange-45 | `#ff6224` |
| `surface-badge-gradient-stop` | active-red-50 | `#ea1917` | active-red-50 | `#ea1917` |
| `surface-badge-gradient-end` | heritage-red-35 | `#a50034` | heritage-red-35 | `#a50034` |
| `surface-badge-red` | active-red-50 | `#ea1917` | active-red-50 | `#ea1917` |
| `surface-badge-light-red` | active-red-95 | `#ffedea` | active-red-95 | `#ffedea` |
| `surface-badge-orange` | orange-50 | `#b95f01` | orange-50 | `#b95f01` |
| `surface-badge-light-orange` | orange-95 | `#ffede0` | orange-95 | `#ffede0` |
| `surface-badge-green` | green-50 | `#008955` | green-50 | `#008955` |
| `surface-badge-light-green` | green-95 | `#d9f6e6` | green-95 | `#d9f6e6` |
| `surface-badge-magenta` | heritage-red-45 | `#d91757` | heritage-red-45 | `#d91757` |
| `surface-badge-light-magenta` | heritage-red-95 | `#ffecef` | heritage-red-95 | `#ffecef` |
| `surface-badge-light-gray` | cool-gray-90 | `#e8e9ed` | cool-gray-90 | `#e8e9ed` |
| `surface-badge-black` | warm-gray-10 | `#262626` | mist-gray-40 | `#5b6062` |
| `surface-button-primary` | active-red-50 | `#ea1917` | mist-gray-50 | `#767c7f` |
| `surface-button-primary-hover` | white | `#ffffff` | mist-gray-90 | `#e1e2e5` |
| `surface-button-primary-pressed` | warm-gray-75 | `#dbd7ce` | mist-gray-30 | `#44484a` |
| `surface-button-primary-disabled` | white | `#ffffff` | mist-gray-50 | `#767c7f` |
| `surface-button-secondary` | white | `#ffffff` | mist-gray-50 | `#767c7f` |
| `surface-button-secondary-hover` | active-red-50 | `#ea1917` | mist-gray-90 | `#e1e2e5` |
| `surface-button-secondary-pressed` | active-red-40 | `#c00011` | mist-gray-30 | `#44484a` |
| `surface-button-tertiary` | white | `#ffffff` | mist-gray-50 | `#767c7f` |
| `surface-button-tertiary-hover` | white | `#ffffff` | mist-gray-90 | `#e1e2e5` |
| `surface-button-tertiary-pressed` | warm-gray-75 | `#dbd7ce` | mist-gray-30 | `#44484a` |
| `surface-button-icon` | warm-gray-75 | `#dbd7ce` | mist-gray-40 | `#5b6062` |
| `surface-button-icon-pressed` | warm-gray-60 | `#aba8a2` | mist-gray-50 | `#767c7f` |
| `surface-button-light` | neutral-gray-95 | `#f2f2f2` | cool-gray-90 | `#e8e9ed` |
| `surface-button-dark` | warm-gray-15 | `#333333` | mist-gray-60 | `#8e9394` |
| `surface-card-gray` | neutral-gray-99 | `#fafafa` | mist-gray-35 | `#4e5355` |
| `surface-chip` | warm-gray-99 | `#fcf9f6` | warm-gray-25 | `#4a4a49` |
| `surface-chip-selected` | active-red-50 | `#ea1917` | mist-gray-90 | `#e1e2e5` |
| `surface-chip-pink` | active-red-99 | `#fef5f5` | active-red-30 | `#93000a` |
| `surface-dialog-popup` | warm-gray-85 | `#f0ece4` | mist-gray-20 | `#2d2d2d` |
| `surface-notification-card` | warm-gray-15 | `#333333` | mist-gray-30 | `#44484a` |
| `surface-selection-active` | active-red-50 | `#ea1917` | green-60 | `#22a56c` |
| `surface-selection-inactive` | warm-gray-35 | `#646464` | mist-gray-50 | `#767c7f` |
| `surface-selection-disabled` | warm-gray-70 | `#cbc8c2` | mist-gray-50 | `#767c7f` |
| `surface-selection-active-disabled` | warm-gray-55 | `#a19e99` | mist-gray-50 | `#767c7f` |
| `surface-selection-switch-inactive` | warm-gray-35 | `#646464` | mist-gray-50 | `#767c7f` |
| `surface-selection-option-disabled` | warm-gray-85 | `#f0ece4` | mist-gray-20 | `#2d2d2d` |
| `surface-tab` | cool-gray-95 | `#f2f3f5` | mist-gray-45 | `#697072` |
| `surface-tab-active` | warm-gray-95 | `#faf9f5` | mist-gray-30 | `#44484a` |
| `surface-text-field-disabled` | warm-gray-75 | `#dbd7ce` | mist-gray-40 | `#5b6062` |
| `surface-toast` | warm-gray-10 | `#262626` | mist-gray-60 | `#8e9394` |
| `surface-white` | white | `#ffffff` | white | `#ffffff` |
| `surface-black` | warm-gray-10 | `#262626` | mist-gray-10 | `#111111` |
| `surface-badge-dark-gray` | cool-gray-35 | `#666973` | cool-gray-35 | `#666973` |
| `surface-footer` | warm-gray-15 | `#333333` | mist-gray-30 | `#44484a` |
| `surface-header-dark` | warm-gray-85 | `#f0ece4` | black | `#000000` |
| `surface-header-light` | warm-gray-90 | `#f6f3eb` | black | `#000000` |
| `surface-sub-disabled` | neutral-gray-95 | `#f2f2f2` | mist-gray-30 | `#44484a` |
| `surface-card-orange` | orange-95 | `#ffede0` | orange-40 | `#934b01` |
| `surface-selection-inactive-disabled` | warm-gray-55 | `#a19e99` | mist-gray-50 | `#767c7f` |
| `surface-banner` | neutral-gray-5 | `#1a1a1a` | neutral-gray-5 | `#1a1a1a` |
| `surface-card` | warm-gray-85 | `#f0ece4` | black | `#000000` |
| `surface-filter` | warm-gray-85 | `#f0ece4` | mist-gray-20 | `#2d2d2d` |
| `surface-selection-option` | neutral-gray-95 | `#f2f2f2` | mist-gray-30 | `#44484a` |
| `surface-tab-segmented` | warm-gray-85 | `#f0ece4` | black | `#000000` |
| `surface-sub-supporting` | neutral-gray-95 | `#f2f2f2` | mist-gray-45 | `#697072` |

### On Surface (40)

| Token | light primitive | light | dark primitive | dark |
|---|---|---|---|---|
| `on-surface-default-disabled` | warm-gray-55 | `#a19e99` | mist-gray-50 | `#767c7f` |
| `on-surface-main` | black | `#000000` | mist-gray-99 | `#f7f8fa` |
| `on-surface-main-error` | active-red-50 | `#ea1917` | active-red-60 | `#ff5449` |
| `on-surface-main-success` | yellow-green-40 | `#287d00` | green-70 | `#46bf85` |
| `on-surface-main-selected` | white | `#ffffff` | mist-gray-30 | `#44484a` |
| `on-surface-sub` | warm-gray-35 | `#646464` | mist-gray-75 | `#b3b7b8` |
| `on-surface-sub-error` | heritage-red-35 | `#a50034` | active-red-50 | `#ea1917` |
| `on-surface-sub-success` | yellow-green-35 | `#316d15` | green-70 | `#46bf85` |
| `on-surface-accent` | active-red-50 | `#ea1917` | mist-gray-90 | `#e1e2e5` |
| `on-surface-highlight` | heritage-red-35 | `#a50034` | mist-gray-95 | `#eff1f4` |
| `on-surface-badge-red` | active-red-50 | `#ea1917` | active-red-50 | `#ea1917` |
| `on-surface-badge-orange` | orange-50 | `#b95f01` | orange-50 | `#b95f01` |
| `on-surface-badge-green` | green-50 | `#008955` | green-50 | `#008955` |
| `on-surface-badge-magenta` | heritage-red-45 | `#d91757` | heritage-red-45 | `#d91757` |
| `on-surface-button-primary` | white | `#ffffff` | white | `#ffffff` |
| `on-surface-button-primary-hover` | black | `#000000` | mist-gray-30 | `#44484a` |
| `on-surface-button-primary-disabled` | black | `#000000` | white | `#ffffff` |
| `on-surface-button-secondary` | black | `#000000` | white | `#ffffff` |
| `on-surface-button-secondary-hover` | white | `#ffffff` | white | `#ffffff` |
| `on-surface-button-tertiary` | black | `#000000` | white | `#ffffff` |
| `on-surface-card-gray` | warm-gray-65 | `#bdbab5` | warm-gray-90 | `#f6f3eb` |
| `on-surface-card-yellow` | yellow-70 | `#eeb404` | yellow-70 | `#eeb404` |
| `on-surface-footer` | neutral-gray-25 | `#4a4946` | mist-gray-20 | `#2d2d2d` |
| `on-surface-index` | warm-gray-70 | `#cbc8c2` | mist-gray-50 | `#767c7f` |
| `on-surface-page-indicator-dot` | warm-gray-70 | `#cbc8c2` | mist-gray-30 | `#44484a` |
| `on-surface-text-field-inactive` | warm-gray-35 | `#646464` | white | `#ffffff` |
| `on-surface-white` | white | `#ffffff` | white | `#ffffff` |
| `on-surface-black` | black | `#000000` | mist-gray-10 | `#111111` |
| `on-surface-main-supporting` | warm-gray-15 | `#333333` | mist-gray-85 | `#d3d4d7` |
| `on-surface-badge-dark-gray` | cool-gray-20 | `#42444a` | mist-gray-20 | `#2d2d2d` |
| `on-surface-header` | warm-gray-35 | `#646464` | white | `#ffffff` |
| `on-surface-button-label-disabled` | warm-gray-35 | `#646464` | white | `#ffffff` |
| `on-surface-card-orange` | orange-40 | `#934b01` | orange-90 | `#ffdcc3` |
| `on-surface-menu` | warm-gray-70 | `#cbc8c2` | mist-gray-50 | `#767c7f` |
| `on-surface-page-indicator` | warm-gray-35 | `#646464` | white | `#ffffff` |
| `on-surface-selection-active-disabled` | warm-gray-55 | `#a19e99` | mist-gray-50 | `#767c7f` |
| `on-surface-text-field-assistive` | warm-gray-45 | `#878580` | mist-gray-80 | `#c5c8c9` |
| `on-surface-card-dark` | neutral-gray-25 | `#4a4946` | mist-gray-20 | `#2d2d2d` |
| `on-surface-card-light` | warm-gray-70 | `#cbc8c2` | mist-gray-50 | `#767c7f` |
| `on-surface-sub-supporting` | neutral-gray-25 | `#4a4946` | mist-gray-20 | `#2d2d2d` |

### Stroke (31)

| Token | light primitive | light | dark primitive | dark |
|---|---|---|---|---|
| `stroke-default-error` | active-red-50 | `#ea1917` | active-red-60 | `#ff5449` |
| `stroke-default-success` | green-60 | `#22a56c` | green-70 | `#46bf85` |
| `stroke-main` | warm-gray-70 | `#cbc8c2` | mist-gray-50 | `#767c7f` |
| `stroke-main-focused` | warm-gray-30 | `#5c5b5a` | white | `#ffffff` |
| `stroke-sub` | warm-gray-60 | `#aba8a2` | mist-gray-50 | `#767c7f` |
| `stroke-badge-green` | green-50 | `#008955` | green-50 | `#008955` |
| `stroke-badge-gray` | cool-gray-35 | `#666973` | cool-gray-35 | `#666973` |
| `stroke-badge-orange` | orange-50 | `#b95f01` | orange-50 | `#b95f01` |
| `stroke-badge-magenta` | heritage-red-45 | `#d91757` | heritage-red-45 | `#d91757` |
| `stroke-accent` | active-red-50 | `#ea1917` | white | `#ffffff` |
| `stroke-badge-red` | active-red-50 | `#ea1917` | active-red-50 | `#ea1917` |
| `stroke-button` | warm-gray-50 | `#94928d` | mist-gray-95 | `#eff1f4` |
| `stroke-button-tertiary` | warm-gray-30 | `#5c5b5a` | mist-gray-95 | `#eff1f4` |
| `stroke-button-icon` | warm-gray-35 | `#646464` | mist-gray-95 | `#eff1f4` |
| `stroke-card-selected` | black | `#000000` | white | `#ffffff` |
| `stroke-card-gray` | neutral-gray-95 | `#f2f2f2` | mist-gray-40 | `#5b6062` |
| `stroke-chip` | neutral-gray-90 | `#e0e0e0` | neutral-gray-90 | `#e0e0e0` |
| `stroke-chip-pink` | heritage-red-35 | `#a50034` | heritage-red-35 | `#a50034` |
| `stroke-chip-white` | white | `#ffffff` | white | `#ffffff` |
| `stroke-selection-active` | active-red-50 | `#ea1917` | green-60 | `#22a56c` |
| `stroke-selection-inactive` | black | `#000000` | white | `#ffffff` |
| `stroke-tab` | mist-gray-10 | `#111111` | mist-gray-99 | `#f7f8fa` |
| `stroke-text-field` | mist-gray-55 | `#828586` | mist-gray-90 | `#e1e2e5` |
| `stroke-text-field-focused` | warm-gray-10 | `#262626` | mist-gray-35 | `#4e5355` |
| `stroke-text-field-disabled` | warm-gray-70 | `#cbc8c2` | mist-gray-70 | `#a9adaf` |
| `stroke-white` | white | `#ffffff` | white | `#ffffff` |
| `stroke-black` | black | `#000000` | mist-gray-10 | `#111111` |
| `stroke-default-selected` | black | `#000000` | white | `#ffffff` |
| `stroke-tab-segmented` | mist-gray-55 | `#828586` | mist-gray-90 | `#e1e2e5` |
| `stroke-main-supporting` | warm-gray-80 | `#e6e1d6` | mist-gray-50 | `#767c7f` |
| `stroke-sub-supporting` | mist-gray-55 | `#828586` | mist-gray-65 | `#999d9f` |

### Scrim (3)

| Token | light primitive | light | dark primitive | dark |
|---|---|---|---|---|
| `scrim-default` | black | `#000000` | black | `#000000` |
| `scrim-white` | white | `#ffffff` | white | `#ffffff` |
| `scrim-black` | neutral-gray-10 | `#262626` | neutral-gray-10 | `#262626` |
