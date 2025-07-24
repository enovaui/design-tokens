#!/usr/bin/env node

/**
 * Token Transformer Engine
 * Transforms Figma Variables to platform-specific token formats.
 */

console.log('🔧 Token transformer script started');

const fs = require('fs-extra');
const path = require('path');
const CSSGenerator = require('./css-generator');

class TokenTransformer {
	constructor(mappingConfig) {
		this.mappingConfig = mappingConfig;
		this.cssGenerator = new CSSGenerator();
	}

	/**
	 * Transform Figma tokens to platform-specific tokens
	 */
	transformTokens(figmaTokens, platform = 'web') {
		const mapping = this.mappingConfig[platform];
		if (!mapping) {
			throw new Error(`Unsupported platform: ${platform}`);
		}

		const transformedTokens = {};

		Object.entries(figmaTokens).forEach(([collectionName, tokens]) => {
			const platformMapping = mapping.collections[collectionName];
			if (!platformMapping) {
				console.warn(`No mapping found for collection ${collectionName} on platform ${platform}.`);
				return;
			}

			const packageName = platformMapping.package;
			const fileName = platformMapping.fileName;

			if (!transformedTokens[packageName]) {
				transformedTokens[packageName] = {};
			}

			if (!transformedTokens[packageName][fileName]) {
				transformedTokens[packageName][fileName] = {};
			}

			// Transform token structure
			transformedTokens[packageName][fileName] = this.transformTokenStructure(
				tokens,
				platformMapping.structure || 'flat'
			);
		});

		return transformedTokens;
	}

	/**
	 * Transform token structure (nested vs flat)
	 */
	transformTokenStructure(tokens, structureType) {
		switch (structureType) {
			case 'flat':
				return this.flattenTokens(tokens);
			case 'nested':
				return tokens;
			case 'css-custom-properties':
				return this.toCSSCustomProperties(tokens);
			default:
				return tokens;
		}
	}

	/**
	 * Flatten nested tokens
	 */
	flattenTokens(tokens, prefix = '', result = {}) {
		Object.entries(tokens).forEach(([key, value]) => {
			const newKey = prefix ? `${prefix}-${key}` : key;

			if (typeof value === 'object' && value !== null && !value.$ref) {
				this.flattenTokens(value, newKey, result);
			} else {
				result[newKey] = value;
			}
		});

		return result;
	}

	/**
	 * Convert to CSS Custom Properties format
	 */
	toCSSCustomProperties(tokens) {
		const cssVars = {};
		const flattened = this.flattenTokens(tokens);

		Object.entries(flattened).forEach(([key, value]) => {
			cssVars[`--${key}`] = value;
		});

		return cssVars;
	}

	/**
	 * Resolve token references
	 */
	resolveReferences(tokens, allTokens) {
		const resolved = JSON.parse(JSON.stringify(tokens));

		const resolveValue = (value) => {
			if (typeof value === 'object' && value.$ref) {
			// $ref format: "core-tokens/json/color-primitive.json#/primitive/color/black"
			const refPath = value.$ref;
			const [filePath, jsonPath] = refPath.split('#');

			// Extract package and file name from file path
			const pathParts = filePath.split('/');
			const packageName = pathParts[0];
			const fileName = pathParts[2].replace('.json', '');

			// Parse JSON path
			const pathSegments = jsonPath.split('/').filter(s => s);

			// Find referenced value
			let referencedValue = allTokens[packageName]?.[fileName];
			for (const segment of pathSegments) {
				if (referencedValue && typeof referencedValue === 'object') {
					referencedValue = referencedValue[segment];
				} else {
					break;
				}
			}

				return referencedValue || value.$ref; // Return original if resolution fails
			}

			if (typeof value === 'object' && value !== null) {
				const result = {};
				Object.entries(value).forEach(([k, v]) => {
					result[k] = resolveValue(v);
				});
				return result;
			}

			return value;
		};

		return resolveValue(resolved);
	}

	/**
	 * Generate platform-specific output files
	 */
	async generateOutputFiles(transformedTokens, outputDir) {
		const outputs = [];

		for (const [packageName, files] of Object.entries(transformedTokens)) {
			const packageDir = path.join(outputDir, 'packages', packageName);
			await fs.ensureDir(packageDir);

			for (const [fileName, tokens] of Object.entries(files)) {
				// Generate JSON file
				const jsonDir = path.join(packageDir, 'json');
				await fs.ensureDir(jsonDir);
				const jsonPath = path.join(jsonDir, `${fileName}.json`);
				await this.saveTokensToFile(jsonPath, tokens);
				outputs.push(jsonPath);

				// Generate CSS file
				const cssDir = path.join(packageDir, 'css');
				await fs.ensureDir(cssDir);
				const cssPath = path.join(cssDir, `${fileName}.css`);
				await this.generateCSSFile(tokens, cssPath);
				outputs.push(cssPath);
			}
		}

		return outputs;
	}

