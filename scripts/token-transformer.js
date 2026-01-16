#!/usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Token Transformer Engine
 * Transforms Figma Variables to platform-specific token formats.
 */

console.log('🔧 Token transformer script started');

const fs = require('fs-extra');
const path = require('path');
const CSSGenerator = require('./css-generator');
const DartGenerator = require('./dart-generator');

class TokenTransformer {
	constructor(mappingConfig) {
		this.mappingConfig = mappingConfig;
		this.cssGenerator = new CSSGenerator();
		this.dartGenerator = new DartGenerator();
		this.baseDir = path.resolve(__dirname, '..');

		// semantic color themes for webos-tokens
		// The pattern is used to match the file names in the JSON directory
		this.semanticThemes = [
			{ name: 'dark', pattern: 'color-semantic-dark.json' },
			{ name: 'light', pattern: 'color-semantic-light.json' },
			{ name: 'high_contrast', pattern: 'color-semantic-high-contrast.json' },
		];

		// semantic color themes for web-tokens
		this.webSemanticThemes = [
			{ name: 'web', pattern: 'color-semantic-web.json' },
			{ name: 'mobile', pattern: 'color-semantic-mobile.json' },
			{ name: 'mono_black', pattern: 'color-semantic-mono-black.json' },
			{ name: 'mono_white', pattern: 'color-semantic-mono-white.json' },
			{ name: 'lg_brand', pattern: 'color-semantic-lg-brand.json' },
		];

		// semantic color themes for mobile-tokens
		this.mobileSemanticThemes = [
			{ name: 'mobile', pattern: 'color-semantic-mobile.json' },
			{ name: 'mono_black', pattern: 'color-semantic-mono-black.json' },
			{ name: 'mono_white', pattern: 'color-semantic-mono-white.json' },
			{ name: 'web', pattern: 'color-semantic-web.json' },
			{ name: 'lg_brand', pattern: 'color-semantic-lg-brand.json' },
		];

		// primitive token types with corresponding Dart methods
		this.primitiveTokenTypes = [
			{ type: 'color', dartMethod: 'generateColorDartFromJSON' },
			{ type: 'radius', dartMethod: 'generateRadiusDartFromJSON' },
			{ type: 'typography', dartMethod: 'generateTypographyDartFromJSON' },
			{ type: 'spacing', dartMethod: 'generateSpacingDartFromJSON' },
		];
	}

	/**
	 * Normalize token names to consistent kebab-case format
	 * @param {string} tokenName - Original token name
	 * @returns {string} Normalized token name
	 */
	normalizeTokenName(tokenName) {
		const normalizations = {
			'chip-actionchip': 'chip-action-chip',
			'chip-filterchip': 'chip-filter-chip', 
			'dialogpopup': 'dialog-popup',
			'selectioncontrol-checkbox': 'selection-control-checkbox',
			'selectioncontrol-switch': 'selection-control-switch',
			'badge-deeporange': 'badge-deep-orange',
			'badge-heritagered': 'badge-heritage-red',
			'badge-lightred': 'badge-light-red',
			'badge-lightorange': 'badge-light-orange',
			'badge-lightgreen': 'badge-light-green',
			'badge-lightmagenta': 'badge-light-magenta',
			'badge-lightgray': 'badge-light-gray'
		};
		
		// Apply specific normalizations first
		let normalized = normalizations[tokenName] || tokenName;
		
		// Apply global pattern-based normalizations for compound paths
		normalized = normalized
			// Apply badge normalizations globally for compound paths
			.replace(/badge-deeporange/g, 'badge-deep-orange')
			.replace(/badge-heritagered/g, 'badge-heritage-red')
			.replace(/badge-lightred/g, 'badge-light-red')
			.replace(/badge-lightorange/g, 'badge-light-orange')
			.replace(/badge-lightgreen/g, 'badge-light-green')
			.replace(/badge-lightmagenta/g, 'badge-light-magenta')
			.replace(/badge-lightgray/g, 'badge-light-gray')
			// Apply chip and selection control normalizations globally
			.replace(/chip-actionchip/g, 'chip-action-chip')
			.replace(/chip-filterchip/g, 'chip-filter-chip')
			.replace(/dialogpopup/g, 'dialog-popup')
			.replace(/selectioncontrol-checkbox/g, 'selection-control-checkbox')
			.replace(/selectioncontrol-switch/g, 'selection-control-switch')
			// General kebab-case normalization for compound words
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.toLowerCase();
			
		return normalized;
	}

	/**
	 * Update primitive Dart files based on token type
	 * @param {string} filePath - JSON file path
	 * @param {string} outputDir - Output directory
	 * @param {Array} updatedFiles - Array to store updated file paths
	 */
	async updatePrimitiveDartFiles(filePath, outputDir, updatedFiles) {
		for (const { type, dartMethod } of this.primitiveTokenTypes) {
			if (filePath.includes(`${type}-primitive`)) {
				const dartPath = path.join(this.baseDir, `lib/src/core_tokens/${type}_primitive.dart`);
				await this.dartGenerator[dartMethod](filePath, dartPath);
				console.log(`   💎 Updated Dart file ${path.relative(outputDir, dartPath)}`);
				updatedFiles.push(dartPath);
			}
		}
	}

