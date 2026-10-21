#!/usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generate C headers from LUPA design-token JSON files.
 *
 * The JSON files remain the source of truth.  Semantic $ref values are
 * validated and emitted as references to primitive C macros instead of being
 * flattened into duplicate literals.
 */

const fs = require('fs-extra');
const path = require('path');

const PACKAGE_NAME = 'lupa-tokens';

function toMacroSegment(value) {
	return String(value)
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.replace(/[^a-zA-Z0-9]+/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_|_$/g, '')
		.toUpperCase() || 'TOKEN';
}

function toHeaderName(fileName) {
	return `${fileName.replace(/\.json$/, '').replace(/-/g, '_')}.h`;
}

function toGuard(fileName) {
	return `LUPA_TOKENS_${toMacroSegment(fileName.replace(/\.json$/, ''))}_H`;
}

function decodeJsonPointerSegment(segment) {
	return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

function escapeCString(value) {
	return String(value)
		.replace(/\\/g, '\\\\')
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r');
}

function sortLeaves(value, prefix = []) {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return [{ path: prefix, value }];
	}
	if (value.$ref) {
		return [{ path: prefix, value }];
	}
	return Object.keys(value)
		.sort((a, b) => a.localeCompare(b, 'en'))
		.flatMap(key => sortLeaves(value[key], [...prefix, key]));
}

class CGenerator {
	constructor(options = {}) {
		this.baseDir = options.baseDir || path.resolve(__dirname, '..');
		this.packageName = options.packageName || PACKAGE_NAME;
		this.packageDir = path.join(this.baseDir, 'packages', this.packageName);
		this.jsonDir = path.join(this.packageDir, 'json');
		this.includeDir = path.join(this.packageDir, 'include', 'lupa_tokens');
		this.tokenFiles = new Map();
	}

	async loadTokenFiles() {
		this.tokenFiles.clear();
		const packagesDir = path.join(this.baseDir, 'packages');
		const packages = await fs.readdir(packagesDir, { withFileTypes: true });

		for (const packageEntry of packages) {
			if (!packageEntry.isDirectory()) {
				continue;
			}
			const jsonDir = path.join(packagesDir, packageEntry.name, 'json');
			if (!await fs.pathExists(jsonDir)) {
				continue;
			}
			const files = await fs.readdir(jsonDir);
			for (const fileName of files.filter(file => file.endsWith('.json'))) {
				const filePath = path.join(jsonDir, fileName);
				this.tokenFiles.set(`${packageEntry.name}/json/${fileName}`, {
					packageName: packageEntry.name,
					fileName,
					filePath,
					content: await fs.readJson(filePath)
				});
			}
		}
	}

	getFileInfo(ref) {
		if (typeof ref !== 'string') {
			throw new Error(`Invalid token reference: ${String(ref)}`);
		}
		const [filePart, pointer = ''] = ref.split('#');
		const fileInfo = this.tokenFiles.get(filePart);
		if (!fileInfo) {
			throw new Error(`Referenced token file not found: ${filePart}`);
		}
		if (!pointer.startsWith('/')) {
			throw new Error(`Invalid JSON pointer in reference: ${ref}`);
		}
		return {
			...fileInfo,
			pointerSegments: pointer
				.split('/')
				.slice(1)
				.map(decodeJsonPointerSegment)
		};
	}

