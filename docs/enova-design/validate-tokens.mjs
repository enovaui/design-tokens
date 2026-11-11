#!/usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Catch dead design tokens before they ship.
 *
 * A misspelled custom property does not throw and does not warn. The
 * declaration is simply dropped and the element inherits something else. The
 * declaration is simply dropped. An early adopter shipped 14 of these.
 * This script finds them.
 *
 * It reports:
 *   1. --primitive-* / --semantic-* names that @enovaui/core-tokens and
 *      @enovaui/web-tokens do not publish
 *   2. --primitive-* / --semantic-* names that exist, but only in another
 *      platform package (mobile-tokens, webos-tokens, webos-m-tokens). These
 *      are the dangerous ones: the name looks right and even greps clean in the
 *      monorepo, but a web page never loads that file, so the value is absent.
 *   3. any other custom property that is used but never defined in the scanned
 *      source, whatever prefix the project uses (--app-*, or your own)
 *   4. references that only survive because of a fallback
 *   5. hard-coded hex/rgb colors, including %23 inside a data URI
 *   6. tokens used in the wrong role: a surface (a fill) used as text color, or
 *      an on-surface (an ink) used as a background
 *   7. a layer-3 name that only renames the semantic name it points at, which
 *      rule 2 of design.md is about. The layer itself is required; only a name
 *      that adds nothing is a finding. A component token prints below the
 *      verdict so it does not look like work. enova-app-tokens.css, whose whole
 *      job is exactly that, is exempt.
 *   8. a name the document uses, the project defines, and the document never
 *      loads. Checks 1-3 look at the whole scanned tree; this one asks per
 *      document, because a page that drops its <link> to enova-app-tokens.css
 *      keeps every name resolvable in the folder and loses all of them in the
 *      browser.
 *   9. a rule reading --semantic-* directly, on any axis, instead of a layer-3
 *      token. The architecture is primitive -> semantic -> component, and a page
 *      consumes the component layer. A rule wired straight to a semantic name
 *      renders correctly and leaves that component with no override point.
 *      Report only by default, --strict-layer to fail on it.
 *
 * Checks 1-5 ask whether a name resolves. Checks 6 to 9 ask whether the right
 * name was chosen, whether the page can actually see it, and whether it was read
 * from the right layer. Those are different questions, and the more consequential
 * ones. Three audited pages scored zero on checks 1-5 while being visibly wrong:
 * one wrote `color: var(--semantic-color-surface-button-primary)`, painting
 * every link in full-saturation brand red under lg-brand and in near-invisible
 * gray under mono-black, both from that single declaration; another kept a
 * `--<prefix>-*` layer that renamed the semantic palette; the third deleted its
 * <link> to enova-app-tokens.css while still writing var(--app-*) 31 times, so
 * the browser discarded every padding, radius, elevation and type declaration on
 * the page and the folder still held the file. Every name involved was real, so
 * nothing failed. A clean run of 1-5 is not evidence of a correct page, and that
 * is what 6 to 8 exist to say.
 *
 * Usage
 *   node validate-tokens.mjs <scan-dir> [--tokens <dir>] [--define <path>]
 *                            [--allow-hex] [--allow-alias] [--show-aliases]
 *                            [--strict-layer]
 *
 *   <scan-dir>     your app source (default: cwd)
 *   --tokens       where the enova token CSS lives. Default: resolve
 *                  @enovaui/core-tokens and @enovaui/web-tokens from node_modules.
 *                  Point it at a design-tokens/packages directory (or at a copy of
 *                  the css folders) if you vendored the files.
 *   --define       extra file or directory whose declarations count as defined but
 *                  which is not itself checked. Use it when enova-app-tokens.css
 *                  lives outside <scan-dir>. Repeatable, or comma-separated.
 *                  Passing it also asserts the file is loaded, so its names are
 *                  exempt from check 8.
 *   --allow-hex    skip check 5
 *   --allow-alias  downgrade check 7 to a warning. For a migration in progress,
 *                  where the layer is known and being removed.
 *   --show-aliases list the component tokens check 7 accepted. Off by default:
 *                  they are not findings, and listing them alongside findings led
 *                  an adopting agent to delete valid tokens to reach a zero count.
 *   --strict-layer make check 9 fail the run. Off by default, because an adoption
 *                  in progress has not built its layer-3 tokens yet and a red
 *                  build on day one gets the check switched off rather than the
 *                  page fixed. Turn it on once check 9 reads zero, to hold it.
 *
 * Exit code 1 on any finding in checks 1-3, 6, 8, the renaming half of 7, and 9
 * when --strict-layer is passed.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => {
	const i = args.indexOf(name);
	return i === -1 ? null : args[i + 1] ?? '';
};
const has = (name) => args.includes(name);
const flagAll = (name) =>
	args.flatMap((a, i) => (a === name && args[i + 1] ? args[i + 1].split(',') : [])).map((s) => s.trim()).filter(Boolean);