	/**
	 * Update specific semantic color Dart file
	 * @param {string} filePath - JSON file path
	 * @param {Array} updatedFiles - Array to store updated file paths
	 */
	async updateSemanticDartFileForTheme(filePath, updatedFiles) {
		if (!filePath.includes('color-semantic')) return;

		// Determine which package this file belongs to
		const isWebosPackage = filePath.includes('webos-tokens');
		const isWebPackage = filePath.includes('web-tokens');
		const isMobilePackage = filePath.includes('mobile-tokens');

		// webos-tokens semantic colors
		if (isWebosPackage) {
			const webosDartOutputDir = path.join(this.baseDir, 'lib/src/webos_tokens');
			for (const { name, pattern } of this.semanticThemes) {
				const themePart = pattern.replace('.json', '').replace('color-semantic-', '');
				if (filePath.includes(themePart)) {
					await this.dartGenerator.generateSemanticDartFromJSON(filePath, webosDartOutputDir, name);
					console.log(`✅ Generated WebOS Semantic Dart files for ${name} theme`);
					console.log(`   💎 Updated WebOS Dart files for ${name} theme semantic colors`);
					const dartFilePath = path.join(webosDartOutputDir, `color_semantic_${name}.dart`);
					updatedFiles.push(dartFilePath);
					return;
				}
			}
		}

		// web-tokens semantic colors
		if (isWebPackage) {
			const webDartOutputDir = path.join(this.baseDir, 'lib/src/web_tokens');
			for (const { name, pattern } of this.webSemanticThemes) {
				const themePart = pattern.replace('.json', '').replace('color-semantic-', '');
				if (filePath.includes(themePart)) {
					// For web-tokens we use folder names that may differ from "name" in DartGenerator
					await this.dartGenerator.generateSemanticDartFromJSON(filePath, webDartOutputDir, name);
					console.log(`✅ Generated Web Semantic Dart files for ${name} theme`);
					console.log(`   💎 Updated Web Dart files for ${name} theme semantic colors`);
					const dartFilePath = path.join(webDartOutputDir, name, 'color', `color_semantic_${name}.dart`);
					updatedFiles.push(dartFilePath);
					return;
				}
			}
		}

		// mobile-tokens semantic colors
		if (isMobilePackage) {
			const mobileDartOutputDir = path.join(this.baseDir, 'lib/src/mobile_tokens');
			for (const { name, pattern } of this.mobileSemanticThemes) {
				const themePart = pattern.replace('.json', '').replace('color-semantic-', '');
				if (filePath.includes(themePart)) {
					// For mobile-tokens we also use folder names that may differ from "name" in DartGenerator
					await this.dartGenerator.generateSemanticDartFromJSON(filePath, mobileDartOutputDir, name);
					console.log(`✅ Generated Mobile Semantic Dart files for ${name} theme`);
					console.log(`   💎 Updated Mobile Dart files for ${name} theme semantic colors`);
					const dartFilePath = path.join(mobileDartOutputDir, name, 'color', `color_semantic_${name}.dart`);
					updatedFiles.push(dartFilePath);
					return;
				}
			}
		}
	}

	/**
	 * Update CSS and Dart files based on JSON file
	 * @param {string} filePath - JSON file path
	 * @param {string} outputDir - Output directory
	 * @param {Array} updatedFiles - Array to store updated file paths
	 */
	async updateDerivedFiles(filePath, outputDir, updatedFiles) {
		// Update CSS file
		const cssPath = filePath.replace('/json/', '/css/').replace('.json', '.css');
		await this.updateCSSFromJSON(filePath, cssPath);
		console.log(`   🎨 Updated CSS file ${path.relative(outputDir, cssPath)}`);
		updatedFiles.push(cssPath);

		// Update primitive Dart files
		await this.updatePrimitiveDartFiles(filePath, outputDir, updatedFiles);

		// Update semantic Dart files
		await this.updateSemanticDartFileForTheme(filePath, updatedFiles);
	}

	/**
	 * Apply incremental updates based on changes
	 */
	async applyChanges(changes, outputDir) {
		const updatedFiles = [];

		// Handle added tokens - group by collection/file
		const addedTokensByFile = {};
		for (const [tokenPath, changeData] of Object.entries(changes.added || {})) {
			const filePath = this.resolveOutputPath(tokenPath, changeData, outputDir);

			if (!addedTokensByFile[filePath]) {
				addedTokensByFile[filePath] = [];
			}
			addedTokensByFile[filePath].push({ tokenPath, changeData });
		}

		// Process added tokens by file
		for (const [filePath, tokens] of Object.entries(addedTokensByFile)) {
			console.log(`   🔍 Processing file: ${path.relative(outputDir, filePath)} with ${tokens.length} tokens`);
			await this.addTokensToFile(filePath, tokens);
			console.log(`   ✅ Added ${tokens.length} tokens to ${path.relative(outputDir, filePath)}`);
			updatedFiles.push(filePath);

			// Update corresponding CSS and Dart files
			await this.updateDerivedFiles(filePath, outputDir, updatedFiles);
		}

		// Handle modified tokens
		for (const [tokenPath, changeData] of Object.entries(changes.modified || {})) {
			const filePath = this.resolveOutputPath(tokenPath, changeData, outputDir);
			await this.mergeTokenFile(filePath, changeData.after);
			console.log(`   📝 Modified tokens in ${path.relative(outputDir, filePath)}`);
			updatedFiles.push(filePath);

			// Update corresponding CSS and Dart files
			await this.updateDerivedFiles(filePath, outputDir, updatedFiles);
		}

		// Handle removed tokens
		for (const [tokenPath, changeData] of Object.entries(changes.removed || {})) {
			const filePath = this.resolveOutputPath(tokenPath, changeData, outputDir);

			console.log(`   🔍 Processing removed token: ${tokenPath}`);

			// Create token structure to remove
			const tokenToRemove = this.convertTokenDataToFormat(changeData);

			await this.removeTokensFromFile(filePath, tokenToRemove);
			console.log(`   🗑️  Removed tokens from ${path.relative(outputDir, filePath)}`);
			updatedFiles.push(filePath);

			// Update corresponding CSS and Dart files
			await this.updateDerivedFiles(filePath, outputDir, updatedFiles);
		}
		return [...new Set(updatedFiles)]; // Remove duplicates
	}