	/**
	 * Generate CSS file
	 */
	async generateCSSFile(tokens, outputPath) {
		let cssContent = `:root {\n`;

		const flattened = this.flattenTokens(tokens);

		// Sort entries by numerical value for spacing and radius tokens
		const sortedEntries = Object.entries(flattened).sort(([keyA], [keyB]) => {
			// Extract numerical value from key (e.g., "primitive-spacing-66" -> 66)
			const getNumericValue = (key) => {
				const match = key.match(/(\d+)$/);
				return match ? parseInt(match[1], 10) : 0;
			};

			// Only sort if both keys are spacing or radius tokens
			if ((keyA.includes('spacing') || keyA.includes('radius')) &&
				(keyB.includes('spacing') || keyB.includes('radius'))) {
				return getNumericValue(keyA) - getNumericValue(keyB);
			}

			// For other tokens, maintain original order
			return 0;
		});

		sortedEntries.forEach(([key, value]) => {
			if (typeof value === 'string' || typeof value === 'number') {
				// Add px unit for spacing and radius tokens if value is a number
				const formattedValue = this.formatCSSValue(key, value);
				cssContent += `  --${key}: ${formattedValue};\n`;
			}
		});

		cssContent += `}\n`;

		await fs.writeFile(outputPath, cssContent, 'utf8');
	}

	/**
	 * Update specific CSS variables in existing file
	 */
	async updateCSSFile(tokens, outputPath) {
		await fs.ensureDir(path.dirname(outputPath));

		// Check if CSS file exists
		if (!await fs.pathExists(outputPath)) {
			// If file doesn't exist, create new one
			await this.generateCSSFile(tokens, outputPath);
			return;
		}

		// Read existing CSS content
		let cssContent = await fs.readFile(outputPath, 'utf8');

		// Flatten tokens to get CSS variables
		const flattened = this.flattenTokens(tokens);

		// Update each CSS variable
		Object.entries(flattened).forEach(([key, value]) => {
			if (typeof value === 'string' || typeof value === 'number') {
				const cssVar = `--${key}`;
				const formattedValue = this.formatCSSValue(key, value);
				const regex = new RegExp(`(\\s*${cssVar.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\s*:\\s*)[^;]+;`, 'g');

				if (cssContent.match(regex)) {
					// Update existing variable
					cssContent = cssContent.replace(regex, `$1${formattedValue};`);
					console.log(`   📝 Updated CSS variable: ${cssVar} = ${formattedValue}`);
				} else {
					console.log(`   ⚠️  CSS variable not found in file: ${cssVar}`);
				}
			}
		});

		// Write updated content back to file
		await fs.writeFile(outputPath, cssContent, 'utf8');
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
			await this.addTokensToFile(filePath, tokens);
			console.log(`   ✅ Added ${tokens.length} tokens to ${path.relative(outputDir, filePath)}`);
			updatedFiles.push(filePath);

			// Update corresponding CSS file
			const cssPath = filePath.replace('/json/', '/css/').replace('.json', '.css');
			await this.updateCSSFromJSON(filePath, cssPath);
			console.log(`   🎨 Updated CSS file ${path.relative(outputDir, cssPath)}`);
			updatedFiles.push(cssPath);
		}

		// Handle modified tokens
		for (const [tokenPath, changeData] of Object.entries(changes.modified || {})) {
			const filePath = this.resolveOutputPath(tokenPath, changeData, outputDir);
			await this.mergeTokenFile(filePath, changeData.after);
			console.log(`   📝 Modified tokens in ${path.relative(outputDir, filePath)}`);
			updatedFiles.push(filePath);

			// Update corresponding CSS file
			const cssPath = filePath.replace('/json/', '/css/').replace('.json', '.css');
			await this.updateCSSFromJSON(filePath, cssPath);
			console.log(`   🎨 Updated CSS file ${path.relative(outputDir, cssPath)}`);
			updatedFiles.push(cssPath);
		}

		// Handle removed tokens
		for (const [tokenPath, changeData] of Object.entries(changes.removed || {})) {
			const filePath = this.resolveOutputPath(tokenPath, changeData, outputDir);

			// Create token structure to remove
			const tokenToRemove = this.convertTokenDataToFormat(changeData);
			await this.removeTokensFromFile(filePath, tokenToRemove);
			console.log(`   🗑️  Removed tokens from ${path.relative(outputDir, filePath)}`);
			updatedFiles.push(filePath);

			// Update corresponding CSS file
			const cssPath = filePath.replace('/json/', '/css/').replace('.json', '.css');
			await this.updateCSSFromJSON(filePath, cssPath);
			console.log(`   🎨 Updated CSS file ${path.relative(outputDir, cssPath)}`);
			updatedFiles.push(cssPath);
		}