const VALUE_FLAGS = new Set(['--tokens', '--define']);
const scanDir = path.resolve(
	args.find((a, i) => !a.startsWith('--') && !VALUE_FLAGS.has(args[i - 1])) ?? '.'
);
/* A misspelled source path would otherwise scan nothing and report a clean run. */
let scanDirOk = false;
try {
	scanDirOk = fs.statSync(scanDir).isDirectory();
	fs.readdirSync(scanDir);
} catch {
	scanDirOk = false;
}
if (!scanDirOk) {
	console.error(`Source directory not found or not readable: ${scanDir}`);
	process.exit(2);
}
const allowHex = has('--allow-hex');
const allowAlias = has('--allow-alias');
const showAliases = has('--show-aliases');
const strictLayer = has('--strict-layer');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', '.cache']);
/* .md is included on purpose. Documentation that promises a token which does not
 * exist outlives the code that promised it: one audited page advertised a
 * --<prefix>-border-default in its README as public API, and nothing defined it. */
const SCAN_EXT = /\.(css|scss|less|html|htm|js|jsx|mjs|cjs|ts|tsx|vue|svelte|md)$/;

const ALL_PACKAGES = ['core-tokens', 'web-tokens', 'mobile-tokens', 'webos-m-tokens', 'webos-tokens'];

/* Which packages the project actually loads is detected from the source rather
 * than assumed, so a page that deliberately uses mobile-tokens is not flagged.
 * Matches @import "@enovaui/web-tokens/css/...", <link href=".../web-tokens@3.5.0/css/...">
 * and vendored paths like /vendor/enova/web-tokens/css/. The leading separator
 * keeps prose mentions of a package name from counting. */
const LOADED_RE = /[/'"`](core-tokens|web-tokens|mobile-tokens|webos-m-tokens|webos-tokens)(?:@[^/'"`]*)?\/css\//g;

/* Primitives are shared, so core-tokens is always in play. Only the semantic
 * package is a real choice. */
const ALWAYS_LOADED = ['core-tokens'];
const DEFAULT_SEMANTIC = ['web-tokens'];

function walk(dir, onFile) {
	let entries;
	try {
		entries = fs.readdirSync(dir, {withFileTypes: true});
	} catch {
		return;
	}
	for (const e of entries) {
		if (e.isDirectory()) {
			if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), onFile);
		} else {
			onFile(path.join(dir, e.name));
		}
	}
}

