const assert = require('node:assert/strict');
const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const CGenerator = require('../../scripts/c-generator');

test('generates primitive, semantic, and opacity headers', async () => {
	const baseDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lupa-c-generator-'));
	const jsonDir = path.join(baseDir, 'packages', 'lupa-tokens', 'json');
	await fs.ensureDir(jsonDir);

	await fs.writeJson(path.join(jsonDir, 'color-primitive.json'), {
		primitive: {
			color: {
				black: '#000000',
				white: '#ffffff'
			}
		}
	}, { spaces: 4 });
	await fs.writeJson(path.join(jsonDir, 'color-semantic-dark.json'), {
		semantic: {
			color: {
				background: {
					default: {
						$ref: 'lupa-tokens/json/color-primitive.json#/primitive/color/black'
					}
				}
			}
		}
	}, { spaces: 4 });
	await fs.writeJson(path.join(jsonDir, 'opacity-primitive.json'), {
		primitive: {
			opacity: {
				a0: 0,
				a50: 0.5,
				a100: 1
			}
		}
	}, { spaces: 4 });

	await new CGenerator({ baseDir }).generateAll();

	const includeDir = path.join(baseDir, 'packages', 'lupa-tokens', 'include', 'lupa_tokens');
	const primitiveHeader = await fs.readFile(path.join(includeDir, 'color_primitive.h'), 'utf8');
	const semanticHeader = await fs.readFile(path.join(includeDir, 'color_semantic_dark.h'), 'utf8');
	const opacityHeader = await fs.readFile(path.join(includeDir, 'opacity_primitive.h'), 'utf8');

	assert.match(primitiveHeader, /#define PRIMITIVE_COLOR_BLACK\s+UINT32_C\(0x000000\)/);
	assert.match(semanticHeader, /#include "color_primitive\.h"/);
	assert.match(semanticHeader, /X\(COLOR_BACKGROUND_DEFAULT, PRIMITIVE_COLOR_BLACK, "background\.default", "black"\)/);
	assert.match(semanticHeader, /#define LUPA_TOKENS_DECLARE_COLOR\(name, value, semantic_name, primitive_name\)/);
	assert.match(semanticHeader, /SEMANTIC_DARK_TOKEN_LIST\(LUPA_TOKENS_DECLARE_COLOR\)/);
	assert.match(opacityHeader, /#define PRIMITIVE_OPACITY_A50\s+0\.5f/);
});
