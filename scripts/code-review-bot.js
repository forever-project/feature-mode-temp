#!/usr/bin/env node
/**
 * GitHub PR Code Review Bot
 * 
 * 基于 ai-skills 规范的自动化代码审查工具
 * 在 GitHub PR 中自动发布审查评论
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 审查级别阈值
  BLOCKING_THRESHOLD: 1,  // 出现 Blocking 级别问题则检查失败
  
  // 文件匹配模式
  REVIEW_PATTERNS: [
    'src/features/**/*.ts',
    'src/features/**/*.tsx',
    'src/pages/**/*.ts',
    'src/pages/**/*.tsx',
  ],
  
  // 忽略模式
  IGNORE_PATTERNS: [
    '**/*.d.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/node_modules/**',
  ],
};

// 审查规则库
const RULES = {
  // 🔴 Blocking 规则
  blocking: [
    {
      id: 'BC-1',
      name: 'Page 层直接 API 调用',
      pattern: /request\s*\(|fetch\s*\(|axios\./,
      filePattern: /src\/pages\//,
      message: '🔴 **BC-1**: Page 层禁止直接调用 API',
      suggestion: '请将 API 调用下沉到 `features/{domain}/services/` 层',
      reference: '`feature-service` skill',
    },
    {
      id: 'BC-2',
      name: 'Page 层定义 types.ts',
      pattern: /types\.ts$/,
      filePattern: /src\/pages\//,
      message: '🔴 **BC-2**: Page 层禁止定义类型文件',
      suggestion: '请将类型定义移至 `features/{domain}/types.ts`',
      reference: '`type-definition-convention`',
    },
    {
      id: 'BC-3',
      name: '跨域引用私有文件',
      pattern: /from\s+['"]@\/features\/[^'"]+\/_/,
      message: '🔴 **BC-3**: 禁止直接引用其他 feature 的私有文件',
      suggestion: '请通过 `features/{domain}/index.tsx` 导出公共 API',
      reference: '`folder-structure-convention`',
    },
    {
      id: 'BC-4',
      name: '非 index.tsx 导出引用',
      pattern: /from\s+['"]@\/features\/([^'"]+)\/(?!index)/,
      excludePattern: /index\.tsx$/,
      message: '🔴 **BC-4**: 禁止直接引用 feature 内部文件',
      suggestion: '请通过 `features/{domain}/index.tsx` 唯一出口引用',
      reference: '`code-organization-convention`',
    },
  ],
  
  // 🟡 Suggestion 规则
  suggestion: [
    {
      id: 'SG-1',
      name: 'any 类型使用',
      pattern: /:\s*any\b/,
      message: '🟡 **SG-1**: 发现 `any` 类型使用',
      suggestion: '请定义具体的 Domain Type 替代 `any`',
      reference: '`type-definition-convention`',
    },
    {
      id: 'SG-2',
      name: 'useEffect 内使用箭头函数',
      pattern: /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?const\s+\w+\s*=\s*\([^)]*\)\s*=>/,
      message: '🟡 **SG-2**: useEffect 内部建议使用 `function` 声明方法',
      suggestion: 'useEffect 内部方法使用 `function`，事件处理使用箭头函数',
      reference: '`code-style-convention`',
    },
    {
      id: 'SG-3',
      name: '使用废弃属性 destroyOnClose',
      pattern: /destroyOnClose/,
      message: '🟡 **SG-3**: 发现废弃属性 `destroyOnClose`',
      suggestion: '请使用 `destroyOnHidden` 替代',
      reference: '`antd-usage-convention`',
    },
    {
      id: 'SG-4',
      name: '列表缺少 key 属性',
      pattern: /\.map\s*\(\s*\([^)]*\)\s*=>\s*<[A-Z][^>]*>/,
      excludePattern: /key\s*=/,
      message: '🟡 **SG-4**: 列表渲染可能缺少 `key` 属性',
      suggestion: '请为列表项添加唯一的 `key` 属性',
      reference: 'React 最佳实践',
    },
    {
      id: 'SG-5',
      name: '表单未使用 vertical 布局',
      pattern: /Form\s+[^>]*layout\s*=/,
      excludePattern: /layout\s*=\s*["']vertical["']/,
      message: '🟡 **SG-5**: 表单建议使用 `layout="vertical"`',
      suggestion: '统一使用 `layout="vertical"` 保持表单一致性',
      reference: '`modal-form` skill',
    },
    {
      id: 'SG-6',
      name: 'Service 函数命名不规范',
      pattern: /export\s+(async\s+)?function\s+(get|post|put|delete|handle)[A-Z]/,
      message: '🟡 **SG-6**: Service 函数命名不符合规范',
      suggestion: '使用 `fetch*List`, `get*Detail`, `create*`, `update*`, `delete*` 命名',
      reference: '`feature-service` skill',
    },
  ],
};

// 获取 PR 中的变更文件
function getChangedFiles() {
  try {
    // 在 GitHub Actions 中使用
    if (process.env.GITHUB_EVENT_PATH) {
      const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      return event.pull_request ? [event.pull_request] : [];
    }
    
    // 本地测试：获取 git diff 的文件
    const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f);
  } catch (error) {
    console.error('获取变更文件失败:', error.message);
    return [];
  }
}

// 检查文件内容
function reviewFile(filePath, content) {
  const issues = [];
  const lines = content.split('\n');
  
  // 检查 Blocking 规则
  for (const rule of RULES.blocking) {
    // 检查文件路径匹配
    if (rule.filePattern && !rule.filePattern.test(filePath)) {
      continue;
    }
    
    // 检查排除模式
    if (rule.excludePattern && rule.excludePattern.test(filePath)) {
      continue;
    }
    
    // 逐行检查
    lines.forEach((line, index) => {
      if (rule.pattern.test(line)) {
        // 检查是否需要排除
        if (rule.excludePattern && rule.excludePattern.test(line)) {
          return;
        }
        
        issues.push({
          level: 'blocking',
          ruleId: rule.id,
          ruleName: rule.name,
          line: index + 1,
          message: rule.message,
          suggestion: rule.suggestion,
          reference: rule.reference,
          code: line.trim(),
        });
      }
    });
  }
  
  // 检查 Suggestion 规则
  for (const rule of RULES.suggestion) {
    // 检查排除模式
    if (rule.excludePattern && rule.excludePattern.test(filePath)) {
      continue;
    }
    
    // 逐行检查
    lines.forEach((line, index) => {
      if (rule.pattern.test(line)) {
        // 检查是否需要排除
        if (rule.excludePattern && rule.excludePattern.test(line)) {
          return;
        }
        
        issues.push({
          level: 'suggestion',
          ruleId: rule.id,
          ruleName: rule.name,
          line: index + 1,
          message: rule.message,
          suggestion: rule.suggestion,
          reference: rule.reference,
          code: line.trim(),
        });
      }
    });
  }
  
  return issues;
}

// 生成 Markdown 审查报告
function generateReport(results) {
  let report = '## 🤖 AI Code Review Report\n\n';
  
  const blockingCount = results.filter(r => r.level === 'blocking').length;
  const suggestionCount = results.filter(r => r.level === 'suggestion').length;
  
  // 摘要
  report += '### 📊 Summary\n\n';
  report += `| Level | Count |\n`;
  report += `|-------|-------|\n`;
  report += `| 🔴 Blocking | ${blockingCount} |\n`;
  report += `| 🟡 Suggestion | ${suggestionCount} |\n`;
  report += `| **Total** | **${results.length}** |\n\n`;
  
  if (blockingCount > 0) {
    report += '⚠️ **存在 Blocking 级别问题，请修复后再合并**\n\n';
  }
  
  // 按文件分组
  const byFile = results.reduce((acc, issue) => {
    if (!acc[issue.file]) acc[issue.file] = [];
    acc[issue.file].push(issue);
    return acc;
  }, {});
  
  // 详细报告
  for (const [file, issues] of Object.entries(byFile)) {
    report += `### 📁 ${file}\n\n`;
    
    for (const issue of issues) {
      const icon = issue.level === 'blocking' ? '🔴' : '🟡';
      report += `${icon} **${issue.ruleId}** at line ${issue.line}\n\n`;
      report += `**问题**: ${issue.message}\n\n`;
      report += `**代码**:\n\`\`\`tsx\n${issue.code}\n\`\`\`\n\n`;
      report += `**建议**: ${issue.suggestion}\n\n`;
      report += `**参考**: ${issue.reference}\n\n`;
      report += '---\n\n';
    }
  }
  
  // 底部信息
  report += '\n---\n';
  report += '*Powered by [ai-skills](https://github.com/your-org/ai-skills) | Frontend Code Review Agent*\n';
  
  return report;
}

// 主函数
async function main() {
  console.log('🔍 Starting AI Code Review...\n');
  
  const changedFiles = getChangedFiles();
  console.log(`📁 Found ${changedFiles.length} changed files\n`);
  
  const allIssues = [];
  
  for (const file of changedFiles) {
    // 检查是否应该审查
    const shouldReview = CONFIG.REVIEW_PATTERNS.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(file);
    });
    
    const shouldIgnore = CONFIG.IGNORE_PATTERNS.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(file);
    });
    
    if (!shouldReview || shouldIgnore) {
      continue;
    }
    
    // 读取文件内容
    try {
      const content = fs.readFileSync(file, 'utf8');
      const issues = reviewFile(file, content);
      
      for (const issue of issues) {
        allIssues.push({ ...issue, file });
      }
      
      if (issues.length > 0) {
        console.log(`  ⚠️  ${file}: ${issues.length} issues`);
      } else {
        console.log(`  ✅ ${file}`);
      }
    } catch (error) {
      console.log(`  ⚠️  ${file}: 读取失败`);
    }
  }
  
  console.log('\n');
  
  // 生成报告
  const report = generateReport(allIssues);
  
  // 输出报告
  console.log(report);
  
  // 保存报告到文件（供 GitHub Actions 使用）
  const reportPath = path.join(process.cwd(), 'code-review-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  // 设置输出变量（GitHub Actions）
  const blockingCount = allIssues.filter(i => i.level === 'blocking').length;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_blocking=${blockingCount > 0}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `blocking_count=${blockingCount}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `suggestion_count=${allIssues.filter(i => i.level === 'suggestion').length}\n`);
  }
  
  // 返回退出码
  process.exit(blockingCount >= CONFIG.BLOCKING_THRESHOLD ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
