#!/usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Unified CSS Generator
 * Consolidates all CSS generation functionality from scattered scripts
 */

const fs = require('fs-extra');
const path = require('path');

class CSSGenerator {
    constructor() {
        this.baseDir = path.resolve(__dirname, '..');
        this.packagesDir = path.join(this.baseDir, 'packages');
    }

    /**
     * Format token values with appropriate units
     */
    formatCSSValue(key, value) {
        // Handle direct values (not wrapped in {value: ...})
        if (typeof value === 'string' || typeof value === 'number') {
            // Add px units to spacing and radius tokens
            if ((key.includes('spacing') || key.includes('radius')) &&
                typeof value === 'number') {
                return `${value}px`;
            }
            return value;
        }

        // Handle wrapped values
        if (!value || !value.value) {
            return value;
        }

        // Add px units to spacing and radius tokens
        if ((key.includes('spacing') || key.includes('radius')) &&
            typeof value.value === 'number') {
            return `${value.value}px`;
        }

        return value.value;
    }

    /**
     * Generate CSS content from JSON tokens with proper formatting
     */
    async generateCSSFromJSON(jsonPath, cssPath, options = {}) {
        const fs = require('fs-extra');
        const path = require('path');
        if (!await fs.pathExists(jsonPath)) {
            console.log(`❌ JSON file not found: ${jsonPath}`);
            return false;
        }
        console.log(`📖 Reading JSON file: ${path.basename(jsonPath)}`);
        let jsonTokens = await fs.readJson(jsonPath);
        // Determine token type from filename
        const fileName = path.basename(jsonPath, '.json');
        const tokenType = fileName.replace('-primitive', '').replace('-semantic', '');
        // Generate CSS content based on token type and structure
        let cssContent = '';
        // Check if this is a semantic token file
        if (jsonTokens.semantic) {
            if (fileName.includes('color-semantic')) {
                cssContent = await this.generateSemanticColorCSS(jsonTokens, options);
            } else {
                cssContent = await this.generateSemanticGenericCSS(jsonTokens, tokenType, options);
            }
        } else {
            if (tokenType === 'color') {
                cssContent = await this.generateColorCSS(jsonTokens, options);
            } else if (tokenType === 'typography') {
                cssContent = await this.generateTypographyCSS(jsonTokens, options);
            } else {
                cssContent = await this.generateGenericCSS(jsonTokens, tokenType, options);
            }
        }
        // Write CSS file
        await fs.writeFile(cssPath, cssContent);
        console.log(`✅ Generated CSS file: ${path.basename(cssPath)}`);
        return true;
    }

