#!/usr/bin/env node

const { spawn } = require('child_process');

// 간단한 MCP 서버 테스트
async function testMCPServer() {
  console.log("🤖 MCP 서버 ↔ AI 에이전트 소통 테스트\n");
  
  console.log("1️⃣ MCP 서버 시작...");
  
  const serverProcess = spawn('node', ['server.cjs'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: __dirname
  });

  // 서버 시작 대기
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("2️⃣ AI 에이전트가 MCP 서버에 요청을 보냅니다...\n");

  // MCP 프로토콜 메시지 시뮬레이션
  const requests = [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list"
    },
    {
      jsonrpc: "2.0", 
      id: 2,
      method: "tools/call",
      params: {
        name: "search_design_tokens",
        arguments: {
          query: "button",
          category: "color"
        }
      }
    }
  ];

  for (const request of requests) {
    console.log("📤 AI 에이전트 → MCP 서버:");
    console.log(`   ${request.method}`);
    if (request.params) {
      console.log(`   Arguments: ${JSON.stringify(request.params.arguments || {})}`);
    }
    
    // 메시지 전송
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
    
    // 응답 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 서버 출력 수집
  let serverOutput = '';
  serverProcess.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });

  serverProcess.stdout.on('data', (data) => {
    console.log("📥 MCP 서버 → AI 에이전트:");
    console.log(`   ${data.toString().trim()}\n`);
  });

  // 3초 후 종료
  setTimeout(() => {
    console.log("3️⃣ 서버 로그:");
    console.log(serverOutput);
    
    serverProcess.kill();
    console.log("\n✅ MCP 서버 테스트 완료!");
  }, 3000);
}

// 실제 사용 시나리오 시뮬레이션
async function simulateRealUsage() {
  console.log(`
🎯 실제 사용 시나리오: 개발자가 AI에게 질문하는 상황

👤 개발자: "버튼 컴포넌트를 만들고 있는데, primary button에 어떤 색상 토큰을 사용해야 할까요?"

🤖 AI 에이전트: "버튼 관련 색상 토큰을 찾아드리겠습니다. MCP 서버에서 design token 정보를 검색하겠습니다."

[AI가 MCP 서버에 search_design_tokens 호출]
- query: "button primary"
- category: "color"

📊 MCP 서버 응답:
- semantic.color.surface.button-primary 
- semantic.color.surface.button-primary-hover
- semantic.color.surface.button-primary-pressed
- ...등의 토큰들

🤖 AI 에이전트: "Primary button용으로는 다음 토큰들을 사용하시면 됩니다:

1. **기본 상태**: var(--semantic-color-surface-button-primary)
2. **hover 상태**: var(--semantic-color-surface-button-primary-hover) 
3. **pressed 상태**: var(--semantic-color-surface-button-primary-pressed)

CSS 예시:
\`\`\`css
.primary-button {
  background-color: var(--semantic-color-surface-button-primary);
}
.primary-button:hover {
  background-color: var(--semantic-color-surface-button-primary-hover);
}
\`\`\`"

👤 개발자: "감사합니다! 정확히 필요한 정보였어요."
  `);
}

// 메인 실행
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'test':
      await testMCPServer();
      break;
    case 'scenario':
      await simulateRealUsage();
      break;
    default:
      console.log(`
🧪 MCP 서버 테스트 도구

사용법:
  node simple-test.cjs test      # MCP 서버 통신 테스트
  node simple-test.cjs scenario  # 실제 사용 시나리오

예시:
  node simple-test.cjs test
  node simple-test.cjs scenario
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
