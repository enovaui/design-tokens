/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Enova mode switching for pages built on the Enova design tokens.
 *
 * WHY THIS EXISTS
 * All five @enovaui/web-tokens color modes declare their variables on a bare
 * :root. Loading two at once does not merge them: the last one parsed wins for
 * every one of the 158 names. So a mode switch is a *file swap*, and exactly one
 * color-semantic-*.css may be present at a time.
 *
 * That file swap has to stay in sync with the `data-theme` attribute that
 * enova-app-tokens.css reads for the chart palette and elevation. This module
 * owns both halves so they cannot drift apart.
 *
 * USAGE: inline the IIFE at the bottom of <head>, before any content, to avoid
 * a flash of the wrong mode. Or import it:
 *
 *   import {initTheme, setTheme, getTheme} from './enova-theme.js';
 *   initTheme({base: 'https://unpkg.com/@enovaui/web-tokens@3.9.0/css/'});
 *   setTheme('dark');   // 'light' | 'dark' | 'system'
 */

const LINK_ID = 'enova-mode-tokens';
const STORAGE_KEY = 'enova-theme';

/** lg-brand is the light mode; mono-black is its dark pair. */
const MODE_FILE = {
	light: 'color-semantic-lg-brand.css',
	dark: 'color-semantic-mono-black.css'
};

let config = {base: '', onChange: null};

const media = () =>
	typeof window !== 'undefined' && window.matchMedia
		? window.matchMedia('(prefers-color-scheme: dark)')
		: null;

/* The preference set on this page. Held in memory as well as in storage, so a
 * choice survives where localStorage throws or refuses the write. */
let memoryPref = null;

/** The user's preference: 'light' | 'dark' | 'system'. */
export function getPreference() {
	if (memoryPref) return memoryPref;
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		return v === 'light' || v === 'dark' ? v : 'system';
	} catch {
		return 'system';
	}
}

/* The mode whose file is in effect. Set only once a mode file has applied, so a
 * pending or failed switch does not change what getTheme() reports. */
let appliedMode = null;

/* The mode the preference asks for, which is not yet the one on screen while
 * its file loads, and never is if it fails. */
function requestedMode() {
	const pref = getPreference();
	if (pref !== 'system') return pref;
	return media()?.matches ? 'dark' : 'light';
}

/** The mode actually on screen: 'light' | 'dark'. Before any mode file has
 * applied, the mode that is being loaded. */
export function getTheme() {
	return appliedMode ?? requestedMode();
}

let pending = null;

/* Whether a mode file took effect is read from the colors themselves. The link
 * events cannot say: a good mode file fires `error` (its bare-specifier
 * @imports fail, design.md 3B), a 404 fires the same `error`, and both leave a
 * `sheet` whose rules a cross-origin page cannot read. Measured on unpkg. */
const PROBES = ['--semantic-color-surface-main', '--semantic-color-on-surface-main', '--semantic-color-background-main'];
const probe = () => {
	const cs = getComputedStyle(document.documentElement);
	return PROBES.map((p) => cs.getPropertyValue(p).trim()).join('|');
};
const NO_MODE = PROBES.map(() => '').join('|');

/* Links this module created, and the ones among them whose load has finished,
 * one way or the other. A link it did not create counts as settled. */
const tracked = new WeakSet();
const settled = new WeakSet();
let seq = 0;
function track(link) {
	tracked.add(link);
	const mark = () => {
		link.removeEventListener('load', mark);
		link.removeEventListener('error', mark);
		settled.add(link);
	};
	link.addEventListener('load', mark);
	link.addEventListener('error', mark);
	return link;
}

/* Calls done() once `link`, the only mode file, is in effect. A link that has
 * already loaded calls done() at once, since its events will not fire again. */
function whenLoaded(link, done) {
	if (probe() !== NO_MODE) return done();
	const settle = () => {
		link.removeEventListener('load', settle);
		link.removeEventListener('error', settle);
		// A link replaced while it loaded must not stamp its stale mode.
		if (link.isConnected && probe() !== NO_MODE) done();
	};
	link.addEventListener('load', settle);
	link.addEventListener('error', settle);
}