		return [...new Set(updatedFiles)]; // Remove duplicates
	}

	/**
	 * Add new tokens to existing file
	 */
	async addTokensToFile(filePath, tokens) {
		await fs.ensureDir(path.dirname(filePath));

		// Read existing file
		let existingTokens = { primitive: {} };
		if (await fs.pathExists(filePath)) {
			existingTokens = await fs.readJson(filePath);
		}

		// Add new tokens
		for (const { tokenPath, changeData } of tokens) {
			const { path: tokenPathArray, value } = changeData;

			// Build token key (e.g., "spacing-66")
			const tokenKey = tokenPathArray.length > 1
				? `${tokenPathArray[0]}-${tokenPathArray[tokenPathArray.length - 1]}`
				: tokenPathArray[0];

			// Format value based on token type
			let formattedValue = value;
			if (tokenPathArray[0] === 'spacing' || tokenPathArray[0] === 'radius') {
				formattedValue = value === 0 ? '0' : `${value}px`;
			} else if (tokenPathArray[0].startsWith('font-size') && typeof value === 'number') {
				formattedValue = `${value}px`;
			}

			// Add to primitive object
			existingTokens.primitive[tokenKey] = formattedValue;
			console.log(`     + Added ${tokenKey}: ${formattedValue}`);
		}

		// Write updated file
		await this.saveTokensToFile(filePath, existingTokens);
	}

	/**
	 * Update CSS file based on JSON file content
	 */
	async updateCSSFromJSON(jsonPath, cssPath) {
		return await this.cssGenerator.generateCSSFromJSON(jsonPath, cssPath);
	}

	/**
	 * Get default CSS header with comments
	 */
	getDefaultCSSHeader(cssPath) {
		const fileName = path.basename(cssPath, '.css');
		const titleCase = fileName.split('-').map(word =>
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ');

		return `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/* ${fileName}.css */

/* ----------------------------------------
${titleCase} Tokens
------------------------------------------- */

`;
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
		if (collection && collection.includes('color')) {
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
				if (primitiveColorLookup[hex]) {
					// Build $ref string
					const refPath = primitiveColorLookup[hex].join('/');
					return { $ref: `core-tokens/json/color-primitive.json#/${refPath}` };
				}
			}
			return tokens;
		}
		// If already a $ref, leave as is
		if (tokens.$ref) return tokens;
		// Recurse into object
		const out = Array.isArray(tokens) ? [] : {};
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
		function walk(obj, path) {
			Object.entries(obj).forEach(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					walk(value, path.concat(key));
				} else if (typeof value === 'string' && value.startsWith('#')) {
					lookup[value.toLowerCase()] = path.concat(key);
				}
			});
		}
		walk(primitiveColors, ['primitive', 'color']);
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
		const out = Array.isArray(tokens) ? [] : {};
		for (const [k, v] of Object.entries(tokens)) {
			out[k] = this.refSemanticRadiusWithPrimitives(v, primitiveRadiusLookup);
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
			await fs.writeJson(filePath, updatedTokens, { spaces: 4 });
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
	 * Update token file
	 */
	async updateTokenFile(filePath, tokens, operation) {
		switch (operation) {
			case 'add':
				await this.mergeTokenFile(filePath, tokens);
				break;
			case 'modify':
				await this.mergeTokenFile(filePath, tokens);
				break;
			case 'remove':
				if (await fs.pathExists(filePath)) {
					await fs.remove(filePath);
				}
				break;
		}
	}

	/**
	 * Sort tokens numerically for spacing and radius tokens
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

			// Only sort if both keys are spacing or radius tokens
			if ((a.includes('spacing') || a.includes('radius')) &&
				(b.includes('spacing') || b.includes('radius'))) {
				return getNumericValue(a) - getNumericValue(b);
			}

			// For other tokens, maintain original order
			return 0;
		});

		// Rebuild the object with sorted keys
		keys.forEach(key => {
			sortedPrimitive[key] = primitive[key];
		});

		return {
			...tokens,
			primitive: sortedPrimitive
		};
	}

	/**
	 * Format CSS value - add px unit for spacing and radius tokens
	 */
	formatCSSValue(key, value) {
		// Check if this is a spacing or radius token and value is a number
		if ((key.includes('spacing') || key.includes('radius')) &&
			typeof value === 'number' &&
			value !== 0) {
			return `${value}px`;
		}

		// For radius-0, keep it as just "0"
		if (key.includes('radius') && value === 0) {
			return '0';
		}

		return value;
	}

	/**
	 * Convert individual token data to proper nested format for removal
	 */
	convertTokenDataToFormat(changeData) {
		const { path: tokenPath, value } = changeData;
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
     */
    async writeColorSemanticJSON(filePath, data) {
        function replacer(key, value) {
            if (
                value &&
                typeof value === 'object' &&
                !Array.isArray(value) &&
                Object.keys(value).length === 1 &&
                value.$ref
            ) {
                value.__compact = true;
                return value;
            }
            return value;
        }
        let json = JSON.stringify(data, replacer, 4);
        json = json.replace(/\n(\s+){\n(\s+)("\$ref": [^\n]+)\n\1}/g, (match, indent, innerIndent, refLine) => {
            return `\n${indent}{ ${refLine.trim()} }`;
        });
        json = json.replace(/,?\s*"__compact": true/g, '');
        await fs.writeFile(filePath, json + '\n');
    }

	/**
     * Save tokens to JSON file, using compact $ref style for color-semantic files
     */
    async saveTokensToFile(filePath, data) {
        if (filePath.includes('color-semantic')) {
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
