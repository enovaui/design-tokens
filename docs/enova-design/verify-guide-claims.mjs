/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Checks the factual claims in the guide against the token values on disk.
 *
 *   node docs/enova-design/verify-guide-claims.mjs [--report]
 *
 * Semantic names are stable and their values are not, so a guide that quotes a
 * hex or a contrast ratio goes stale silently on a Figma sync. A stale ratio
 * that says something is *safe* is worse than no ratio at all, which is why this
 * runs in CI on the same PR that changes the tokens.
 *
 * Two claim shapes are checkable, and the script is deliberately conservative
 * about which lines it will judge:
 *
 *   1. one token name and one or two hexes on a line
 *      -> the hex must be that token's value in one of the two modes
 *   2. two colors and a ratio-shaped number on a line
 *      -> recompute the contrast and compare to 2dp
 *
 * Everything else is counted, not judged, and printed as a coverage figure. That
 * number is the point: it says how much of the guide no machine is watching, so
 * the claims can be migrated toward a checkable shape over time instead of the
 * gap staying invisible.
 *
 * A line or a block that cannot be checked on purpose, a historical value or a
 * figure derived by hand, opts out with a marker:
 *
 *   <!-- claims: skip -->          the next line
 *   <!-- claims: skip-block -->    until the next blank line
 *   <!-- claims: skip-file -->     the whole file
 *
 * --report exits 0 whatever it finds. Without it, a mismatch exits 1.
 */

import fs from 'node:fs';
import path from 'node:path';
import {ROOT, resolve, contrast} from './token-values.mjs';

const HERE = path.join('docs', 'enova-design');

/* reference-color.md is generated, so it is checked by regenerating it rather
 * than by reading it. See the CI step and generate-color-reference.mjs. */
const FILES = [
	'design.md',
	'reference-patterns.md',
	'reference-charts.md',
	'copilot-instructions.md',
	'README.md',
	'enova-app-tokens.css',
	path.join('starter', 'index.html')
];

const reportOnly = process.argv.includes('--report');

const HEX = /#[0-9a-fA-F]{6}\b/g;
const WORD_COLOUR = /\b(white|black)\b/gi;
const TOKEN = /--(?:semantic|primitive|app)-[a-z0-9-]+|`(?:on-)?(?:surface|background|stroke)-[a-z0-9-]+`/gi;
/* a bare N.N or N.NN, not part of a version, a longer number, or a length */
const RATIO = /(?<![\d.\w])(\d{1,2}\.\d{1,2})(?![\d.]|\s*(?:px|pt|rem|em|%|s\b|ms\b))/g;

const mismatches = [];
/** every claim a machine did judge: {file, line, value} */
const claims = [];
/** token -> hex claims a machine did judge */
const hexClaims = [];
/** ratios a machine could not judge: {file, line, value, text} */
const loose = [];
/** hexes not written beside a token name: {file, line, value, text} */
const hexMentions = [];
let skipped = 0;

/** every distinct color reference on a line, as {label, light, dark} */
function colorsOn(line) {
	const out = [];
	for (const h of line.match(HEX) ?? []) {
		const hex = h.toLowerCase();
		out.push({label: h, light: hex, dark: hex});
	}
	for (const w of line.match(WORD_COLOUR) ?? []) {
		const r = resolve(w);
		out.push({label: w, ...r});
	}
	return out;
}