/* Calls done() once the mode file for `mode` is the one applied, so the
 * data-theme attribute never changes ahead of the colors it goes with. */
function applyLink(mode, done) {
	if (typeof document === 'undefined') return done();
	const my = ++seq; // a later call supersedes one still waiting below
	const href = config.base + MODE_FILE[mode];
	const current = document.getElementById(LINK_ID);

	if (pending) {
		pending.remove();
		pending = null;
	}
	if (current && current.getAttribute('href') === href) return whenLoaded(current, done);

	const next = track(document.createElement('link'));
	next.rel = 'stylesheet';
	next.href = href;
	if (!current) {
		// Order against enova-app-tokens.css does not matter: the mode file
		// defines only --semantic-color-* names, which the app layer reads and
		// never redefines.
		next.id = LINK_ID;
		document.head.appendChild(next);
		return whenLoaded(next, done);
	}

	// No mode is on screen yet. If the current file is still loading, let it
	// settle first and switch from there: loading the two side by side would
	// let its late arrival pass for the new file, and a failed switch would
	// then drop the file that worked. If it already failed, there is nothing
	// to keep, so replace it.
	if (probe() === NO_MODE) {
		if (tracked.has(current) && !settled.has(current)) {
			const resume = () => {
				current.removeEventListener('load', resume);
				current.removeEventListener('error', resume);
				if (my === seq) applyLink(mode, done);
			};
			current.addEventListener('load', resume);
			current.addEventListener('error', resume);
			return;
		}
		current.remove();
		next.id = LINK_ID;
		document.head.appendChild(next);
		return whenLoaded(next, done);
	}

	// Swapping href in place unloads the old file before the new one arrives,
	// and every semantic color is undefined in between: measured at five
	// transparent frames per toggle with the file already cached. So the new
	// file loads beside the old one, which is dropped once the new one is
	// ready. Until it loads the new file applies nothing, so only one mode is
	// ever in effect.
	pending = next;
	const before = probe();
	// load or error alike: the colors say whether the new file took effect.
	// If they did not move, the new file failed; drop it and keep the old mode.
	next.onload = next.onerror = () => {
		if (pending !== next) return;
		pending = null;
		if (probe() === before) {
			next.remove();
			return;
		}
		current.remove();
		next.id = LINK_ID;
		done();
	};
	current.after(next);
}

function applyAttribute(mode) {
	if (typeof document === 'undefined') return;
	// Always the mode of the file that is loaded, 'system' included. Left unset,
	// the prefers-color-scheme block in enova-app-tokens.css would flip layer 3
	// the moment the OS changes, while layer 2 still waits for its file.
	document.documentElement.setAttribute('data-theme', mode);
}

function apply() {
	const pref = getPreference();
	const mode = requestedMode();
	applyLink(mode, () => {
		appliedMode = mode;
		applyAttribute(mode);
		config.onChange?.(mode, pref);
	});
	return mode;
}

/**
 * @param {object} opts
 * @param {string} opts.base   URL prefix for the web-tokens css directory,
 *                             e.g. 'https://unpkg.com/@enovaui/web-tokens@3.9.0/css/'
 *                             or '/vendor/enova/web-tokens/css/'. Must end in '/'.
 * @param {(mode: string, preference: string) => void} [opts.onChange]
 */
export function initTheme(opts = {}) {
	config = {...config, ...opts};
	if (config.base && !config.base.endsWith('/')) config.base += '/';

	const mode = apply();

	// Follow the OS only while the preference is 'system'.
	const mq = media();
	mq?.addEventListener('change', () => {
		if (getPreference() === 'system') apply();
	});

	// Keep other tabs in step.
	if (typeof window !== 'undefined') {
		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY) return;
			memoryPref = null; // another tab chose; storage is the source again
			apply();
		});
	}
	return mode;
}

