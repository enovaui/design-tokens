#!/usr/bin/env node

/**
 * Figma Variables API Client
 * Reads Variables from Figma design files, compares with local tokens, and detects changes.
 */

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs-extra');
const path = require('path');

/**
 * Resolve a $ref to its actual value from the token structure
 * @param {string} ref - The $ref string (e.g., "core-tokens/json/color-primitive.json#/primitive/color/white")
 * @param {object} localTokens - The loaded local token structure
 * @returns {string|null} - The resolved value or null if not found
 */
function resolveReference(ref, localTokens) {
	try {
		// Parse the reference: "core-tokens/json/color-primitive.json#/primitive/color/white"
		const [filePart, pathPart] = ref.split('#');

		if (!filePart || !pathPart) {
			return null;
		}

		// Extract package and file from the file part
		// "core-tokens/json/color-primitive.json" -> package: "core-tokens", file: "color-primitive"
		const pathSegments = filePart.split('/');
		if (pathSegments.length < 3) {
			return null;
		}

		const packageName = pathSegments[0];
		const fileName = pathSegments[2].replace('.json', '');

		// Get the package data
		const packageData = localTokens[packageName];
		if (!packageData || !packageData[fileName]) {
			return null;
		}

		// Navigate through the path: "/primitive/color/white" -> ["primitive", "color", "white"]
		const pathKeys = pathPart.substring(1).split('/'); // Remove leading '/'

		let current = packageData[fileName];
		for (const key of pathKeys) {
			if (current && typeof current === 'object' && current.hasOwnProperty(key)) {
				current = current[key];
			} else {
				return null;
			}
		}

		// If we found a direct value, return it
		if (typeof current === 'string') {
			return current;
		}

		// If we found another $ref, resolve it recursively (but prevent infinite loops)
		if (typeof current === 'object' && current.$ref) {
			return resolveReference(current.$ref, localTokens);
		}

		return null;
	} catch (error) {
		console.warn(`Failed to resolve reference: ${ref}`, error);
		return null;
	}
}

class FigmaAPIClient {
	constructor(accessToken, fileKey) {
		this.accessToken = accessToken;
		this.fileKey = fileKey;
		this.baseUrl = 'https://api.figma.com/v1';
	}

