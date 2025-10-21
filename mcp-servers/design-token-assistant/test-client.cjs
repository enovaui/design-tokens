#!/usr/bin/env node

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const { spawn } = require("child_process");

/**
 * MCP 클라이언트 테스트 도구
 * AI 에이전트가 MCP 서버와 어떻게 소통하는지 시뮬레이션
 */
class MCPClientTest {
  constructor() {
    this.client = null;
  }

  async connect() {
    console.log("🔗 MCP 서버에 연결 중...");
    
    // MCP 서버 프로세스 시작
    const serverProcess = spawn("node", [
      "src/server.cjs"
    ], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "inherit"] // stdin, stdout은 파이프, stderr는 콘솔
    });

    // 클라이언트 생성 및 연결
    this.client = new Client(
      {
        name: "test-client",
        version: "1.0.0"
      },
      {
        capabilities: {}
      }
    );

    const transport = new StdioClientTransport({
      readable: serverProcess.stdout,
      writable: serverProcess.stdin
    });

    await this.client.connect(transport);
    console.log("✅ MCP 서버 연결 완료!");
    
    return serverProcess;
  }

  async listTools() {
    console.log("\n📋 사용 가능한 도구들:");
    const result = await this.client.listTools();
    
    result.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   📝 ${tool.description}`);
    });
    
    return result.tools;
  }

  async testTokenSearch(query) {
    console.log(`\n🔍 토큰 검색: "${query}"`);
    
    const result = await this.client.callTool({
      name: "search_design_tokens",
      arguments: {
        query,
        limit: 5
      }
    });

    const data = JSON.parse(result.content[0].text);
    console.log(`📊 결과: ${data.showing}개 표시 (총 ${data.totalFound}개 발견)`);
    
    data.tokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.name}`);
      console.log(`   🎨 값: ${token.value}`);
      console.log(`   📦 패키지: ${token.package}`);
      console.log(`   💻 CSS: ${token.cssVar}`);
      console.log(`   📝 사용법: ${token.usage}`);
      console.log("");
    });
  }

  async testTokenUsage(tokenName) {
    console.log(`\n📖 토큰 사용법: "${tokenName}"`);
    
    const result = await this.client.callTool({
      name: "get_token_usage_guide",
      arguments: {
        tokenName
      }
    });

    const data = JSON.parse(result.content[0].text);
    console.log("📋 상세 가이드:");
    console.log(`   🏷️  토큰: ${data.token}`);
    console.log(`   🎨 값: ${data.value}`);
    console.log(`   📦 패키지: ${data.package}`);
    console.log(`   📂 카테고리: ${data.category}`);
    console.log(`   💻 CSS: ${data.css.variable}`);
    console.log(`   📱 SCSS: ${data.scss}`);
    console.log(`   🔧 JS: ${data.javascript}`);
    
    console.log("   📝 예시:");
    data.css.examples.forEach(example => {
      console.log(`      ${example}`);
    });
  }

  async testValidation(tokenName, context) {
    console.log(`\n✅ 유효성 검증: "${tokenName}" in "${context}"`);
    
    const result = await this.client.callTool({
      name: "validate_token_usage",
      arguments: {
        tokenName,
        context
      }
    });

    const data = JSON.parse(result.content[0].text);
    console.log(`📊 유효성: ${data.isValid ? "✅ 유효" : "❌ 문제 있음"}`);
    
    if (data.warnings.length > 0) {
      console.log("⚠️  경고:");
      data.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    if (data.suggestions.length > 0) {
      console.log("💡 제안:");
      data.suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
    }
  }

  async testRecommendations(componentType, platform) {
    console.log(`\n🎯 디자인 추천: ${componentType} (${platform})`);
    
    const result = await this.client.callTool({
      name: "get_design_recommendations",
      arguments: {
        componentType,
        platform
      }
    });

    const data = JSON.parse(result.content[0].text);
    console.log("🏆 추천 토큰들:");
    data.recommendedTokens.forEach(token => console.log(`   • ${token}`));
    
    console.log("📋 패턴:");
    data.patterns.forEach(pattern => console.log(`   • ${pattern}`));
    
    console.log("💻 예시:");
    data.examples.forEach(example => console.log(`   ${example}`));
  }
}

// 테스트 실행
async function runTests() {
  const testClient = new MCPClientTest();
  
  try {
    // 서버 연결
    const serverProcess = await testClient.connect();
    
    // 잠시 대기 (서버 초기화)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 테스트 시나리오들
    await testClient.listTools();
    await testClient.testTokenSearch("button");
    await testClient.testTokenUsage("primitive.color.white");
    await testClient.testValidation("primitive.color.white", "background-color");
    await testClient.testRecommendations("button", "web");
    
    console.log("\n🎉 모든 테스트 완료!");
    
    // 서버 종료
    serverProcess.kill();
    
  } catch (error) {
    console.error("❌ 테스트 실패:", error);
  }
}

// CLI에서 실행
if (require.main === module) {
  runTests();
}

module.exports = MCPClientTest;