	/**
	 * Add new tokens to existing file
	 */
	async addTokensToFile(filePath, tokens) {
		await fs.ensureDir(path.dirname(filePath));

		let existingTokens = {};
		if (await fs.pathExists(filePath)) {
			existingTokens = await fs.readJson(filePath);
		}

		const isColorSemantic = /color-semantic/.test(filePath);
		const isRadiusSemantic = /radius-semantic/.test(filePath);
		const isTypographySemantic = /typography-semantic/.test(filePath);

		if (isColorSemantic) {
			// Build primitive color lookup
			let primitiveColors = {};
			try {
				const primitivePath = path.resolve(__dirname, '../packages/core-tokens/json/color-primitive.json');
				const primitiveData = fs.readJsonSync(primitivePath);
				if (primitiveData && primitiveData.primitive && primitiveData.primitive.color) {
					primitiveColors = primitiveData.primitive.color;
				}
			} catch (e) {
				console.warn('Failed to load primitive colors:', e.message);
			}
			const primitiveColorLookup = this.buildPrimitiveColorLookup(primitiveColors);

			for (const { changeData } of tokens) {
				const { path: originalTokenPathArray, value } = changeData;
				// Process special cases like "onbackground" -> ["on", "background"]
				const tokenPathArray = [];
				for (const segment of originalTokenPathArray) {
					// Special case handling for combined segments
					if (segment === 'onbackground') {
						tokenPathArray.push('on');
						tokenPathArray.push('background');
					} else if (segment === 'onsurface') {
						tokenPathArray.push('on');
						tokenPathArray.push('surface');
					} else {
						tokenPathArray.push(segment);
					}
				}

				// semantic.color.[...path]
				let target = existingTokens;
				if (!target.semantic) target.semantic = {};
				target = target.semantic;
				if (!target.color) target.color = {};
				target = target.color;
				for (let i = 0; i < tokenPathArray.length - 1; i++) {
					const normalizedKey = this.normalizeTokenName(tokenPathArray[i]);
					if (!target[normalizedKey]) target[normalizedKey] = {};
					target = target[normalizedKey];
				}
				// Apply normalization to the final key as well
				const finalKey = this.normalizeTokenName(tokenPathArray[tokenPathArray.length - 1]);
				target[finalKey] = value;
			}
			// Apply reference conversion to entire object at once
			existingTokens = this.refSemanticColorsWithPrimitives(existingTokens, primitiveColorLookup);
			const sortedTokens = this.sortTokens(existingTokens);
			await this.saveTokensToFile(filePath, sortedTokens);
			return;
		}

		if (isRadiusSemantic) {
			// Build primitive radius lookup
			let primitiveRadius = {};
			try {
				const primitivePath = path.resolve(__dirname, '../packages/core-tokens/json/radius-primitive.json');
				const radiusJson = fs.readJsonSync(primitivePath);
				if (radiusJson && radiusJson.primitive) {
					primitiveRadius = radiusJson.primitive;
				}
			} catch (e) {
				console.warn('Failed to load primitive radius:', e.message);
			}
			const primitiveRadiusLookup = this.buildPrimitiveRadiusLookup(primitiveRadius);

			// Initialize fresh semantic radius structure to avoid duplicates
			if (!existingTokens.semantic) existingTokens.semantic = {};
			existingTokens.semantic.radius = {}; // Reset radius to avoid duplicates

			for (const { changeData } of tokens) {
				const { path: tokenPathArray, value } = changeData;
				// semantic.radius.[...path] - but skip first 'radius' from path if it exists
				let target = existingTokens.semantic.radius;
				
				// Skip the first element if it's 'radius' (to avoid semantic.radius.radius.*)
				const pathToUse = tokenPathArray[0] === 'radius' ? tokenPathArray.slice(1) : tokenPathArray;
				
				for (let i = 0; i < pathToUse.length - 1; i++) {
					if (!target[pathToUse[i]]) target[pathToUse[i]] = {};
					target = target[pathToUse[i]];
				}
				
				// Format value as px string if it's a number
				let formattedValue = value;
				if (typeof value === 'number') {
					formattedValue = `${value}px`;
				}
				
				// Always set value as-is, let refSemanticRadiusWithPrimitives handle conversion
				const normalizedKey = this.normalizeTokenName(pathToUse[pathToUse.length - 1]);
				target[normalizedKey] = formattedValue;
			}
			
			// Apply reference conversion to entire object at once
			existingTokens = this.refSemanticRadiusWithPrimitives(existingTokens, primitiveRadiusLookup);
			const sortedTokens = this.sortTokens(existingTokens);
			await this.saveTokensToFile(filePath, sortedTokens);
			return;
		}

		if (isTypographySemantic) {
			// Build primitive typography lookup  
			let primitiveTypography = {};
			try {
				const primitivePath = path.resolve(__dirname, '../packages/core-tokens/json/typography-primitive.json');
				const typographyJson = fs.readJsonSync(primitivePath);
				if (typographyJson && typographyJson.primitive) {
					primitiveTypography = typographyJson.primitive;
				}
			} catch (e) {
				console.warn('Failed to load primitive typography:', e.message);
			}
			const primitiveTypographyLookup = this.buildPrimitiveTypographyLookup(primitiveTypography);

			// Initialize fresh semantic structure - directly under semantic, not under typography
			if (!existingTokens.semantic) existingTokens.semantic = {};

			for (const { changeData } of tokens) {
				const { path: tokenPathArray, value } = changeData;
				// Convert fontweight to font-weight and put directly under semantic
				let target = existingTokens.semantic;
				
				for (let i = 0; i < tokenPathArray.length - 1; i++) {
					let key = tokenPathArray[i];
					// Convert fontweight to font-weight
					if (key === 'fontweight') {
						key = 'font-weight';
					}
					const normalizedKey = this.normalizeTokenName(key);
					if (!target[normalizedKey]) target[normalizedKey] = {};
					target = target[normalizedKey];
				}
				
				// Set the final value
				const finalKey = this.normalizeTokenName(tokenPathArray[tokenPathArray.length - 1]);
				target[finalKey] = value;
			}
			
			// Apply reference conversion to entire object at once
			existingTokens = this.refSemanticTypographyWithPrimitives(existingTokens, primitiveTypographyLookup);
			const sortedTokens = this.sortTokens(existingTokens);
			await this.saveTokensToFile(filePath, sortedTokens);
			return;
		}

		if (!existingTokens.primitive) existingTokens.primitive = {};
		for (const { changeData } of tokens) {
			const { path: tokenPathArray, value } = changeData;
			const tokenKey = tokenPathArray.length > 1
				? `${tokenPathArray[0]}-${tokenPathArray[tokenPathArray.length - 1]}`
				: tokenPathArray[0];
			let formattedValue = value;
			if (tokenPathArray[0] === 'spacing' || tokenPathArray[0] === 'radius') {
				formattedValue = value === 0 ? '0' : `${value}px`;
			} else if (tokenPathArray[0].startsWith('font-size') && typeof value === 'number') {
				formattedValue = `${value}px`;
			}
			existingTokens.primitive[tokenKey] = formattedValue;
			console.log(`     + Added ${tokenKey}: ${formattedValue}`);
		}
		const sortedTokens = this.sortTokens(existingTokens);
		await this.saveTokensToFile(filePath, sortedTokens);
	}