	/**
	* Make a Figma API request
	*/
	async makeRequest(endpoint) {
		const { default: fetch } = await import('node-fetch');
		const url = `${this.baseUrl}${endpoint}`;

		try {
			const response = await fetch(url, {
				headers: {
					'X-Figma-Token': this.accessToken,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Figma API Error: ${response.status} - ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Figma API request failed:', error);
			throw error;
		}
	}

	/**
	 * Get Variables and Collections from Figma file
	 */
	async getVariablesAndCollections() {
		try {
			const endpoint = `/files/${this.fileKey}/variables/local`;
			const response = await this.makeRequest(endpoint);
			return {
				variables: response.meta.variables,
				collections: response.meta.variableCollections
			};
		} catch (error) {
			console.error('Failed to get Variables and Collections:', error);
			throw error;
		}
	}

	/**
	 * Format Variable values
	 */
	formatVariableValues(variables, collections) {
		const formattedTokens = {};

		Object.values(variables).forEach(variable => {
			const collection = collections[variable.variableCollectionId];
			const collectionName = collection?.name || 'unknown';

			// Skip hidden variables
			if (variable.hiddenFromPublishing === true) {
				console.log(`⏭️ Skipping hidden variable: ${variable.name} in ${collectionName}`);
				return;
			}

			// Skip specific tokens to ignore
			if (variable.name === 'mist-gray/100') {
				console.log(`⏭️ Skipping ignored token: ${variable.name} in ${collectionName}`);
				return;
			}

			// Group by collection
			if (!formattedTokens[collectionName]) {
				formattedTokens[collectionName] = {};
			}

			// Create token path from Variable name
			const tokenPath = variable.name.toLowerCase().replace(/\s+/g, '-').split('/');
			let current = formattedTokens[collectionName];

			// Create nested object structure
			tokenPath.slice(0, -1).forEach(segment => {
			if (!current[segment]) current[segment] = {};
				current = current[segment];
			});

			// For semantic color collections with multiple modes, create separate collections for each mode
			if ((collectionName === 'lg.webOS.color.semantic' ||
				 collectionName === 'lg.web.color.semantic' ||
				 collectionName === 'lg.mobile.color.semantic') &&
				collection.modes && collection.modes.length > 1) {
				// Handle each mode separately
				collection.modes.forEach(mode => {
					const modeCollectionName = `${collectionName}.${mode.name.toLowerCase().replace(/\s+/g, '-')}`;

					if (!formattedTokens[modeCollectionName]) {
						formattedTokens[modeCollectionName] = {};
					}

					let modeCurrent = formattedTokens[modeCollectionName];

					// Create nested object structure for this mode
					tokenPath.slice(0, -1).forEach(segment => {
						if (!modeCurrent[segment]) modeCurrent[segment] = {};
						modeCurrent = modeCurrent[segment];
					});

					// Set value for this mode if it exists
					if (variable.valuesByMode[mode.modeId]) {
						const value = variable.valuesByMode[mode.modeId];
						modeCurrent[tokenPath[tokenPath.length - 1]] = this.formatVariableValue(value, variable.resolvedType, variables);
					}
				});
			} else {
				// Set value (use first mode value)
				const modeId = Object.keys(variable.valuesByMode)[0];
				const value = variable.valuesByMode[modeId];
				current[tokenPath[tokenPath.length - 1]] = this.formatVariableValue(value, variable.resolvedType, variables);
			}
		});

		return formattedTokens;
	}

	/**
	 * Format Variable value based on type
	 */
	formatVariableValue(value, type, variables = null) {
		// Handle VARIABLE_ALIAS by resolving reference
		if (value && value.type === 'VARIABLE_ALIAS' && variables) {
			const referencedVariable = variables[value.id];
			if (referencedVariable) {
				// Get the first mode value from referenced variable
				const modeId = Object.keys(referencedVariable.valuesByMode)[0];
				const referencedValue = referencedVariable.valuesByMode[modeId];
				return this.formatVariableValue(referencedValue, referencedVariable.resolvedType, variables);
			}
			return value; // Return as-is if can't resolve
		}

		switch (type) {
			case 'COLOR':
				if (value && value.r !== undefined) {
					// Convert RGB values to Hex
					const r = Math.round(value.r * 255);
					const g = Math.round(value.g * 255);
					const b = Math.round(value.b * 255);
					return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
				}
				return value;
			case 'FLOAT':
				return value;
			case 'STRING':
				return value;
			case 'BOOLEAN':
				return value;
			default:
				return value;
		}
	}
}

/**
 * Load current local tokens
 */
async function loadLocalTokens() {
	const tokens = {};
	const packagesDir = path.join(__dirname, '..', 'packages');

	try {
		const packages = await fs.readdir(packagesDir);

		for (const pkg of packages) {
			const jsonDir = path.join(packagesDir, pkg, 'json');
			if (await fs.pathExists(jsonDir)) {
				const jsonFiles = await fs.readdir(jsonDir);
				tokens[pkg] = {};

				for (const file of jsonFiles.filter(f => f.endsWith('.json'))) {
					const filePath = path.join(jsonDir, file);
					const content = await fs.readJson(filePath);
					const baseName = path.basename(file, '.json');
					tokens[pkg][baseName] = content;
				}
			}
		}

		return tokens;
	} catch (error) {
		console.error('Failed to load local tokens:', error);
		throw error;
	}
}

/**
 * Get semantic color file name based on mode
 */
function getSemanticColorFileName(mode) {
	const modeFileMapping = {
		'mono-white': 'color-semantic-mono-white',
		'mono-black': 'color-semantic-mono-black',
		'lg-brand': 'color-semantic-lg-brand',
		'mobile': 'color-semantic-mobile',
		'web': 'color-semantic-web',
		'dark': 'color-semantic-dark',
		'light': 'color-semantic-light',
		'high-contrast': 'color-semantic-high-contrast'
	};
	return modeFileMapping[mode] || `color-semantic-${mode}`;
}

/**
 * Analyze differences between Figma and local tokens
 */
function analyzeChanges(figmaTokens, localTokens) {
	const changes = {
		added: {},
		modified: {},
		removed: {},
		unchanged: {}
	};

	console.log('Analyzing changes...');
	console.log('Number of Figma token collections:', Object.keys(figmaTokens).length);
	console.log('Number of local packages:', Object.keys(localTokens).length);

	// Collection to Package mapping (based on actual Figma collection names)
	const collectionMapping = {
		// Primitive collections
		'lg.color.primitive': 'core-tokens',
		'lg.spacing.primitive': 'core-tokens',
		'lg.radius.primitive': 'core-tokens',
		'lg.typography.primitive': 'core-tokens',

		// Web semantic collections (only hyphenated versions exist in Figma)
		'lg.web.color.semantic': 'web-tokens',
		'lg.web.color.semantic.mono-white': 'web-tokens',
		'lg.web.color.semantic.mono-black': 'web-tokens',
		'lg.web.color.semantic.lg-brand': 'web-tokens',
		'lg.web.color.semantic.mobile': 'web-tokens',
		'lg.web.color.semantic.web': 'web-tokens',

		// WebOS semantic collections
		'lg.webOS.color.semantic': 'webos-tokens',
		'lg.webOS.color.semantic.dark': 'webos-tokens',
		'lg.webOS.color.semantic.light': 'webos-tokens',
		'lg.webOS.color.semantic.high-contrast': 'webos-tokens',
		'lg.webOS.radius.semantic': 'webos-tokens',

		// Mobile semantic collections (only hyphenated versions exist in Figma)
		'lg.mobile.color.semantic': 'mobile-tokens',
		'lg.mobile.color.semantic.mono-white': 'mobile-tokens',
		'lg.mobile.color.semantic.mono-black': 'mobile-tokens',
		'lg.mobile.color.semantic.lg-brand': 'mobile-tokens',
		'lg.mobile.color.semantic.mobile': 'mobile-tokens',
		'lg.mobile.color.semantic.web': 'mobile-tokens',

		// Component collections (for reference)
		'lg.web.color.component': 'web-tokens',
		'lg.webOS.color.component': 'webos-tokens',
		'lg.mobile.color.component': 'mobile-tokens'
	};

	console.log('🔍 Figma collections found:', Object.keys(figmaTokens));

	// Compare each Figma collection with corresponding local package
	Object.entries(figmaTokens).forEach(([collectionName, figmaCollection]) => {
		// Skip component collections - they don't need change detection
		if (collectionName.includes('.component')) {
			console.log(`⏭️ Skipping component collection: ${collectionName}`);
			return;
		}

		// Skip specific excluded collections
		const excludedCollections = [
			'Documentation',
			'lg.sys.color-common',
			'webOS.spacing',
			'tq.typography',
			'webOS.radius'
		];

		if (excludedCollections.includes(collectionName)) {
			console.log(`⏭️ Skipping excluded collection: ${collectionName}`);
			return;
		}

		const packageName = collectionMapping[collectionName];

		if (!packageName) {
			console.log(`⚠️ No mapping found for collection: ${collectionName}`);
			return;
		}

		const localPackage = localTokens[packageName];
		if (!localPackage) {
			console.log(`⚠️ Local package not found: ${packageName}`);
			return;
		}

		// For lg.color.primitive, compare with color-primitive.json
		if (collectionName === 'lg.color.primitive') {
			const localColorTokens = localPackage['color-primitive'];
			if (localColorTokens && localColorTokens.primitive && localColorTokens.primitive.color) {
				compareFigmaWithLocal(figmaCollection, localColorTokens.primitive.color, collectionName, packageName, changes);
			}
		} else if (collectionName === 'lg.typography.primitive') {
			// For lg.typography.primitive, compare with typography-primitive.json
			const localTypographyTokens = localPackage['typography-primitive'];
			if (localTypographyTokens && localTypographyTokens.primitive) {
				compareTypographyTokens(figmaCollection, localTypographyTokens.primitive, collectionName, packageName, changes);
			}
		} else if (collectionName === 'lg.radius.primitive') {
			// For lg.radius.primitive, compare with radius-primitive.json
			const localRadiusTokens = localPackage['radius-primitive'];
			if (localRadiusTokens && localRadiusTokens.primitive) {
				comparePrimitiveTokens(figmaCollection, localRadiusTokens.primitive, collectionName, packageName, changes, 'radius');
			}
		} else if (collectionName === 'lg.spacing.primitive') {
			// For lg.spacing.primitive, compare with spacing-primitive.json
			const localSpacingTokens = localPackage['spacing-primitive'];
			if (localSpacingTokens && localSpacingTokens.primitive) {
				comparePrimitiveTokens(figmaCollection, localSpacingTokens.primitive, collectionName, packageName, changes, 'spacing');
			}
		} else if (collectionName === 'lg.webOS.color.semantic.dark') {
			// For lg.webOS.color.semantic.dark, compare with color-semantic-dark.json
			const localSemanticTokens = localPackage['color-semantic-dark'];
			if (localSemanticTokens && localSemanticTokens.semantic && localSemanticTokens.semantic.color) {
				compareSemanticColorTokens(figmaCollection, localSemanticTokens.semantic.color, collectionName, packageName, changes, localTokens);
			}
		} else if (collectionName === 'lg.webOS.color.semantic.light') {
			// For lg.webOS.color.semantic.light, compare with color-semantic-light.json
			const localSemanticTokens = localPackage['color-semantic-light'];
			if (localSemanticTokens && localSemanticTokens.semantic && localSemanticTokens.semantic.color) {
				compareSemanticColorTokens(figmaCollection, localSemanticTokens.semantic.color, collectionName, packageName, changes, localTokens);
			}
		} else if (collectionName === 'lg.webOS.color.semantic.high-contrast') {
			// For lg.webOS.color.semantic.high-contrast, compare with color-semantic-high-contrast.json
			const localSemanticTokens = localPackage['color-semantic-high-contrast'];
			if (localSemanticTokens && localSemanticTokens.semantic && localSemanticTokens.semantic.color) {
				compareSemanticColorTokens(figmaCollection, localSemanticTokens.semantic.color, collectionName, packageName, changes, localTokens);
			}
		} else if (collectionName === 'lg.webOS.color.semantic') {
			// Skip the base collection since we handle the mode-specific ones above
			console.log(`⏭️ Skipping base semantic collection: ${collectionName} (handled via mode-specific collections)`);
		} else if (collectionName === 'lg.web.color.semantic') {
			// Skip the base collection since we handle the mode-specific ones above
			console.log(`⏭️ Skipping base semantic collection: ${collectionName} (handled via mode-specific collections)`);
		} else if (collectionName === 'lg.mobile.color.semantic') {
			// Skip the base collection since we handle the mode-specific ones above
			console.log(`⏭️ Skipping base semantic collection: ${collectionName} (handled via mode-specific collections)`);
		} else if (collectionName.startsWith('lg.web.color.semantic.')) {
			// Handle web semantic color modes
			const mode = collectionName.split('.').pop(); // monowhite, monoblack, lgbrand, mobile, web
			const fileName = getSemanticColorFileName(mode);
			const localSemanticTokens = localPackage[fileName];
			if (localSemanticTokens && localSemanticTokens.semantic && localSemanticTokens.semantic.color) {
				compareSemanticColorTokens(figmaCollection, localSemanticTokens.semantic.color, collectionName, packageName, changes, localTokens);
			}
		} else if (collectionName.startsWith('lg.mobile.color.semantic.')) {
			// Handle mobile semantic color modes
			const mode = collectionName.split('.').pop(); // monowhite, monoblack, lgbrand, mobile, web
			const fileName = getSemanticColorFileName(mode);
			const localSemanticTokens = localPackage[fileName];
			if (localSemanticTokens && localSemanticTokens.semantic && localSemanticTokens.semantic.color) {
				compareSemanticColorTokens(figmaCollection, localSemanticTokens.semantic.color, collectionName, packageName, changes, localTokens);
			}
		} else if (collectionName === 'lg.webOS.radius.semantic') {
			// For lg.webOS.radius.semantic, compare with radius-semantic.json
			const localRadiusSemanticTokens = localPackage['radius-semantic'];
			if (localRadiusSemanticTokens && localRadiusSemanticTokens.semantic && localRadiusSemanticTokens.semantic.radius) {
				compareSemanticRadiusTokens(figmaCollection, localRadiusSemanticTokens.semantic.radius, collectionName, packageName, changes, localTokens);
			}
		} else {
			// For other collections, use general comparison
			compareTokensRecursively(figmaCollection, localPackage, collectionName, packageName, changes);
		}
	});

	// Check for removed tokens (exist in local but not in Figma)
	Object.entries(localTokens).forEach(([packageName, localPackage]) => {
		const collectionName = Object.keys(collectionMapping).find(key =>
			collectionMapping[key] === packageName
		);

		// Skip component collections
		if (collectionName && collectionName.includes('.component')) {
			return;
		}

		// Skip excluded collections
		const excludedCollections = [
			'Documentation',
			'lg.sys.color-common',
			'webOS.spacing',
			'tq.typography',
			'webOS.radius'
		];

		if (collectionName && excludedCollections.includes(collectionName)) {
			return;
		}

		// Skip primitive collections (they have their own removal check in comparePrimitiveTokens)
		const primitiveCollections = [
			'lg.color.primitive',
			'lg.typography.primitive',
			'lg.radius.primitive',
			'lg.spacing.primitive'
		];

		if (collectionName && primitiveCollections.includes(collectionName)) {
			return;
		}

		// Skip semantic collections (they are handled via mode-specific collections)
		const semanticCollections = [
			'lg.webOS.color.semantic',
			'lg.web.color.semantic',
			'lg.mobile.color.semantic',
			'lg.webOS.radius.semantic'
		];

		if (collectionName && semanticCollections.includes(collectionName)) {
			return;
		}

		if (collectionName && figmaTokens[collectionName]) {
			checkRemovedTokens(localPackage, figmaTokens[collectionName], collectionName, packageName, changes);
		}
	});

	return changes;
}

/**
 * Compare Figma typography collection with local typography tokens
 */
function compareTypographyTokens(figmaCollection, localPrimitiveTokens, collectionName, packageName, changes) {
	// Handle fontsize and fontweight, skip fontfamily
	Object.entries(figmaCollection).forEach(([category, figmaValues]) => {
		if (category === 'fontfamily') {
			console.log(`⏭️ Skipping fontfamily tokens in ${collectionName}`);
			return;
		}

		if (category === 'fontsize' && typeof figmaValues === 'object') {
			// Map fontsize: figma.fontsize.10 → local.font-size-10
			Object.entries(figmaValues).forEach(([size, figmaValue]) => {
				const localTokenName = `font-size-${size}`;
				const localValue = localPrimitiveTokens[localTokenName];
				const pathString = `${collectionName}/fontsize-${size}`;

				compareTypographyToken(pathString, localTokenName, localValue, figmaValue, collectionName, packageName, changes);
			});
		} else if (category === 'fontweight' && typeof figmaValues === 'object') {
			// Map fontweight: figma.fontweight.regular → local.font-weight.regular
			Object.entries(figmaValues).forEach(([weight, figmaValue]) => {
				// Skip oblique fontweight variations
				if (weight.toLowerCase().includes('oblique')) {
					console.log(`⏭️ Skipping oblique fontweight: ${weight}`);
					return;
				}

				const localValue = localPrimitiveTokens['font-weight'] && localPrimitiveTokens['font-weight'][weight];
				const pathString = `${collectionName}/fontweight-${weight}`;

				if (localValue === undefined) {
					// Token added
					changes.added[pathString] = {
						collection: collectionName,
						package: packageName,
						path: ['fontweight', weight],
						value: figmaValue
					};
					console.log(`Found new typography token: ${pathString} = ${figmaValue}`);
				} else if (String(localValue) !== String(figmaValue)) {
					// Token modified
					const mappedChange = {
						filePath: `${packageName}/typography-primitive`,
						before: {
							primitive: {
								'font-weight': {
									[weight]: localValue
								}
							}
						},
						after: {
							primitive: {
								'font-weight': {
									[weight]: figmaValue
								}
							}
						}
					};
					changes.modified[`${packageName}/typography-primitive/font-weight-${weight}`] = mappedChange;
					console.log(`Found modified typography token: ${pathString}`);
					console.log(`  Local: ${localValue} → Figma: ${figmaValue}`);
				} else {
					// Token unchanged
					changes.unchanged[pathString] = {
						collection: collectionName,
						package: packageName,
						path: ['fontweight', weight],
						value: figmaValue
					};
					console.log(`Typography fontweight unchanged: ${pathString} (${localValue})`);
				}
			});
		}
	});
}

/**
 * Compare individual typography token
 */
function compareTypographyToken(pathString, localTokenName, localValue, figmaValue, collectionName, packageName, changes) {
	if (localValue === undefined) {
		// Token added
		changes.added[pathString] = {
			collection: collectionName,
			package: packageName,
			path: [localTokenName],
			value: figmaValue
		};
		console.log(`Found new typography token: ${pathString} = ${figmaValue}`);
	} else {
		// Token comparison - handle px units properly
		const normalizedLocal = String(localValue).replace('px', '');
		const normalizedFigma = String(figmaValue);

		if (normalizedLocal !== normalizedFigma) {
			// Token modified
			const mappedChange = {
				filePath: `${packageName}/typography-primitive`,
				before: {
					primitive: {
						[localTokenName]: localValue
					}
				},
				after: {
					primitive: {
						[localTokenName]: `${figmaValue}px`
					}
				}
			};
			changes.modified[`${packageName}/typography-primitive/${localTokenName}`] = mappedChange;
			console.log(`Found modified typography token: ${pathString}`);
			console.log(`  Local: ${localValue} → Figma: ${figmaValue}px`);
		} else {
			// Token unchanged
			changes.unchanged[pathString] = {
				collection: collectionName,
				package: packageName,
				path: [localTokenName],
				value: figmaValue
			};
			console.log(`Typography token unchanged: ${pathString} (${localValue})`);
		}
	}
}

/**
 * Compare primitive tokens (radius, spacing)
 */
function comparePrimitiveTokens(figmaCollection, localPrimitiveTokens, collectionName, packageName, changes, tokenType) {
	// Handle radius and spacing tokens
	// Figma structure: {radius: {2: 2, 4: 4, ...}} or {spacing: {2: 2, 4: 4, ...}}
	// Local structure: {radius-2: "2px", radius-4: "4px", ...} or {spacing-2: "2px", spacing-4: "4px", ...}

	const figmaValues = figmaCollection[tokenType]; // radius or spacing
	if (!figmaValues || typeof figmaValues !== 'object') {
		console.log(`⚠️ No ${tokenType} values found in Figma collection ${collectionName}`);
		return;
	}

	Object.entries(figmaValues).forEach(([size, figmaValue]) => {
		const localTokenName = `${tokenType}-${size}`;
		const localValue = localPrimitiveTokens[localTokenName];
		const pathString = `${collectionName}/${tokenType}-${size}`;

		if (localValue === undefined) {
			// Token added
			changes.added[pathString] = {
				collection: collectionName,
				package: packageName,
				path: [tokenType, size],
				value: figmaValue
			};
			console.log(`Found new ${tokenType} token: ${pathString} = ${figmaValue}`);
		} else {
			// Token comparison - handle px units properly
			const normalizedLocal = String(localValue).replace('px', '');
			const normalizedFigma = String(figmaValue);

			if (normalizedLocal !== normalizedFigma) {
				// Token modified
				const mappedChange = {
					filePath: `${packageName}/${tokenType}-primitive`,
					before: {
						primitive: {
							[localTokenName]: localValue
						}
					},
					after: {
						primitive: {
							[localTokenName]: `${figmaValue}px`
						}
					}
				};
				changes.modified[`${packageName}/${tokenType}-primitive/${localTokenName}`] = mappedChange;
				console.log(`Found modified ${tokenType} token: ${pathString}`);
				console.log(`  Local: ${localValue} → Figma: ${figmaValue}px`);
			} else {
				// Token unchanged
				changes.unchanged[pathString] = {
					collection: collectionName,
					package: packageName,
					path: [tokenType, size],
					value: figmaValue
				};
				console.log(`${tokenType} token unchanged: ${pathString} (${localValue})`);
			}
		}
	});

	// Check for removed tokens
	Object.entries(localPrimitiveTokens).forEach(([tokenName, localValue]) => {
		if (tokenName.startsWith(`${tokenType}-`)) {
			const size = tokenName.replace(`${tokenType}-`, '');
			if (!figmaValues.hasOwnProperty(size)) {
				const pathString = `${collectionName}/${tokenName}`;
				changes.removed[pathString] = {
					collection: collectionName,
					package: packageName,
					path: [tokenName],
					value: localValue
				};
				console.log(`Found removed ${tokenType} token: ${pathString} = ${localValue}`);
			}
		}
	});
}

/**
 * Compare semantic color tokens (webOS Dark mode)
 */
function compareSemanticColorTokens(figmaCollection, localSemanticColorTokens, collectionName, packageName, changes, localTokens) {
	// Compare recursively - Figma and local structures should match
	// Figma: background.full.default = "#000000"
	// Local: background.full.default = {"$ref": "core-tokens/json/color-primitive.json#/primitive/color/black"}

	function compareSemanticRecursively(figmaObj, localObj, currentPath = []) {
		if (!figmaObj || !localObj) return;

		Object.entries(figmaObj).forEach(([key, figmaValue]) => {
			// Map Figma token names to local structure
			let mappedKey = key;
			let mappedPath = [...currentPath];

			if (key === 'inputfield') {
				mappedKey = 'input-field';
				mappedPath = [...currentPath, mappedKey];
			} else if (key === 'inputfield-success') {
				mappedKey = 'input-field-success';
				mappedPath = [...currentPath, mappedKey];
			} else if (key === 'button_icon') {
				mappedKey = 'button-icon';
				mappedPath = [...currentPath, mappedKey];
			} else if (key === 'button_icon-pressed') {
				mappedKey = 'button-icon-pressed';
				mappedPath = [...currentPath, mappedKey];
			} else if (key === 'notificationcard') {
				mappedKey = 'notification-card';
				mappedPath = [...currentPath, mappedKey];
			} else if (key === 'textfield-disabled') {
				mappedKey = 'text-field-disabled';
				mappedPath = [...currentPath, mappedKey];
			} else if (key === 'onbackground') {
				// onbackground → on.background
				mappedPath = [...currentPath, 'on', 'background'];
			} else if (key === 'onsurface') {
				// onsurface → on.surface
				mappedPath = [...currentPath, 'on', 'surface'];
			} else {
				mappedPath = [...currentPath, mappedKey];
			}

			const fullPath = [...currentPath, key]; // Keep original path for Figma reference
			const pathString = `${collectionName}/${fullPath.join('/')}`;

			if (typeof figmaValue === 'object' && figmaValue !== null && !Array.isArray(figmaValue)) {
				// Recursive case - need to navigate to the correct local structure
				let localTarget = localObj;

				// Navigate through mapped path to find the correct local object
				if (key === 'onbackground' || key === 'onsurface') {
					// For onbackground/onsurface, navigate to on.background/on.surface
					if (localObj.on && localObj.on[key === 'onbackground' ? 'background' : 'surface']) {
						localTarget = localObj.on[key === 'onbackground' ? 'background' : 'surface'];
					} else {
						localTarget = null;
					}
				} else if (localObj[mappedKey] && typeof localObj[mappedKey] === 'object') {
					localTarget = localObj[mappedKey];
				} else {
					localTarget = null;
				}

				if (localTarget) {
					compareSemanticRecursively(figmaValue, localTarget, fullPath);
				} else {
					// New structure added
					changes.added[pathString] = {
						collection: collectionName,
						package: packageName,
						path: fullPath,
						value: figmaValue
					};
					console.log(`Found new semantic structure: ${pathString}`);
				}
			} else {
				// Leaf value - compare resolved value vs $ref
				let localValue;

				// Navigate through mapped path to find the correct local value
				if (key === 'onbackground' || key === 'onsurface') {
					// For onbackground/onsurface, get value from on.background/on.surface
					const targetKey = key === 'onbackground' ? 'background' : 'surface';
					localValue = localObj.on && localObj.on[targetKey] ? localObj.on[targetKey] : undefined;
				} else {
					localValue = localObj[mappedKey];
				}

				if (localValue === undefined) {
					// Token added
					changes.added[pathString] = {
						collection: collectionName,
						package: packageName,
						path: fullPath,
						value: figmaValue
					};
					console.log(`Found new semantic token: ${pathString} = ${figmaValue}`);
				} else if (typeof localValue === 'object' && localValue.$ref) {
					// Local has $ref, need to resolve and compare
					const resolvedValue = resolveReference(localValue.$ref, localTokens);
					if (resolvedValue !== null && String(resolvedValue) !== String(figmaValue)) {
						// Values are different
						const mappedChange = mapToLocalStructure(collectionName, packageName, fullPath, localValue, figmaValue);
						if (mappedChange) {
							changes.modified[pathString] = mappedChange;
							console.log(`Found modified semantic token: ${pathString}`);
							console.log(`  Local $ref resolved: ${resolvedValue} → Figma: ${figmaValue}`);
						}
					} else if (resolvedValue !== null) {
						// Values are the same
						changes.unchanged[pathString] = {
							collection: collectionName,
							package: packageName,
							path: fullPath,
							value: figmaValue
						};
						console.log(`Semantic token unchanged: ${pathString} ($ref resolved: ${resolvedValue})`);
					} else {
						// Could not resolve $ref, mark as unchanged for safety
						changes.unchanged[pathString] = {
							collection: collectionName,
							package: packageName,
							path: fullPath,
							value: figmaValue
						};
						console.log(`Semantic token with unresolvable $ref unchanged: ${pathString}`);
					}
				} else if (String(localValue) !== String(figmaValue)) {
					// Direct value comparison
					const mappedChange = mapToLocalStructure(collectionName, packageName, fullPath, localValue, figmaValue);
					if (mappedChange) {
						changes.modified[`${packageName}/color-semantic-dark/${fullPath.join('-')}`] = mappedChange;
						console.log(`Found modified semantic token: ${pathString}`);
						console.log(`  Local: ${localValue} → Figma: ${figmaValue}`);
					}
				} else {
					// Token unchanged
					changes.unchanged[pathString] = {
						collection: collectionName,
						package: packageName,
						path: fullPath,
						value: figmaValue
					};
					console.log(`Semantic token unchanged: ${pathString} (${localValue})`);
				}
			}
		});
	}

	compareSemanticRecursively(figmaCollection, localSemanticColorTokens);
}

/**
 * Compare semantic radius tokens (webOS)
 */
function compareSemanticRadiusTokens(figmaCollection, localSemanticRadiusTokens, collectionName, packageName, changes, localTokens) {
	// Handle the specific structure of lg.webOS.radius.semantic
	// Figma: { radius: { full: 999, button: 24, ... } }
	// Local: { full: {"$ref": "..."}, button: {"$ref": "..."}, ... }

	// Check if figmaCollection has a 'radius' key (which contains the actual tokens)
	const figmaRadiusTokens = figmaCollection.radius || figmaCollection;

	if (figmaRadiusTokens && typeof figmaRadiusTokens === 'object') {
		Object.entries(figmaRadiusTokens).forEach(([tokenName, figmaValue]) => {
			const pathString = `${collectionName}/radius/${tokenName}`;
			const localValue = localSemanticRadiusTokens[tokenName];

			if (localValue === undefined) {
				// Token added
				changes.added[pathString] = {
					collection: collectionName,
					package: packageName,
					path: ['radius', tokenName],
					value: figmaValue
				};
				console.log(`Found new semantic radius token: ${pathString} = ${figmaValue}`);
			} else if (typeof localValue === 'object' && localValue.$ref) {
				// Local has $ref, resolve and compare with Figma value
				const resolvedValue = resolveReference(localValue.$ref, localTokens);
				if (resolvedValue !== null) {
					// Convert values to comparable format
					const figmaStr = String(figmaValue).replace('px', '');
					const localStr = String(resolvedValue).replace('px', '');

					if (figmaStr !== localStr) {
						// Values are different
						const mappedChange = mapToLocalStructure(collectionName, packageName, ['radius', tokenName], localValue, figmaValue);
						if (mappedChange) {
							changes.modified[`${packageName}/radius-semantic/radius-${tokenName}`] = mappedChange;
							console.log(`Found modified semantic radius token: ${pathString}`);
							console.log(`  Local $ref resolved: ${resolvedValue} → Figma: ${figmaValue}`);
						}
					} else {
						// Values are the same
						changes.unchanged[pathString] = {
							collection: collectionName,
							package: packageName,
							path: ['radius', tokenName],
							value: figmaValue
						};
						console.log(`Semantic radius token unchanged: ${pathString} ($ref resolved: ${resolvedValue})`);
					}
				} else {
					// Failed to resolve $ref, treat as potential change
					console.warn(`Failed to resolve $ref: ${localValue.$ref} for ${pathString}`);
					changes.unchanged[pathString] = {
						collection: collectionName,
						package: packageName,
						path: ['radius', tokenName],
						value: figmaValue
					};
					console.log(`Semantic radius token with unresolved $ref: ${pathString} (${figmaValue})`);
				}
			} else if (String(localValue) !== String(figmaValue)) {
				// Direct value comparison
				const mappedChange = mapToLocalStructure(collectionName, packageName, ['radius', tokenName], localValue, figmaValue);
				if (mappedChange) {
					changes.modified[`${packageName}/radius-semantic/radius-${tokenName}`] = mappedChange;
					console.log(`Found modified semantic radius token: ${pathString}`);
					console.log(`  Local: ${localValue} → Figma: ${figmaValue}`);
				}
			} else {
				// Token unchanged
				changes.unchanged[pathString] = {
					collection: collectionName,
					package: packageName,
					path: ['radius', tokenName],
					value: figmaValue
				};
				console.log(`Semantic radius token unchanged: ${pathString} (${localValue})`);
			}
		});
	}

	// Check for removed tokens
	Object.entries(localSemanticRadiusTokens).forEach(([tokenName, localValue]) => {
		if (!figmaRadiusTokens || figmaRadiusTokens[tokenName] === undefined) {
			const pathString = `${collectionName}/radius/${tokenName}`;
			changes.removed[pathString] = {
				collection: collectionName,
				package: packageName,
				path: ['radius', tokenName],
				value: localValue
			};
			console.log(`Found removed semantic radius token: ${pathString} = ${JSON.stringify(localValue)}`);
		}
	});
}

function compareFigmaWithLocal(figmaCollection, localColorTokens, collectionName, packageName, changes) {
	// Flatten Figma structure: neutral-gray: {5: "#value"} → neutral-gray-5: "#value"
	const flatFigmaTokens = {};

	Object.entries(figmaCollection).forEach(([colorFamily, shades]) => {
		if (typeof shades === 'object' && shades !== null) {
			Object.entries(shades).forEach(([shade, value]) => {
				const tokenName = `${colorFamily}-${shade}`;
				flatFigmaTokens[tokenName] = value;
			});
		} else {
			// Direct token like "black": "#000000"
			flatFigmaTokens[colorFamily] = shades;
		}
	});

	// Compare flattened tokens
	Object.entries(flatFigmaTokens).forEach(([tokenName, figmaValue]) => {
		const localValue = localColorTokens[tokenName];
		const pathString = `${collectionName}/${tokenName}`;

		if (localValue === undefined) {
			// Token added
			changes.added[pathString] = {
				collection: collectionName,
				package: packageName,
				path: [tokenName],
				value: figmaValue
			};
			console.log(`Found new token: ${pathString} = ${figmaValue}`);
		} else if (localValue !== figmaValue) {
			// Token modified
			const mappedChange = {
				filePath: `${packageName}/color-primitive`,
				before: {
					primitive: {
						color: {
							[tokenName]: localValue
						}
					}
				},
				after: {
					primitive: {
						color: {
							[tokenName]: figmaValue
						}
					}
				}
			};
			changes.modified[`${packageName}/color-primitive/${tokenName}`] = mappedChange;
			console.log(`Found modified token: ${pathString}`);
			console.log(`  Local: ${localValue} → Figma: ${figmaValue}`);
		} else {
			// Token unchanged
			changes.unchanged[pathString] = {
				collection: collectionName,
				package: packageName,
				path: [tokenName],
				value: figmaValue
			};
		}
	});

	// Check for removed tokens
	Object.entries(localColorTokens).forEach(([tokenName, localValue]) => {
		if (!flatFigmaTokens.hasOwnProperty(tokenName)) {
			const pathString = `${collectionName}/${tokenName}`;
			changes.removed[pathString] = {
				collection: collectionName,
				package: packageName,
				path: [tokenName],
				value: localValue
			};
			console.log(`Found removed token: ${pathString} = ${localValue}`);
		}
	});
}

/**
 * Recursively compare token objects
 */
function compareTokensRecursively(figmaObj, localObj, collectionName, packageName, changes, currentPath = []) {
	Object.entries(figmaObj).forEach(([key, figmaValue]) => {
		const fullPath = [...currentPath, key];
		const pathString = `${collectionName}/${fullPath.join('/')}`;

		if (typeof figmaValue === 'object' && figmaValue !== null && !Array.isArray(figmaValue)) {
			// Recursive case: nested object
			if (localObj && localObj[key] && typeof localObj[key] === 'object') {
				compareTokensRecursively(figmaValue, localObj[key], collectionName, packageName, changes, fullPath);
			} else {
				// New nested structure added
				changes.added[pathString] = {
					collection: collectionName,
					package: packageName,
					path: fullPath,
					value: figmaValue
				};
				console.log(`Found new token structure: ${pathString}`);
			}
		} else {
			// Leaf value comparison
			if (!localObj || localObj[key] === undefined) {
				// Token added
				changes.added[pathString] = {
					collection: collectionName,
					package: packageName,
					path: fullPath,
					value: figmaValue
				};
				console.log(`Found new token: ${pathString} = ${figmaValue}`);
			} else if (localObj[key] !== figmaValue) {
				// Token modified - need to map to actual local file structure
				const mappedChange = mapToLocalStructure(collectionName, packageName, fullPath, localObj[key], figmaValue);
				if (mappedChange) {
					changes.modified[mappedChange.filePath] = mappedChange;
					console.log(`Found modified token: ${pathString}`);
					console.log(`  Local: ${localObj[key]} → Figma: ${figmaValue}`);
				}
			} else {
				// Token unchanged
				changes.unchanged[pathString] = {
					collection: collectionName,
					package: packageName,
					path: fullPath,
					value: figmaValue
				};
			}
		}
	});
}

/**
 * Map Figma token structure to local file structure
 */
function mapToLocalStructure(collectionName, packageName, figmaPath, beforeValue, afterValue) {
	// Map Figma paths to local file structure based on actual structure

	if (collectionName === 'lg.color.primitive' && figmaPath.length >= 2) {
		const [colorFamily, shade] = figmaPath;

		// Handle special cases for direct tokens (black, white)
		if (figmaPath.length === 1) {
			const tokenName = figmaPath[0]; // "black" or "white"
			return {
				filePath: `${packageName}/color-primitive`,
				before: {
					primitive: {
						color: {
							[tokenName]: beforeValue
						}
					}
				},
				after: {
					primitive: {
						color: {
							[tokenName]: afterValue
						}
					}
				}
			};
		}

		// Handle nested tokens like neutral-gray/5 → neutral-gray-5
		if (figmaPath.length === 2) {
			const tokenName = `${colorFamily}-${shade}`;
			return {
				filePath: `${packageName}/color-primitive`,
				before: {
					primitive: {
						color: {
							[tokenName]: beforeValue
						}
					}
				},
				after: {
					primitive: {
						color: {
							[tokenName]: afterValue
						}
					}
				}
			};
		}
	}

	// Handle radius primitive tokens
	if (collectionName === 'lg.radius.primitive' && figmaPath.length >= 1) {
		const tokenName = `radius-${figmaPath.join('-')}`;
		return {
			filePath: `${packageName}/radius-primitive`,
			before: {
				primitive: {
					[tokenName]: beforeValue
				}
			},
			after: {
				primitive: {
					[tokenName]: afterValue
				}
			}
		};
	}

	// Handle spacing primitive tokens
	if (collectionName === 'lg.spacing.primitive' && figmaPath.length >= 1) {
		const tokenName = `spacing-${figmaPath.join('-')}`;
		return {
			filePath: `${packageName}/spacing-primitive`,
			before: {
				primitive: {
					[tokenName]: beforeValue
				}
			},
			after: {
				primitive: {
					[tokenName]: afterValue
				}
			}
		};
	}

	// Handle semantic color tokens (all platforms and modes)
	if ((collectionName === 'lg.webOS.color.semantic' ||
		 collectionName === 'lg.webOS.color.semantic.dark' ||
		 collectionName === 'lg.webOS.color.semantic.light' ||
		 collectionName === 'lg.webOS.color.semantic.high-contrast' ||
		 collectionName.startsWith('lg.web.color.semantic.') ||
		 collectionName.startsWith('lg.mobile.color.semantic.')) && figmaPath.length >= 1) {

		// Map Figma path keys to local structure
		const mappedPath = figmaPath.map((key, index) => {
			if (key === 'inputfield') return 'input-field';
			if (key === 'inputfield-success') return 'input-field-success';
			if (key === 'button_icon') return 'button-icon';
			if (key === 'button_icon-pressed') return 'button-icon-pressed';
			if (key === 'notificationcard') return 'notification-card';
			if (key === 'textfield-disabled') return 'text-field-disabled';
			if (key === 'onbackground') return ['on', 'background'];
			if (key === 'onsurface') return ['on', 'surface'];
			return key;
		}).flat(); // flat() to handle ['on', 'background'] arrays

		// Determine the file suffix based on collection name
		let fileSuffix = 'dark'; // default for webOS
		if (collectionName.includes('.light')) {
			fileSuffix = 'light';
		} else if (collectionName.includes('.high-contrast')) {
			fileSuffix = 'high-contrast';
		} else if (collectionName.startsWith('lg.web.color.semantic.') ||
				   collectionName.startsWith('lg.mobile.color.semantic.')) {
			// For web and mobile, extract mode and get file name
			const mode = collectionName.split('.').pop();
			fileSuffix = getSemanticColorFileName(mode).replace('color-semantic-', '');
		}

		// Create nested structure for semantic tokens
		// mappedPath example: ['background', 'full', 'default'] or ['surface', 'input-field']
		// Maps to: semantic.color.background.full.default or semantic.color.surface.input-field

		let beforeStructure = { semantic: { color: {} } };
		let afterStructure = { semantic: { color: {} } };

		// Build nested structure using mapped path
		let beforeCurrent = beforeStructure.semantic.color;
		let afterCurrent = afterStructure.semantic.color;

		for (let i = 0; i < mappedPath.length - 1; i++) {
			beforeCurrent[mappedPath[i]] = {};
			afterCurrent[mappedPath[i]] = {};
			beforeCurrent = beforeCurrent[mappedPath[i]];
			afterCurrent = afterCurrent[mappedPath[i]];
		}

		// Set the final value
		const finalKey = mappedPath[mappedPath.length - 1];
		beforeCurrent[finalKey] = beforeValue;
		afterCurrent[finalKey] = afterValue;

		return {
			filePath: `${packageName}/color-semantic-${fileSuffix}`,
			before: beforeStructure,
			after: afterStructure
		};
	}

	// Handle webOS semantic radius tokens
	if (collectionName === 'lg.webOS.radius.semantic' && figmaPath.length >= 1) {
		// Create nested structure for semantic radius tokens
		// figmaPath example: ['radius', 'full']
		// Maps to: semantic.radius.full

		let beforeStructure = { semantic: { radius: {} } };
		let afterStructure = { semantic: { radius: {} } };

		// Build nested structure
		let beforeCurrent = beforeStructure.semantic.radius;
		let afterCurrent = afterStructure.semantic.radius;

		for (let i = 0; i < figmaPath.length - 1; i++) {
			beforeCurrent[figmaPath[i]] = {};
			afterCurrent[figmaPath[i]] = {};
			beforeCurrent = beforeCurrent[figmaPath[i]];
			afterCurrent = afterCurrent[figmaPath[i]];
		}

		// Set the final value
		const finalKey = figmaPath[figmaPath.length - 1];
		beforeCurrent[finalKey] = beforeValue;
		afterCurrent[finalKey] = afterValue;

		return {
			filePath: `${packageName}/radius-semantic`,
			before: beforeStructure,
			after: afterStructure
		};
	}

	// For other collections, use basic mapping
	if (packageName && figmaPath.length > 0) {
		const tokenPath = figmaPath.join('-');
		return {
			filePath: `${packageName}/${collectionName.split('.').pop()}`, // Use last part of collection name
			before: { [tokenPath]: beforeValue },
			after: { [tokenPath]: afterValue }
		};
	}

	return null;
}

/**
 * Check for tokens that exist in local but not in Figma (removed)
 */
function checkRemovedTokens(localObj, figmaObj, collectionName, packageName, changes, currentPath = []) {
	if (!localObj || typeof localObj !== 'object') return;

	Object.entries(localObj).forEach(([key, localValue]) => {
		// Handle special 'on' structure mapping
		if (key === 'on' && typeof localValue === 'object') {
			// Check 'on.background' and 'on.surface' structures
			Object.entries(localValue).forEach(([onKey, onValue]) => {
				const figmaKey = onKey === 'background' ? 'onbackground' : onKey === 'surface' ? 'onsurface' : onKey;
				const fullPath = [...currentPath, key, onKey];
				const pathString = `${collectionName}/${fullPath.join('/')}`;

				if (typeof onValue === 'object' && onValue !== null && !Array.isArray(onValue)) {
					// Recursive case for 'on' structure
					if (figmaObj && figmaObj[figmaKey]) {
						checkRemovedTokens(onValue, figmaObj[figmaKey], collectionName, packageName, changes, fullPath);
					} else {
						changes.removed[pathString] = {
							collection: collectionName,
							package: packageName,
							path: fullPath,
							value: onValue
						};
						console.log(`Found removed token structure: ${pathString}`);
					}
				} else {
					// Leaf value in 'on' structure
					if (!figmaObj || figmaObj[figmaKey] === undefined) {
						changes.removed[pathString] = {
							collection: collectionName,
							package: packageName,
							path: fullPath,
							value: onValue
						};
						console.log(`Found removed token: ${pathString} = ${onValue}`);
					}
				}
			});
			return; // Skip normal processing for 'on' key
		}

		// Map local key to Figma key (reverse mapping for other keys)
		let figmaKey = key;
		if (key === 'input-field') {
			figmaKey = 'inputfield';
		} else if (key === 'input-field-success') {
			figmaKey = 'inputfield-success';
		}

		const fullPath = [...currentPath, key];
		const pathString = `${collectionName}/${fullPath.join('/')}`;

		if (typeof localValue === 'object' && localValue !== null && !Array.isArray(localValue)) {
			// Recursive case
			if (figmaObj && figmaObj[figmaKey]) {
				checkRemovedTokens(localValue, figmaObj[figmaKey], collectionName, packageName, changes, fullPath);
			} else {
				// Entire structure removed
				changes.removed[pathString] = {
					collection: collectionName,
					package: packageName,
					path: fullPath,
					value: localValue
				};
				console.log(`Found removed token structure: ${pathString}`);
			}
		} else {
			// Leaf value
			if (!figmaObj || figmaObj[figmaKey] === undefined) {
				changes.removed[pathString] = {
					collection: collectionName,
					package: packageName,
					path: fullPath,
					value: localValue
				};
				console.log(`Found removed token: ${pathString} = ${localValue}`);
			}
		}
	});
}

/**
 * Main execution function
 */
async function main() {
	try {
		console.log('🎨 Starting Figma Variables sync...');

		// Load Figma settings from environment variables
		const accessToken = process.env.FIGMA_ACCESS_TOKEN;
		const fileKey = process.env.FIGMA_FILE_KEY;

		if (!accessToken || !fileKey) {
			console.error('❌ FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables are required.');
			process.exit(1);
		}

		const client = new FigmaAPIClient(accessToken, fileKey);

		// Get Variables and Collections from Figma
		console.log('📥 Fetching Figma Variables...');
		const { variables, collections } = await client.getVariablesAndCollections();

		// Convert Variables to token format
		const figmaTokens = client.formatVariableValues(variables, collections);

		// Load local tokens
		console.log('📂 Loading local tokens...');
		const localTokens = await loadLocalTokens();

		// Analyze changes
		console.log('🔍 Analyzing changes...');
		const changes = analyzeChanges(figmaTokens, localTokens);

		// Output results
		console.log('✅ Sync completed!');
		console.log('Changes:', {
			added: Object.keys(changes.added).length,
			modified: Object.keys(changes.modified).length,
			removed: Object.keys(changes.removed).length
		});

		// Save changes to file if any
		if (Object.keys(changes.added).length > 0 || Object.keys(changes.modified).length > 0) {
			const outputPath = path.join(__dirname, '..', 'figma-changes.json');
			await fs.writeJson(outputPath, {
				timestamp: new Date().toISOString(),
				figmaTokens,
				localTokens,
				changes
			}, { spaces: 4 });
			console.log(`📝 Changes saved to ${outputPath}`);
		}
	} catch (error) {
		console.error('❌ Sync failed:', error);
		process.exit(1);
	}
}

// Call main function only when script is executed directly
if (require.main === module) {
	main();
}

module.exports = {
	FigmaAPIClient,
	loadLocalTokens,
	analyzeChanges
};
