/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Keeps the token versions the guide pins in step with the packages.
 *
 *   node docs/enova-design/sync-guide-version.mjs           rewrite the pins
 *   node docs/enova-design/sync-guide-version.mjs --check   exit 1 if any pin is stale
 *
 * The guide pins @enovaui/core-tokens and @enovaui/web-tokens in its CDN URLs
 * and in its "written against" lines. The release step (`pnpm run version`)
 * runs this after the package versions move, so a release never needs the
 * guide edited by hand. CI runs it with --check, so a pin cannot drift.
 *
 * Only the pins are touched. Version comparisons that are history, such as
 * "between 0.8.2 and 3.5.0", are left alone because they do not use a pinned
 * form.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const check = process.argv.includes('--check');

const versionOf = (pkg) =>
	JSON.parse(fs.readFileSync(path.join(ROOT, 'packages', pkg, 'package.json'), 'utf8')).version;
const VERSIONS = {core: versionOf('core-tokens'), web: versionOf('web-tokens')};

const FILES = [
	'design.md',
	'README.md',
	'SKILL.md',
	'copilot-instructions.md',
	'enova-theme.js',
	path.join('starter', 'index.html')
];

const V = '\\d+\\.\\d+\\.\\d+';
/* Each pinned form, and which package's version it takes. */
const PINS = [
	// CDN and npm pins: @enovaui/web-tokens@3.9.0
	{re: new RegExp(`(@enovaui/(core|web)-tokens@)(${V})`, 'g'), pkg: (m) => m[2]},
	// design.md: **@enovaui/web-tokens 3.9.0**
	{re: new RegExp(`(\\*\\*@enovaui/(core|web)-tokens )(${V})(?=\\*\\*)`, 'g'), pkg: (m) => m[2]},
	// README.md, SKILL.md: `@enovaui/web-tokens` **3.9.0**
	{re: new RegExp('(`@enovaui/(core|web)-tokens` \\*\\*)(' + V + ')(?=\\*\\*)', 'g'), pkg: (m) => m[2]},
	// design.md 8.11: In lg-brand at 3.9.0 it resolves
	{re: new RegExp(`(In lg-brand at )(${V})(?= it resolves)`, 'g'), pkg: () => 'web'}
];

const stale = [];
let changedFiles = 0;

for (const rel of FILES) {
	const abs = path.join(HERE, rel);
	const before = fs.readFileSync(abs, 'utf8');
	let after = before;
	for (const {re, pkg} of PINS) {
		// Every pattern is (prefix)...(version): the prefix is kept, the version replaced.
		after = after.replace(re, (...args) => {
			const offset = args[args.length - 2];
			const groups = args.slice(0, -2);
			const want = VERSIONS[pkg(groups)];
			const have = groups[groups.length - 1];
			if (have !== want) {
				const line = after.slice(0, offset).split('\n').length;
				stale.push(`${rel}:${line}  ${have} -> ${want}`);
			}
			return groups[1] + want;
		});
	}
	if (after !== before) {
		changedFiles += 1;
		if (!check) fs.writeFileSync(abs, after);
	}
}

const label = `core-tokens ${VERSIONS.core}, web-tokens ${VERSIONS.web}`;
if (!stale.length) {
	console.log(`[OK] every version pin in the guide matches the packages (${label}).`);
} else if (check) {
	console.log(`[FAIL] ${stale.length} version pin(s) in the guide do not match the packages (${label}):`);
	for (const s of stale) console.log(`  ${s}`);
	console.log('Run: node docs/enova-design/sync-guide-version.mjs');
	process.exit(1);
} else {
	console.log(`Updated ${stale.length} pin(s) in ${changedFiles} file(s) to ${label}.`);
}
