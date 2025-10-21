import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Design Token MCP Server for Enhanced Developer Experience
class DesignTokenMCPServer {
  private server: Server;
  private tokenCache: Map<string, any> = new Map();

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

    this.setupToolHandlers();
    this.loadTokenCache();
  }

  private async loadTokenCache() {
    try {
      const packagesDir = path.join(__dirname, "../../../packages");
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

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_tokens",
          description: "Search for design tokens by name, value, or usage context",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query for token name or value"
              },
              category: {
                type: "string",
                enum: ["color", "typography", "spacing", "elevation", "all"],
                description: "Filter by token category"
              },
              platform: {
                type: "string",
                enum: ["core", "webos", "web", "mobile", "all"],
                description: "Filter by platform"
              }
            },
            required: ["query"]
          }
        },
        {
          name: "get_token_usage",
          description: "Get usage examples and documentation for a specific token",
          inputSchema: {
            type: "object",
            properties: {
              tokenName: {
                type: "string",
                description: "The exact token name to look up"
              }
            },
            required: ["tokenName"]
          }
        },
        {
          name: "validate_token_usage",
          description: "Validate if a token is being used correctly in given context",
          inputSchema: {
            type: "object",
            properties: {
              tokenName: {
                type: "string",
                description: "Token name to validate"
              },
              context: {
                type: "string",
                description: "Usage context (e.g., 'background-color', 'font-size')"
              },
              component: {
                type: "string",
                description: "Component type using the token"
              }
            },
            required: ["tokenName", "context"]
          }
        },
        {
          name: "generate_token_migration",
          description: "Generate migration guide for deprecated tokens",
          inputSchema: {
            type: "object",
            properties: {
              oldToken: {
                type: "string",
                description: "Deprecated token name"
              },
              newToken: {
                type: "string",
                description: "New replacement token name"
              }
            },
            required: ["oldToken"]
          }
        },
        {
          name: "analyze_figma_changes",
          description: "Analyze recent Figma changes and their impact on tokens",
          inputSchema: {
            type: "object",
            properties: {
              since: {
                type: "string",
                description: "Date to analyze changes since (YYYY-MM-DD)"
              }
            }
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "search_tokens":
          return await this.searchTokens(args);
        case "get_token_usage":
          return await this.getTokenUsage(args);
        case "validate_token_usage":
          return await this.validateTokenUsage(args);
        case "generate_token_migration":
          return await this.generateTokenMigration(args);
        case "analyze_figma_changes":
          return await this.analyzeFigmaChanges(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async searchTokens(args: any) {
    const { query, category = "all", platform = "all" } = args;
    const results: any[] = [];

    for (const [key, tokens] of this.tokenCache.entries()) {
      const [pkg] = key.split('/');
      
      if (platform !== "all" && !pkg.includes(platform)) continue;

      this.searchInTokenObject(tokens, query, category, pkg, results);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            query,
            results: results.slice(0, 20), // Limit results
            total: results.length
          }, null, 2)
        }
      ]
    };
  }

  private searchInTokenObject(obj: any, query: string, category: string, pkg: string, results: any[], path: string = "") {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === "object" && value !== null) {
        if (value.value !== undefined) {
          // This is a token
          const tokenName = currentPath;
          const tokenValue = value.value;
          const tokenCategory = this.inferTokenCategory(tokenName);

          if (
            (category === "all" || tokenCategory === category) &&
            (tokenName.toLowerCase().includes(query.toLowerCase()) ||
             String(tokenValue).toLowerCase().includes(query.toLowerCase()))
          ) {
            results.push({
              name: tokenName,
              value: tokenValue,
              category: tokenCategory,
              package: pkg,
              description: value.description || "",
              type: value.type || "unknown"
            });
          }
        } else {
          // Recurse into nested objects
          this.searchInTokenObject(value, query, category, pkg, results, currentPath);
        }
      }
    }
  }

  private inferTokenCategory(tokenName: string): string {
    if (tokenName.includes("color") || tokenName.includes("background") || tokenName.includes("border")) {
      return "color";
    }
    if (tokenName.includes("font") || tokenName.includes("text") || tokenName.includes("size")) {
      return "typography";
    }
    if (tokenName.includes("spacing") || tokenName.includes("margin") || tokenName.includes("padding")) {
      return "spacing";
    }
    if (tokenName.includes("shadow") || tokenName.includes("elevation")) {
      return "elevation";
    }
    return "other";
  }

  private async getTokenUsage(args: any) {
    const { tokenName } = args;
    
    // Search for the token across all packages
    let tokenData = null;
    let packageName = "";
    
    for (const [key, tokens] of this.tokenCache.entries()) {
      const found = this.findTokenInObject(tokens, tokenName);
      if (found) {
        tokenData = found;
        packageName = key.split('/')[0];
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

    const usage = this.generateUsageExamples(tokenName, tokenData, packageName);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(usage, null, 2)
        }
      ]
    };
  }

  private findTokenInObject(obj: any, tokenName: string, path: string = ""): any {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (currentPath === tokenName && typeof value === "object" && value.value !== undefined) {
        return value;
      }
      
      if (typeof value === "object" && value !== null && value.value === undefined) {
        const result = this.findTokenInObject(value, tokenName, currentPath);
        if (result) return result;
      }
    }
    return null;
  }

  private generateUsageExamples(tokenName: string, tokenData: any, packageName: string) {
    const category = this.inferTokenCategory(tokenName);
    
    return {
      token: tokenName,
      package: packageName,
      value: tokenData.value,
      type: tokenData.type,
      category,
      description: tokenData.description || "",
      usage: {
        css: `var(--${tokenName.replace(/\./g, '-')})`,
        scss: `$${tokenName.replace(/\./g, '-')}`,
        js: `tokens.${tokenName}`,
        examples: this.getCategoryExamples(category, tokenName)
      },
      relatedTokens: this.findRelatedTokens(tokenName, category)
    };
  }

  private getCategoryExamples(category: string, tokenName: string): string[] {
    switch (category) {
      case "color":
        return [
          `.my-component { background-color: var(--${tokenName.replace(/\./g, '-')}); }`,
          `.my-component { color: var(--${tokenName.replace(/\./g, '-')}); }`,
          `.my-component { border-color: var(--${tokenName.replace(/\./g, '-')}); }`
        ];
      case "typography":
        return [
          `.my-text { font-size: var(--${tokenName.replace(/\./g, '-')}); }`,
          `.my-heading { font-weight: var(--${tokenName.replace(/\./g, '-')}); }`
        ];
      case "spacing":
        return [
          `.my-component { margin: var(--${tokenName.replace(/\./g, '-')}); }`,
          `.my-component { padding: var(--${tokenName.replace(/\./g, '-')}); }`,
          `.my-component { gap: var(--${tokenName.replace(/\./g, '-')}); }`
        ];
      default:
        return [
          `.my-component { /* property */: var(--${tokenName.replace(/\./g, '-')}); }`
        ];
    }
  }

  private findRelatedTokens(tokenName: string, category: string): string[] {
    const related: string[] = [];
    const tokenParts = tokenName.split('.');
    
    for (const [, tokens] of this.tokenCache.entries()) {
      this.findRelatedInObject(tokens, tokenParts, category, related);
    }
    
    return related.slice(0, 5); // Limit to 5 related tokens
  }

  private findRelatedInObject(obj: any, tokenParts: string[], category: string, related: string[], path: string = "") {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === "object" && value !== null) {
        if (value.value !== undefined) {
          const currentCategory = this.inferTokenCategory(currentPath);
          if (currentCategory === category && this.hasCommonParts(currentPath.split('.'), tokenParts)) {
            related.push(currentPath);
          }
        } else {
          this.findRelatedInObject(value, tokenParts, category, related, currentPath);
        }
      }
    }
  }

  private hasCommonParts(path1: string[], path2: string[]): boolean {
    return path1.some(part => path2.includes(part));
  }

  private async validateTokenUsage(args: any) {
    const { tokenName, context, component } = args;
    
    const validation = {
      isValid: true,
      warnings: [],
      suggestions: [],
      bestPractices: []
    };

    // Add validation logic here
    if (context === "background-color" && !tokenName.includes("background")) {
      validation.warnings.push("Consider using a background-specific token for background colors");
    }

    if (component && tokenName.includes("button") && component !== "button") {
      validation.warnings.push(`Using button-specific token in ${component} component`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(validation, null, 2)
        }
      ]
    };
  }

  private async generateTokenMigration(args: any) {
    const { oldToken, newToken } = args;
    
    const migration = {
      from: oldToken,
      to: newToken || "TBD",
      steps: [
        "1. Update CSS custom properties",
        "2. Update SCSS variables", 
        "3. Update JavaScript imports",
        "4. Test visual regression",
        "5. Update documentation"
      ],
      codeExamples: {
        before: `var(--${oldToken?.replace(/\./g, '-')})`,
        after: newToken ? `var(--${newToken.replace(/\./g, '-')})` : "/* New token TBD */"
      }
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(migration, null, 2)
        }
      ]
    };
  }

  private async analyzeFigmaChanges(args: any) {
    try {
      const changesFile = path.join(__dirname, "../../figma-changes.json");
      let changes = {};
      
      if (await fs.pathExists(changesFile)) {
        changes = await fs.readJson(changesFile);
      }

      const analysis = {
        totalChanges: Object.keys(changes).length,
        changes,
        recommendations: [
          "Review color contrast ratios",
          "Validate typography scale consistency", 
          "Check component token mappings",
          "Update documentation"
        ]
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysis, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error analyzing Figma changes: ${error.message}`
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start the server
const server = new DesignTokenMCPServer();
server.run().catch(console.error);