	/**
	 * Update CSS file based on JSON file content
	 */
	async updateCSSFromJSON(jsonPath, cssPath) {
		return await this.cssGenerator.generateCSSFromJSON(jsonPath, cssPath);
	}

	/**
	 * Update Dart file based on JSON file content
	 */
	async updateDartFromJSON(jsonPath, dartPath) {
		return await this.dartGenerator.generateDartFromJSON(jsonPath, dartPath);
	}

	/**
	 * Resolve output path using collection and package information
	 */
	resolveOutputPath(tokenPath, changeData, outputDir) {
		// Extract collection name and determine appropriate file mapping
		const collection = changeData.collection || '';
		const packageName = changeData.package;

		// If no package is specified, try to extract from filePath (for modified tokens)
		let finalPackageName = packageName;
		if (!finalPackageName && changeData.filePath) {
			// filePath format: "package-name/file-name"
			const pathParts = changeData.filePath.split('/');
			finalPackageName = pathParts[0];
		}

		// If still no package, default to core-tokens
		if (!finalPackageName) {
			finalPackageName = 'core-tokens';
		}

		// Determine the appropriate file name based on collection type or filePath
		let fileName;

		// First check if fileName is explicitly provided in changeData
		if (changeData.fileName) {
			fileName = changeData.fileName;
		} else if (collection && /color[.-]semantic/i.test(collection)) {
			// Try to extract the mode part (mono-white, mono-black, web, mobile, etc.)
			const match = collection.match(/color[.-]semantic[.-]([\w-]+)$/i);
			if (match) {
				fileName = `color-semantic-${match[1]}`;
			} else {
				fileName = 'color-semantic';
			}
		} else if (collection && /typography[.-]semantic/i.test(collection)) {
			fileName = 'typography-semantic';
		} else if (collection && collection.includes('color')) {
			fileName = 'color-primitive';
		} else if (collection && collection.includes('spacing')) {
			fileName = 'spacing-primitive';
		} else if (collection && collection.includes('typography')) {
			fileName = 'typography-primitive';
		} else if (collection && collection.includes('radius')) {
			fileName = 'radius-primitive';
		} else if (changeData.filePath) {
			// Extract filename from filePath
			const pathParts = changeData.filePath.split('/');
			if (pathParts.length > 1) {
				fileName = pathParts[1];
			} else {
				fileName = 'tokens'; // generic fallback
			}
		} else {
			// Fallback: extract from token path
			const pathParts = tokenPath.split('/');
			if (pathParts.length > 1) {
				const tokenName = pathParts[1];
				if (tokenName.includes('spacing')) {
					fileName = 'spacing-primitive';
				} else if (tokenName.includes('color')) {
					fileName = 'color-primitive';
				} else if (tokenName.includes('typography') || tokenName.includes('fontsize')) {
					fileName = 'typography-primitive';
				} else if (tokenName.includes('radius')) {
					fileName = 'radius-primitive';
				} else {
					fileName = 'tokens'; // generic fallback
				}
			} else {
				fileName = 'tokens'; // generic fallback
			}
		}

		return path.join(outputDir, 'packages', finalPackageName, 'json', `${fileName}.json`);
	}

