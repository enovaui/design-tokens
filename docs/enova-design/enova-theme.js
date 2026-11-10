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

/** The user's stored preference: 'light' | 'dark' | 'system'. */
export function getPreference() {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		return v === 'light' || v === 'dark' ? v : 'system';
	} catch {
		return 'system';
	}
}

/** The mode actually on screen: 'light' | 'dark'. */
export function getTheme() {
	const pref = getPreference();
	if (pref !== 'system') return pref;
	return media()?.matches ? 'dark' : 'light';
}

let pending = null;

/* Calls done() once the mode file for `mode` is the one applied, so the
 * data-theme attribute never changes ahead of the colors it goes with. */
function applyLink(mode, done) {
	if (typeof document === 'undefined') return done();
	const href = config.base + MODE_FILE[mode];
	const current = document.getElementById(LINK_ID);

	if (pending) {
		pending.remove();
		pending = null;
	}
	if (current && current.getAttribute('href') === href) return done();

	const next = document.createElement('link');
	next.rel = 'stylesheet';
	next.href = href;
	if (!current) {
		// Order against enova-app-tokens.css does not matter: the mode file
		// defines only --semantic-color-* names, which the app layer reads and
		// never redefines.
		next.id = LINK_ID;
		document.head.appendChild(next);
		return done();
	}

	// Swapping href in place unloads the old file before the new one arrives,
	// and every semantic color is undefined in between: measured at five
	// transparent frames per toggle with the file already cached. So the new
	// file loads beside the old one, which is dropped once the new one is
	// ready. Until it loads the new file applies nothing, so only one mode is
	// ever in effect.
	pending = next;
	next.onload = () => {
		if (pending !== next) return;
		current.remove();
		next.id = LINK_ID;
		pending = null;
		done();
	};
	// A failed @import inside the mode file fires error although the file
	// itself applied (the bare specifiers, design.md 3B), so only a link with
	// no sheet at all counts as a failure.
	next.onerror = () => {
		if (next.sheet) return next.onload();
		if (pending !== next) return;
		next.remove();
		pending = null;
	};
	current.after(next);
}

function applyAttribute(mode, pref) {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	// 'system' leaves data-theme off so the prefers-color-scheme block in
	// enova-app-tokens.css takes over; an explicit choice stamps it and wins.
	if (pref === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', mode);
}

function apply() {
	const pref = getPreference();
	const mode = getTheme();
	applyLink(mode, () => {
		applyAttribute(mode, pref);
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
			if (e.key === STORAGE_KEY) apply();
		});
	}
	return mode;
}

/** @param {'light'|'dark'|'system'} pref */
export function setTheme(pref) {
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
 *   function stamp(mode) {
 *     if (pref === 'light' || pref === 'dark') document.documentElement.setAttribute('data-theme', mode);
 *     else document.documentElement.removeAttribute('data-theme');
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
 *     if (!cur) { next.id = 'enova-mode-tokens'; document.head.appendChild(next); stamp(mode); return; }
 *     // Load the new file beside the old one and drop the old one when it is
 *     // ready. Swapping href in place leaves every color undefined meanwhile.
 *     pending = next;
 *     function swap() {
 *       if (pending !== next) return;
 *       cur.parentNode.removeChild(cur); next.id = 'enova-mode-tokens'; pending = null; stamp(mode);
 *     }
 *     next.onload = swap;
 *     // A failed @import inside the file fires error although the file applied.
 *     next.onerror = function () {
 *       if (next.sheet) return swap();
 *       if (pending === next) { next.parentNode.removeChild(next); pending = null; }
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