/** @param {'light'|'dark'|'system'} pref */
export function setTheme(pref) {
	memoryPref = pref;
	try {
		if (pref === 'system') localStorage.removeItem(STORAGE_KEY);
		else localStorage.setItem(STORAGE_KEY, pref);
	} catch {
		/* private mode: apply for this page only */
	}
	return apply();
}

/** light <-> dark, dropping 'system'. */
export function toggleTheme() {
	return setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/* ---------------------------------------------------------------------------
 * No-build version. Paste inside <head>, after the primitive/radius/typography
 * <link>s and before enova-app-tokens.css. Replace BASE with your own URL.
 *
 * <script>
 * (function () {
 *   var BASE = 'https://unpkg.com/@enovaui/web-tokens@3.9.0/css/';
 *   var FILES = {light: 'color-semantic-lg-brand.css', dark: 'color-semantic-mono-black.css'};
 *   var pref = null;
 *   try { pref = localStorage.getItem('enova-theme'); } catch (e) {}
 *   var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
 *   function resolve() {
 *     if (pref === 'light' || pref === 'dark') return pref;
 *     return mq && mq.matches ? 'dark' : 'light';
 *   }
 *   var pending = null;
 *   function probe() {
 *     var cs = getComputedStyle(document.documentElement);
 *     return ['surface-main', 'on-surface-main', 'background-main'].map(function (n) {
 *       return cs.getPropertyValue('--semantic-color-' + n).trim();
 *     }).join('|');
 *   }
 *   function stamp(mode) {
 *     // Always the loaded mode, 'system' included, so layer 3 waits for layer 2.
 *     document.documentElement.setAttribute('data-theme', mode);
 *   }
 *   function apply() {
 *     var mode = resolve();
 *     var href = BASE + FILES[mode];
 *     var cur = document.getElementById('enova-mode-tokens');
 *     if (pending) { pending.parentNode.removeChild(pending); pending = null; }
 *     if (cur && cur.getAttribute('href') === href) { stamp(mode); return; }
 *     var next = document.createElement('link');
 *     next.rel = 'stylesheet';
 *     next.href = href;
 *     if (!cur) {
 *       next.id = 'enova-mode-tokens';
 *       next.settled = false;
 *       next.addEventListener('load', function () { next.settled = true; });
 *       next.addEventListener('error', function () { next.settled = true; });
 *       document.head.appendChild(next); stamp(mode); return;
 *     }
 *     // Nothing on screen yet. If the first file is still loading, wait for it
 *     // and switch from there; if it failed, there is nothing to keep.
 *     if (probe() === '||') {
 *       if (cur.settled === false) {
 *         var resume = function () { cur.removeEventListener('load', resume); cur.removeEventListener('error', resume); apply(); };
 *         cur.addEventListener('load', resume); cur.addEventListener('error', resume);
 *         return;
 *       }
 *       cur.parentNode.removeChild(cur); next.id = 'enova-mode-tokens'; document.head.appendChild(next); stamp(mode); return;
 *     }
 *     // Load the new file beside the old one and drop the old one when it is
 *     // ready. Swapping href in place leaves every color undefined meanwhile.
 *     // Link events cannot tell a good mode file from a 404 (both fire error),
 *     // so the colors decide: if they did not move, keep the old mode.
 *     pending = next;
 *     var before = probe();
 *     next.onload = next.onerror = function () {
 *       if (pending !== next) return;
 *       pending = null;
 *       if (probe() === before) { next.parentNode.removeChild(next); return; }
 *       cur.parentNode.removeChild(cur); next.id = 'enova-mode-tokens'; stamp(mode);
 *     };
 *     cur.parentNode.insertBefore(next, cur.nextSibling);
 *   }
 *   apply();
 *   mq && mq.addEventListener('change', function () { if (pref !== 'light' && pref !== 'dark') apply(); });
 *   window.enovaSetTheme = function (p) {
 *     pref = (p === 'system' ? null : p);
 *     try { p === 'system' ? localStorage.removeItem('enova-theme') : localStorage.setItem('enova-theme', p); } catch (e) {}
 *     apply();
 *   };
 * })();
 * </script>
 * ------------------------------------------------------------------------- */
