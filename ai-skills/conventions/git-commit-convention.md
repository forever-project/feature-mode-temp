# Git Commit Convention

本规范定义 Git 提交信息的格式规范，确保提交历史清晰、可追溯、易于理解。

## Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

## 格式说明

### Header（必须）

```
<type>(<scope>): <subject>
```

- **type**：提交类型（必填）
- **scope**：影响范围（可选）
- **subject**：简短描述（必填）

### Body（可选）

- 详细描述变更内容
- 说明变更的原因和背景
- 可以包含多个段落

### Footer（可选）

- 关联的 Issue 编号：`Closes #123`, `Fixes #456`
- 破坏性变更说明：`BREAKING CHANGE: ...`

## Type 类型

| 类型       | 说明   | 使用场景                                         |
| ---------- | ------ | ------------------------------------------------ |
| `feat`     | 新功能 | 新增功能、新页面、新组件                         |
| `fix`      | 修复   | 修复 Bug、修复问题                               |
| `docs`     | 文档   | 仅修改文档（README、注释等）                     |
| `style`    | 格式   | 不影响代码逻辑的格式修改（空格、格式化、分号等） |
| `refactor` | 重构   | 代码重构，既不修复 bug 也不添加功能              |
| `perf`     | 性能   | 性能优化                                         |
| `test`     | 测试   | 添加或修改测试代码                               |
| `chore`    | 构建   | 构建过程或辅助工具的变动                         |
| `ci`       | CI     | 持续集成相关的修改                               |
| `revert`   | 回滚   | 撤销之前的提交                                   |
| `wip`      | 进行中 | 工作进行中（Work in Progress）                   |

## Scope 范围

| 范围        | 说明         |
| ----------- | ------------ |
| `page`      | 页面相关     |
| `component` | 组件相关     |
| `hook`      | Hooks 相关   |
| `service`   | 服务层相关   |
| `api`       | 接口相关     |
| `style`     | 样式相关     |
| `config`    | 配置相关     |
| `deps`      | 依赖相关     |
| `utils`     | 工具函数相关 |
| `types`     | 类型定义相关 |

## Subject 规范

- 使用**祈使句**，现在时态
- 首字母**小写**
- 结尾**不加句号**
- 不超过 50 个字符
- 描述做了什么，而不是怎么做

```
✅ feat(user): add user list page
✅ fix(order): fix order status display error
✅ refactor(table): extract table columns builder

❌ feat(user): Added user list page      // 过去时
❌ fix(order): Fix order status.         // 大写开头，有句号
❌ feat(user): update                    // 描述不清晰
```

## 完整示例

### 简单提交

```bash
feat(user): add user list page
```

### 带范围的提交

```bash
fix(order): fix order status display error
```

### 带详细描述的提交

```bash
feat(user): add user list page

- Add UserTable component with pagination
- Add UserSearchForm with filter options
- Add useUserList hook for data management

Closes #123
```

### 修复 Bug

```bash
fix(order): fix order status not updating

Order status was not updating after payment success.
Now it correctly updates to 'paid' when payment callback is received.

Fixes #456
```

### 重构代码

```bash
refactor(table): extract table columns builder

Extract column definitions to _columns.tsx for better maintainability.
No functional changes.
```

### 性能优化

```bash
perf(list): optimize list rendering performance

Use React.memo and useMemo to reduce unnecessary re-renders.
Improves performance by ~30% for large lists.
```

### 破坏性变更

```bash
feat(api): change user list response format

BREAKING CHANGE: Response format changed from { data: [] } to { list: [], total: 0 }

Closes #789
```

### 撤销提交

```bash
revert: feat(user): add user list page

This reverts commit abc1234.
```

## 提交频率建议

- **原子性提交**：每次提交只做一件事
- **频繁提交**：小步快跑，及时提交
- **完整功能**：一个功能可以分多次提交，但要在 PR 中完整

```bash
# 好的提交历史
feat(user): add user table component
feat(user): add user search form
feat(user): add useUserList hook
feat(user): add user list page

# 不好的提交历史（一次提交做太多事）
feat(user): add user list page with table, search form and hooks
```

## Commit Hooks

推荐配置 husky + lint-staged 进行提交前检查：

```bash
# .husky/commit-msg
npx --no-install commitlint --edit $1
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert', 'wip'],
    ],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
  },
};
```

## Rules

- **type 必须**：每次提交必须指定 type
- **subject 清晰**：描述做了什么，而不是怎么做
- **body 详细**：复杂变更需要在 body 中说明背景和原因
- **关联 Issue**：修复 bug 或实现功能时，在 footer 中关联 Issue
- **原子提交**：一次提交只做一件事，便于回滚和审查
