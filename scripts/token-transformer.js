#!/usr/bin/env node

/**
 * Token Transformer Engine
 * Transforms Figma Variables to platform-specific token formats.
 */

console.log('🔧 Token transformer script started');

const fs = require('fs-extra');
const path = require('path');

class TokenTransformer {
	constructor(mappingConfig) {
		this.mappingConfig = mappingConfig;
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
				await fs.writeJson(jsonPath, tokens, { spaces: 4 });
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
		Object.entries(flattened).forEach(([key, value]) => {
			if (typeof value === 'string' || typeof value === 'number') {
				cssContent += `  --${key}: ${value};\n`;
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
				const regex = new RegExp(`(\\s*${cssVar.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\s*:\\s*)[^;]+;`, 'g');

				if (cssContent.match(regex)) {
					// Update existing variable
					cssContent = cssContent.replace(regex, `$1${value};`);
					console.log(`   📝 Updated CSS variable: ${cssVar} = ${value}`);
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

		// Handle added tokens
		for (const [path, changeData] of Object.entries(changes.added)) {
			const filePath = this.resolveOutputPath(path, outputDir);
			await this.updateTokenFile(filePath, changeData.after || changeData, 'add');
			updatedFiles.push(filePath);
		}

		// Handle modified tokens
		for (const [path, changeData] of Object.entries(changes.modified)) {
			const filePath = this.resolveOutputPath(path, outputDir);
			await this.mergeTokenFile(filePath, changeData.after);
			updatedFiles.push(filePath);

			// Also update CSS file (only changed values)
			const cssPath = filePath.replace('/json/', '/css/').replace('.json', '.css');
			await this.updateCSSFile(changeData.after, cssPath);
			updatedFiles.push(cssPath);
		}

		// Handle removed tokens
		for (const [path, changeData] of Object.entries(changes.removed)) {
			const filePath = this.resolveOutputPath(path, outputDir);
			await this.removeTokensFromFile(filePath, changeData.before);
			updatedFiles.push(filePath);
		}

		return [...new Set(updatedFiles)]; // Remove duplicates
	}

	/**
	 * Resolve output path
	 */
	resolveOutputPath(tokenPath, outputDir) {
		// tokenPath format: "package-name/file-name"
		const [packageName, fileName] = tokenPath.split('/');
		return path.join(outputDir, 'packages', packageName, 'json', `${fileName}.json`);
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

		await fs.writeJson(filePath, mergedTokens, { spaces: 4 });
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

		// Apply changes to token files
		if (changes && Object.keys(changes).length > 0) {
			console.log('📝 Applying token changes...');

			const outputDir = path.join(__dirname, '..');
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
			}, { spaces: 2 });

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
