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

class TokenTransformer {
	constructor(mappingConfig) {
		this.mappingConfig = mappingConfig;
		this.cssGenerator = new CSSGenerator();
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

		let existingTokens = {};
		if (await fs.pathExists(filePath)) {
			existingTokens = await fs.readJson(filePath);
		}

		const isColorSemantic = /color-semantic/.test(filePath);
		const isRadiusSemantic = /radius-semantic/.test(filePath);

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
				const { path: tokenPathArray, value } = changeData;
				console.log("changeData:", changeData);
				// semantic.color.[...path]
				let target = existingTokens;
				if (!target.semantic) target.semantic = {};
				target = target.semantic;
				if (!target.color) target.color = {};
				target = target.color;
				for (let i = 0; i < tokenPathArray.length - 1; i++) {
					if (!target[tokenPathArray[i]]) target[tokenPathArray[i]] = {};
					target = target[tokenPathArray[i]];
				}
				// Always set value as-is, let refSemanticColorsWithPrimitives handle conversion
				target[tokenPathArray[tokenPathArray.length - 1]] = value;
			}
			// Apply reference conversion to entire object at once
			existingTokens = this.refSemanticColorsWithPrimitives(existingTokens, primitiveColorLookup);
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

		if (collection && /color[.-]semantic/i.test(collection)) {
			// Try to extract the dark/light part
			const match = collection.match(/color[.-]semantic[.-](\w+)$/i);
			if (match) {
				fileName = `color-semantic-${match[1]}`;
			} else {
				fileName = 'color-semantic';
			}
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