function tokensOn(line) {
	const out = [];
	for (const t of line.match(TOKEN) ?? []) {
		const r = resolve(t);
		if (r && (r.light || r.dark)) out.push({label: t.replace(/`/g, ''), ...r});
	}
	return out;
}

const near = (a, b) => Math.abs(a - b) < 0.005;

for (const rel of FILES) {
	const abs = path.join(ROOT, HERE, rel);
	if (!fs.existsSync(abs)) continue;
	const text = fs.readFileSync(abs, 'utf8');
	if (text.includes('<!-- claims: skip-file -->')) {
		skipped += 1;
		continue;
	}

	const lines = text.split('\n');
	let skipNext = false;
	let skipBlock = false;
	/* Two independent claims can compute to the same ratio, so a repeat only
	 * counts as a restatement inside one section. 4.52 in 8.1 and 4.52 in 8.3 are
	 * different facts that happen to agree. */
	let section = '(top)';

	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		const heading = line.match(/^#{2,4}\s+(.+)$/) || line.match(/^\s*\*\s+-+\s*(.+?)\s*-+/);
		if (heading) section = heading[1].trim().slice(0, 60);

		if (line.includes('claims: skip-block')) {
			skipBlock = true;
			continue;
		}
		if (skipBlock) {
			if (line.trim() === '') skipBlock = false;
			else skipped += 1;
			continue;
		}
		if (line.includes('claims: skip')) {
			skipNext = true;
			continue;
		}
		if (skipNext) {
			skipNext = false;
			skipped += 1;
			continue;
		}

		/* Cross-references and thresholds look exactly like ratios and are not
		 * claims about any color pair, so they never reach the counters. */
		const prose = line
			.replace(/\[[^\]]*\]\([^)]*\)/g, ' ') // [8.5](#85-...) and every other link
			.replace(/§?\d+\.\d+(?:\.\d+)?/g, (s) => (/^\d{1,2}\.\d{2}$/.test(s) ? s : ' ')) // §8.4, 1.4.3
			.replace(/\d+(?:\.\d+)?:1/g, ' ') // 4.5:1, 3:1
			.replace(/@?\d+\.\d+\.\d+/g, ' '); // 3.5.0, 0.8.2

		const hexes = prose.match(HEX) ?? [];
		const ratios = [...prose.matchAll(RATIO)].map((m) => m[1]).filter((s) => +s >= 1 && +s <= 21);
		if (!hexes.length && !ratios.length) continue;

		const where = `${rel}:${i + 1}`;

		/* 1. token -> hex, but only when the two are written side by side with
		 * nothing between them. Proximity anywhere on the line is not enough: a
		 * sentence naming one token often quotes the hex of a different one. */
		const adjacent = [
			...prose.matchAll(
				/`?(--(?:semantic|primitive|app)-[a-z0-9-]+|(?:on-)?(?:surface|background|stroke)-[a-z0-9-]+)`?\s*(?:is|=|:|->)?\s*`?(#[0-9a-fA-F]{6})`?/gi
			)
		];
		const pairedHexes = new Set();
		for (const m of adjacent) {
			const t = resolve(m[1]);
			if (!t || (!t.light && !t.dark)) continue;
			const hex = m[2].toLowerCase();
			pairedHexes.add(m[2]);
			const modes = [t.light, t.dark].filter(Boolean);
			hexClaims.push({file: rel, line: i + 1, value: hex});
			if (!modes.includes(hex)) {
				mismatches.push({
					where,
					value: hex,
					section,
					lineRatios: ratios,
					what: `${m[1]} is ${modes.join(' / ')}, the guide says ${hex}`,
					fix: `${m[1]} resolves to ${modes.join(' / ')} now`,
					line: line.trim()
				});
			}
		}
		/* An unpaired hex is not the same kind of problem as an unpaired ratio. A
		 * color value recurs legitimately: #ffffff means a different token in
		 * every sentence that mentions it, and the counter-examples in rule 1 are
		 * raw values on purpose. Counted, never called a restatement. */
		for (const h of hexes.filter((x) => !pairedHexes.has(x))) {
			hexMentions.push({file: rel, line: i + 1, value: h.toLowerCase(), text: line.trim()});
		}

		/* 2. a ratio, but only in the one form that names both of its colors:
		 *      `#a` on `#b` = N.NN     or     A / B  N.NN
		 * Anything looser is a restatement of a number established elsewhere. */
		const C = '(#[0-9a-fA-F]{6}|white|black)';
		const stated = [
			// `#a` on `#b` = N.NN, allowing a token name to be quoted beside either
			// color, which is how the guide actually writes it
			...prose.matchAll(new RegExp('`?' + C + '`?[^=\\n]{0,40}?`?' + C + '`?[^=\\n]{0,8}=\\s*\\*{0,2}(\\d{1,2}\\.\\d{1,2})', 'gi')),
			// A on B, the ratio following within a few words
			...prose.matchAll(new RegExp('`?' + C + '`?\\s*(?:on|over)\\s*`?' + C + '`?[^\\d\\n]{0,14}(\\d{1,2}\\.\\d{1,2})', 'gi')),
			// a table cell: A / B  N.NN
			...prose.matchAll(new RegExp('`?' + C + '`?\\s*/\\s*`?' + C + '`?\\s+\\*{0,2}(\\d{1,2}\\.\\d{1,2})', 'gi'))
		];
		const claimedRatios = new Set();
		for (const m of stated) {
			const a = resolve(m[1]);
			const b = resolve(m[2]);
			const got = +m[3];
			if (!a || !b || got < 1 || got > 21) continue;
			claimedRatios.add(m[3]);
			const pairs = [
				[a.light, b.light],
				[a.dark, b.dark]
			].filter(([x, y]) => x && y);
			if (!pairs.length) continue;
			const round = (x) => Math.round(x * 100) / 100;
			claims.push({file: rel, section, line: i + 1, value: m[3]});
			if (!pairs.some(([x, y]) => near(round(contrast(x, y)), got))) {
				const now = pairs.map(([x, y]) => round(contrast(x, y)).toFixed(2));
				mismatches.push({
					where,
					value: m[3],
					section,
					lineRatios: ratios,
					what: `${m[1]} on ${m[2]} is ${now.join(' / ')}, the guide says ${got.toFixed(2)}`,
					fix: `${m[1]} on ${m[2]} is ${now.join(' / ')} now`,
					line: line.trim()
				});
			}
		}
		for (const r of ratios.filter((x) => !claimedRatios.has(x))) {
			loose.push({file: rel, section, line: i + 1, value: r, text: line.trim()});
		}
	}
}

/* ---- classify what could not be judged ----------------------------------- *
 * A number a machine cannot judge is one of two very different things, and the
 * work to do about them is different, so they are never reported as one total.
 *
 *   restatement  the same value is a judged claim elsewhere in the same file.
 *                It carries no new information and it is separate debt: change
 *                the token and someone has to find every copy by hand.
 *   orphan       the value appears nowhere as a judged claim, so which color
 *                pair it describes exists only in the sentence.
 */
const claimedIn = new Map(); // "file\u0000section" -> Map(value -> [lines])
for (const c of claims) {
	const k = `${c.file}\u0000${c.section}`;
	if (!claimedIn.has(k)) claimedIn.set(k, new Map());
	const m = claimedIn.get(k);
	if (!m.has(c.value)) m.set(c.value, []);
	m.get(c.value).push(c.line);
}
const primaryFor = (l) => claimedIn.get(`${l.file}\u0000${l.section}`)?.get(l.value) ?? null;

const restatements = loose.filter((l) => primaryFor(l));
const orphans = loose.filter((l) => !primaryFor(l));

const showAll = process.argv.includes('--list');
const CAP = showAll ? Infinity : 8;

if (mismatches.length) {
	console.log(`\n[FAIL] ${mismatches.length} claim(s) no longer match the tokens on disk.\n`);
	console.log('For each one: correct the value, then decide whether the sentence around');
	console.log('it still holds. A value change can flip a conclusion, and only a person');
	console.log('can see that. Every copy of the old number is listed so none is missed.\n');

	for (const m of mismatches) {
		console.log(`  ${m.where}`);
		console.log(`     now: ${m.fix}`);
		console.log(`     | ${m.line.slice(0, 110)}`);
		const file = m.where.split(':')[0];
		/* A hex that moved almost always drags a ratio with it: the pairing on the
		 * same line was computed from the old value. Walk from the changed value to
		 * the ratios beside it, then to every place those ratios are said again, so
		 * one failure produces the whole edit list rather than its first line. */
		for (const rv of new Set(m.lineRatios ?? [])) {
			const here = [...claims, ...loose].filter(
				(x) => x.file === file && x.section === m.section && x.value === rv
			);
			const lines = [...new Set(here.map((x) => x.line))].sort((a, b) => a - b);
			if (!lines.length) continue;
			console.log(`     ${rv} was computed from the old value. Recompute it, then fix every`);
			console.log(`     line that says it: ${lines.join(', ')}`);
		}
		console.log('');
	}
}

console.log(`checked        ${claims.length + hexClaims.length}   (${hexClaims.length} token/hex, ${claims.length} ratio)`);
console.log(`repeated       ${restatements.length}   ratios restated after being stated once`);
console.log(`unchecked      ${orphans.length}   ratios whose color pair is only in the prose`);
console.log(
	`hex mentions   ${hexMentions.length}   hexes with no token name beside them, mostly code examples.` +
		'\n               Nothing to do; --list to audit them.'
);
if (skipped) console.log(`skipped      ${skipped}  (explicit markers)`);
console.log('');

if (restatements.length) {
	const byValue = new Map();
	for (const r of restatements) {
		const k = `${r.file} ${r.section} ${r.value}`;
		if (!byValue.has(k)) byValue.set(k, {sample: r, lines: []});
		byValue.get(k).lines.push(r.line);
	}
	const rows = [...byValue.values()]
		.map(({sample, lines}) => ({
			file: sample.file,
			section: sample.section,
			value: sample.value,
			lines,
			primary: primaryFor(sample)
		}))
		.sort((a, b) => b.lines.length - a.lines.length);

	console.log(`REPEATED  ${restatements.length} in ${rows.length} value(s). Delete them, or replace them`);
	console.log('with a pointer to the line that states the value once. Each one you remove');
	console.log('is one less place to edit on the next token change.\n');
	for (const r of rows.slice(0, CAP)) {
		console.log(`  ${r.file}  ${r.value}   in "${r.section}"`);
		console.log(`     stated once at ${r.primary.join(', ')}, where both colors are named`);
		console.log(`     said again at  ${r.lines.join(', ')}`);
	}
	if (rows.length > CAP) console.log(`  ... and ${rows.length - CAP} more value(s) (--list)`);
	console.log('');
}

if (orphans.length) {
	console.log(`UNCHECKED  ${orphans.length}. Which colors these describe is only in the prose, so`);
	console.log('no machine can confirm them. Rewrite as `#a` on `#b` = N.NN to bring one');
	console.log('under the check, or mark it <!-- claims: skip --> if it cannot be written');
	console.log('that way, so what is left unwatched is a deliberate list rather than a gap.\n');
	for (const o of orphans.slice(0, CAP)) {
		console.log(`  ${o.file}:${o.line}  ${o.value}`);
		console.log(`     | ${o.text.slice(0, 100)}`);
	}
	if (orphans.length > CAP) console.log(`  ... and ${orphans.length - CAP} more (--list)`);
	console.log('');
}

if (mismatches.length) process.exit(reportOnly ? 0 : 1);
console.log('[OK] every checkable claim matches the tokens on disk.');
