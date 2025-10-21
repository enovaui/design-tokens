import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

// GitHub Copilot과 MCP 서버를 연동하는 확장 프로그램
export class CopilotMCPIntegration {
    private mcpServerProcess: ChildProcess | null = null;
    private tokenCache: Map<string, any> = new Map();

    constructor(private context: vscode.ExtensionContext) {
        this.startMCPServer();
        this.setupCopilotIntegration();
    }

    // MCP 서버 시작
    private async startMCPServer() {
        const config = vscode.workspace.getConfiguration('enovaui');
        const mcpServerPath = config.get<string>('mcpServerPath');
        
        if (!mcpServerPath) {
            vscode.window.showErrorMessage('MCP Server path not configured');
            return;
        }

        try {
            const serverPath = path.resolve(vscode.workspace.rootPath || '', mcpServerPath);
            this.mcpServerProcess = spawn('node', [serverPath], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            this.mcpServerProcess.stderr?.on('data', (data) => {
                console.log(`[MCP Server] ${data.toString()}`);
            });

            vscode.window.showInformationMessage('Design Token MCP Server started');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to start MCP Server: ${error}`);
        }
    }

    // Copilot 통합 설정
    private setupCopilotIntegration() {
        // 1. 컨텍스트 제공자 등록
        this.registerContextProvider();
        
        // 2. 코드 액션 제공자 등록
        this.registerCodeActionProvider();
        
        // 3. 자동완성 제공자 등록
        this.registerCompletionProvider();
        
        // 4. 명령어 등록
        this.registerCommands();
    }

    // Copilot에게 토큰 컨텍스트 제공
    private registerContextProvider() {
        const disposable = vscode.languages.registerInlineCompletionItemProvider(
            ['css', 'scss', 'javascript', 'typescript'],
            {
                provideInlineCompletionItems: async (document, position, context, token) => {
                    const config = vscode.workspace.getConfiguration('enovaui');
                    if (!config.get<boolean>('autoSuggestTokens')) {
                        return [];
                    }

                    const lineText = document.lineAt(position.line).text;
                    const prefix = lineText.substring(0, position.character);

                    // CSS 변수 패턴 감지
                    if (prefix.includes('var(--') && !prefix.includes(')')) {
                        const suggestions = await this.getTokenSuggestions(prefix);
                        return suggestions.map(token => new vscode.InlineCompletionItem(token));
                    }

                    return [];
                }
            }
        );

        this.context.subscriptions.push(disposable);
    }

    // 코드 액션 제공자
    private registerCodeActionProvider() {
        const disposable = vscode.languages.registerCodeActionsProvider(
            ['css', 'scss'],
            {
                provideCodeActions: (document, range, context, token) => {
                    const actions: vscode.CodeAction[] = [];
                    
                    // 하드코딩된 색상값 감지
                    const text = document.getText(range);
                    const colorRegex = /#[0-9a-fA-F]{3,6}/g;
                    
                    if (colorRegex.test(text)) {
                        const action = new vscode.CodeAction(
                            'Replace with design token',
                            vscode.CodeActionKind.Refactor
                        );
                        
                        action.command = {
                            title: 'Replace with design token',
                            command: 'enovaui.replaceWithToken',
                            arguments: [document, range, text]
                        };
                        
                        actions.push(action);
                    }

                    return actions;
                }
            }
        );

        this.context.subscriptions.push(disposable);
    }

    // 자동완성 제공자
    private registerCompletionProvider() {
        const disposable = vscode.languages.registerCompletionItemProvider(
            ['css', 'scss'],
            {
                provideCompletionItems: async (document, position, token, context) => {
                    const lineText = document.lineAt(position.line).text;
                    const prefix = lineText.substring(0, position.character);

                    // var(-- 입력 중일 때
                    if (prefix.endsWith('var(--')) {
                        const tokens = await this.getAllDesignTokens();
                        return tokens.map(token => {
                            const item = new vscode.CompletionItem(
                                token.name.replace(/\./g, '-'),
                                vscode.CompletionItemKind.Variable
                            );
                            item.detail = `${token.package} • ${token.value}`;
                            item.documentation = new vscode.MarkdownString(
                                `**Package:** ${token.package}\n\n**Value:** ${token.value}\n\n**Usage:** \`var(--${token.name.replace(/\./g, '-')})\``
                            );
                            item.insertText = token.name.replace(/\./g, '-') + ')';
                            return item;
                        });
                    }

                    return [];
                }
            },
            '-' // 트리거 문자
        );

        this.context.subscriptions.push(disposable);
    }

    // 명령어 등록
    private registerCommands() {
        // Copilot에게 토큰 질문하기
        const askCopilotCommand = vscode.commands.registerCommand(
            'enovaui.askCopilotAboutTokens',
            async () => {
                const input = await vscode.window.showInputBox({
                    prompt: 'What would you like to know about design tokens?',
                    placeholder: 'e.g., "What color token should I use for primary buttons?"'
                });

                if (input) {
                    const answer = await this.askMCPServer(input);
                    
                    // Copilot Chat API를 통해 답변 전달 (가상 구현)
                    await this.sendToCopilotChat(input, answer);
                }
            }
        );

        // 토큰을 Copilot과 함께 삽입
        const insertTokenCommand = vscode.commands.registerCommand(
            'enovaui.insertTokenWithCopilot',
            async () => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) return;

                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);

                // Copilot에게 컨텍스트 제공하고 토큰 추천 요청
                const recommendation = await this.getTokenRecommendation(selectedText);
                
                if (recommendation) {
                    await editor.edit(editBuilder => {
                        editBuilder.replace(selection, recommendation);
                    });
                }
            }
        );

        this.context.subscriptions.push(askCopilotCommand, insertTokenCommand);
    }

    // MCP 서버에 질문
    private async askMCPServer(query: string): Promise<string> {
        return new Promise((resolve) => {
            if (!this.mcpServerProcess) {
                resolve('MCP Server not available');
                return;
            }

            const request = {
                jsonrpc: "2.0",
                id: Date.now(),
                method: "tools/call",
                params: {
                    name: "search_design_tokens",
                    arguments: { query }
                }
            };

            this.mcpServerProcess.stdin?.write(JSON.stringify(request) + '\n');

            // 응답 처리 (간소화된 버전)
            setTimeout(() => {
                resolve(`Found design tokens related to: ${query}`);
            }, 1000);
        });
    }

    // Copilot Chat에 답변 전달 (가상 구현)
    private async sendToCopilotChat(question: string, answer: string) {
        // 실제로는 GitHub Copilot Chat API를 사용
        const message = `**Design Token Question:** ${question}\n\n**Answer:** ${answer}`;
        
        vscode.window.showInformationMessage(
            'Answer sent to Copilot Chat',
            'Show Details'
        ).then(selection => {
            if (selection === 'Show Details') {
                vscode.window.showInformationMessage(message);
            }
        });
    }

    // 토큰 추천
    private async getTokenRecommendation(context: string): Promise<string | null> {
        // 컨텍스트를 분석해서 적절한 토큰 추천
        if (context.includes('background') || context.includes('bg')) {
            return 'var(--semantic-color-surface-main)';
        }
        if (context.includes('color') || context.includes('text')) {
            return 'var(--semantic-color-on-surface-main)';
        }
        return null;
    }

    // 토큰 제안
    private async getTokenSuggestions(prefix: string): Promise<string[]> {
        // 간단한 토큰 제안 로직
        const commonTokens = [
            'semantic-color-surface-main',
            'semantic-color-on-surface-main',
            'semantic-color-surface-button-primary',
            'primitive-color-white',
            'primitive-spacing-4'
        ];

        return commonTokens.filter(token => 
            token.includes(prefix.split('--')[1]?.toLowerCase() || '')
        );
    }

    // 모든 디자인 토큰 가져오기
    private async getAllDesignTokens(): Promise<any[]> {
        // 실제로는 MCP 서버에서 가져옴
        return [
            { name: 'primitive.color.white', package: 'core-tokens', value: '#ffffff' },
            { name: 'semantic.color.surface.main', package: 'webos-tokens', value: '#000000' },
            // ... 더 많은 토큰들
        ];
    }

    dispose() {
        if (this.mcpServerProcess) {
            this.mcpServerProcess.kill();
        }
    }
}

// 확장 프로그램 활성화
export function activate(context: vscode.ExtensionContext) {
    console.log('EnovaUI Design Tokens for Copilot is now active!');
    
    const integration = new CopilotMCPIntegration(context);
    
    context.subscriptions.push({
        dispose: () => integration.dispose()
    });
}

export function deactivate() {
    console.log('EnovaUI Design Tokens for Copilot is now deactivated');
}
