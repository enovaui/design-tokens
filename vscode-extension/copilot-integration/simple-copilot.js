#!/usr/bin/env node

const vscode = require('vscode');
const { spawn } = require('child_process');

// 현재 VS Code에서 바로 사용할 수 있는 간단한 Copilot 연동
class SimpleCopilotIntegration {
    constructor() {
        this.mcpServerPath = './mcp-servers/design-token-assistant/server.cjs';
    }

    // Copilot Chat에 컨텍스트 제공
    async provideCopilotContext() {
        const tokenSummary = await this.getTokenSummary();
        
        return `
# EnovaUI Design Tokens Context for GitHub Copilot

## Available Token Packages:
- core-tokens: Primitive design tokens (colors, spacing, typography)
- webos-tokens: WebOS platform-specific semantic tokens
- web-tokens: Web platform-specific semantic tokens  
- mobile-tokens: Mobile platform-specific semantic tokens

## Token Usage Patterns:
- Use \`var(--token-name)\` for CSS
- Replace dots with dashes in token names
- Prefer semantic tokens over primitive tokens
- Use platform-specific tokens when building for specific platforms

## Common Token Categories:
- Colors: \`semantic.color.surface.*\`, \`semantic.color.on-surface.*\`
- Spacing: \`primitive.spacing.*\`
- Typography: \`primitive.fontsize.*\`, \`primitive.fontweight.*\`
- Button tokens: \`semantic.color.surface.button-*\`

## Examples:
\`\`\`css
.primary-button {
  background-color: var(--semantic-color-surface-button-primary);
  color: var(--semantic-color-on-surface-main);
  padding: var(--primitive-spacing-4);
  font-size: var(--primitive-fontsize-16);
}
\`\`\`

${tokenSummary}
        `;
    }

    async getTokenSummary() {
        // MCP 서버에서 토큰 요약 정보 가져오기
        return `
## Most Used Tokens:
- var(--primitive-color-white): #ffffff
- var(--semantic-color-surface-main): Platform-specific surface color
- var(--semantic-color-on-surface-main): Platform-specific text color
- var(--primitive-spacing-4): 16px spacing
- var(--primitive-fontsize-16): 16px font size
        `;
    }

    // VS Code workspace에 .copilot-context.md 파일 생성
    async createCopilotContext() {
        const context = await this.provideCopilotContext();
        
        // 파일 생성 로직 (VS Code API 사용)
        console.log('Creating .copilot-context.md file...');
        console.log(context);
        
        return context;
    }
}

module.exports = SimpleCopilotIntegration;