    /**
     * Generate color CSS with proper group organization
     */
    async generateColorCSS(jsonTokens, options = {}) {
        const colorTokens = jsonTokens.primitive?.color || {};

        // Define color groups with their comments
        const colorGroups = [
            {
                name: 'Basic Colors',
                pattern: /^(black|white)$/,
                comment: '/* Basic Colors */'
            },
            {
                name: 'Neutral Gray',
                pattern: /^neutral-gray-/,
                comment: '/* Neutral Gray Colors */'
            },
            {
                name: 'Mist Gray',
                pattern: /^mist-gray-/,
                comment: '/* Mist Gray Colors */'
            },
            {
                name: 'Cool Gray',
                pattern: /^cool-gray-/,
                comment: '/* Cool Gray Colors */'
            },
            {
                name: 'Blue Gray',
                pattern: /^blue-gray-/,
                comment: '/* Blue Gray Colors */'
            },
            {
                name: 'Warm Gray',
                pattern: /^warm-gray-/,
                comment: '/* Warm Gray Colors */'
            },
            {
                name: 'Heritage Red',
                pattern: /^heritage-red-/,
                comment: '/* Heritage Red Colors */'
            },
            {
                name: 'Active Red',
                pattern: /^active-red-/,
                comment: '/* Active Red Colors */'
            },
            {
                name: 'Red Orange',
                pattern: /^red-orange-/,
                comment: '/* Red Orange Colors */'
            },
            {
                name: 'Deep Orange',
                pattern: /^deep-orange-/,
                comment: '/* Deep Orange Colors */'
            },
            {
                name: 'Orange',
                pattern: /^orange-/,
                comment: '/* Orange Colors */'
            },
            {
                name: 'Yellow',
                pattern: /^yellow-/,
                comment: '/* Yellow Colors */'
            },
            {
                name: 'Yellow Green',
                pattern: /^yellow-green-/,
                comment: '/* Yellow Green Colors */'
            },
            {
                name: 'Green',
                pattern: /^green-/,
                comment: '/* Green Colors */'
            },
            {
                name: 'Mint Green',
                pattern: /^mint-green-/,
                comment: '/* Mint Green Colors */'
            },
            {
                name: 'Teal Green',
                pattern: /^teal-green-/,
                comment: '/* Teal Green Colors */'
            },
            {
                name: 'Blue Green',
                pattern: /^blue-green-/,
                comment: '/* Blue Green Colors */'
            },
            {
                name: 'Sky Blue',
                pattern: /^sky-blue-/,
                comment: '/* Sky Blue Colors */'
            },
            {
                name: 'Cobalt Blue',
                pattern: /^cobalt-blue-/,
                comment: '/* Cobalt Blue Colors */'
            },
            {
                name: 'Navy',
                pattern: /^navy-/,
                comment: '/* Navy Colors */'
            },
            {
                name: 'Violet',
                pattern: /^violet-/,
                comment: '/* Violet Colors */'
            },
            {
                name: 'Purple',
                pattern: /^purple-/,
                comment: '/* Purple Colors */'
            },
            {
                name: 'Red Brown',
                pattern: /^red-brown-/,
                comment: '/* Red Brown Colors */'
            },
            {
                name: 'Brown',
                pattern: /^brown-/,
                comment: '/* Brown Colors */'
            },
            {
                name: 'Primary Colors',
                pattern: /^(primary-|secondary-|tertiary-)/,
                comment: '/* Primary Colors */'
            },
            {
                name: 'Success Colors',
                pattern: /^success-/,
                comment: '/* Success Colors */'
            },
            {
                name: 'Warning Colors',
                pattern: /^warning-/,
                comment: '/* Warning Colors */'
            },
            {
                name: 'Danger Colors',
                pattern: /^danger-/,
                comment: '/* Danger Colors */'
            },
            {
                name: 'Info Colors',
                pattern: /^info-/,
                comment: '/* Info Colors */'
            }
        ];

        // Generate CSS header
        let cssContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/* color-primitive.css */

/* ----------------------------------------
Primitive Color Tokens
------------------------------------------- */

:root {
`;

        // Group and output tokens
        const processedTokens = new Set();

        for (const group of colorGroups) {
            const groupTokens = Object.keys(colorTokens).filter(key =>
                group.pattern.test(key) && !processedTokens.has(key)
            );            if (groupTokens.length > 0) {
            cssContent += `\n\t${group.comment}\n`;
                groupTokens.forEach(key => {
                    const value = this.formatCSSValue(key, colorTokens[key]);
                    cssContent += `\t--primitive-color-${key}: ${value};\n`;
                    processedTokens.add(key);
                });
            }
        }

        // Handle any remaining tokens that didn't match groups
        const remainingTokens = Object.keys(colorTokens).filter(key => !processedTokens.has(key));
        if (remainingTokens.length > 0) {
            cssContent += `\n\t/* Other Colors */\n`;
            remainingTokens.forEach(key => {
                const value = this.formatCSSValue(key, colorTokens[key]);
                cssContent += `\t--primitive-color-${key}: ${value};\n`;
            });
        }

        cssContent += '}\n';
        return cssContent;
    }

    /**
     * Generate typography CSS with font-weight tokens
     */
    async generateTypographyCSS(jsonTokens, options = {}) {
        const primitive = jsonTokens.primitive || {};

        // Generate CSS header
        let cssContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/* typography-primitive.css */

/* ----------------------------------------
Primitive Typography Tokens
------------------------------------------- */

:root {
`;

        // Generate font-size tokens
        const fontSizeTokens = Object.keys(primitive)
            .filter(key => key.startsWith('font-size-'))
            .sort((a, b) => {
                const aNum = parseInt(a.match(/\d+$/)?.[0] || '0');
                const bNum = parseInt(b.match(/\d+$/)?.[0] || '0');
                return aNum - bNum;
            });

        if (fontSizeTokens.length > 0) {
            cssContent += '\n\t/* Font Sizes */\n';
            fontSizeTokens.forEach(key => {
                const value = this.formatCSSValue(key, primitive[key]);
                cssContent += `\t--primitive-${key}: ${value};\n`;
            });
        }

        // Generate font-weight tokens (individual keys like font-weight-bold)
        const fontWeightTokens = Object.keys(primitive)
            .filter(key => key.startsWith('font-weight-'))
            .sort();

        if (fontWeightTokens.length > 0) {
            cssContent += '\n\t/* Font Weight Tokens */\n';
            fontWeightTokens.forEach(key => {
                const value = this.formatCSSValue(key, primitive[key]);
                cssContent += `\t--primitive-${key}: ${value};\n`;
            });
        }

        // Handle font-weight object
        if (primitive['font-weight'] && typeof primitive['font-weight'] === 'object') {
            cssContent += '\n\t/* Font Weights */\n';
            Object.entries(primitive['font-weight']).forEach(([weight, value]) => {
                cssContent += `\t--primitive-font-weight-${weight}: ${value};\n`;
            });
        }

        // Handle any other typography tokens
        const otherTokens = Object.keys(primitive)
            .filter(key => !key.startsWith('font-size-') && !key.startsWith('font-weight-') && key !== 'font-weight')
            .sort();

        if (otherTokens.length > 0) {
            cssContent += '\n\t/* Other Typography */\n';
            otherTokens.forEach(key => {
                const value = this.formatCSSValue(key, primitive[key]);
                cssContent += `\t--primitive-${key}: ${value};\n`;
            });
        }

        cssContent += '}\n';
        return cssContent;
    }

    /**
     * Generate generic CSS for other token types
     */
    async generateGenericCSS(jsonTokens, tokenType, options = {}) {
        const tokens = jsonTokens.primitive || {};

        // Generate CSS header
        let cssContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/* ${tokenType}-primitive.css */

/* ----------------------------------------
Primitive ${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} Tokens
------------------------------------------- */

:root {
`;

        // Generate CSS variables
        Object.keys(tokens).forEach(key => {
            const value = this.formatCSSValue(key, tokens[key]);
            cssContent += `\t--primitive-${key}: ${value};\n`;
        });

        cssContent += '}\n';
        return cssContent;
    }

    /**
     * Update all CSS files from their corresponding JSON files
     */
    async updateAllCSS(packageName = 'core-tokens') {
        const packageDir = path.join(this.packagesDir, packageName);
        const jsonDir = path.join(packageDir, 'json');
        const cssDir = path.join(packageDir, 'css');

        if (!await fs.pathExists(jsonDir)) {
            console.log(`❌ JSON directory not found: ${jsonDir}`);
            return;
        }

        if (!await fs.pathExists(cssDir)) {
            await fs.ensureDir(cssDir);
        }

        console.log(`🔄 Updating all CSS files for package: ${packageName}`);

        const jsonFiles = await fs.readdir(jsonDir);
        const primitiveFiles = jsonFiles.filter(file =>
            file.endsWith('-primitive.json')
        );

        for (const jsonFile of primitiveFiles) {
            const jsonPath = path.join(jsonDir, jsonFile);
            const cssFile = jsonFile.replace('.json', '.css');
            const cssPath = path.join(cssDir, cssFile);

            await this.generateCSSFromJSON(jsonPath, cssPath);
        }

        console.log('✅ All CSS files updated successfully');
    }

    /**
     * Resolve $ref references to actual values
     */
    async resolveReference(ref, allTokens) {
        try {
            // Parse the reference: "core-tokens/json/color-primitive.json#/primitive/color/white"
            const [filePart, pathPart] = ref.split('#');

            if (!filePart || !pathPart) {
                return null;
            }

            // Extract package and file from the file part
            const pathSegments = filePart.split('/');
            if (pathSegments.length < 3) {
                return null;
            }

            const packageName = pathSegments[0];
            const fileName = pathSegments[2].replace('.json', '');

            // Get the package data
            const packageData = allTokens[packageName];
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
                return await this.resolveReference(current.$ref, allTokens);
            }

            return null;
        } catch (error) {
            console.warn(`Failed to resolve reference: ${ref}`, error);
            return null;
        }
    }

    /**
     * Load all token files for reference resolution
     */
    async loadAllTokens() {
        const allTokens = {};
        const packageDirs = ['core-tokens', 'web-tokens', 'mobile-tokens', 'webos-tokens'];

        for (const packageName of packageDirs) {
            const packageDir = path.join(this.packagesDir, packageName, 'json');

            if (!await fs.pathExists(packageDir)) {
                continue;
            }

            allTokens[packageName] = {};
            const jsonFiles = await fs.readdir(packageDir);

            for (const fileName of jsonFiles) {
                if (!fileName.endsWith('.json')) {
                    continue;
                }

                const filePath = path.join(packageDir, fileName);
                const fileNameWithoutExt = fileName.replace('.json', '');

                try {
                    allTokens[packageName][fileNameWithoutExt] = await fs.readJson(filePath);
                } catch (error) {
                    console.warn(`Failed to load ${filePath}:`, error);
                }
            }
        }

        return allTokens;
    }

    /**
     * Resolve all $ref references in a token object
     */
    async resolveAllReferences(tokens, allTokens) {
        const resolveValue = async (value) => {
            if (typeof value === 'object' && value !== null) {
                if (value.$ref) {
                    const resolved = await this.resolveReference(value.$ref, allTokens);
                    return resolved !== null ? resolved : value.$ref;
                } else {
                    const result = {};
                    for (const [k, v] of Object.entries(value)) {
                        result[k] = await resolveValue(v);
                    }
                    return result;
                }
            }
            return value;
        };

        return await resolveValue(tokens);
    }

    /**
     * Generate semantic color CSS (preserve primitive references)
     */
    async generateSemanticColorCSS(jsonTokens, options = {}) {
        // Load all tokens for reference resolution
        const allTokens = await this.loadAllTokens();
        // We'll need the original (unresolved) semantic tokens for $ref detection
        const semanticTokensRaw = jsonTokens.semantic?.color || {};

        // Helper to extract primitive variable name from $ref
        function getPrimitiveVarFromRef(ref) {
            // Example ref: core-tokens/json/color-primitive.json#/primitive/color/mist-gray-95
            const match = ref.match(/color-primitive\.json#\/primitive\/color\/([\w-]+)/);
            if (match) {
                return `var(--primitive-color-${match[1]})`;
            }
            return null;
        }

        // Flatten semantic tokens and generate CSS variables, preserving $ref as var() when possible
        const flattenTokens = (objRaw, objResolved, prefix = 'semantic-color') => {
            const flattened = [];
            const flatten = (currentRaw, currentResolved, currentPrefix) => {
                for (const key of Object.keys(currentResolved)) {
                    const valueResolved = currentResolved[key];
                    const valueRaw = currentRaw ? currentRaw[key] : undefined;
                    const newPrefix = `${currentPrefix}-${key}`;
                    if (
                        typeof valueResolved === 'string' ||
                        (typeof valueResolved === 'object' && valueResolved !== null && valueResolved.value)
                    ) {
                        // If original was a $ref, output var(--primitive-color-xxx)
                        let cssValue;
                        if (valueRaw && valueRaw.$ref) {
                            const varRef = getPrimitiveVarFromRef(valueRaw.$ref);
                            cssValue = varRef || valueResolved;
                        } else {
                            cssValue = valueResolved;
                        }
                        flattened.push([newPrefix, cssValue]);
                    } else if (typeof valueResolved === 'object' && valueResolved !== null) {
                        flatten(valueRaw, valueResolved, newPrefix);
                    }
                }
            };
            flatten(objRaw, objResolved, prefix);
            return flattened;
        };

        // Resolve all $ref references (for fallback/other cases)
        const resolvedTokens = await this.resolveAllReferences(jsonTokens, allTokens);
        const semanticTokensResolved = resolvedTokens.semantic?.color || {};
        const flatTokens = flattenTokens(semanticTokensRaw, semanticTokensResolved);

        // Generate CSS header
        let cssContent = `/*\n * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.\n * SPDX-License-Identifier: Apache-2.0\n */\n\n@import \"@enovaui/core-tokens/css/color-primitive.css\";\n\n/* ----------------------------------------\nSemantic Color Tokens\n------------------------------------------- */\n\n:root {\n`;

        // Group tokens by category for better organization
        const categories = {
            background: [],
            'on-background': [],
            surface: [],
            'on-surface': [],
            stroke: [],
            scrim: [],
            other: []
        };
        for (const [varName, value] of flatTokens) {
            let category = 'other';
            if (varName.includes('-background-')) {
                category = varName.includes('-on-background-') ? 'on-background' : 'background';
            } else if (varName.includes('-surface-')) {
                category = varName.includes('-on-surface-') ? 'on-surface' : 'surface';
            } else if (varName.includes('-stroke-')) {
                category = 'stroke';
            } else if (varName.includes('-scrim-')) {
                category = 'scrim';
            }
            categories[category].push([varName, value]);
        }
        for (const [categoryName, tokens] of Object.entries(categories)) {
            if (tokens.length === 0) continue;
            const categoryComment = categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            cssContent += `\n\t/* ${categoryComment} */\n`;
            for (const [varName, value] of tokens) {
                cssContent += `\t--${varName}: ${value};\n`;
            }
        }
        cssContent += '}\n';
        return cssContent;
    }

    /**
     * Generate semantic CSS for non-color tokens (radius, spacing, etc.)
     */
    async generateSemanticGenericCSS(jsonTokens, tokenType, options = {}) {
        // Load all tokens for reference resolution
        const allTokens = await this.loadAllTokens();

        // Resolve all $ref references
        const resolvedTokens = await this.resolveAllReferences(jsonTokens, allTokens);

        const semanticTokens = resolvedTokens.semantic || {};

        // Generate CSS header
        const headerType = tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
        let cssContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

@import "@enovaui/core-tokens/css/${tokenType}-primitive.css";

/* ----------------------------------------
Semantic ${headerType} Tokens
------------------------------------------- */

:root {
`;

        // Flatten semantic tokens and generate CSS variables
        const flattenTokens = (obj, prefix = `semantic-${tokenType}`) => {
            const flattened = [];

            const flatten = (current, currentPrefix) => {
                for (const [key, value] of Object.entries(current)) {
                    // Special handling for radius semantic tokens to avoid duplicate "radius" in variable names
                    let newPrefix;
                    if (tokenType === 'radius' && key === 'radius' && currentPrefix === `semantic-${tokenType}`) {
                        // Skip the "radius" key for radius semantic tokens to avoid semantic-radius-radius-*
                        newPrefix = currentPrefix;
                    } else {
                        // Token names are already normalized by Token Transformer
                        newPrefix = `${currentPrefix}-${key}`;
                    }

                    if (typeof value === 'string' || typeof value === 'number') {
                        // Direct value - convert to CSS variable reference if it looks like a primitive reference
                        let cssValue = value;
                        if (String(value).includes(`primitive-${tokenType}`)) {
                            // Already a CSS variable
                            cssValue = `var(--${value})`;
                        } else {
                            // Convert primitive reference to CSS variable, remove px suffix for radius
                            let cleanValue = value;
                            if (tokenType === 'radius' && String(value).endsWith('px')) {
                                cleanValue = String(value).replace(/px$/, '');
                            }
                            cssValue = `var(--primitive-${tokenType}-${cleanValue})`;
                        }
                        flattened.push([newPrefix, cssValue]);
                    } else if (typeof value === 'object' && value !== null) {
                        flatten(value, newPrefix);
                    }
                }
            };

            flatten(obj, prefix);
            return flattened;
        };

        const flatTokens = flattenTokens(semanticTokens);

        // Output CSS variables
        for (const [varName, value] of flatTokens) {
            // Token names are already normalized by Token Transformer
            cssContent += `\t--${varName}: ${value};\n`;
        }

        cssContent += '}\n';
        return cssContent;
    }
}

// CLI functionality
async function main() {
    const generator = new CSSGenerator();
    const args = process.argv.slice(2);
    const command = args[0];

    try {
        switch (command) {
            case 'update-all':
                await generator.updateAllCSS(args[1]);
                break;

            case 'update-css':
                if (args.length < 3) {
                    console.log('Usage: node css-generator.js update-css <jsonPath> <cssPath>');
                    process.exit(1);
                }
                await generator.generateCSSFromJSON(args[1], args[2]);
                break;

            case 'help':
            default:
                console.log(`
CSS Generator - Unified CSS generation for design tokens

Usage:
  node css-generator.js update-all [packageName]    Update all CSS files from JSON
  node css-generator.js update-css <json> <css>     Update specific CSS file
  node css-generator.js help                        Show this help

Examples:
  node css-generator.js update-all core-tokens
  node css-generator.js update-css ./json/spacing-primitive.json ./css/spacing-primitive.css
`);
                break;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Export for use as module
module.exports = CSSGenerator;

// Run CLI if called directly
if (require.main === module) {
    main();
}