	/**
	 * Merge tokens into existing file (deep merge)
	 */
	async mergeTokenFile(filePath, newTokens) {
		await fs.ensureDir(path.dirname(filePath));

		let existingTokens = {};
		if (await fs.pathExists(filePath)) {
			existingTokens = await fs.readJson(filePath);
		}

		// Deep merge the tokens
		const mergedTokens = this.deepMerge(existingTokens, newTokens);

		let out = mergedTokens;

		// color-semantic: hex → $ref
		if (filePath.includes('color-semantic')) {
			let primitiveColors = {};
			try {
				const primitivePath = path.resolve(__dirname, '../packages/core-tokens/json/color-primitive.json');
				primitiveColors = fs.readJsonSync(primitivePath).primitive.color;
			} catch (e) {}
			const primitiveColorLookup = this.buildPrimitiveColorLookup(primitiveColors);
			out = this.refSemanticColorsWithPrimitives(out, primitiveColorLookup);
		}
		// radius-semantic: px string → $ref
		if (filePath.includes('radius-semantic')) {
			let primitiveRadius = {};
			try {
				const primitivePath = path.resolve(__dirname, '../packages/core-tokens/json/radius-primitive.json');
				const radiusJson = fs.readJsonSync(primitivePath);
				if (radiusJson && radiusJson.primitive) {
					primitiveRadius = radiusJson.primitive;
				} else {
					primitiveRadius = {};
				}
			} catch (e) {
				primitiveRadius = {};
			}
			const primitiveRadiusLookup = this.buildPrimitiveRadiusLookup(primitiveRadius);
			out = this.refSemanticRadiusWithPrimitives(out, primitiveRadiusLookup);
		}
		
		// typography-semantic: number → $ref
		if (filePath.includes('typography-semantic')) {
			let primitiveTypography = {};
			try {
				const primitivePath = path.resolve(__dirname, '../packages/core-tokens/json/typography-primitive.json');
				const typographyJson = fs.readJsonSync(primitivePath);
				if (typographyJson && typographyJson.primitive) {
					primitiveTypography = typographyJson.primitive;
				} else {
					primitiveTypography = {};
				}
			} catch (e) {
				primitiveTypography = {};
			}
			const primitiveTypographyLookup = this.buildPrimitiveTypographyLookup(primitiveTypography);
			out = this.refSemanticTypographyWithPrimitives(out, primitiveTypographyLookup);
		}
		const sortedTokens = this.sortTokens(out);
		await this.saveTokensToFile(filePath, sortedTokens);
	}

	/**
	 * Recursively replace hex color values in semantic tokens with $ref to primitives
	 * @param {object} tokens - The semantic color tokens object
	 * @param {object} primitiveColorLookup - Map of hex to primitive token path array
	 * @returns {object} - New tokens object with $ref replacements
	 */
	refSemanticColorsWithPrimitives(tokens, primitiveColorLookup) {
		if (Array.isArray(tokens)) {
			return tokens.map(t => this.refSemanticColorsWithPrimitives(t, primitiveColorLookup));
		}
		if (typeof tokens !== 'object' || tokens === null) {
			// Only process string hex values
			if (typeof tokens === 'string' && tokens.startsWith('#')) {
				const hex = tokens.toLowerCase();
				if (primitiveColorLookup && primitiveColorLookup[hex]) {
					// Build $ref string
					const refPath = primitiveColorLookup[hex].join('/');
					console.log(`   🔗 Converting hex ${hex} to $ref: ${refPath}`);
					return { $ref: `core-tokens/json/color-primitive.json#/${refPath}` };
				} else {
					console.warn(`   ⚠️ No primitive token found for hex color: ${hex}`);
				}
			}
			return tokens;
		}
		// If already a $ref, leave as is
		if (tokens.$ref) return tokens;
		// Recurse into object
		const out = {};
		for (const [k, v] of Object.entries(tokens)) {
			out[k] = this.refSemanticColorsWithPrimitives(v, primitiveColorLookup);
		}
		return out;
	}

