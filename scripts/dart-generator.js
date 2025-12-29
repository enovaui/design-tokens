#!/usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Dart Generator
 * Generates Dart color files from JSON token files
 */

const fs = require('fs-extra');
const path = require('path');

class DartGenerator {
	constructor() {
		this.baseDir = path.resolve(__dirname, '..');
		this.packagesDir = path.join(this.baseDir, 'packages');
	}

	/**
	 * Convert HEX color to RGBA components
	 */
	hexToRgba(hex) {
		// Remove # if present
		hex = hex.replace('#', '');

		// Parse the hex values
		let r, g, b;
		if (hex.length === 3) {
			// Short hex (#RGB)
			r = parseInt(hex[0] + hex[0], 16);
			g = parseInt(hex[1] + hex[1], 16);
			b = parseInt(hex[2] + hex[2], 16);
		} else {
			// Full hex (#RRGGBB)
			r = parseInt(hex.substring(0, 2), 16);
			g = parseInt(hex.substring(2, 4), 16);
			b = parseInt(hex.substring(4, 6), 16);
		}

		return { r, g, b, a: 1.0 };
	}

	/**
	 * Generate Dart code for a color property
	 */
	generateColorProperty(name, hexValue) {
		// Convert hex to RGBA
		const rgba = this.hexToRgba(hexValue);
		// Always use 1.0 for alpha
		const alpha = '1.0';
		// Generate Dart property with camelCase variable name (no trailing blank line)
		return `\n  /// ${name} - ${hexValue}\n  late final Color ${this.toCamelCase(name)} = const Color.fromRGBO(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha});`;
	}

	// Convert token name to camelCase (e.g., neutral-gray-5 -> neutralGray5)
	toCamelCase(name) {
		return name.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
	}

