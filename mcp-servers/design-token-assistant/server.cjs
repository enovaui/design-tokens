#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const fs = require('fs-extra');
const path = require('path');

// 간단한 Design Token MCP 서버
class DesignTokenMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "design-token-assistant",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tokenCache = new Map();
    this.setupToolHandlers();
    this.loadTokenCache();
  }

  async loadTokenCache() {
    try {
      const packagesDir = path.join(__dirname, "../../packages");
      const packages = await fs.readdir(packagesDir);
      
      for (const pkg of packages) {
        const jsonDir = path.join(packagesDir, pkg, "json");
        if (await fs.pathExists(jsonDir)) {
          const files = await fs.readdir(jsonDir);
          for (const file of files) {
            if (file.endsWith('.json')) {
              const content = await fs.readJson(path.join(jsonDir, file));
              this.tokenCache.set(`${pkg}/${file}`, content);
            }
          }
        }
      }
      console.error(`[MCP] Loaded ${this.tokenCache.size} token files`);
    } catch (error) {
      console.error("[MCP] Failed to load token cache:", error);
    }
  }

  setupToolHandlers() {
    // 사용 가능한 도구들 목록 제공
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_design_tokens",
          description: "Search for design tokens by name or value",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search term for token name or value"
              },
              category: {
                type: "string",
                enum: ["color", "typography", "spacing", "all"],
                description: "Filter by token category",
                default: "all"
              }
            },
            required: ["query"]
          }
        },
        {
          name: "get_token_usage",
          description: "Get usage examples for a specific design token",
          inputSchema: {
            type: "object",
            properties: {
              tokenName: {
                type: "string",
                description: "The exact token name to get usage for"
              }
            },
            required: ["tokenName"]
          }
        },
        {
          name: "list_token_packages",
          description: "List all available design token packages",
          inputSchema: {
            type: "object",
            properties: {}
          }
        }
      ]
    }));

    // 도구 실행 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "search_design_tokens":
            return await this.searchTokens(args);
          case "get_token_usage":
            return await this.getTokenUsage(args);
          case "list_token_packages":
            return await this.listPackages(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async searchTokens(args) {
    const { query, category = "all" } = args;
    const results = [];

    for (const [packageFile, tokens] of this.tokenCache.entries()) {
      const [packageName] = packageFile.split('/');
      this.searchInObject(tokens, query, category, packageName, results);
    }

    const limitedResults = results.slice(0, 10);
    
    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} tokens matching "${query}":\n\n` +
                limitedResults.map((token, index) => 
                  `${index + 1}. **${token.name}**\n` +
                  `   Package: ${token.package}\n` +
                  `   Value: ${token.value}\n` +
                  `   CSS: \`var(--${token.name.replace(/\./g, '-')})\`\n`
                ).join('\n') +
                (results.length > 10 ? `\n... and ${results.length - 10} more tokens` : '')
        }
      ]
    };
  }

  searchInObject(obj, query, category, packageName, results, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        const tokenCategory = this.inferTokenCategory(currentPath);
        
        if (
          (category === "all" || tokenCategory === category) &&
          (currentPath.toLowerCase().includes(query.toLowerCase()) ||
           value.toLowerCase().includes(query.toLowerCase()))
        ) {
          results.push({
            name: currentPath,
            value: value,
            package: packageName,
            category: tokenCategory
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        this.searchInObject(value, query, category, packageName, results, currentPath);
      }
    }
  }

  inferTokenCategory(tokenName) {
    if (tokenName.includes('color') || tokenName.includes('background')) {
      return 'color';
    }
    if (tokenName.includes('font') || tokenName.includes('text') || tokenName.includes('size')) {
      return 'typography';
    }
    if (tokenName.includes('spacing') || tokenName.includes('margin') || tokenName.includes('padding')) {
      return 'spacing';
    }
    return 'other';
  }

  async getTokenUsage(args) {
    const { tokenName } = args;
    
    let tokenData = null;
    let packageName = "";
    
    for (const [packageFile, tokens] of this.tokenCache.entries()) {
      const found = this.findTokenInObject(tokens, tokenName);
      if (found) {
        tokenData = found;
        packageName = packageFile.split('/')[0];
        break;
      }
    }

    if (!tokenData) {
      return {
        content: [
          {
            type: "text",
            text: `Token "${tokenName}" not found in any package.`
          }
        ]
      };
    }

    const category = this.inferTokenCategory(tokenName);
    const cssVar = `--${tokenName.replace(/\./g, '-')}`;
    
    return {
      content: [
        {
          type: "text",
          text: `## ${tokenName}\n\n` +
                `**Package:** ${packageName}\n` +
                `**Value:** ${tokenData}\n` +
                `**Category:** ${category}\n\n` +
                `### Usage Examples:\n\n` +
                `**CSS:**\n` +
                `\`\`\`css\n` +
                `.my-element {\n` +
                `  ${category === 'color' ? 'background-color' : 'property'}: var(${cssVar});\n` +
                `}\n` +
                `\`\`\`\n\n` +
                `**SCSS:**\n` +
                `\`\`\`scss\n` +
                `$${tokenName.replace(/\./g, '-')}: var(${cssVar});\n` +
                `\`\`\`\n\n` +
                `**JavaScript:**\n` +
                `\`\`\`js\n` +
                `const tokenValue = 'var(${cssVar})';\n` +
                `\`\`\``
        }
      ]
    };
  }

  findTokenInObject(obj, tokenName, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (currentPath === tokenName && typeof value === 'string') {
        return value;
      }
      
      if (typeof value === 'object' && value !== null) {
        const result = this.findTokenInObject(value, tokenName, currentPath);
        if (result) return result;
      }
    }
    return null;
  }

  async listPackages() {
    const packages = new Set();
    for (const packageFile of this.tokenCache.keys()) {
      packages.add(packageFile.split('/')[0]);
    }
    
    return {
      content: [
        {
          type: "text",
          text: `## Available Design Token Packages\n\n` +
                Array.from(packages).map(pkg => `• **${pkg}**`).join('\n') +
                `\n\nTotal: ${packages.size} packages with ${this.tokenCache.size} token files loaded.`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[MCP] Design Token Assistant server started");
  }
}

// 서버 시작
if (require.main === module) {
  const server = new DesignTokenMCPServer();
  server.run().catch(console.error);
}

module.exports = DesignTokenMCPServer;
