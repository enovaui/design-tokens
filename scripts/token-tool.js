#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

class SimpleTokenTool {
  constructor() {
    this.tokenCache = new Map();
    this.loadTokens();
  }

  async loadTokens() {
    console.log('🔄 로컬 토큰 파일들을 로딩 중...');
    
    try {
      const packagesDir = path.join(__dirname, '../packages');
      const packages = await fs.readdir(packagesDir);
      
      for (const pkg of packages) {
        const jsonDir = path.join(packagesDir, pkg, 'json');
        if (await fs.pathExists(jsonDir)) {
          const files = await fs.readdir(jsonDir);
          for (const file of files) {
            if (file.endsWith('.json')) {
              const filePath = path.join(jsonDir, file);
              const content = await fs.readJson(filePath);
              this.tokenCache.set(`${pkg}/${file}`, content);
              console.log(`  ✅ ${pkg}/${file} 로딩 완료`);
            }
          }
        }
      }
      
      console.log(`\n📦 총 ${this.tokenCache.size}개 파일 로딩 완료!\n`);
    } catch (error) {
      console.error('❌ 토큰 로딩 실패:', error.message);
    }
  }

  searchTokens(query) {
    console.log(`🔍 "${query}" 검색 중...\n`);
    
    const results = [];
    
    for (const [packageFile, tokens] of this.tokenCache.entries()) {
      const [packageName] = packageFile.split('/');
      this.searchInObject(tokens, query, packageName, results);
    }

    if (results.length === 0) {
      console.log('❌ 검색 결과가 없습니다.');
      return;
    }

    console.log(`✨ ${results.length}개의 토큰을 찾았습니다:\n`);
    
    results.slice(0, 10).forEach((result, index) => {
      console.log(`${index + 1}. 📋 ${result.name}`);
      console.log(`   📦 패키지: ${result.package}`);
      console.log(`   🎨 값: ${result.value}`);
      console.log(`   📝 CSS: var(--${result.name.replace(/\./g, '-')})`);
      console.log('');
    });

    if (results.length > 10) {
      console.log(`... 및 ${results.length - 10}개 더`);
    }
  }

  searchInObject(obj, query, packageName, results, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        // 직접 값인 경우 (primitive tokens)
        if (currentPath.toLowerCase().includes(query.toLowerCase()) ||
            value.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            name: currentPath,
            value: value,
            package: packageName,
            type: 'primitive'
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        // 중첩된 객체인 경우
        this.searchInObject(value, query, packageName, results, currentPath);
      }
    }
  }

  getTokenUsage(tokenName) {
    console.log(`📖 "${tokenName}" 토큰 사용법 가이드\n`);
    
    // 토큰 찾기
    let tokenData = null;
    let packageName = '';
    
    for (const [packageFile, tokens] of this.tokenCache.entries()) {
      const found = this.findTokenInObject(tokens, tokenName);
      if (found) {
        tokenData = found;
        packageName = packageFile.split('/')[0];
        break;
      }
    }

    if (!tokenData) {
      console.log('❌ 토큰을 찾을 수 없습니다.');
      return;
    }

    const category = this.inferTokenCategory(tokenName);
    
    console.log(`🏷️  토큰명: ${tokenName}`);
    console.log(`📦 패키지: ${packageName}`);
    console.log(`🎨 값: ${tokenData}`);
    console.log(`📂 카테고리: ${category}`);
    console.log(`\n💡 사용 예시:`);
    
    const cssVar = `--${tokenName.replace(/\./g, '-')}`;
    
    if (category === 'color') {
      console.log(`   CSS: .my-element { background-color: var(${cssVar}); }`);
      console.log(`   CSS: .my-element { color: var(${cssVar}); }`);
      console.log(`   CSS: .my-element { border-color: var(${cssVar}); }`);
    } else if (category === 'spacing') {
      console.log(`   CSS: .my-element { margin: var(${cssVar}); }`);
      console.log(`   CSS: .my-element { padding: var(${cssVar}); }`);
    } else {
      console.log(`   CSS: .my-element { /* property */: var(${cssVar}); }`);
    }
    
    console.log(`\n📱 SCSS: $${tokenName.replace(/\./g, '-')}: var(${cssVar});`);
    console.log(`🔧 JS: const value = 'var(${cssVar})';`);
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

  inferTokenCategory(tokenName) {
    if (tokenName.includes('color') || tokenName.includes('background') || tokenName.includes('border')) {
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

  listAvailablePackages() {
    console.log('📦 사용 가능한 패키지들:\n');
    
    const packages = new Set();
    for (const packageFile of this.tokenCache.keys()) {
      packages.add(packageFile.split('/')[0]);
    }
    
    Array.from(packages).forEach(pkg => {
      console.log(`  • ${pkg}`);
    });
  }
}

// CLI 실행
async function main() {
  const tool = new SimpleTokenTool();
  await tool.loadTokens();
  
  const command = process.argv[2];
  const query = process.argv[3];

  switch (command) {
    case 'search':
      if (!query) {
        console.log('사용법: node token-tool.js search <검색어>');
        return;
      }
      tool.searchTokens(query);
      break;
      
    case 'usage':
      if (!query) {
        console.log('사용법: node token-tool.js usage <토큰명>');
        return;
      }
      tool.getTokenUsage(query);
      break;
      
    case 'list':
      tool.listAvailablePackages();
      break;
      
    default:
      console.log(`
🛠️  EnovaUI 디자인 토큰 도구

사용법:
  node token-tool.js search <검색어>     # 토큰 검색
  node token-tool.js usage <토큰명>      # 토큰 사용법 보기
  node token-tool.js list               # 패키지 목록 보기

예시:
  node token-tool.js search "button"
  node token-tool.js search "color"
  node token-tool.js usage "primitive.color.white"
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SimpleTokenTool;
