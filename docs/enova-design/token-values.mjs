/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * The one place that reads token values off disk.
 *
 * generate-color-reference.mjs and verify-guide-claims.mjs both need the same
 * three things: what every primitive resolves to, what every semantic name
 * resolves to in each of the two modes, and a contrast function. Having two
 * copies of that would mean the generator and the checker could disagree about
 * what the tokens say, which is the one disagreement that must not be possible.
 *
 * Values only. Nothing here knows anything about the guide.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/** repo root, two levels up from docs/enova-design/ */
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');

/** primitive name (without the leading --) -> lowercase hex */
export const primitives = {};
for (const m of read('packages', 'core-tokens', 'css', 'color-primitive.css')
	.matchAll(/--(primitive-color-[a-z0-9-]+):\s*([^;]+);/g)) {
	primitives[m[1]] = m[2].trim().toLowerCase();
}

/**
 * One mode file -> Map of semantic name (without the --semantic-color- prefix)
 * to {group, ref, hex}. `group` is the nearest preceding comment heading, which
 * is what the reference doc sections are built from.
 */
function readMode(file) {
	const out = new Map();
	let group = '';
	for (const line of read('packages', 'web-tokens', 'css', file).split('\n')) {
		const g = line.match(/\/\*\s*(.+?)\s*\*\//);
		if (g && !/SPDX|----|Semantic/.test(g[1])) group = g[1];
		const m = line.match(/--semantic-color-([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)/);
		if (m) out.set(m[1], {group, ref: m[2], hex: primitives[m[2]]});
	}
	return out;
}

/** lg-brand, the light mode */
export const light = readMode('color-semantic-lg-brand.css');

/** mono-black, the dark mode */
export const dark = readMode('color-semantic-mono-black.css');

/** the pinned token version, read rather than written down */
export const version = JSON.parse(read('packages', 'web-tokens', 'package.json')).version;

/** how many keys each mode defines. The guide asserts the two are equal. */
export const keyCount = light.size;

/** true when both modes define exactly the same key set */
export const modesAgree = light.size === dark.size && [...light.keys()].every((k) => dark.has(k));

/** WCAG relative luminance of a #rrggbb string */
export function luminance(hex) {
	const c = hex
		.replace('#', '')
		.match(/../g)
		.map((x) => parseInt(x, 16) / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** WCAG contrast ratio between two #rrggbb strings */
export function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/**
 * Resolve a name the guide might mention to its hex in each mode. Accepts a
 * bare semantic name (`surface-main`), a full custom property
 * (`--semantic-color-surface-main`), a primitive either way, and the two color
 * words the guide uses in prose.
 */
export function resolve(name) {
	const n = name.replace(/^`|`$/g, '').replace(/^--/, '');
	/* A literal the guide wrote out. Callers pass these as often as they pass
	 * names, and returning null for them silently skipped every contrast claim
	 * that spelled its colors as hex, which is most of them. */
	if (/^#[0-9a-fA-F]{6}$/.test(n)) {
		const hex = n.toLowerCase();
		return {light: hex, dark: hex};
	}
	if (/^white$/i.test(n)) return {light: '#ffffff', dark: '#ffffff'};
	if (/^black$/i.test(n)) return {light: '#000000', dark: '#000000'};

	if (n.startsWith('primitive-color-')) {
		const hex = primitives[n];
		return hex ? {light: hex, dark: hex} : null;
	}

	const key = n.replace(/^semantic-color-/, '');
	const l = light.get(key);
	const d = dark.get(key);
	if (!l && !d) return null;
	return {light: l?.hex ?? null, dark: d?.hex ?? null};
}
