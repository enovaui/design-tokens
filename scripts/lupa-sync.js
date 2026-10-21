#!/usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * LUPA token synchronizer.
 *
 * This intentionally runs independently from the existing token synchronizer:
 * LUPA consumes a different Figma library and publishes C headers instead of
 * CSS/Dart artifacts.
 */

require('dotenv').config();

const fs = require('fs-extra');
const path = require('path');
const { FigmaAPIClient } = require('./figma-sync');

const BASE_DIR = path.resolve(__dirname, '..');
const PACKAGE_NAME = 'lupa-tokens';
const PACKAGE_DIR = path.join(BASE_DIR, 'packages', PACKAGE_NAME);
const JSON_DIR = path.join(PACKAGE_DIR, 'json');

function kebabCase(value) {
	return String(value)
		.trim()
		.replace(/_/g, '-')
		.replace(/\s+/g, '-')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[^a-zA-Z0-9-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase();
}

function normalizeSegments(name) {
	return String(name)
		.split('/')
		.map(kebabCase)
		.filter(Boolean);
}

function tokenSegments(name, type, semantic = false) {
	let segments = normalizeSegments(name);
	const typeName = kebabCase(type);

	if (segments[0] === typeName) {
		segments = segments.slice(1);
	}

	if (semantic) {
		const expanded = [];
		for (const segment of segments) {
			if (segment === 'on-background' || segment === 'on-surface') {
				expanded.push('on', segment.replace('on-', ''));
			} else {
				expanded.push(segment);
			}
		}
		segments = expanded;
	}

	return segments;
}

function setNestedValue(target, segments, value) {
	if (segments.length === 0) {
		throw new Error('A token must have a non-empty name.');
	}

	let current = target;
	for (const segment of segments.slice(0, -1)) {
		if (current[segment] === undefined) {
			current[segment] = {};
		} else if (typeof current[segment] !== 'object' || current[segment] === null || Array.isArray(current[segment])) {
			throw new Error(`Token path collision at ${segments.join('/')}.`);
		}
		current = current[segment];
	}

	const leaf = segments[segments.length - 1];
	if (current[leaf] !== undefined) {
		throw new Error(`Duplicate token name: ${segments.join('/')}`);
	}
	current[leaf] = value;
}

function sortObject(value) {
	if (Array.isArray(value)) {
		return value.map(sortObject);
	}
	if (!value || typeof value !== 'object') {
		return value;
	}
	return Object.fromEntries(
		Object.keys(value)
			.sort((a, b) => a.localeCompare(b, 'en'))
			.map(key => [key, sortObject(value[key])])
	);
}

function roundColorComponent(value) {
	return Math.max(0, Math.min(255, Math.round(Number(value) * 255)));
}

function toHexComponent(value) {
	return roundColorComponent(value).toString(16).padStart(2, '0');
}

function colorToHex(value) {
	if (typeof value === 'string') {
		return value;
	}
	if (!value || typeof value !== 'object' || value.r === undefined) {
		return value;
	}

	const rgb = `${toHexComponent(value.r)}${toHexComponent(value.g)}${toHexComponent(value.b)}`;
	const alpha = value.a === undefined ? 1 : Number(value.a);
	if (alpha >= 0.999999) {
		return `#${rgb}`;
	}
	return `#${rgb}${toHexComponent(alpha)}`;
}

function formatValue(value, resolvedType) {
	switch (resolvedType) {
		case 'COLOR':
			return colorToHex(value);
		case 'FLOAT':
			return typeof value === 'number' ? value : Number(value);
		case 'BOOLEAN':
		case 'STRING':
			return value;
		default:
			return value;
	}
}

function collectionVariables(variables, collection) {
	const ids = new Set(collection.variableIds || []);
	return Object.values(variables)
		.filter(variable => variable.variableCollectionId === collection.id || ids.has(variable.id))
		.sort((a, b) => String(a.name).localeCompare(String(b.name), 'en'));
}

function getCollectionEntries(collections) {
	return Object.values(collections || {});
}

function findCollection(collections, preferredName, suffix) {
	const entries = getCollectionEntries(collections);
	if (preferredName) {
		const exact = entries.find(collection => collection.name === preferredName);
		if (!exact) {
			throw new Error(`Figma collection not found: ${preferredName}`);
		}
		return exact;
	}

	const matches = entries
		.filter(collection => collection.name.endsWith(suffix))
		.sort((a, b) => a.name.localeCompare(b.name, 'en'));
	if (matches.length === 0) {
		return null;
	}
	if (matches.length > 1) {
		throw new Error(
			`Multiple Figma collections match ${suffix}: ${matches.map(collection => collection.name).join(', ')}. ` +
			'Set the corresponding LUPA_FIGMA_*_COLLECTION variable explicitly.'
		);
	}
	return matches[0];
}

function getModes(collection) {
	if (Array.isArray(collection.modes) && collection.modes.length > 0) {
		return collection.modes;
	}
	return [{
		modeId: collection.defaultModeId || 'default',
		name: 'default'
	}];
}

function getModeValue(variable, modeId) {
	const values = variable.valuesByMode || {};
	return values[modeId] !== undefined ? values[modeId] : values[Object.keys(values)[0]];
}

function resolveRawValue(variableId, modeId, variables, stack = []) {
	if (stack.includes(variableId)) {
		throw new Error(`Variable alias cycle detected: ${[...stack, variableId].join(' -> ')}`);
	}

	const variable = variables[variableId];
	if (!variable) {
		throw new Error(`Referenced Figma variable not found: ${variableId}`);
	}

	const value = getModeValue(variable, modeId);
	if (value && value.type === 'VARIABLE_ALIAS') {
		return resolveRawValue(value.id, modeId, variables, [...stack, variableId]);
	}
	return value;
}

function getAliasTarget(rawValue, variables) {
	if (!rawValue || rawValue.type !== 'VARIABLE_ALIAS') {
		return null;
	}
	return variables[rawValue.id] || null;
}

function refPath(type, tokenName) {
	const jsonType = kebabCase(type);
	const escapedName = String(tokenName).replace(/~/g, '~0').replace(/\//g, '~1');
	return `${PACKAGE_NAME}/json/${jsonType}-primitive.json#/primitive/${jsonType}/${escapedName}`;
}

function buildPrimitiveData(variables, collection, type) {
	const values = {};
	if (!collection) {
		return values;
	}

	const variablesInCollection = collectionVariables(variables, collection);
	const defaultModeId = collection.defaultModeId || getModes(collection)[0].modeId;
	for (const variable of variablesInCollection) {
		const segments = tokenSegments(variable.name, type);
		const tokenName = segments.join('-');
		if (!tokenName) {
			continue;
		}
		const rawValue = resolveRawValue(variable.id, defaultModeId, variables);
		setNestedValue(values, [tokenName], formatValue(rawValue, variable.resolvedType));
	}
	return values;
}

function buildPrimitiveLookup(primitiveValues) {
	const lookup = new Map();
	for (const [name, value] of Object.entries(primitiveValues)) {
		const key = typeof value === 'string' ? value.toLowerCase() : String(value);
		if (!lookup.has(key)) {
			lookup.set(key, name);
		}
	}
	return lookup;
}

function semanticValue(variable, modeId, variables, primitiveValues, primitiveLookup, type) {
	const rawValue = getModeValue(variable, modeId);
	const aliasTarget = getAliasTarget(rawValue, variables);
	if (aliasTarget && aliasTarget.resolvedType === variable.resolvedType) {
		const targetName = tokenSegments(aliasTarget.name, type).join('-');
		const targetCollection = variables[aliasTarget.id]?.variableCollectionId;
		const primitiveCollectionId = primitiveValues.__collectionId;
		if (targetCollection === primitiveCollectionId && targetName) {
			return { $ref: refPath(type, targetName) };
		}
	}

	const resolved = formatValue(resolveRawValue(variable.id, modeId, variables), variable.resolvedType);
	const lookupKey = typeof resolved === 'string' ? resolved.toLowerCase() : String(resolved);
	const primitiveName = primitiveLookup.get(lookupKey);
	if (primitiveName) {
		return { $ref: refPath(type, primitiveName) };
	}
	return resolved;
}

function buildSemanticData(variables, collection, type, primitiveValues) {
	const result = {};
	if (!collection) {
		return result;
	}

	const primitiveLookup = buildPrimitiveLookup(primitiveValues);
	const variablesInCollection = collectionVariables(variables, collection);
	for (const mode of getModes(collection)) {
		const modeName = kebabCase(mode.name || 'default') || 'default';
		const semanticValues = {};
		for (const variable of variablesInCollection) {
			const segments = tokenSegments(variable.name, type, true);
			if (segments.length === 0) {
				continue;
			}
			setNestedValue(
				semanticValues,
				segments,
				semanticValue(variable, mode.modeId, variables, primitiveValues, primitiveLookup, type)
			);
		}
		result[modeName] = sortObject({ semantic: { [type]: semanticValues } });
	}
	return result;
}

async function writeJson(fileName, value) {
	const filePath = path.join(JSON_DIR, fileName);
	await fs.ensureDir(JSON_DIR);
	await fs.writeJson(filePath, sortObject(value), { spaces: 4 });
	console.log(`✅ Generated ${path.relative(BASE_DIR, filePath)}`);
}

async function main() {
	const accessToken = process.env.FIGMA_ACCESS_TOKEN;
	const fileKey = process.env.LUPA_FIGMA_FILE_KEY || process.env.FIGMA_FILE_KEY;
	const fileUrl = process.env.LUPA_FIGMA_FILE_URL || process.env.FIGMA_FILE_URL;
	if (!accessToken || !fileKey) {
		throw new Error('FIGMA_ACCESS_TOKEN and LUPA_FIGMA_FILE_KEY (or FIGMA_FILE_KEY) are required.');
	}

	console.log('🦙 Starting LUPA token sync...');
	if (fileUrl) {
		console.log(`📎 Source Figma URL configured: ${fileUrl.replace(/([?&]node-id=)[^&]+/, '$1…')}`);
	}

	const client = new FigmaAPIClient(accessToken, fileKey);
	const { variables, collections } = await client.getVariablesAndCollections();
	const colorPrimitiveCollection = findCollection(
		collections,
		process.env.LUPA_FIGMA_COLOR_PRIMITIVE_COLLECTION,
		'.color.primitive'
	);
	if (!colorPrimitiveCollection) {
		throw new Error('No Figma color primitive collection was found. Set LUPA_FIGMA_COLOR_PRIMITIVE_COLLECTION.');
	}

	const colorPrimitiveValues = buildPrimitiveData(variables, colorPrimitiveCollection, 'color');
	Object.defineProperty(colorPrimitiveValues, '__collectionId', {
		value: colorPrimitiveCollection.id,
		enumerable: false
	});
	await writeJson('color-primitive.json', { primitive: { color: colorPrimitiveValues } });

	const colorSemanticCollection = findCollection(
		collections,
		process.env.LUPA_FIGMA_COLOR_SEMANTIC_COLLECTION,
		'.color.semantic'
	);
	if (colorSemanticCollection) {
		const semanticByMode = buildSemanticData(
			variables,
			colorSemanticCollection,
			'color',
			colorPrimitiveValues
		);
		for (const [modeName, value] of Object.entries(semanticByMode)) {
			await writeJson(`color-semantic-${modeName}.json`, value);
		}
	} else {
		console.warn('⚠️ No Figma color semantic collection found; only primitive colors were generated.');
	}

	const opacityPrimitiveCollection = findCollection(
		collections,
		process.env.LUPA_FIGMA_OPACITY_PRIMITIVE_COLLECTION,
		'.opacity.primitive'
	);
	if (opacityPrimitiveCollection) {
		const opacityValues = buildPrimitiveData(variables, opacityPrimitiveCollection, 'opacity');
		await writeJson('opacity-primitive.json', { primitive: { opacity: opacityValues } });
	} else {
		console.log('ℹ️ No opacity primitive collection found; opacity support remains available in the C generator.');
	}

	console.log('🎉 LUPA token sync completed.');
}

if (require.main === module) {
	main().catch(error => {
		console.error('❌ LUPA token sync failed:', error.message);
		process.exit(1);
	});
}

module.exports = {
	kebabCase,
	tokenSegments,
	colorToHex,
	buildPrimitiveData,
	buildSemanticData,
	findCollection,
	resolveRawValue
};
