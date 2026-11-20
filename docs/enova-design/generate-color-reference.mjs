/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regenerates reference-color.md from the token CSS. Run after any Figma sync or
 * version bump. The doc is a build artifact, not a hand-maintained file.
 *
 *   node docs/enova-design/generate-color-reference.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {light as L, dark as D, contrast as cr, version, keyCount, modesAgree} from './token-values.mjs';

// Values come from token-values.mjs so that this generator and
// verify-guide-claims.mjs cannot disagree about what the tokens say.
const HERE = path.dirname(fileURLToPath(import.meta.url));

/* The file this generator writes opens by asserting that both modes define the
 * same key set, and the rest of the guide leans on it: a mode switch is a file
 * swap, so a name that resolves in one mode and not the other is a page that
 * breaks on a toggle rather than a value to look up. The assertion is generated,
 * which means that without this check a one-sided token would be published as
 * its own denial: the table would carry a row with an empty column while the
 * sentence above it said the modes agree. Simulated before it was written, by
 * adding a semantic to lg-brand only. Stop instead, because the fix belongs in
 * the token package and the person this blocks owns both. */
if (!modesAgree) {
	const onlyLight = [...L.keys()].filter((k) => !D.has(k));
	const onlyDark = [...D.keys()].filter((k) => !L.has(k));
	const list = (names) => names.map((n) => `      --semantic-color-${n}`).join('\n');
	console.error(
		'The two modes do not define the same keys, so reference-color.md cannot be\n' +
			'generated: its opening sentence would be false.\n' +
			(onlyLight.length ? `\n  in lg-brand (light) only, ${onlyLight.length}:\n${list(onlyLight)}\n` : '') +
			(onlyDark.length ? `\n  in mono-black (dark) only, ${onlyDark.length}:\n${list(onlyDark)}\n` : '') +
			'\n  Add each missing name to the other mode file in @enovaui/web-tokens, then\n' +
			'  run this again. Do not paper over it here: a page using one of these would\n' +
			'  lose the declaration the moment someone switches mode, with no error.'
	);
	process.exit(1);
}

let out = `<!--
  SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
  SPDX-License-Identifier: Apache-2.0

  GENERATED from @enovaui/web-tokens + @enovaui/core-tokens v${version}.
  Regenerate rather than hand-editing; these values change with every Figma sync.
-->

# Color token reference: lg-brand (light) / mono-black (dark)

The two modes define **exactly the same ${keyCount} keys**. That is what makes a mode switch
a file swap.

In CSS, a semantic name appears only as the value of a component token, such as
\`--app-card-container-color: var(--semantic-color-surface-main)\`, and your rules read
the component token (design.md rule 2). The mode file resolves it. This table is
for looking values up, not for copying hexes into code.

`;

const pick = [
  ['Page background','background-main'],
  ['Card / panel background','surface-main'],
  ['Card hover','surface-main-hover'],
  ['Body text','on-surface-main'],
  ['Secondary text','on-surface-sub'],
  ['Accent text / link','on-surface-accent'],
  ['Border','stroke-main'],
  ['Subtle border','stroke-sub'],
  ['Focus ring','stroke-main-focused'],
  ['Primary button surface','surface-button-primary'],
  ['Primary button label','on-surface-button-primary'],
  ['Secondary button surface','surface-button-secondary'],
  ['Secondary button label','on-surface-button-secondary'],
  ['Disabled surface','surface-main-disabled'],
  ['Disabled label','on-surface-default-disabled'],
  ['Success text','on-surface-main-success'],
  ['Warning surface','surface-default-warning'],
  ['Error text','on-surface-main-error'],
  ['Input border','stroke-text-field'],
  ['Modal dim','scrim-default'],
];
out += `## The 20 you will actually use\n\n| For | Token (\`--semantic-color-\` omitted) | light | dark |\n|---|---|---|---|\n`;
for (const [use,k] of pick) {
  const l=L.get(k), d=D.get(k);
  out += `| ${use} | \`${k}\` | ${l?`\`${l.hex}\``:'-'} | ${d?`\`${d.hex}\``:'-'} |\n`;
}

out += `\n## Contrast audit (WCAG)\n\nBody text needs 4.5:1. Large text (24px, or 18.66px bold) and UI elements need 3:1.\n\n| Pair | light | dark |\n|---|---|---|\n`;
const pairs = [
  ['on-surface-main / surface-main','on-surface-main','surface-main'],
  ['on-surface-sub / surface-main','on-surface-sub','surface-main'],
  ['on-surface-accent / surface-main','on-surface-accent','surface-main'],
  ['on-background-main / background-main','on-background-main','background-main'],
  ['on-background-sub / background-main','on-background-sub','background-main'],
  ['on-background-accent / background-main','on-background-accent','background-main'],
  ['on-surface-button-primary / surface-button-primary','on-surface-button-primary','surface-button-primary'],
  ['on-surface-button-secondary / surface-button-secondary','on-surface-button-secondary','surface-button-secondary'],
  ['on-surface-main-error / surface-main','on-surface-main-error','surface-main'],
  ['on-surface-main-success / surface-main','on-surface-main-success','surface-main'],
  ['on-surface-default-disabled / surface-main','on-surface-default-disabled','surface-main'],
  ['stroke-main / surface-main','stroke-main','surface-main'],
  ['on-surface-card-gray / surface-card-gray','on-surface-card-gray','surface-card-gray'],
  ['on-surface-white / surface-toast','on-surface-white','surface-toast'],
];
const mark=v=>v>=4.5?'✅':v>=3?'⚠️ 3:1 only':'❌';
for (const [name,fg,bg] of pairs) {
  const l = L.get(fg)&&L.get(bg) ? cr(L.get(fg).hex,L.get(bg).hex) : null;
  const d = D.get(fg)&&D.get(bg) ? cr(D.get(fg).hex,D.get(bg).hex) : null;
  out += `| ${name} | ${l?`${l.toFixed(2)} ${mark(l)}`:'-'} | ${d?`${d.toFixed(2)} ${mark(d)}`:'-'} |\n`;
}
out += `\nEvery ❌ and ⚠️ above is explained, with the workaround, in [design.md §8](./design.md#8-pitfalls).\n`;