	/**
	 * Convert string to PascalCase (e.g., on_surface -> OnSurface)
	 */
	toPascalCase(str) {
		return str
			.split(/[-_]/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
	}

	/**
	 * Update Color Dart file from JSON color tokens
	 */
	async generateColorDartFromJSON(jsonPath, dartPath) {
		if (!await fs.pathExists(jsonPath)) {
			console.log(`❌ JSON file not found: ${jsonPath}`);
			return false;
		}
		const jsonTokens = await fs.readJson(jsonPath);
		// Check if this is a color primitive file
		if (!jsonTokens.primitive || !jsonTokens.primitive.color) {
			console.log(`❌ Invalid color tokens file: ${jsonPath}`);
			return false;
		}

		const colorTokens = jsonTokens.primitive.color;

		// Generate Dart class content
		let dartContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class ColorPrimitive {
  ColorPrimitive._();

  static ColorPrimitive? _instance;
  static ColorPrimitive get instance => _instance ??= ColorPrimitive._();
`;

		// Add color properties with blank lines only between properties
		const colorEntries = Object.entries(colorTokens).filter(([_, hexValue]) => typeof hexValue === 'string' && hexValue.startsWith('#'));
		colorEntries.forEach(([name, hexValue], idx) => {
			dartContent += this.generateColorProperty(name, hexValue);
			if (idx < colorEntries.length - 1) {
				dartContent += '\n';
			}
		});

		// Close the class
		dartContent += '\n}\n';

		// Write Dart file
		await fs.writeFile(dartPath, dartContent);
		console.log(`✅ Generated Dart file: ${path.basename(dartPath)}`);
		return true;
	}


	/**
	 * Update Radius Dart file from JSON radius tokens
	 */
	async generateRadiusDartFromJSON(jsonPath, dartPath) {
		if (!await fs.pathExists(jsonPath)) {
			console.log(`❌ JSON file not found: ${jsonPath}`);
			return false;
		}
		const jsonTokens = await fs.readJson(jsonPath);
		// Check if this is a radius primitive file
		if (!jsonTokens.primitive) {
			console.log(`❌ Invalid radius tokens file: ${jsonPath}`);
			return false;
		}

		const radiusTokens = jsonTokens.primitive;

		// Generate Dart class content
		let dartContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class RadiusPrimitive {
  RadiusPrimitive._();

  static RadiusPrimitive? _instance;
  static RadiusPrimitive get instance => _instance ??= RadiusPrimitive._();
`;

		// Add radius properties with blank lines only between properties
		const radiusEntries = Object.entries(radiusTokens).filter(([_, value]) => typeof value === 'string' && value.endsWith('px'));
		radiusEntries.forEach(([name, value], idx) => {
			// Remove px and parse as double
			const px = parseFloat(value.replace('px', ''));
			// camelCase for Dart variable
			const varName = this.toCamelCase(name);
			dartContent += `\n  late final Radius ${varName} = const Radius.circular(${px});`;
		});

		// Close the class
		dartContent += '\n}\n';

		// Write Dart file
		await fs.writeFile(dartPath, dartContent);
		console.log(`✅ Generated Dart file: ${path.basename(dartPath)}`);
		return true;
	}


	/**
	 * Update Spacing Dart file from JSON spacing tokens
	 */
	async generateSpacingDartFromJSON(jsonPath, dartPath) {
		if (!await fs.pathExists(jsonPath)) {
			console.log(`❌ JSON file not found: ${jsonPath}`);
			return false;
		}
		const jsonTokens = await fs.readJson(jsonPath);
		// Check if this is a spacing primitive file
		if (!jsonTokens.primitive) {
			console.log(`❌ Invalid spacing tokens file: ${jsonPath}`);
			return false;
		}

		const spacingTokens = jsonTokens.primitive;

		// Generate Dart class content
		let dartContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class SpacingPrimitive {
  SpacingPrimitive._();

  static SpacingPrimitive? _instance;
  static SpacingPrimitive get instance => _instance ??= SpacingPrimitive._();
`;

		// Add spacing properties with blank lines only between properties
		const spacingEntries = Object.entries(spacingTokens).filter(([_, value]) => typeof value === 'string' && value.endsWith('px'));
		spacingEntries.forEach(([name, value], idx) => {
			// Remove px and parse as number
			const px = parseFloat(value.replace('px', ''));
			// camelCase for Dart variable
			const varName = this.toCamelCase(name);
			// Use int if px is integer, else double
			const isInt = Number.isInteger(px);
			const type = isInt ? 'int' : 'double';
			dartContent += `\n  late final ${type} ${varName} = ${px};`;
		});

		// Close the class
		dartContent += '\n}\n';

		// Write Dart file
		await fs.writeFile(dartPath, dartContent);
		console.log(`✅ Generated Dart file: ${path.basename(dartPath)}`);
		return true;
	}

	async generateTypographyDartFromJSON(jsonPath, dartPath) {
		if (!await fs.pathExists(jsonPath)) {
			console.log(`❌ JSON file not found: ${jsonPath}`);
			return false;
		}
		const jsonTokens = await fs.readJson(jsonPath);
		if (!jsonTokens.primitive) {
			console.log(`❌ Invalid typography tokens file: ${jsonPath}`);
			return false;
		}
		const typographyTokens = jsonTokens.primitive;

	let dartContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class FontSizePrimitive {
  FontSizePrimitive._();

  static FontSizePrimitive? _instance;
  static FontSizePrimitive get instance => _instance ??= FontSizePrimitive._();
`;

		// Only font-size-XX keys, sorted numerically
		const sizeEntries = Object.entries(typographyTokens)
			.filter(([name, value]) => name.startsWith('font-size-') && typeof value === 'string' && value.endsWith('px'))
			.sort((a, b) => parseInt(a[0].replace('font-size-', '')) - parseInt(b[0].replace('font-size-', '')));
		sizeEntries.forEach(([name, value], idx) => {
			const px = parseFloat(value.replace('px', ''));
			const sizeName = 'size' + name.replace('font-size-', '');
			dartContent += `\n  late final double ${sizeName} = ${px};`;
		});

		dartContent += '\n}\n';

		// FontWeightPrimitive class (static mapping)
	dartContent += `
class FontWeightPrimitive {
  FontWeightPrimitive._();

  static FontWeightPrimitive? _instance;
  static FontWeightPrimitive get instance => _instance ??= FontWeightPrimitive._();

  late final FontWeight thin = FontWeight.w100;
  late final FontWeight extralight = FontWeight.w200;
  late final FontWeight light = FontWeight.w300;
  late final FontWeight regular = FontWeight.w400;
  late final FontWeight medium = FontWeight.w500;
  late final FontWeight semiBold = FontWeight.w600;
  late final FontWeight bold = FontWeight.w700;
  late final FontWeight extrabold = FontWeight.w800;
  late final FontWeight black = FontWeight.w900;
}
`;

		await fs.writeFile(dartPath, dartContent);
		console.log(`✅ Generated Dart file: ${path.basename(dartPath)}`);
		return true;
	}

	/**
	 * Generate Semantic Color Dart files from JSON
	 * @param {string} jsonPath - Path to JSON file
	 * @param {string} outputDir - Base output directory for Dart files
	 * @param {string} theme - Theme name (e.g., 'dark', 'light')
	 */
	async generateSemanticDartFromJSON(jsonPath, outputDir, theme) {
		if (!await fs.pathExists(jsonPath)) {
			console.log(`❌ JSON file not found: ${jsonPath}`);
			return false;
		}

		const jsonTokens = await fs.readJson(jsonPath);

		// Ensure we have semantic color tokens
		if (!jsonTokens.semantic || !jsonTokens.semantic.color) {
			console.log(`❌ Invalid semantic color tokens file: ${jsonPath}`);
			return false;
		}

		const semanticColors = jsonTokens.semantic.color;
		const themeDirPath = path.join(outputDir, theme);

		// Create theme directory if it doesn't exist
		await fs.ensureDir(path.join(themeDirPath, 'color'));

		// Process each top-level category
		for (const [category, values] of Object.entries(semanticColors)) {
			console.log(`🔍 Found top-level category: ${category}`);

			// Special case for "on" category which might contain subcategories like "background", "surface", etc.
			if (category === 'on') {
				console.log(`🔍 Found 'on' category, checking for special subcategories`);

				// Handle special "on_*" combined categories
				const combinedCategories = ['background', 'surface', 'primary', 'secondary'];

				// Process each potential combined category
				for (const subCat of combinedCategories) {
					if (values[subCat] && typeof values[subCat] === 'object') {
						// Create combined directory like "on_background", "on_surface", etc.
						const combinedCategory = `on_${subCat}`;
						const combinedCategoryDir = path.join(themeDirPath, 'color', combinedCategory);
						await fs.ensureDir(combinedCategoryDir);

						console.log(`   🔄 Processing combined category: ${combinedCategory}`);
						console.log(`   📁 Created directory: ${combinedCategoryDir}`);

						// Generate main category file
						await this.generateCategoryFile(combinedCategory, values[subCat], combinedCategoryDir, theme);

						// Process nested subcategories under the combined category
						for (const [key, subValues] of Object.entries(values[subCat])) {
							if (typeof subValues === 'object' && !subValues.$ref) {
								console.log(`      📦 Found subcategory in combined category: ${key}`);
								const subCategoryDir = path.join(combinedCategoryDir, key);
								await fs.ensureDir(subCategoryDir);
								await this.generateSubCategoryFile(key, subValues, subCategoryDir, combinedCategory, theme);
							}
						}
					}
				}

				// After processing all combined categories, continue with next top-level category
				continue;
			}

			// Normal case - process the category directly
			const categoryDir = path.join(themeDirPath, 'color', category);
			await fs.ensureDir(categoryDir);

			// Generate main category file
			await this.generateCategoryFile(category, values, categoryDir, theme);

			// Process nested subcategories (like overlay, popup)
			for (const [key, subValues] of Object.entries(values)) {
				if (typeof subValues === 'object' && !subValues.$ref) {
					const subCategoryDir = path.join(categoryDir, key);
					await fs.ensureDir(subCategoryDir);
					await this.generateSubCategoryFile(key, subValues, subCategoryDir, category, theme);
				}
			}
		}

		console.log(`✅ Generated Semantic Dart files for ${theme} theme`);
		return true;
	}

	/**
	 * Generate Dart file for a main category
	 */
	async generateCategoryFile(category, values, categoryDir, theme) {
		// Convert category to PascalCase for class name (e.g., on_surface -> OnSurface)
		const className = this.toPascalCase(category);
		const baseClassName = `${className}Base`;
		const fileName = `${category}.dart`;
		const filePath = path.join(categoryDir, fileName);

		// Get list of direct properties and subcategories
		const directProps = [];
		const subCategories = [];

		for (const [key, value] of Object.entries(values)) {
			if (typeof value === 'object' && !value.$ref) {
				// This is a subcategory
				subCategories.push(key);
			} else if (value && value.$ref) {
				// This is a direct property
				directProps.push(key);
			}
		}

		// Start building the Dart file content
		let dartContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

`;
		// Only import Color if there are direct properties that use Color type
		if (directProps.length > 0) {
			dartContent += `import 'package:flutter/material.dart' show Color;\n\n`;
		}
		// Only import color_primitive if there are direct properties that reference it
		if (directProps.length > 0) {
			dartContent += `import '../../../../core_tokens/color_primitive.dart';\n`;
		}
		dartContent += `import '../../../base/color/${category}/${category}_base.dart';\n`;
		// Add imports for subcategories
		for (const subCategory of subCategories) {
			dartContent += `import '${subCategory}/${subCategory}.dart';\n`;
		}

		dartContent += `\nclass ${className} extends ${baseClassName} {\n`;
		dartContent += `  const ${className}();\n\n`;

		// Add subcategory getters
		for (const subCategory of subCategories) {
			const subClassName = this.toPascalCase(subCategory);
			dartContent += `  @override\n  ${subClassName} get ${this.toCamelCase(subCategory)} => const ${subClassName}();\n`;
		}
		// Add direct property getters
		for (const prop of directProps) {
			// Extract reference to primitive color
			const colorRef = values[prop].$ref;
			// Extract color name from the reference
			// Example: "core-tokens/json/color-primitive.json#/primitive/color/neutral-gray-10"
			const colorName = colorRef.split('/').pop().replace(/[-_](\w)/g, (_, c) => c.toUpperCase());

			// If the property is named 'default', rename to 'defaultColor'
			const dartProp = prop === 'default' ? 'defaultColor' : this.toCamelCase(prop);
			dartContent += `  @override\n  Color get ${dartProp} => ColorPrimitive.instance.${colorName};\n`;
		}

		// Close the class
		dartContent += `}\n`;

		// Write the file
		await fs.writeFile(filePath, dartContent);
		console.log(`✅ Generated ${fileName}`);
	}

	/**
	 * Generate Dart file for a subcategory
	 */
	async generateSubCategoryFile(subCategory, values, subCategoryDir, parentCategory, theme) {
		// Convert names to proper case
		const className = this.toPascalCase(subCategory);
		const baseClassName = `${className}Base`;
		const fileName = `${subCategory}.dart`;
		const filePath = path.join(subCategoryDir, fileName);

		// For parent categories that are combined (like on_background),
		// we need to use the correct path format for imports
		const formattedParentCategory = parentCategory;

		// Start building the Dart file content
		let dartContent = `/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../../core_tokens/color_primitive.dart';
import '../../../../base/color/${formattedParentCategory}/${subCategory}/${subCategory}_base.dart';

class ${className} extends ${baseClassName} {
  const ${className}();

`;

		// Add properties
		for (const [prop, value] of Object.entries(values)) {
			if (value && value.$ref) {
				// Extract color name from the reference
				const colorRef = value.$ref;
				const colorName = colorRef.split('/').pop().replace(/[-_](\w)/g, (_, c) => c.toUpperCase());

				// If the property is named 'default', rename to 'defaultColor'
				const dartProp = prop === 'default' ? 'defaultColor' : this.toCamelCase(prop);
				dartContent += `  @override
  Color get ${dartProp} => ColorPrimitive.instance.${colorName};\n`;
			}
		}

		// Close the class
		dartContent += `}\n`;

		// Write the file
		await fs.writeFile(filePath, dartContent);
		console.log(`✅ Generated ${fileName}`);
	}
}

module.exports = DartGenerator;