	/**
	 * Build a lookup of primitive color values to their token paths
	 */
	buildPrimitiveColorLookup(primitiveColors) {
		const lookup = {};
		if (!primitiveColors || typeof primitiveColors !== 'object') {
			console.warn('   ⚠️ Primitive colors data is empty or invalid');
			return lookup;
		}

		function walk(obj, path) {
			if (!obj || typeof obj !== 'object') return;
			Object.entries(obj).forEach(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					walk(value, path.concat(key));
				} else if (typeof value === 'string' && value.startsWith('#')) {
					const hex = value.toLowerCase();
					lookup[hex] = path.concat(key);
					console.log(`   📋 Mapped primitive color: ${hex} → ${path.concat(key).join('/')}`);
				}
			});
		}
		walk(primitiveColors, ['primitive', 'color']);
		console.log(`   ✅ Built primitive color lookup with ${Object.keys(lookup).length} entries`);
		return lookup;
	}

	// Build a lookup of primitive radius values to their token paths
	buildPrimitiveRadiusLookup(primitiveRadius) {
		const lookup = {};
		if (!primitiveRadius || typeof primitiveRadius !== 'object') return lookup;
		function walk(obj, path) {
			if (!obj || typeof obj !== 'object') return;
			Object.entries(obj).forEach(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					walk(value, path.concat(key));
				} else if (typeof value === 'string' && value.endsWith('px')) {
					lookup[value] = path.concat(key);
				}
			});
		}
		walk(primitiveRadius, ['primitive']);
		return lookup;
	}

	// Build a lookup of primitive typography values to their token paths
	buildPrimitiveTypographyLookup(primitiveTypography) {
		const lookup = {};
		if (!primitiveTypography || typeof primitiveTypography !== 'object') return lookup;

		function walk(obj, path) {
			if (!obj || typeof obj !== 'object') return;
			Object.entries(obj).forEach(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					walk(value, path.concat(key));
				} else if (typeof value === 'number' || typeof value === 'string') {
					// For font-weight values like 100, 200, 300, etc.
					lookup[value] = path.concat(key);
				}
			});
		}

		walk(primitiveTypography, ['primitive']);
		return lookup;
	}

	// Recursively replace px string values in semantic radius tokens with $ref to primitives
	refSemanticRadiusWithPrimitives(tokens, primitiveRadiusLookup) {
		if (Array.isArray(tokens)) {
			return tokens.map(t => this.refSemanticRadiusWithPrimitives(t, primitiveRadiusLookup));
		}
		if (tokens === null || tokens === undefined) return tokens;
		// fix: allow number as well as string (e.g. 50 → 50px)
		let pxString = null;
		if (typeof tokens === 'string' && tokens.endsWith('px')) {
			pxString = tokens;
		} else if (typeof tokens === 'number' || (typeof tokens === 'string' && /^\d+$/.test(tokens))) {
			pxString = tokens.toString() + 'px';
		}
		if (pxString && primitiveRadiusLookup[pxString]) {
			const refPath = primitiveRadiusLookup[pxString].join('/');
			return { $ref: `core-tokens/json/radius-primitive.json#/${refPath}` };
		}
		if (typeof tokens !== 'object') return tokens;
		if (tokens.$ref) return tokens;
		const out = {};
		for (const [k, v] of Object.entries(tokens)) {
			out[k] = this.refSemanticRadiusWithPrimitives(v, primitiveRadiusLookup);
		}
		return out;
	}

	// Recursively replace typography values in semantic typography tokens with $ref to primitives
	refSemanticTypographyWithPrimitives(tokens, primitiveTypographyLookup) {
		if (Array.isArray(tokens)) {
			return tokens.map(t => this.refSemanticTypographyWithPrimitives(t, primitiveTypographyLookup));
		}
		if (tokens === null || tokens === undefined) return tokens;
		
		// Check if this is a font-weight value that should be converted to a reference
		if (typeof tokens === 'number' && primitiveTypographyLookup[tokens]) {
			const refPath = primitiveTypographyLookup[tokens].join('/');
			return { $ref: `core-tokens/json/typography-primitive.json#/${refPath}` };
		}
		
		if (typeof tokens !== 'object') return tokens;
		if (tokens.$ref) return tokens;
		
		const out = {};
		for (const [k, v] of Object.entries(tokens)) {
			out[k] = this.refSemanticTypographyWithPrimitives(v, primitiveTypographyLookup);
		}
		return out;
	}

	/**
	 * Deep merge two objects
	 */
	deepMerge(target, source) {
		const result = { ...target };

		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
					result[key] = this.deepMerge(result[key] || {}, source[key]);
				} else {
					result[key] = source[key];
				}
			}
		}

		return result;
	}

	/**
	 * Remove specific tokens from file
	 */
	async removeTokensFromFile(filePath, tokensToRemove) {
		if (await fs.pathExists(filePath)) {
			const existingTokens = await fs.readJson(filePath);
			const updatedTokens = this.removeTokensRecursive(existingTokens, tokensToRemove);

			// Sort tokens and use consistent formatting for all files
			const sortedTokens = this.sortTokens(updatedTokens);
			await this.saveTokensToFile(filePath, sortedTokens);
		}
	}

	/**
	 * Recursively remove tokens
	 */
	removeTokensRecursive(target, toRemove) {
		const result = { ...target };

		for (const key in toRemove) {
			if (toRemove.hasOwnProperty(key)) {
				if (toRemove[key] && typeof toRemove[key] === 'object' && !Array.isArray(toRemove[key])) {
					if (result[key] && typeof result[key] === 'object') {
						result[key] = this.removeTokensRecursive(result[key], toRemove[key]);
						// Remove empty objects
						if (Object.keys(result[key]).length === 0) {
							delete result[key];
						}
					}
				} else {
					delete result[key];
				}
			}
		}

		return result;
	}

	/**
	 * Sort tokens numerically for spacing, radius, and font-size tokens
	 */
	sortTokens(tokens) {
		if (!tokens || !tokens.primitive) {
			return tokens;
		}

		const primitive = tokens.primitive;
		const sortedPrimitive = {};

		// Get all keys and sort them
		const keys = Object.keys(primitive).sort((a, b) => {
			// Extract numerical value from key (e.g., "spacing-66" -> 66)
			const getNumericValue = (key) => {
				const match = key.match(/(\d+)$/);
				return match ? parseInt(match[1], 10) : 0;
			};

			// Only sort if both keys are spacing, radius, or font-size tokens
			if ((a.includes('spacing') || a.includes('radius') || a.includes('font-size')) &&
				(b.includes('spacing') || b.includes('radius') || b.includes('font-size'))) {
				return getNumericValue(a) - getNumericValue(b);
			}

			// For other tokens, maintain alphabetical order
			return a.localeCompare(b);
		});

		// Rebuild the primitive object with sorted keys
		keys.forEach(key => {
			sortedPrimitive[key] = primitive[key];
		});

		return {
			...tokens,
			primitive: sortedPrimitive
		};
	}

	/**
	 * Convert individual token data to proper nested format for removal
	 */
	convertTokenDataToFormat(changeData) {
		const { path: tokenPath, value, collection } = changeData;

		// Handle semantic color tokens differently
		if (collection && /color[.-]semantic/i.test(collection)) {
			// For semantic color tokens, create a nested structure
			// Example: [surface, default-selected-focused] -> semantic.color.surface.default-selected-focused
			const result = { semantic: { color: {} } };
			let current = result.semantic.color;

			// Handle special case for onsurface (combined token)
			if (tokenPath[0] === 'onsurface') {
				// onsurface -> on.surface
				if (!current.on) current.on = {};
				current.on.surface = {};
				current = current.on.surface;

				// Start from index 1 since we've already processed 'onsurface' -> 'on.surface'
				for (let i = 1; i < tokenPath.length - 1; i++) {
					current[tokenPath[i]] = {};
					current = current[tokenPath[i]];
				}
				current[tokenPath[tokenPath.length - 1]] = value;
			}
			// Handle special case for onbackground (combined token)
			else if (tokenPath[0] === 'onbackground') {
				// onbackground -> on.background
				if (!current.on) current.on = {};
				current.on.background = {};
				current = current.on.background;

				// Start from index 1 since we've already processed 'onbackground' -> 'on.background'
				for (let i = 1; i < tokenPath.length - 1; i++) {
					current[tokenPath[i]] = {};
					current = current[tokenPath[i]];
				}
				current[tokenPath[tokenPath.length - 1]] = value;
			}
			else {
				// Normal nested structure
				for (let i = 0; i < tokenPath.length - 1; i++) {
					current[tokenPath[i]] = {};
					current = current[tokenPath[i]];
				}
				current[tokenPath[tokenPath.length - 1]] = value;
			}

			return result;
		}
		// For primitive tokens (non-semantic)
		else {
			const result = {};
			// Always start with "primitive" as the top level
			result.primitive = {};
			let current = result.primitive;

			// For removed tokens, build simple key-value structure
			const finalKey = tokenPath[tokenPath.length - 1];

			// Apply proper formatting based on token type
			if (finalKey.includes('spacing') || finalKey.includes('radius')) {
				current[finalKey] = typeof value === 'number' ? `${value}px` : value;
			} else if (finalKey.includes('fontsize') && typeof value === 'number') {
				current[finalKey] = `${value}px`;
			} else {
				current[finalKey] = value;
			}

			return result;
		}
	}

	/**
	 * Normalize existing token files to ensure consistent formatting
	 */
	async normalizeExistingTokenFiles(outputDir) {
		const packageDirs = ['core-tokens', 'web-tokens', 'mobile-tokens', 'webos-tokens'];
		const updatedFiles = [];

		for (const packageName of packageDirs) {
			const packageDir = path.join(outputDir, 'packages', packageName, 'json');

			if (!await fs.pathExists(packageDir)) {
				continue;
			}

			const jsonFiles = await fs.readdir(packageDir);

			for (const fileName of jsonFiles) {
				if (!fileName.endsWith('.json')) {
					continue;
				}

				const filePath = path.join(packageDir, fileName);
				let hasChanges = false;
				const tokens = await fs.readJson(filePath);

				// Normalize typography tokens
				if (fileName.includes('typography') && tokens.primitive) {
					for (const [key, value] of Object.entries(tokens.primitive)) {
						if (key.startsWith('font-size-') && typeof value === 'number') {
							tokens.primitive[key] = `${value}px`;
							hasChanges = true;
							console.log(`   🔧 Normalized ${key}: ${value} → ${value}px`);
						}
					}
				}

				// Normalize spacing tokens
				if (fileName.includes('spacing') && tokens.primitive) {
					for (const [key, value] of Object.entries(tokens.primitive)) {
						if (key.startsWith('spacing-') && typeof value === 'number') {
							tokens.primitive[key] = value === 0 ? '0' : `${value}px`;
							hasChanges = true;
							console.log(`   🔧 Normalized ${key}: ${value} → ${value === 0 ? '0' : value + 'px'}`);
						}
					}
				}

				// Normalize radius tokens
				if (fileName.includes('radius') && tokens.primitive) {
					for (const [key, value] of Object.entries(tokens.primitive)) {
						if (key.startsWith('radius-') && typeof value === 'number') {
							tokens.primitive[key] = value === 0 ? '0' : `${value}px`;
							hasChanges = true;
							console.log(`   🔧 Normalized ${key}: ${value} → ${value === 0 ? '0' : value + 'px'}`);
						}
					}
				}

				if (hasChanges) {
					await this.saveTokensToFile(filePath, tokens);
					updatedFiles.push(filePath);

					// Update corresponding CSS file
					const cssPath = filePath.replace('/json/', '/css/').replace('.json', '.css');
					await this.updateCSSFromJSON(filePath, cssPath);
					updatedFiles.push(cssPath);
				}
			}
		}

		return updatedFiles;
	}

	/**
	 * Write JSON with compact $ref objects and 4-space indentation (for color-semantic tokens)
	 * This version ensures {"$ref": "..."} is always on one line.
	 */
	async writeColorSemanticJSON(filePath, data) {
		function customStringify(obj, indent = 0) {
			const pad = ' '.repeat(indent);
			if (Array.isArray(obj)) {
				if (obj.length === 0) return '[]';
				const items = obj.map(item => customStringify(item, indent + 4));
				return '[\n' + items.map(i => pad + '    ' + i).join(',\n') + '\n' + pad + ']';
			} else if (obj && typeof obj === 'object') {
				const keys = Object.keys(obj);
				// Compact single $ref object
				if (keys.length === 1 && keys[0] === '$ref') {
					return `{"$ref": ${JSON.stringify(obj['$ref'])}}`;
				}
				if (keys.length === 0) return '{}';
				let out = '{\n';
				out += keys.map((k, idx) => {
					const v = obj[k];
					return pad + '    ' + JSON.stringify(k) + ': ' + customStringify(v, indent + 4);
				}).join(',\n');
				out += '\n' + pad + '}';
				return out;
			} else {
				return JSON.stringify(obj);
			}
		}
		const json = customStringify(data, 0) + '\n';
		await fs.writeFile(filePath, json);
	}

	/**
	 * Save tokens to JSON file, using compact $ref style for color-semantic files
	 */
	async saveTokensToFile(filePath, data) {
		if (filePath.includes('color-semantic') || filePath.includes('radius-semantic')) {
			await this.writeColorSemanticJSON(filePath, data);
		} else {
			await fs.writeJson(filePath, data, { spaces: 4 });
		}
	}
}