	getValueAtPointer(fileInfo) {
		let current = fileInfo.content;
		for (const segment of fileInfo.pointerSegments) {
			if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, segment)) {
				throw new Error(`Reference path not found: ${fileInfo.fileName}#/${fileInfo.pointerSegments.join('/')}`);
			}
			current = current[segment];
		}
		return current;
	}

	resolveReference(ref, stack = []) {
		if (stack.includes(ref)) {
			throw new Error(`Token reference cycle detected: ${[...stack, ref].join(' -> ')}`);
		}
		const fileInfo = this.getFileInfo(ref);
		const value = this.getValueAtPointer(fileInfo);
		if (value && typeof value === 'object' && !Array.isArray(value) && value.$ref) {
			return this.resolveReference(value.$ref, [...stack, ref]);
		}
		return { value, fileInfo };
	}

	getFileTokenInfo(fileName) {
		const primitive = fileName.match(/^(.+)-primitive\.json$/);
		if (primitive) {
			return { type: primitive[1], layer: 'primitive' };
		}
		const semantic = fileName.match(/^(.+)-semantic(?:-.+)?\.json$/);
		if (semantic) {
			return { type: semantic[1], layer: 'semantic' };
		}
		return null;
	}

	getTokenPath(fileInfo, tokenInfo) {
		const layerIndex = fileInfo.pointerSegments.indexOf(tokenInfo.layer);
		if (layerIndex < 0) {
			throw new Error(`Reference does not contain ${tokenInfo.layer}: ${fileInfo.fileName}`);
		}
		let tokenPath = fileInfo.pointerSegments.slice(layerIndex + 1);
		if (tokenPath[0] === tokenInfo.type) {
			tokenPath = tokenPath.slice(1);
		}
		if (tokenPath.length === 0) {
			throw new Error(`Reference points to a token group, not a token: ${fileInfo.fileName}`);
		}
		return tokenPath;
	}

	macroForReference(ref) {
		const resolved = this.resolveReference(ref);
		const tokenInfo = this.getFileTokenInfo(resolved.fileInfo.fileName);
		if (!tokenInfo) {
			throw new Error(`Unsupported referenced token file: ${resolved.fileInfo.fileName}`);
		}
		const tokenPath = this.getTokenPath(resolved.fileInfo, tokenInfo);
		const prefix = tokenInfo.layer === 'primitive' ? 'PRIMITIVE' : 'TOKEN';
		return `${prefix}_${toMacroSegment(tokenInfo.type)}_${tokenPath.map(toMacroSegment).join('_')}`;
	}

	primitiveHeaderDependency(ref) {
		const fileInfo = this.getFileInfo(ref);
		const tokenInfo = this.getFileTokenInfo(fileInfo.fileName);
		if (!tokenInfo || tokenInfo.layer !== 'primitive') {
			return null;
		}
		if (fileInfo.packageName !== this.packageName) {
			throw new Error(`LUPA headers cannot include an external token package: ${fileInfo.packageName}`);
		}
		return toHeaderName(fileInfo.fileName);
	}

	valueType(type) {
		switch (type) {
			case 'color':
				return 'uint32_t';
			case 'opacity':
				return 'float';
			default:
				return 'float';
		}
	}

	colorLiteral(value) {
		if (typeof value !== 'string' || !/^#[0-9a-fA-F]{3,8}$/.test(value)) {
			throw new Error(`Invalid color token value: ${String(value)}`);
		}
		let hex = value.slice(1);
		if (hex.length === 3 || hex.length === 4) {
			hex = hex.split('').map(component => component + component).join('');
		}
		if (hex.length === 6) {
			return `UINT32_C(0x${hex.toUpperCase()})`;
		}
		if (hex.length === 8) {
			// JSON uses #RRGGBBAA; LUPA headers use 0xAARRGGBB.
			const rgba = hex.toUpperCase();
			return `UINT32_C(0x${rgba.slice(6)}${rgba.slice(0, 6)})`;
		}
		throw new Error(`Unsupported color length: ${value}`);
	}

	numericLiteral(value, type) {
		const number = Number(value);
		if (!Number.isFinite(number)) {
			throw new Error(`Invalid numeric token value: ${String(value)}`);
		}
		if (type === 'opacity' || !Number.isInteger(number)) {
			return `${number.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}f`;
		}
		return number < 0 ? `${number}` : `${number}u`;
	}

	valueLiteral(type, value) {
		if (value && typeof value === 'object' && value.$ref) {
			return this.macroForReference(value.$ref);
		}
		if (type === 'color') {
			return this.colorLiteral(value);
		}
		if (typeof value === 'number') {
			return this.numericLiteral(value, type);
		}
		if (typeof value === 'boolean') {
			return value ? '1' : '0';
		}
		if (typeof value === 'string') {
			if (type === 'opacity' || /^-?\d+(\.\d+)?$/.test(value)) {
				return this.numericLiteral(value, type);
			}
			return `"${escapeCString(value)}"`;
		}
		throw new Error(`Unsupported ${type} token value: ${JSON.stringify(value)}`);
	}

	getTokenSection(content, layer, type) {
		const layerData = content[layer];
		if (!layerData || typeof layerData !== 'object') {
			throw new Error(`Missing ${layer} section in token JSON.`);
		}
		if (layerData[type] && typeof layerData[type] === 'object') {
			return layerData[type];
		}
		return layerData;
	}

	getTypeFromFile(fileName) {
		const info = this.getFileTokenInfo(fileName);
		return info ? info.type : null;
	}

	getSemanticListName(fileName, type) {
		const themeMatch = fileName.match(new RegExp(`^${type}-semantic-(.+)\\.json$`));
		if (themeMatch) {
			return `SEMANTIC_${toMacroSegment(themeMatch[1])}_TOKEN_LIST`;
		}
		return `SEMANTIC_${toMacroSegment(type)}_TOKEN_LIST`;
	}

	formatHeader(sourceFile, guard, body) {
		const sourceComment = sourceFile.endsWith('.json')
			? `/* Generated from packages/${this.packageName}/json/${sourceFile}. */`
			: '/* Generated by scripts/c-generator.js. */';
		return [
			'/*',
			' * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.',
			' * SPDX-License-Identifier: Apache-2.0',
			' */',
			'',
			sourceComment,
			`#ifndef ${guard}`,
			`#define ${guard}`,
			'',
			...body,
			'',
			`#endif /* ${guard} */`,
			''
		].join('\n');
	}

	generatePrimitiveHeader(fileName, content) {
		const info = this.getFileTokenInfo(fileName);
		const type = info.type;
		const section = this.getTokenSection(content, 'primitive', type);
		const leaves = sortLeaves(section);
		const lines = ['#include <stdint.h>', ''];

		for (const leaf of leaves) {
			let tokenPath = leaf.path;
			if (tokenPath[0] === type) {
				tokenPath = tokenPath.slice(1);
			}
			const macro = `PRIMITIVE_${toMacroSegment(type)}_${tokenPath.map(toMacroSegment).join('_')}`;
			lines.push(`#define ${macro.padEnd(48)} ${this.valueLiteral(type, leaf.value)}`);
		}

		return this.formatHeader(fileName, toGuard(fileName), lines);
	}

	generateSemanticHeader(fileName, content) {
		const info = this.getFileTokenInfo(fileName);
		const type = info.type;
		const section = this.getTokenSection(content, 'semantic', type);
		const leaves = sortLeaves(section);
		const listName = this.getSemanticListName(fileName, type);
		const dependencies = new Set();
		const entries = [];
		const directValueDefinitions = [];

		for (const leaf of leaves) {
			const tokenPath = leaf.path[0] === type ? leaf.path.slice(1) : leaf.path;
			const tokenName = `${toMacroSegment(type)}_${tokenPath.map(toMacroSegment).join('_')}`;
			let valueMacro;
			let primitiveName = '';
			if (leaf.value && typeof leaf.value === 'object' && leaf.value.$ref) {
				const resolved = this.resolveReference(leaf.value.$ref);
				const dependency = this.primitiveHeaderDependency(leaf.value.$ref);
				if (dependency) {
					dependencies.add(dependency);
				}
				valueMacro = this.macroForReference(leaf.value.$ref);
				primitiveName = resolved.fileInfo.pointerSegments[resolved.fileInfo.pointerSegments.length - 1];
			} else {
				valueMacro = `LUPA_${toMacroSegment(fileName.replace(/\.json$/, ''))}_${tokenName}_VALUE`;
				directValueDefinitions.push(`#define ${valueMacro} ${this.valueLiteral(type, leaf.value)}`);
			}
			entries.push({
				name: tokenName,
				value: valueMacro,
				semanticPath: tokenPath.join('.'),
				primitiveName
			});
		}

		const lines = ['#include <stdint.h>'];
		for (const dependency of [...dependencies].sort()) {
			lines.push(`#include "${dependency}"`);
		}
		lines.push('');
		lines.push(...directValueDefinitions);
		if (directValueDefinitions.length > 0) {
			lines.push('');
		}
		lines.push(`#define ${listName}(X) \\`);
		if (entries.length === 0) {
			lines[lines.length - 1] = `#define ${listName}(X)`;
		} else {
			entries.forEach((entry, index) => {
				const suffix = index === entries.length - 1 ? '' : ' \\';
				lines.push(`    X(${entry.name}, ${entry.value}, "${escapeCString(entry.semanticPath)}", "${escapeCString(entry.primitiveName)}")${suffix}`);
			});
		}
		lines.push('');
		lines.push('#ifndef LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS');
		lines.push(`#define LUPA_TOKENS_DECLARE_${toMacroSegment(type)}(name, value, semantic_name, primitive_name) \\\n    static const ${this.valueType(type)} TOKEN_##name = value;`);
		lines.push(`${listName}(LUPA_TOKENS_DECLARE_${toMacroSegment(type)})`);
		lines.push(`#undef LUPA_TOKENS_DECLARE_${toMacroSegment(type)}`);
		lines.push('#endif');

		return this.formatHeader(fileName, toGuard(fileName), lines);
	}

	generateUmbrellaHeader() {
		const header = this.formatHeader('lupa_tokens.h', 'LUPA_TOKENS_LUPA_TOKENS_H', [
			'#include "color_primitive.h"',
			'',
			'/* Include exactly one semantic theme header in a normal translation unit. */',
			'/* Define LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS before including multiple themes. */'
		]);
		return header;
	}

	async generateFile(fileName, content, options = {}) {
		const info = this.getFileTokenInfo(fileName);
		if (!info) {
			return null;
		}
		const header = info.layer === 'primitive'
			? this.generatePrimitiveHeader(fileName, content)
			: this.generateSemanticHeader(fileName, content);
		const outputPath = path.join(this.includeDir, toHeaderName(fileName));
		if (options.check) {
			let existing;
			try {
				existing = await fs.readFile(outputPath, 'utf8');
			} catch (error) {
				if (error.code === 'ENOENT') {
					throw new Error(`Generated header is missing: ${path.relative(this.baseDir, outputPath)}`);
				}
				throw error;
			}
			if (existing !== header) {
				throw new Error(`Generated header is stale: ${path.relative(this.baseDir, outputPath)}`);
			}
			console.log(`✅ Checked ${path.relative(this.baseDir, outputPath)}`);
		} else {
			await fs.writeFile(outputPath, header);
			console.log(`✅ Generated ${path.relative(this.baseDir, outputPath)}`);
		}
		return outputPath;
	}

	async generateAll(options = {}) {
		await this.loadTokenFiles();
		if (!options.check) {
			await fs.ensureDir(this.includeDir);
		}
		const jsonFiles = (await fs.readdir(this.jsonDir))
			.filter(fileName => fileName.endsWith('.json'))
			.sort();
		const generated = [];

		for (const fileName of jsonFiles) {
			const fileInfo = this.tokenFiles.get(`${this.packageName}/json/${fileName}`);
			if (!fileInfo) {
				continue;
			}
			const outputPath = await this.generateFile(fileName, fileInfo.content, options);
			if (outputPath) {
				generated.push(outputPath);
			}
		}

		const umbrellaPath = path.join(this.includeDir, 'lupa_tokens.h');
		const umbrella = this.generateUmbrellaHeader();
		if (options.check) {
			let existing;
			try {
				existing = await fs.readFile(umbrellaPath, 'utf8');
			} catch (error) {
				if (error.code === 'ENOENT') {
					throw new Error(`Generated header is missing: ${path.relative(this.baseDir, umbrellaPath)}`);
				}
				throw error;
			}
			if (existing !== umbrella) {
				throw new Error(`Generated header is stale: ${path.relative(this.baseDir, umbrellaPath)}`);
			}
			console.log(`✅ Checked ${path.relative(this.baseDir, umbrellaPath)}`);
		} else {
			await fs.writeFile(umbrellaPath, umbrella);
			console.log(`✅ Generated ${path.relative(this.baseDir, umbrellaPath)}`);
		}
		generated.push(umbrellaPath);

		if (options.check) {
			return generated;
		}
		return generated;
	}
}

async function main() {
	const check = process.argv.includes('--check');
	const generator = new CGenerator();
	await generator.generateAll({ check });
	console.log('🎉 C header generation completed.');
}

if (require.main === module) {
	main().catch(error => {
		console.error('❌ C header generation failed:', error.message);
		process.exit(1);
	});
}

module.exports = CGenerator;
