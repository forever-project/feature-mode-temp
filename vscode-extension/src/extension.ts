import * as vscode from 'vscode';

// 审查规则定义
interface ReviewRule {
  id: string;
  level: 'blocking' | 'suggestion';
  message: string;
  suggestion: string;
  reference: string;
  pattern: RegExp;
  filePattern?: RegExp;
  excludePattern?: RegExp;
}

// 规则库
const RULES: ReviewRule[] = [
  // 🔴 Blocking 规则
  {
    id: 'BC-1',
    level: 'blocking',
    message: 'Page 层禁止直接调用 API',
    suggestion: '请将 API 调用下沉到 features/{domain}/services/ 层',
    reference: 'feature-service skill',
    pattern: /request\s*\(|fetch\s*\(|axios\./,
    filePattern: /src\/pages\//,
  },
  {
    id: 'BC-2',
    level: 'blocking',
    message: 'Page 层禁止定义类型文件',
    suggestion: '请将类型定义移至 features/{domain}/types.ts',
    reference: 'type-definition-convention',
    pattern: /types\.ts$/,
    filePattern: /src\/pages\//,
  },
  {
    id: 'BC-3',
    level: 'blocking',
    message: '禁止直接引用其他 feature 的私有文件',
    suggestion: '请通过 features/{domain}/index.tsx 导出公共 API',
    reference: 'folder-structure-convention',
    pattern: /from\s+['"]@\/features\/[^'"]+\/_/,
  },
  {
    id: 'BC-4',
    level: 'blocking',
    message: '禁止直接引用 feature 内部文件',
    suggestion: '请通过 features/{domain}/index.tsx 唯一出口引用',
    reference: 'code-organization-convention',
    pattern: /from\s+['"]@\/features\/([^'"]+)\/(?!index)/,
    excludePattern: /index\.tsx$/,
  },
  // 🟡 Suggestion 规则
  {
    id: 'SG-1',
    level: 'suggestion',
    message: '发现 any 类型使用',
    suggestion: '请定义具体的 Domain Type 替代 any',
    reference: 'type-definition-convention',
    pattern: /:\s*any\b/,
  },
  {
    id: 'SG-3',
    level: 'suggestion',
    message: '发现废弃属性 destroyOnClose',
    suggestion: '请使用 destroyOnHidden 替代',
    reference: 'antd-usage-convention',
    pattern: /destroyOnClose/,
  },
  {
    id: 'SG-5',
    level: 'suggestion',
    message: '表单建议使用 layout="vertical"',
    suggestion: '统一使用 layout="vertical" 保持表单一致性',
    reference: 'modal-form skill',
    pattern: /Form\s+[^>]*layout\s*=/,
    excludePattern: /layout\s*=\s*["']vertical["']/,
  },
];

// 诊断集合
const diagnosticCollection = vscode.languages.createDiagnosticCollection('aiCodeReview');

// 审查文件
function reviewFile(document: vscode.TextDocument): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const filePath = document.fileName;
  const config = vscode.workspace.getConfiguration('aiCodeReview');
  
  // 检查是否应该审查
  const reviewPatterns = config.get<string[]>('reviewPatterns', []);
  const ignorePatterns = config.get<string[]>('ignorePatterns', []);
  
  const shouldReview = reviewPatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
  
  const shouldIgnore = ignorePatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
  
  if (!shouldReview || shouldIgnore) {
    return diagnostics;
  }
  
  const blockingOnly = config.get<boolean>('blockingOnly', false);
  const text = document.getText();
  const lines = text.split('\n');
  
  for (const rule of RULES) {
    // 如果仅显示 blocking，跳过 suggestion
    if (blockingOnly && rule.level === 'suggestion') {
      continue;
    }
    
    // 检查文件路径匹配
    if (rule.filePattern && !rule.filePattern.test(filePath)) {
      continue;
    }
    
    // 检查排除模式
    if (rule.excludePattern && rule.excludePattern.test(filePath)) {
      continue;
    }
    
    // 逐行检查
    lines.forEach((line, lineIndex) => {
      if (rule.pattern.test(line)) {
        // 检查是否需要排除
        if (rule.excludePattern && rule.excludePattern.test(line)) {
          return;
        }
        
        const startPos = new vscode.Position(lineIndex, 0);
        const endPos = new vscode.Position(lineIndex, line.length);
        const range = new vscode.Range(startPos, endPos);
        
        const severity = rule.level === 'blocking' 
          ? vscode.DiagnosticSeverity.Error 
          : vscode.DiagnosticSeverity.Warning;
        
        const diagnostic = new vscode.Diagnostic(
          range,
          `[${rule.id}] ${rule.message}\n建议: ${rule.suggestion}\n参考: ${rule.reference}`,
          severity
        );
        
        diagnostic.code = rule.id;
        diagnostic.source = 'AI Code Review';
        
        diagnostics.push(diagnostic);
      }
    });
  }
  
  return diagnostics;
}

// 激活扩展
export function activate(context: vscode.ExtensionContext) {
  console.log('AI Code Review extension is now active');
  
  const config = vscode.workspace.getConfiguration('aiCodeReview');
  
  // 注册命令：审查当前文件
  const reviewFileCommand = vscode.commands.registerCommand('aiCodeReview.reviewFile', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const diagnostics = reviewFile(editor.document);
      diagnosticCollection.set(editor.document.uri, diagnostics);
      
      const blockingCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      const suggestionCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
      
      vscode.window.showInformationMessage(
        `AI Code Review: ${blockingCount} blocking, ${suggestionCount} suggestions`
      );
    }
  });
  
  // 注册命令：审查整个工作区
  const reviewWorkspaceCommand = vscode.commands.registerCommand('aiCodeReview.reviewWorkspace', async () => {
    const files = await vscode.workspace.findFiles(
      'src/{features,pages}/**/*.{ts,tsx}',
      '{**/node_modules/**,**/*.d.ts,**/*.test.ts,**/*.spec.ts}'
    );
    
    let totalBlocking = 0;
    let totalSuggestion = 0;
    
    for (const file of files) {
      const document = await vscode.workspace.openTextDocument(file);
      const diagnostics = reviewFile(document);
      diagnosticCollection.set(document.uri, diagnostics);
      
      totalBlocking += diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      totalSuggestion += diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
    }
    
    vscode.window.showInformationMessage(
      `AI Code Review Complete: ${totalBlocking} blocking, ${totalSuggestion} suggestions in ${files.length} files`
    );
  });
  
  // 注册命令：切换实时审查
  const toggleRealtimeCommand = vscode.commands.registerCommand('aiCodeReview.toggleRealtime', async () => {
    const current = config.get<boolean>('enable', true);
    await config.update('enable', !current, true);
    vscode.window.showInformationMessage(`AI Code Review: ${!current ? 'Enabled' : 'Disabled'}`);
  });
  
  // 实时审查
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => {
    if (config.get<boolean>('enable', true)) {
      const diagnostics = reviewFile(event.document);
      diagnosticCollection.set(event.document.uri, diagnostics);
    }
  });
  
  // 打开文件时审查
  const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(document => {
    if (config.get<boolean>('enable', true)) {
      const diagnostics = reviewFile(document);
      diagnosticCollection.set(document.uri, diagnostics);
    }
  });
  
  // 保存文件时审查
  const onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument(document => {
    if (config.get<boolean>('enable', true)) {
      const diagnostics = reviewFile(document);
      diagnosticCollection.set(document.uri, diagnostics);
    }
  });
  
  context.subscriptions.push(
    reviewFileCommand,
    reviewWorkspaceCommand,
    toggleRealtimeCommand,
    onDidChangeTextDocument,
    onDidOpenTextDocument,
    onDidSaveTextDocument,
    diagnosticCollection
  );
}

// 停用扩展
export function deactivate() {
  diagnosticCollection.dispose();
}
