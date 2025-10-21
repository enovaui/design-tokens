#!/usr/bin/env node

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const { spawn } = require('child_process');

// MCP 클라이언트 - AI 에이전트 시뮬레이션
class MCPTestClient {
  constructor() {
    this.client = null;
    this.serverProcess = null;
  }

  async connect() {
    console.log("🔗 MCP 서버에 연결 중...");
    
    // MCP 서버 프로세스 시작
    this.serverProcess = spawn('node', ['./server.cjs'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname
    });

    // 클라이언트 생성 및 연결
    const transport = new StdioClientTransport({
      readable: this.serverProcess.stdout,
      writable: this.serverProcess.stdin
    });

    this.client = new Client(
      {
        name: "design-token-test-client",
        version: "1.0.0"
      },
      {
        capabilities: {}
      }
    );

    await this.client.connect(transport);
    
    console.log("✅ MCP 서버 연결 성공!");
    
    // 서버 에러 출력
    this.serverProcess.stderr.on('data', (data) => {
      console.log(`[MCP Server] ${data.toString().trim()}`);
    });
  }

  async listTools() {
    console.log("\n📋 사용 가능한 도구들:");
    
    const response = await this.client.listTools();
    response.tools.forEach((tool, index) => {
      console.log(`${index + 1}. **${tool.name}**`);
      console.log(`   ${tool.description}`);
    });
    
    return response.tools;
  }

  async searchTokens(query, category = "all") {
    console.log(`\n🔍 토큰 검색: "${query}" (카테고리: ${category})`);
    
    const response = await this.client.callTool({
      name: "search_design_tokens",
      arguments: { query, category }
    });

    console.log("\n📊 검색 결과:");
    response.content.forEach(content => {
      console.log(content.text);
    });
    
    return response;
  }

  async getTokenUsage(tokenName) {
    console.log(`\n📖 토큰 사용법: "${tokenName}"`);
    
    const response = await this.client.callTool({
      name: "get_token_usage",
      arguments: { tokenName }
    });

    console.log("\n💡 사용법 가이드:");
    response.content.forEach(content => {
      console.log(content.text);
    });
    
    return response;
  }

  async listPackages() {
    console.log(`\n📦 패키지 목록:`);
    
    const response = await this.client.callTool({
      name: "list_token_packages",
      arguments: {}
    });

    console.log("\n📋 사용 가능한 패키지들:");
    response.content.forEach(content => {
      console.log(content.text);
    });
    
    return response;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
    console.log("\n🔌 연결 종료");
  }

  // AI 에이전트 대화 시뮬레이션
  async simulateConversation() {
    console.log("\n🤖 AI 에이전트 대화 시뮬레이션 시작\n");
    
    try {
      await this.connect();
      
      // 1. 도구 목록 확인
      await this.listTools();
      
      // 2. 사용자 질문: "버튼 색상 토큰을 찾고 싶어요"
      console.log('\n👤 사용자: "버튼 색상 토큰을 찾고 싶어요"');
      console.log('🤖 AI: 버튼 관련 색상 토큰을 검색해드리겠습니다.');
      await this.searchTokens("button", "color");
      
      // 3. 사용자 질문: "primary button 토큰 사용법을 알려주세요"
      console.log('\n👤 사용자: "primary button 토큰 사용법을 알려주세요"');
      console.log('🤖 AI: primitive.color.active-red-50 토큰의 사용법을 확인해드리겠습니다.');
      await this.getTokenUsage("primitive.color.active-red-50");
      
      // 4. 사용자 질문: "어떤 패키지들이 있나요?"
      console.log('\n👤 사용자: "어떤 패키지들이 있나요?"');
      console.log('🤖 AI: 사용 가능한 디자인 토큰 패키지들을 확인해드리겠습니다.');
      await this.listPackages();
      
      // 5. 사용자 질문: "spacing 토큰을 찾아주세요"
      console.log('\n👤 사용자: "spacing 토큰을 찾아주세요"');
      console.log('🤖 AI: 스페이싱 관련 토큰들을 검색해드리겠습니다.');
      await this.searchTokens("spacing", "spacing");
      
    } catch (error) {
      console.error("❌ 에러:", error.message);
    } finally {
      await this.disconnect();
    }
  }
}

// CLI 실행
async function main() {
  const command = process.argv[2];
  const client = new MCPTestClient();

  switch (command) {
    case 'conversation':
      await client.simulateConversation();
      break;
      
    case 'search':
      const query = process.argv[3];
      if (!query) {
        console.log('사용법: node mcp-client.js search <검색어>');
        return;
      }
      try {
        await client.connect();
        await client.searchTokens(query);
        await client.disconnect();
      } catch (error) {
        console.error('❌ 에러:', error.message);
      }
      break;
      
    case 'usage':
      const tokenName = process.argv[3];
      if (!tokenName) {
        console.log('사용법: node mcp-client.js usage <토큰명>');
        return;
      }
      try {
        await client.connect();
        await client.getTokenUsage(tokenName);
        await client.disconnect();
      } catch (error) {
        console.error('❌ 에러:', error.message);
      }
      break;
      
    default:
      console.log(`
🤖 MCP 클라이언트 테스트 도구

사용법:
  node mcp-client.js conversation     # AI 에이전트 대화 시뮬레이션
  node mcp-client.js search <검색어>  # 토큰 검색
  node mcp-client.js usage <토큰명>   # 토큰 사용법

예시:
  node mcp-client.js conversation
  node mcp-client.js search "button"
  node mcp-client.js usage "primitive.color.white"
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MCPTestClient;
