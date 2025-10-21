#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const fs = require("fs-extra");
const path = require("path");

// Design Token MCP Server for AI Agents
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
      // stderr에 로그 출력 (MCP 프로토콜에서는 stdout은 통신용)
      console.error(`[MCP] Loaded ${this.tokenCache.size} token files`);
    } catch (error) {
      console.error("[MCP] Failed to load token cache:", error);
    }
  }

  setupToolHandlers() {
    // AI 에이전트에게 사용 가능한 도구들을 알려줌
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_design_tokens",
          description: "Search for design tokens by name, value, or category. Returns matching tokens with usage examples.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query for token name or value (e.g., 'button', 'color', 'white')"
              },
              category: {
                type: "string",
                enum: ["color", "typography", "spacing", "radius", "all"],
                description: "Filter by token category",
                default: "all"
              },
              platform: {
                type: "string",
                enum: ["core", "webos", "web", "mobile", "all"],
                description: "Filter by platform",
                default: "all"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return",
                default: 10
              }
            },
            required: ["query"]
          }
        },
        {
          name: "get_token_usage_guide",
          description: "Get detailed usage examples and best practices for a specific token",
          inputSchema: {
            type: "object",
            properties: {
              tokenName: {
                type: "string",
                description: "The exact token name to look up (e.g., 'primitive.color.white')"
              }
            },
            required: ["tokenName"]
          }
        },
        {
          name: "validate_token_usage",
          description: "Validate if a token is being used correctly in a given context",
          inputSchema: {
            type: "object",
            properties: {
              tokenName: {
                type: "string",
                description: "Token name to validate"
              },
              context: {
                type: "string",
                description: "Usage context (e.g., 'background-color', 'font-size', 'padding')"
              },
              component: {
                type: "string",
                description: "Component type using the token (optional)"
              }
            },
            required: ["tokenName", "context"]
          }
        },
        {
          name: "get_design_recommendations",
          description: "Get design system recommendations based on current usage patterns",
          inputSchema: {
            type: "object",
            properties: {
              componentType: {
                type: "string",
                description: "Type of component being designed (e.g., 'button', 'card', 'form')"
              },
              platform: {
                type: "string",
                enum: ["web", "mobile", "webos"],
                description: "Target platform"
              }
            },
            required: ["componentType"]
          }
        }
      ]
    }));

    // AI 에이전트가 도구를 호출할 때 실행되는 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "search_design_tokens":
            return await this.searchTokens(args);
          case "get_token_usage_guide":
            return await this.getTokenUsage(args);
          case "validate_token_usage":
            return await this.validateTokenUsage(args);
          case "get_design_recommendations":
            return await this.getDesignRecommendations(args);
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
    const { query, category = "all", platform = "all", limit = 10 } = args;
    const results = [];

    console.error(`[MCP] Searching for tokens with query: "${query}"`);

    for (const [key, tokens] of this.tokenCache.entries()) {
      const [pkg] = key.split('/');
      
      if (platform !== "all" && !pkg.includes(platform)) continue;

      this.searchInTokenObject(tokens, query, category, pkg, results);
    }

    const limitedResults = results.slice(0, limit);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            query,
            totalFound: results.length,
            showing: limitedResults.length,
            tokens: limitedResults.map(token => ({
              name: token.name,
              value: token.value,
              package: token.package,
              category: token.category,
              cssVar: `var(--${token.name.replace(/\./g, '-')})`,
              usage: this.generateBasicUsage(token.name, token.category)
            }))
          }, null, 2)
        }
      ]
    };
  }

  searchInTokenObject(obj, query, category, pkg, results, path = "") {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === "string") {
        const tokenCategory = this.inferTokenCategory(currentPath);
        
        if (
          (category === "all" || tokenCategory === category) &&
          (currentPath.toLowerCase().includes(query.toLowerCase()) ||
           value.toLowerCase().includes(query.toLowerCase()))
        ) {
          results.push({
            name: currentPath,
            value: value,
            category: tokenCategory,
            package: pkg
          });
        }
      } else if (typeof value === "object" && value !== null) {
        this.searchInTokenObject(value, query, category, pkg, results, currentPath);
      }
    }
  }

  async getTokenUsage(args) {
    const { tokenName } = args;
    
    console.error(`[MCP] Getting usage guide for token: "${tokenName}"`);
    
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
            text: `Token "${tokenName}" not found. Try searching for similar tokens first.`
          }
        ]
      };
    }

    const category = this.inferTokenCategory(tokenName);
    const usage = this.generateDetailedUsage(tokenName, tokenData, category, packageName);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(usage, null, 2)
        }
      ]
    };
  }

  async validateTokenUsage(args) {
    const { tokenName, context, component } = args;
    
    console.error(`[MCP] Validating token usage: "${tokenName}" in context "${context}"`);
    
    const validation = {
      isValid: true,
      warnings: [],
      suggestions: [],
      bestPractices: []
    };

    // 기본 유효성 검사 로직
    if (context === "background-color" && !tokenName.includes("background") && !tokenName.includes("surface")) {
      validation.warnings.push("Consider using a background or surface token for background colors");
      validation.suggestions.push("Look for tokens containing 'background' or 'surface'");
    }

    if (context === "color" && tokenName.includes("background")) {
      validation.warnings.push("Using background token for text color may cause contrast issues");
      validation.suggestions.push("Look for tokens containing 'on-surface' or 'text'");
    }

    if (component && tokenName.includes("button") && component !== "button") {
      validation.warnings.push(`Using button-specific token in ${component} component`);
      validation.suggestions.push(`Consider using ${component}-specific tokens if available`);
    }

    // 베스트 프랙티스 추가
    validation.bestPractices.push("Always use semantic tokens over primitive tokens when possible");
    validation.bestPractices.push("Ensure sufficient color contrast for accessibility");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(validation, null, 2)
        }
      ]
    };
  }

  async getDesignRecommendations(args) {
    const { componentType, platform = "web" } = args;
    
    console.error(`[MCP] Getting design recommendations for ${componentType} on ${platform}`);
    
    const recommendations = {
      componentType,
      platform,
      recommendedTokens: [],
      patterns: [],
      examples: []
    };

    // 컴포넌트별 추천 토큰
    if (componentType === "button") {
      recommendations.recommendedTokens = [
        "semantic.color.surface.button-primary",
        "semantic.color.surface.button-secondary", 
        "semantic.color.on.surface.button",
        "primitive.radius.4",
        "primitive.spacing.3"
      ];
      
      recommendations.patterns = [
        "Use semantic button tokens for consistent theming",
        "Apply hover/focus states with corresponding tokens",
        "Maintain consistent padding across button sizes"
      ];

      recommendations.examples = [
        ".primary-button { background-color: var(--semantic-color-surface-button-primary); }",
        ".primary-button:hover { background-color: var(--semantic-color-surface-button-primary-hover); }"
      ];
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(recommendations, null, 2)
        }
      ]
    };
  }

  // 유틸리티 메서드들
  findTokenInObject(obj, tokenName, path = "") {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (currentPath === tokenName && typeof value === "string") {
        return value;
      }
      
      if (typeof value === "object" && value !== null) {
        const result = this.findTokenInObject(value, tokenName, currentPath);
        if (result) return result;
      }
    }
    return null;
  }

  inferTokenCategory(tokenName) {
    if (tokenName.includes("color") || tokenName.includes("background") || tokenName.includes("surface")) {
      return "color";
    }
    if (tokenName.includes("font") || tokenName.includes("text") || tokenName.includes("size")) {
      return "typography";
    }
    if (tokenName.includes("spacing") || tokenName.includes("margin") || tokenName.includes("padding")) {
      return "spacing";
    }
    if (tokenName.includes("radius")) {
      return "radius";
    }
    return "other";
  }

  generateBasicUsage(tokenName, category) {
    const cssVar = `--${tokenName.replace(/\./g, '-')}`;
    
    switch (category) {
      case "color":
        return `background-color: var(${cssVar});`;
      case "typography":
        return `font-size: var(${cssVar});`;
      case "spacing":
        return `padding: var(${cssVar});`;
      case "radius":
        return `border-radius: var(${cssVar});`;
      default:
        return `/* property */: var(${cssVar});`;
    }
  }

  generateDetailedUsage(tokenName, tokenValue, category, packageName) {
    const cssVar = `--${tokenName.replace(/\./g, '-')}`;
    
    return {
      token: tokenName,
      value: tokenValue,
      package: packageName,
      category,
      css: {
        variable: `var(${cssVar})`,
        examples: this.getCategoryExamples(category, cssVar)
      },
      scss: `$${tokenName.replace(/\./g, '-')}: var(${cssVar});`,
      javascript: `const tokenValue = 'var(${cssVar})';`,
      bestPractices: this.getBestPractices(category)
    };
  }

  getCategoryExamples(category, cssVar) {
    switch (category) {
      case "color":
        return [
          `.component { background-color: var(${cssVar}); }`,
          `.component { color: var(${cssVar}); }`,
          `.component { border-color: var(${cssVar}); }`
        ];
      case "typography":
        return [
          `.text { font-size: var(${cssVar}); }`,
          `.heading { font-weight: var(${cssVar}); }`
        ];
      case "spacing":
        return [
          `.component { padding: var(${cssVar}); }`,
          `.component { margin: var(${cssVar}); }`,
          `.component { gap: var(${cssVar}); }`
        ];
      case "radius":
        return [
          `.component { border-radius: var(${cssVar}); }`
        ];
      default:
        return [
          `.component { /* property */: var(${cssVar}); }`
        ];
    }
  }

  getBestPractices(category) {
    const common = [
      "Use semantic tokens over primitive tokens when possible",
      "Test across different themes (light/dark)"
    ];

    switch (category) {
      case "color":
        return [...common, "Ensure WCAG AA contrast compliance", "Use appropriate color roles (surface, on-surface, etc.)"];
      case "typography":
        return [...common, "Maintain consistent line-height", "Consider responsive typography"];
      case "spacing":
        return [...common, "Use consistent spacing scale", "Consider responsive spacing"];
      default:
        return common;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[MCP] Design Token Assistant server started");
  }
}

// 서버 시작
const server = new DesignTokenMCPServer();
server.run().catch(console.error);