/** Every custom property declared in a chunk of source. */
function declaredIn(raw) {
	/* A definition inside a comment defines nothing in the browser, so it must
	 * not satisfy a reference either. */
	const text = blankComments(raw);
	const out = new Set();
	// `--name:` in CSS, including inline style attributes, and the quoted key of
	// a JS style object: {'--name': ...} in JSX or CSS-in-JS
	for (const m of text.matchAll(/(--[\w-]+)['"`]?\s*:/g)) out.add(m[1]);
	// element.style.setProperty('--name', ...)
	for (const m of text.matchAll(/setProperty\(\s*['"`](--[\w-]+)['"`]/g)) out.add(m[1]);
	return out;
}

/* ---- the role model behind checks 6 and 7 -------------------------------- */

/* Every --semantic-color-* name belongs to exactly one of three roles, and the
 * whole set of 158 is covered: surface / background / scrim paint an area,
 * on-* is what you put on top of one, stroke-* draws the line between them.
 * The names carry this, which is what makes it checkable. */
const FILL = 'a fill';
const INK = 'an ink';
const LINE = 'a line';

function tokenRole(name) {
	if (!name.startsWith('--semantic-color-')) return null;
	const rest = name.slice('--semantic-color-'.length);
	if (rest.startsWith('on-')) return INK;
	if (rest.startsWith('stroke-')) return LINE;
	if (/^(surface|background|scrim)/.test(rest)) return FILL;
	return null;
}

/* The role each property expects. Deliberately narrow: box-shadow and svg fill
 * are left out because a surface color is defensible in both. */
const PROP_ROLE = new Map();
for (const p of ['color', '-webkit-text-fill-color', 'caret-color', 'text-decoration-color']) PROP_ROLE.set(p, INK);
for (const p of ['background', 'background-color']) PROP_ROLE.set(p, FILL);
for (const p of [
	'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
	'border-block', 'border-inline', 'border-color', 'border-top-color',
	'border-right-color', 'border-bottom-color', 'border-left-color',
	'outline', 'outline-color', 'column-rule', 'column-rule-color'
]) PROP_ROLE.set(p, LINE);

/* Which mismatches are certainly wrong. A fill painted as text, or an ink
 * painted as a background, has no reading under which it is intended: these are
 * the two found in the wild. The rest are suspicious rather than wrong. A border
 * the same color as its surface is a real technique for reserving layout space,
 * and a deliberately heavy ink-colored border is a style choice, so those warn. */
const CERTAIN = new Set([`${INK}<-${FILL}`, `${FILL}<-${INK}`]);

const varsIn = (value) => [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);

/** name -> the values it is declared with, across every mode block */
const localValue = new Map();

/* Resolve a reference to the role(s) it ends up carrying, following the
 * project's own custom properties. This matters because an alias layer is
 * exactly what hides a role reversal from a direct read: the page sets color
 * from a local name of its own, and the reversal, if any, is one file
 * away. A name that resolves to more than one role (different values under
 * different modes) is treated as unknown rather than guessed at. */
function rolesOf(name, seen = new Set()) {
	const direct = tokenRole(name);
	if (direct) return new Set([direct]);
	if (seen.has(name) || seen.size > 8) return new Set();
	seen.add(name);
	const out = new Set();
	for (const value of localValue.get(name) ?? []) {
		for (const ref of varsIn(value)) for (const r of rolesOf(ref, seen)) out.add(r);
	}
	return out;
}

/* Blank out comments while keeping offsets, so line numbers stay right and a
 * value documented in a comment beside the var() that carries it is not a
 * finding. */
const blankComments = (text) =>
	text.replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '));

/* A property or custom property and its value. Values cannot contain a brace or
 * a semicolon, so this needs no real parser; requiring a known property name
 * keeps selectors and at-rule conditions out. */
const DECL_RE = /(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]*)/g;

/* Each HTML style attribute is a declaration block of its own, but its closing
 * quote is neither `;` nor a brace, so DECL_RE ran on into the next attribute:
 * an element styled with a label color, followed on the same line by one
 * styled with a container fill, read as one color declaration whose value
 * named the fill, and check 6 failed a correct page. The closing
 * quote becomes `;`, which keeps every offset, so line numbers stay right. */
const endStyleAttrs = (text) =>
	text.replace(/(\bstyle\s*=\s*)(?:"([^"]*)"|'([^']*)')/g, (m, lead, dq, sq) =>
		dq !== undefined ? `${lead}"${dq};` : `${lead}'${sq};`
	);

/* How a document says "this line is the mistake". Only these two spellings, and
 * only at the start of a CSS comment, so an ordinary comment that happens to use
 * the word is not silently exempted. Both spellings are already in use: the
 * guide opens such a comment with NO, and an adopted README writes one whose
 * whole body is the word wrong. Used by check 9, the one check that reads
 * fenced code in markdown. */
const COUNTER_EXAMPLE = /\/\*\s*(?:NO\b|wrong\s*\*\/)/i;

/* ---- 1. read the source: declarations, uses, and which packages it loads -- */

const appDefined = new Set();
const uses = new Map(); // name -> [{file, line, hasFallback}]

/* For check 8. A name being defined somewhere in the tree is not the same as the
 * document that uses it loading the file that defines it. cssDeclares maps a
 * scanned stylesheet to the names it declares; htmlDocs keeps each document's
 * text so we can ask which of those stylesheets it actually pulls in. */
const cssDeclares = new Map();     // rel -> Set(name)
const htmlDocs = new Map();        // rel -> {text, own: Set(name)}
/* Passing --define is the caller asserting that this file defines names and is
 * loaded from outside the scanned tree, which is exactly what check 8 would
 * otherwise flag. Take them at their word. */
const defineDeclared = new Set();
const hexHits = [];
const detected = new Set(); // enova packages the source actually references
const colorDecls = []; // {file, line, prop, want, refs} for check 6
const aliasDecls = []; // {file, line, name, target} for check 7
const layerRefs = []; // {file, line, prop, names} for check 9

/** Record `--name: value` so rolesOf() can follow the project's own indirection. */
function collectLocalValues(text) {
	for (const [, prop, value] of endStyleAttrs(blankComments(text)).matchAll(DECL_RE)) {
		if (!prop.startsWith('--')) continue;
		if (!localValue.has(prop)) localValue.set(prop, []);
		localValue.get(prop).push(value);
	}
}

const extraDefineFiles = [];
for (const p of flagAll('--define')) {
	const abs = path.resolve(p);
	if (!fs.existsSync(abs)) {
		console.error(`--define path not found: ${p}`);
		process.exit(2);
	}
	if (fs.statSync(abs).isDirectory()) walk(abs, (f) => SCAN_EXT.test(f) && extraDefineFiles.push(f));
	else extraDefineFiles.push(abs);
}

function noteLoadedPackages(text) {
	for (const m of text.matchAll(LOADED_RE)) detected.add(m[1]);
}

for (const f of extraDefineFiles) {
	const text = fs.readFileSync(f, 'utf8');
	for (const n of declaredIn(text)) {
		appDefined.add(n);
		defineDeclared.add(n);
	}
	noteLoadedPackages(text);
	/* Values, not just names: a --define file is where enova-app-tokens.css
	 * usually sits, and check 6 has to resolve through it. It is still not itself
	 * checked, so no findings are recorded from here. */
	collectLocalValues(text);
}

const extraDefineSet = new Set(extraDefineFiles.map((f) => path.resolve(f)));
const scannedFiles = [];

walk(scanDir, (file) => {
	if (!SCAN_EXT.test(file) || extraDefineSet.has(path.resolve(file))) return;
	scannedFiles.push(file);
	const text = fs.readFileSync(file, 'utf8');
	const rel = path.relative(scanDir, file) || path.basename(file);

	/* enova-app-tokens.css is the layer-3 file this guide ships, and mapping
	 * --app-* names onto semantic colors is its entire job. It is therefore the
	 * single largest source of check-7 lines, and every one of them is correct by
	 * construction. Reporting them taught an adopting agent to delete our own
	 * --app-chart-* and --app-focus-ring-border-color to get the count to zero, which is
	 * the opposite of what the check is for. The file is exempt. */
	const isShippedAppLayer = /(^|[\\/])enova-app-tokens\.css$/.test(rel);

	/* This file prints wrong declarations as counter-examples, in prose, inside
	 * string literals. DECL_RE ends at `;` or a brace and requires neither, so a
	 * sentence like "the wrong fix: rename each one" reads as a declaration named
	 * `fix` and swallows the example CSS on the following lines. That is the same
	 * reason .md is exempt from checks 5-7, and it applies here for the same
	 * reason: the wrong code is the point. Only this file, so CSS-in-JS elsewhere
	 * is still checked. */
	const isOwnTooling = /(^|[\\/])validate-tokens\.mjs$/.test(rel);

	const declaredHere = declaredIn(text);
	for (const n of declaredHere) appDefined.add(n);
	noteLoadedPackages(text);

	if (/\.(css|scss|less)$/.test(file)) cssDeclares.set(rel, new Set(declaredHere));
	else if (/\.(html|htm)$/.test(file)) htmlDocs.set(rel, {text, own: new Set(declaredHere)});

	const lineOf = (index) => text.slice(0, index).split('\n').length;

	for (const m of text.matchAll(/var\(\s*(--[\w-]+)\s*(,)?/g)) {
		const [, name, comma] = m;
		// A trailing dash means we matched a glob in prose, e.g. "var(--semantic-*)".
		if (name.endsWith('-')) continue;
		if (!uses.has(name)) uses.set(name, []);
		uses.get(name).push({file: rel, line: lineOf(m.index), hasFallback: Boolean(comma)});
	}

	/* Markdown is scanned for dead token references but not for hard-coded color,
	 * role reversal or aliasing. Documentation quotes hex values on purpose, and
	 * design.md section 8 shows wrong declarations as counter-examples, so the
	 * guide would fail its own checks 5-7 while being correct.
	 *
	 * Check 9 is the exception, because a document is where the wrong layer gets
	 * taught rather than merely shipped. Exempting .md wholesale hid the same
	 * error three times: an adopted page's README kept recommending
	 * var(--semantic-color-*) in a rule after its CSS had stopped doing it, and
	 * both of this guide's own entry points still carried the rule the component
	 * layer replaced. Every one was found by a reader.
	 *
	 * Two narrowings keep it quiet. Only fenced code is read, since prose is full
	 * of "something: " followed by a token name and DECL_RE needs no terminator;
	 * that alone removed three false positives from five files. And a line whose
	 * CSS comment opens with NO is a counter-example on purpose, which is the
	 * convention these documents already use. Prose is therefore unchecked: an
	 * aside that recommends a semantic token in a rule still has to be caught by
	 * a reader. */
	if (file.endsWith('.md')) {
		let inFence = false;
		let offset = 0;
		for (const line of text.split('\n')) {
			const start = offset;
			offset += line.length + 1;
			if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
			if (!inFence) continue;
			if (COUNTER_EXAMPLE.test(line)) continue;
			for (const [, prop, value] of line.matchAll(DECL_RE)) {
				if (prop.startsWith('--')) continue;
				const reached = varsIn(value).filter((r) => r.startsWith('--semantic-'));
				if (reached.length) layerRefs.push({file: rel, line: lineOf(start), prop, names: reached});
			}
		}
		return;
	}

	const code = blankComments(text);

	/* %23 is `#` inside a data URI, and it is a color like any other. It slipped
	 * through until an adopted select shipped a hard-coded gray arrow that way,
	 * so the pattern is matched too. The shipped app layer is exempt: it carries
	 * --app-select-arrow, where the whole url() is the token and the hex has to be
	 * literal because a data-URI SVG cannot read a var(). */
	if (!allowHex && !isShippedAppLayer) {
		/* The `&` in the lookbehind is for HTML numeric entities. A page that
		 * escapes its own output writes `&#039;` for an apostrophe, and `#039`
		 * is three hex digits, so every escapeHtml() in a project was reported
		 * as a hard-coded color. Found on an adopted page that had reached
		 * zero real ones, where the only way to clear the count would have been
		 * to damage correct code. */
		/* Alpha forms count too: #rrggbbaa always, and #rgba only when it has a
		 * letter, because four digits alone are far more often an issue or build
		 * number ("Build #2814") than a color. */
		const HEX4 = '(?=[0-9]*[a-fA-F])[0-9a-fA-F]{4}';
		const HEX_BODY = `(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|${HEX4}|[0-9a-fA-F]{3})`;
		const HEX_RE = new RegExp(`(?<![\\w&-])#${HEX_BODY}(?![\\w-])|%23${HEX_BODY}(?![0-9a-fA-F])|rgba?\\(\\s*\\d`, 'g');
		for (const m of code.matchAll(HEX_RE)) {
			hexHits.push({file: rel, line: lineOf(m.index), text: m[0]});
		}
	}

	for (const m of endStyleAttrs(code).matchAll(DECL_RE)) {
		const [, prop, value] = m;
		const refs = varsIn(value);
		if (!refs.length) continue;

		if (prop.startsWith('--')) {
			if (!localValue.has(prop)) localValue.set(prop, []);
			localValue.get(prop).push(value);
			/* A bare passthrough of one semantic color under a local name. Composed
			 * values (color-mix, a shadow, several tokens) are building something and
			 * are not what rule 2 is about; nor is a reference to a primitive, which
			 * is how a genuine gap gets filled. */
			const bare = value.trim().match(/^var\(\s*(--semantic-color-[\w-]+)\s*(?:,[^)]*)?\)$/);
			if (bare && !prop.startsWith('--semantic-') && !prop.startsWith('--primitive-') && !isShippedAppLayer) {
				aliasDecls.push({file: rel, line: lineOf(m.index), name: prop, target: bare[1]});
			}
			continue;
		}

		const want = PROP_ROLE.get(prop.toLowerCase());
		if (want) colorDecls.push({file: rel, line: lineOf(m.index), prop, want, refs});

		/* Check 9. We are in the else branch, so prop is a real CSS property rather
		 * than a custom property: this declaration is a rule reading a token, not a
		 * layer defining one. A --semantic-* here is the page reaching past layer 3.
		 * Every axis counts, not just color: the first pass of this work fixed the
		 * colors and left font-weight: var(--semantic-font-weight-600) standing,
		 * which is the same violation wearing a different name. */
		const reached = refs.filter((r) => r.startsWith('--semantic-'));
		if (reached.length && !isOwnTooling) layerRefs.push({file: rel, line: lineOf(m.index), prop, names: reached});
	}
});

/* ---- 2. resolve the token set from what the source loads ----------------- */

function cssFilesUnder(dir) {
	const out = [];
	if (fs.existsSync(dir)) walk(dir, (f) => f.endsWith('.css') && out.push(f));
	return out;
}

/** package name -> its css files, for every package we can find on disk */
function findAllPackages() {
	const explicit = flag('--tokens');
	const found = new Map();
	const roots = explicit
		? [path.resolve(explicit)]
		: [path.join(scanDir, 'node_modules', '@enovaui'), path.join(process.cwd(), 'node_modules', '@enovaui')];

	for (const root of roots) {
		for (const pkg of ALL_PACKAGES) {
			if (found.has(pkg)) continue;
			// packages/<pkg>/css (monorepo) or <pkg>/css (node_modules)
			const files = cssFilesUnder(path.join(root, pkg, 'css'));
			if (files.length) found.set(pkg, files);
		}
	}
	// --tokens may also point straight at a folder of web token css
	if (explicit && !found.size) {
		const files = cssFilesUnder(path.resolve(explicit));
		if (files.length) found.set('web-tokens', files);
	}
	return found;
}

const allPackages = findAllPackages();

/* The semantic packages the source actually loads. Falls back to web-tokens when
 * nothing is detected, which is the case for a bundler setup that imports via a
 * path this regex cannot see, or for a bare CSS fragment. */
const detectedSemantic = [...detected].filter((p) => !ALWAYS_LOADED.includes(p));
const loadedPackages = new Set([
	...ALWAYS_LOADED,
	...(detectedSemantic.length ? detectedSemantic : DEFAULT_SEMANTIC)
]);
const detectionSource = detectedSemantic.length ? 'detected in source' : 'default';

const loadedTokenFiles = [];
const otherTokenFiles = new Map();
for (const [pkg, files] of allPackages) {
	if (loadedPackages.has(pkg)) loadedTokenFiles.push(...files);
	else otherTokenFiles.set(pkg, files);
}

if (!loadedTokenFiles.length) {
	console.error(
		'Could not find the token CSS to compare against.\n' +
			'  npm i --no-save @enovaui/core-tokens @enovaui/web-tokens\n' +
			'or, if you load the tokens from a CDN and have no node_modules:\n' +
			'  --tokens <path to a design-tokens checkout>/packages'
	);
	process.exit(2);
}

const published = new Set();
for (const f of loadedTokenFiles) for (const n of declaredIn(fs.readFileSync(f, 'utf8'))) published.add(n);

/** token name -> the packages that define it but which this project does not load */
const elsewhere = new Map();
for (const [pkg, files] of otherTokenFiles) {
	for (const f of files) {
		for (const n of declaredIn(fs.readFileSync(f, 'utf8'))) {
			if (published.has(n)) continue;
			if (!elsewhere.has(n)) elsewhere.set(n, new Set());
			elsewhere.get(n).add(pkg);
		}
	}
}

/* A token file inside the scan dir (a vendored copy) is not app source. Drop any
 * uses and hex hits that came from one. */
const tokenPathSet = new Set([...loadedTokenFiles, ...[...otherTokenFiles.values()].flat()].map((f) => path.resolve(f)));
if (scannedFiles.some((f) => tokenPathSet.has(path.resolve(f)))) {
	const vendored = new Set(
		scannedFiles.filter((f) => tokenPathSet.has(path.resolve(f))).map((f) => path.relative(scanDir, f))
	);
	for (const [name, sites] of uses) {
		const kept = sites.filter((s) => !vendored.has(s.file));
		if (kept.length) uses.set(name, kept);
		else uses.delete(name);
	}
	for (const list of [hexHits, colorDecls, aliasDecls]) {
		for (let i = list.length - 1; i >= 0; i--) if (vendored.has(list[i].file)) list.splice(i, 1);
	}
}

/* ---- 3. classify ------------------------------------------------------- */

const notPublished = [];   // enova-prefixed, nowhere in the monorepo
const wrongPlatform = [];  // enova-prefixed, only in mobile/webos packages
const undefinedLocal = []; // any other prefix, never defined in the source
const okWithFallback = [];

for (const [name, sites] of uses) {
	const isEnova = name.startsWith('--primitive-') || name.startsWith('--semantic-');
	if (isEnova ? published.has(name) : appDefined.has(name)) continue;

	if (sites.every((s) => s.hasFallback)) {
		okWithFallback.push({name, sites});
		continue;
	}
	if (!isEnova) undefinedLocal.push({name, sites});
	else if (elsewhere.has(name)) wrongPlatform.push({name, sites, pkgs: [...elsewhere.get(name)]});
	else notPublished.push({name, sites});
}

/* ---- 4. check 6: a token used in the wrong role -------------------------- */

const reversed = [];  // certainly wrong
const roleWarn = [];  // suspicious, needs a human

for (const d of colorDecls) {
	for (const ref of d.refs) {
		const got = rolesOf(ref);
		// One unambiguous role, and it is not the one this property takes.
		if (got.size !== 1) continue;
		const role = [...got][0];
		if (role === d.want) continue;
		const row = {...d, ref, got: role};
		(CERTAIN.has(`${d.want}<-${role}`) ? reversed : roleWarn).push(row);
	}
}

/* ---- 5. check 7: a color alias layer ------------------------------------ */

/* A local name is a rename rather than a role when every word in it is either a
 * synonym of the role it points at or a generic step word. `--x-surface-default`
 * for surface-main says nothing the semantic name did not; `--app-chart-surface-color`
 * introduces "chart", a context the semantic layer does not name, so it is a role
 * mapping and stays. This is the line rule 2 draws, and it is the difference
 * between the two audited pages. */
const SYNONYMS = [
	['surface', 'bg', 'background', 'fill', 'canvas', 'paper', 'scrim'],
	['stroke', 'border', 'outline', 'divider', 'rule', 'line'],
	['on', 'content', 'text', 'ink', 'fg', 'foreground', 'label', 'copy']
];
const STEP_WORDS = new Set([
	'default', 'primary', 'secondary', 'tertiary', 'main', 'sub', 'base', 'normal',
	'alt', 'alternate', 'subtle', 'strong', 'weak', 'light', 'dark', 'muted',
	'emphasis', 'high', 'low', 'inverse', 'inverted', 'color', 'colour',
	'hover', 'active', 'focus', 'focused', 'pressed', 'selected', 'disabled',
	'accent', 'white', 'black', 'error', 'success', 'warning', 'info',
	'1', '2', '3', '4', '5'
]);
const groupOf = (word) => SYNONYMS.findIndex((g) => g.includes(word));

const renames = [];
const roleMaps = [];
for (const a of aliasDecls) {
	// Drop the project prefix: --atlas-surface-default -> surface-default
	const own = a.name.replace(/^--[^-]+-/, '');
	const target = a.target.slice('--semantic-color-'.length);
	/* The flattest case, and one the word test below misses: the local name is the
	 * semantic name with a prefix bolted on. --x-surface-button-primary for
	 * surface-button-primary is a rename by inspection, whatever "button" is. */
	const sameName = own === target || target.endsWith(`-${own}`) || own.endsWith(`-${target}`);
	const targetGroups = new Set(target.split('-').map(groupOf).filter((g) => g !== -1));
	const isRename =
		sameName || own.split('-').every((w) => STEP_WORDS.has(w) || targetGroups.has(groupOf(w)));
	(isRename ? renames : roleMaps).push(a);
}

/* ---- 6. check 8: the document does not load what defines the name -------- */

/* Checks 1-3 ask whether a name is defined anywhere in the scanned tree. That is
 * not the same question as whether the page that uses it loads the file that
 * defines it, and the gap is the most destructive failure available: an adopted
 * dashboard dropped its <link> to enova-app-tokens.css while still writing
 * var(--app-*) 31 times. Every one of those declarations was discarded by the
 * browser, so the page lost all padding, radius, elevation and its type roles,
 * and checks 1-7 reported zero because the file was still sitting in the folder.
 *
 * Reachability is decided by whether the stylesheet's path or file name appears
 * anywhere in the document text. That covers <link href>, @import and the
 * document.createElement('link') pattern the mode switcher uses, and it errs
 * toward reachable, which is the right direction for a check that fails a build.
 * One transitive pass so a stylesheet imported by a reachable stylesheet counts. */

const unloaded = []; // {file, name, sites, definedIn}

const mentions = (text, rel) => {
	const base = path.basename(rel);
	return text.includes(rel.split(path.sep).join('/')) || text.includes(base);
};

for (const [htmlRel, doc] of htmlDocs) {
	// Which scanned stylesheets does this document reach?
	const reach = new Set();
	for (let changed = true; changed; ) {
		changed = false;
		for (const cssRel of cssDeclares.keys()) {
			if (reach.has(cssRel)) continue;
			const carriers = [doc.text, ...[...reach].map((r) => fs.readFileSync(path.join(scanDir, r), 'utf8'))];
			if (carriers.some((t) => mentions(t, cssRel))) {
				reach.add(cssRel);
				changed = true;
			}
		}
	}

	const available = new Set([...doc.own, ...defineDeclared]);
	for (const cssRel of reach) for (const n of cssDeclares.get(cssRel)) available.add(n);

	/* Only names the project really does define elsewhere. Anything undefined
	 * everywhere is already check 3, and reporting it twice is noise. */
	for (const [name, sites] of uses) {
		if (available.has(name) || published.has(name)) continue;
		if (!appDefined.has(name)) continue;
		const here = sites.filter((s) => s.file === htmlRel && !s.hasFallback);
		if (!here.length) continue;
		const definedIn = [...cssDeclares].filter(([, names]) => names.has(name)).map(([r]) => r);
		unloaded.push({file: htmlRel, name, sites: here, definedIn});
	}
}

const near = (name) => {
	const parts = name.split('-');
	const pool = name.startsWith('--primitive-') || name.startsWith('--semantic-') ? published : appDefined;
	let best = [];
	for (let depth = parts.length - 1; depth >= 3 && best.length === 0; depth--) {
		const prefix = parts.slice(0, depth).join('-');
		best = [...pool].filter((p) => p.startsWith(prefix) && p !== name).slice(0, 5);
	}
	return best;
};

const section = (title, rows, note) => {
	if (!rows.length) return;
	console.log(`\n${title}`);
	for (const {name, sites, pkgs} of rows) {
		console.log(`  x ${name}${pkgs ? `   [defined only in: ${pkgs.join(', ')}]` : ''}`);
		for (const s of sites.slice(0, 3)) console.log(`      ${s.file}:${s.line}`);
		if (sites.length > 3) console.log(`      ... +${sites.length - 3} more`);
		const cands = near(name);
		if (cands.length) console.log(`      did you mean: ${cands.join(', ')}`);
	}
	if (note) console.log(`  ${note}`);
};

console.log(`Loaded packages: ${[...loadedPackages].join(' + ')}  (${detectionSource})`);
console.log(`Token definitions available: ${published.size} (${loadedTokenFiles.length} css files)`);
if (elsewhere.size)
	console.log(
		`Names from packages this project does not load: ${elsewhere.size} (${[...otherTokenFiles.keys()].join(', ')})`
	);
console.log(`Scanning: ${scanDir}`);
if (extraDefineFiles.length) console.log(`Extra definition sources: ${extraDefineFiles.length} file(s) via --define`);
console.log(`Tokens referenced: ${uses.size}`);

section('[1] --primitive-* / --semantic-* not published anywhere (no fallback -> dead declaration)', notPublished);
section(
	'[2] Exists, but ONLY in a package this project does not load -> dead at runtime',
	wrongPlatform,
	'These grep clean in the monorepo, which is exactly why they get written.\n  If you meant to use that package, load its css and this check follows you.'
);
section('[3] Used but never defined in this source (no fallback -> dead declaration)', undefinedLocal);

if (okWithFallback.length) {
	console.log('\n[4] Unpublished but has a fallback, so it works (confirm this is intentional)');
	for (const {name, sites} of okWithFallback) console.log(`  . ${name}  (${sites[0].file}:${sites[0].line})`);
}

if (!allowHex && hexHits.length) {
	console.log(`\n[5] ${hexHits.length} hard-coded color(s) - replace with tokens (skip with --allow-hex)`);
	for (const h of hexHits.slice(0, 15)) console.log(`  . ${h.file}:${h.line}  ${h.text}`);
	if (hexHits.length > 15) console.log(`  ... +${hexHits.length - 15} more`);
}

const roleLine = (r) =>
	`  x ${r.file}:${r.line}  ${r.prop}: var(${r.ref})` +
	`\n      ${r.prop} takes ${r.want}, ${r.ref} is ${r.got}` +
	(tokenRole(r.ref) ? '' : `\n      (resolved through this project's own properties)`);

if (reversed.length) {
	console.log(`\n[6] ${reversed.length} token(s) used in the wrong role -> the color is not what you asked for`);
	for (const r of reversed.slice(0, 15)) console.log(roleLine(r));
	if (reversed.length > 15) console.log(`  ... +${reversed.length - 15} more`);
	console.log(
		'  A fill and an ink are not interchangeable. surface-button-primary is a\n' +
			'  saturated brand red under lg-brand and a mid gray under mono-black, so as\n' +
			'  a text color it reads as a wall of red in one mode and sinks into the\n' +
			'  background in the other. For text on a surface use on-surface-*, and for\n' +
			'  a background use surface-*.'
	);
}

if (roleWarn.length) {
	console.log(`\n[6b] ${roleWarn.length} unusual role(s) - probably wrong, but there are reasons to do this`);
	for (const r of roleWarn.slice(0, 10)) console.log(roleLine(r).replace(/^  x/, '  .'));
	if (roleWarn.length > 10) console.log(`  ... +${roleWarn.length - 10} more`);
	console.log('  Borders belong to --semantic-color-stroke-*, whose steps are built to sit\n  between two areas without shouting.');
}

/* Only renames are reported as check 7. Component tokens used to be listed here
 * too, under the same [7] heading, and that was a mistake: a numbered heading
 * reads as a finding no matter what the note under it says, and an adopting agent
 * asked to "make it zero" deleted legitimate tokens to get there. They now print
 * separately, below the verdict, and only with --show-aliases. */
if (renames.length) {
	console.log(`\n[7] ${renames.length} renamed color token(s) under this project's own prefix (design.md rule 2)`);
	for (const a of renames.slice(0, 15)) console.log(`  x ${a.file}:${a.line}  ${a.name}: var(${a.target})`);
	if (renames.length > 15) console.log(`  ... +${renames.length - 15} more rename(s)`);
	console.log(
		'  These rename a semantic color without adding meaning. The layer itself is\n' +
			'  required, and deleting it is the wrong fix: rename each one instead, so it\n' +
			'  says which component and which part it dresses.\n' +
			'      --app-surface-default: var(--semantic-color-surface-main)   x a rename\n' +
			'      --app-card-container-color:  var(--semantic-color-surface-main)   . a component\n' +
			'  A name that only repeats the semantic name gives you nothing to override:\n' +
			'  changing one component means changing every component that shares the\n' +
			'  color. A name that says card, or chip, or toast is the override point.\n' +
			'  See design.md rule 2, and Migrating an existing page.'
	);
}

if (unloaded.length) {
	const byFile = new Map();
	for (const u of unloaded) {
		if (!byFile.has(u.file)) byFile.set(u.file, []);
		byFile.get(u.file).push(u);
	}
	console.log(`\n[8] ${unloaded.length} token(s) used by a document that does not load the file defining them`);
	for (const [file, list] of byFile) {
		const missing = [...new Set(list.flatMap((u) => u.definedIn))];
		console.log(`  x ${file}  uses ${list.length} name(s) it never loads`);
		for (const u of list.slice(0, 6)) {
			console.log(`      ${u.name}  (line ${u.sites.map((s) => s.line).slice(0, 4).join(', ')})`);
		}
		if (list.length > 6) console.log(`      ... +${list.length - 6} more`);
		if (missing.length) console.log(`    defined in: ${missing.join(', ')}  <- not reached from this document`);
	}
	console.log(
		'  The names exist in the project, so checks 1-3 pass, and the browser still\n' +
			'  discards every declaration that uses them. A page missing its app layer\n' +
			'  loses all spacing, radius, elevation and type roles at once and reports\n' +
			'  nothing. Add the stylesheet back, in the order given in design.md section 3.'
	);
}

if (layerRefs.length) {
	const byFile = new Map();
	for (const r of layerRefs) {
		if (!byFile.has(r.file)) byFile.set(r.file, []);
		byFile.get(r.file).push(r);
	}
	const mark = strictLayer ? 'x' : '.';
	console.log(
		`\n[9] ${layerRefs.length} rule(s) read --semantic-* directly, past layer 3` +
			(strictLayer ? '' : '  (report only, --strict-layer to fail on these)')
	);
	for (const [file, list] of byFile) {
		console.log(`  ${mark} ${file}  ${list.length} declaration(s)`);
		for (const r of list.slice(0, 6)) {
			console.log(`      line ${r.line}  ${r.prop}: var(${r.names[0]})`);
		}
		if (list.length > 6) console.log(`      ... +${list.length - 6} more`);
	}
	console.log(
		'  Each of these needs a layer-3 token between the rule and the semantic name.\n' +
			'  Add the token where your --app-* names are defined, then point the rule at it:\n' +
			'      .app-card  { background-color: var(--semantic-color-surface-main); }   x\n' +
			'      :root      { --app-card-container-color: var(--semantic-color-surface-main); }\n' +
			'      .app-card  { background-color: var(--app-card-container-color); }            .\n' +
			'  Both render the same pixel today. Only the second can be overridden for one\n' +
			'  component without moving every other component that shares the color.\n' +
			'  Name it <component>-<part>[-<state>]-color; see design.md rule 2.'
	);
}

const dead = notPublished.length + wrongPlatform.length + undefinedLocal.length;
const misused =
	reversed.length + (allowAlias ? 0 : renames.length) + unloaded.length + (strictLayer ? layerRefs.length : 0);

console.log(
	dead
		? `\n[FAIL] ${dead} dead token reference(s) - fix before shipping.`
		: '\n[OK] No dead token references.'
);
if (misused) {
	const parts = [];
	if (reversed.length) parts.push(`${reversed.length} in the wrong role`);
	if (!allowAlias && renames.length) parts.push(`${renames.length} renamed`);
	if (unloaded.length) parts.push(`${unloaded.length} defined but not loaded`);
	if (strictLayer && layerRefs.length) parts.push(`${layerRefs.length} reaching past layer 3`);
	console.log(`[FAIL] ${misused} token(s) used against the guide: ${parts.join(', ')}.`);
	console.log('       These all resolve to a real name somewhere, which is why checks 1-5 pass.');
	console.log('       Resolving is not the same as being right, and being defined in the');
	console.log('       project is not the same as being loaded by the page.');
} else if (!dead && !layerRefs.length) {
	console.log('[OK] No token misuse.');
}

/* Reported whether or not it counts toward the exit code, because a run that
 * printed [9] and then [OK] would be telling the reader two things at once. */
if (!strictLayer && layerRefs.length) {
	console.log(
		`[WARN] ${layerRefs.length} rule(s) reach past layer 3 (check 9). Not counted in the exit\n` +
			'       code yet, so an adoption in progress still goes green. Give each one a\n' +
			'       layer-3 token, then run with --strict-layer to hold the line.'
	);
}

/* Below the verdict on purpose, so it cannot be mistaken for something to fix.
 * These are allowed: they name a role the semantic layer does not have. */
if (roleMaps.length) {
	if (showAliases) {
		console.log(`\n${roleMaps.length} component token(s), expected. Nothing to do here.`);
		for (const a of roleMaps) console.log(`  . ${a.file}:${a.line}  ${a.name}: var(${a.target})`);
		console.log('  This is layer 3 doing its job. Each adds something the semantic layer does');
		console.log('  not say: a component and its part, or a role such as a chart axis.');
		console.log('  Worth a glance to confirm the name really does add that, no more than that.');
	} else {
		console.log(`\n${roleMaps.length} component token(s) found, expected. --show-aliases to list them.`);
	}
}

process.exit(dead + misused ? 1 : 0);