/**
 * Load default mapping configuration
 */
async function loadMappingConfig(configPath) {
	try {
		return await fs.readJson(configPath);
	} catch (error) {
		console.warn('Could not find mapping configuration file. Using default settings.');
		return getDefaultMappingConfig();
	}
}

/**
 * Default mapping configuration
 */
function getDefaultMappingConfig() {
	return {
		web: {
			collections: {
				'Core': {
					package: 'core-tokens',
					fileName: 'tokens',
					structure: 'nested'
				},
				'Web Semantic': {
					package: 'web-tokens',
					fileName: 'semantic-tokens',
					structure: 'nested'
				}
			}
		},
		webos: {
			collections: {
				'Core': {
					package: 'core-tokens',
					fileName: 'tokens',
					structure: 'nested'
				},
				'webOS Semantic': {
					package: 'webos-tokens',
					fileName: 'semantic-tokens',
					structure: 'nested'
				}
			}
		},
		mobile: {
			collections: {
				'Core': {
					package: 'core-tokens',
					fileName: 'tokens',
					structure: 'nested'
				},
				'Mobile Semantic': {
					package: 'mobile-tokens',
					fileName: 'semantic-tokens',
					structure: 'nested'
				}
			}
		}
	};
}

/**
 * Main execution function
 */
