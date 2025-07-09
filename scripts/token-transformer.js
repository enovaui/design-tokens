#!/usr/bin/env node

/**
 * Token Transformer Engine
 * Transforms Figma Variables to platform-specific token formats.
 */

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
   * Apply incremental updates based on changes
   */
  async applyChanges(changes, outputDir) {
    const updatedFiles = [];

    // Handle added tokens
    for (const [path, tokens] of Object.entries(changes.added)) {
      const filePath = this.resolveOutputPath(path, outputDir);
      await this.updateTokenFile(filePath, tokens, 'add');
      updatedFiles.push(filePath);
    }

    // Handle modified tokens
    for (const [path, tokens] of Object.entries(changes.modified)) {
      const filePath = this.resolveOutputPath(path, outputDir);
      await this.updateTokenFile(filePath, tokens, 'modify');
      updatedFiles.push(filePath);
    }

    // Handle removed tokens
    for (const [path] of Object.entries(changes.removed)) {
      const filePath = this.resolveOutputPath(path, outputDir);
      await this.updateTokenFile(filePath, null, 'remove');
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
   * Update token file
   */
  async updateTokenFile(filePath, tokens, operation) {
    switch (operation) {
      case 'add':
      case 'modify':
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeJson(filePath, tokens, { spaces: 4 });
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
    const configPath = path.join(__dirname, 'config', 'mapping.json');
    const mappingConfig = await loadMappingConfig(configPath);
    
    const transformer = new TokenTransformer(mappingConfig);
    
    // Read input file (generated by figma-sync.js)
    const changesPath = path.join(__dirname, '..', 'figma-changes.json');
    
    if (!await fs.pathExists(changesPath)) {
      console.log('No changes file found. Please run figma-sync.js first.');
      return;
    }

    const changesData = await fs.readJson(changesPath);
    const { figmaTokens, changes } = changesData;

    console.log('🔄 Starting token transformation...');

    // Transform for each platform
    const platforms = ['web', 'webos', 'mobile'];
    const allUpdatedFiles = [];

    for (const platform of platforms) {
      console.log(`📱 Transforming tokens for ${platform} platform...`);
      
      const transformedTokens = transformer.transformTokens(figmaTokens, platform);
      const outputDir = path.join(__dirname, '..');
      
      const updatedFiles = await transformer.generateOutputFiles(transformedTokens, outputDir);
      allUpdatedFiles.push(...updatedFiles);
      
      console.log(`✅ ${platform} platform completed (${updatedFiles.length} files)`);
    }

    console.log('🎉 All platform token transformations completed!');
    console.log(`Total ${allUpdatedFiles.length} files updated.`);

    // Save updated files list
    const manifestPath = path.join(__dirname, '..', 'token-update-manifest.json');
    await fs.writeJson(manifestPath, {
      timestamp: new Date().toISOString(),
      updatedFiles: allUpdatedFiles,
      platforms
    }, { spaces: 2 });

  } catch (error) {
    console.error('❌ Token transformation failed:', error);
    process.exit(1);
  }
}

// Call main function only when script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  TokenTransformer,
  loadMappingConfig,
  getDefaultMappingConfig
};
