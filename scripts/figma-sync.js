#!/usr/bin/env node

/**
 * Figma Variables API Client
 * Reads Variables from Figma design files, compares with local tokens, and detects changes.
 */

const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

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

      // Set value (use first mode value)
      const modeId = Object.keys(variable.valuesByMode)[0];
      const value = variable.valuesByMode[modeId];
      
      current[tokenPath[tokenPath.length - 1]] = this.formatVariableValue(value, variable.resolvedType);
    });

    return formattedTokens;
  }

  /**
   * Format Variable value based on type
   */
  formatVariableValue(value, type) {
    switch (type) {
      case 'COLOR':
        if (value.r !== undefined) {
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
 * Analyze differences between Figma and local tokens
 */
function analyzeChanges(figmaTokens, localTokens) {
  const changes = {
    added: {},
    modified: {},
    removed: {},
    unchanged: {}
  };

  // TODO: Implement actual difference analysis logic
  // Currently only provides basic structure

  console.log('Analyzing changes...');
  console.log('Number of Figma token collections:', Object.keys(figmaTokens).length);
  console.log('Number of local packages:', Object.keys(localTokens).length);

  return changes;
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
      }, { spaces: 2 });
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