async function main() {
	try {
		console.log('🚀 Starting token transformer...');

		const configPath = path.join(__dirname, '..', 'config', 'mapping.json');
		console.log('📁 Config path:', configPath);

		const mappingConfig = await loadMappingConfig(configPath);
		console.log('⚙️  Mapping config loaded');

		const transformer = new TokenTransformer(mappingConfig);

		// Read input file (generated by figma-sync.js)
		const changesPath = path.join(__dirname, '..', 'figma-changes.json');
		console.log('📄 Changes path:', changesPath);

		if (!await fs.pathExists(changesPath)) {
			console.log('❌ No changes file found. Please run figma-sync.js first.');
			return;
		}

		console.log('📖 Reading changes file...');
		const changesData = await fs.readJson(changesPath);
		console.log('📊 Changes data loaded:', Object.keys(changesData));
		const { figmaTokens, changes } = changesData;

		console.log('🔄 Starting token transformation...');
		console.log('📝 Changes found:', changes);

		// First, normalize existing token files to ensure consistent formatting
		console.log('🔧 Normalizing existing token files...');
		const outputDir = path.join(__dirname, '..');
		const normalizedFiles = await transformer.normalizeExistingTokenFiles(outputDir);
		if (normalizedFiles.length > 0) {
			console.log(`✅ Normalized ${normalizedFiles.length} files:`);
			normalizedFiles.forEach(file => console.log(`   - ${path.relative(outputDir, file)}`));
		}

		// Apply changes to token files
		if (changes && Object.keys(changes).length > 0) {
			console.log('📝 Applying token changes...');

			console.log('📁 Output directory:', outputDir);

			const updatedFiles = await transformer.applyChanges(changes, outputDir);

			console.log(`✅ Applied changes to ${updatedFiles.length} files:`);
			updatedFiles.forEach(file => console.log(`   - ${path.relative(outputDir, file)}`));

			// Save updated files list
			const manifestPath = path.join(__dirname, '..', 'token-update-manifest.json');
			await fs.writeJson(manifestPath, {
				timestamp: new Date().toISOString(),
				updatedFiles: updatedFiles.map(file => path.relative(outputDir, file)),
				changesApplied: {
					added: Object.keys(changes.added || {}).length,
					modified: Object.keys(changes.modified || {}).length,
					removed: Object.keys(changes.removed || {}).length
				}
			}, { spaces: 4 });

			console.log('📋 Update manifest saved to token-update-manifest.json');
		} else {
			console.log('ℹ️  No changes detected in figma-changes.json');
		}

		console.log('🎉 Token transformation completed!');

	} catch (error) {
		console.error('❌ Token transformation failed:', error);
		console.error('Stack trace:', error.stack);
		process.exit(1);
	}
}

// Call main function only when script is executed directly
if (require.main === module) {
	console.log('🔧 Token transformer starting...');
	main().catch(error => {
		console.error('❌ Fatal error:', error);
		process.exit(1);
	});
}

module.exports = {
	TokenTransformer,
	loadMappingConfig,
	getDefaultMappingConfig
};