/* The surface / on-surface pair audit. Generated because the naming looks like a
 * pairing convention and is not: most pairs are unusable together. */
const pairKeys = [...L.keys()].filter(k => k.startsWith('surface-'))
  .map(k => k.replace('surface-', ''))
  .filter(sfx => L.has('on-surface-' + sfx));
const pairRows = pairKeys.map(sfx => ({
  sfx,
  l: cr(L.get('on-surface-' + sfx).hex, L.get('surface-' + sfx).hex),
  d: cr(D.get('on-surface-' + sfx).hex, D.get('surface-' + sfx).hex)
})).sort((a, b) => Math.min(a.l, a.d) - Math.min(b.l, b.d));
const pairOk = pairRows.filter(r => Math.min(r.l, r.d) >= 4.5);

out += `\n## The surface / on-surface trap\n\n`;
out += `${pairKeys.length} \`surface-X\` names have an exactly matching \`on-surface-X\`, which looks\n`;
out += `like a pairing convention. It is not. Measured as text on its same-named surface,\n`;
out += `**only ${pairOk.length} of ${pairRows.length} clear 4.5:1 in both modes**, and the ones at 1.00 are ink the\n`;
out += `same color as the surface.\n\n`;
out += `Read \`on-\` as the character of the ink, not the surface it belongs to.\n`;
out += `\`on-surface-badge-red\` is red ink for a badge, not ink to put on \`surface-badge-red\`.\n\n`;
out += `| Pair (\`surface-\` / \`on-surface-\`) | light | dark |\n|---|---|---|\n`;
for (const r of pairRows) {
  out += `| \`${r.sfx}\` | ${r.l.toFixed(2)} ${mark(r.l)} | ${r.d.toFixed(2)} ${mark(r.d)} |\n`;
}
out += `\nThe safe defaults are \`on-surface-main\` / \`-sub\` on a card and\n`;
out += `\`on-background-main\` / \`-sub\` on the page. See [design.md §8.7](./design.md#87-an-on-surface-name-is-not-the-ink-for-the-surface-of-the-same-name).\n`;

const groups = new Map();
for (const [k,v] of L) { if(!groups.has(v.group)) groups.set(v.group,[]); groups.get(v.group).push(k); }
out += `\n## All ${keyCount}\n`;
for (const [g,keys] of groups) {
  out += `\n### ${g} (${keys.length})\n\n| Token | light primitive | light | dark primitive | dark |\n|---|---|---|---|---|\n`;
  for (const k of keys) {
    const l=L.get(k), d=D.get(k);
    const short = r => r.replace('primitive-color-','');
    out += `| \`${k}\` | ${short(l.ref)} | \`${l.hex}\` | ${d?short(d.ref):'-'} | ${d?`\`${d.hex}\``:'-'} |\n`;
  }
}
fs.writeFileSync(path.join(HERE, 'reference-color.md'), out);
console.log('written | tokens:', L.size, '| lines:', out.split('\n').length);
