#!/usr/bin/env node

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
     * Generate CSS content from JSON tokens with proper formatting
     */
    async generateCSSFromJSON(jsonPath, cssPath, options = {}) {
        if (!await fs.pathExists(jsonPath)) {
            console.log(`❌ JSON file not found: ${jsonPath}`);
            return false;
        }

        console.log(`📖 Reading JSON file: ${path.basename(jsonPath)}`);
        let jsonTokens = await fs.readJson(jsonPath);

        // Sort tokens if needed
        if (options.sort !== false) {
            jsonTokens = this.sortTokens(jsonTokens);
        }

        // Determine token type from filename
        const fileName = path.basename(jsonPath, '.json');
        const tokenType = fileName.replace('-primitive', '');

        // Generate CSS content based on token type
        let cssContent = '';

        if (tokenType === 'color') {
            cssContent = await this.generateColorCSS(jsonTokens, options);
        } else if (tokenType === 'typography') {
            cssContent = await this.generateTypographyCSS(jsonTokens, options);
        } else {
            cssContent = await this.generateGenericCSS(jsonTokens, tokenType, options);
        }

        // Write CSS file
        await fs.writeFile(cssPath, cssContent);
        console.log(`✅ Generated CSS file: ${path.basename(cssPath)}`);

        // Also update JSON file with sorted tokens
        if (options.sort !== false) {
            await fs.writeJson(jsonPath, jsonTokens, { spaces: 4 });
            console.log(`📝 Sorted JSON file: ${path.basename(jsonPath)}`);
        }

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
---------------------------------------- */

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
---------------------------------------- */

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
---------------------------------------- */

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
     * Sort all token files
     */
    async sortAllTokens(packageName = 'core-tokens') {
        const packageDir = path.join(this.packagesDir, packageName);
        const jsonDir = path.join(packageDir, 'json');

        if (!await fs.pathExists(jsonDir)) {
            console.log(`❌ JSON directory not found: ${jsonDir}`);
            return;
        }

        console.log(`📋 Sorting all token files for package: ${packageName}`);

        const jsonFiles = await fs.readdir(jsonDir);
        const primitiveFiles = jsonFiles.filter(file =>
            file.endsWith('-primitive.json')
        );

        for (const jsonFile of primitiveFiles) {
            const jsonPath = path.join(jsonDir, jsonFile);

            if (await fs.pathExists(jsonPath)) {
                console.log(`📋 Sorting: ${jsonFile}`);
                let jsonTokens = await fs.readJson(jsonPath);
                jsonTokens = this.sortTokens(jsonTokens);
                await fs.writeJson(jsonPath, jsonTokens, { spaces: 4 });
                console.log(`✅ Sorted: ${jsonFile}`);
            }
        }

        console.log('✅ All token files sorted successfully');
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

            case 'sort-all':
                await generator.sortAllTokens(args[1]);
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
  node css-generator.js sort-all [packageName]      Sort all token files
  node css-generator.js update-css <json> <css>     Update specific CSS file
  node css-generator.js help                        Show this help

Examples:
  node css-generator.js update-all core-tokens
  node css-generator.js sort-all
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
