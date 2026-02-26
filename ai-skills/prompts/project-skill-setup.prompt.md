# 项目 Skill 体系搭建指南

本文档指导如何从零开始为前端项目搭建 AI Skill 体系，确保 AI 生成的代码符合项目规范和架构设计。

## 目标

建立一套完整的 AI Skill 体系，使 AI 能够：

- 理解项目架构和技术栈
- 生成符合规范的代码
- 保持代码风格一致性
- 复用既有组件和逻辑

## 前提条件

- 已存在前端项目（本示例为 Umi Max + React + TypeScript + Ant Design）
- 项目已有基础架构和示例代码
- 有明确的代码规范和设计思想

## 执行步骤

### Step 1: 项目结构分析

**目标**：深入理解现有项目结构和代码组织方式。

**执行内容**：

1. 读取项目根目录配置文件（package.json、README.md、.umirc.ts 等）
2. 分析 src 目录结构，识别：
   - 页面层（pages/）组织方式
   - 业务层（features/）组织方式
   - 组件、hooks、services、types 的分布
3. 读取示例代码（如 OrderList、UserList 等）
4. 理解代码排版规范（导入顺序、变量声明顺序等）

**输出**：

- 项目技术栈清单
- 目录结构图
- 代码组织规范总结

---

### Step 2: 创建 Skill 基础目录

**目标**：建立 ai-skills 目录结构。

**执行内容**：

```bash
mkdir -p ai-skills/
mkdir -p ai-skills/conventions
mkdir -p ai-skills/skills/list
mkdir -p ai-skills/skills/form
mkdir -p ai-skills/skills/request
mkdir -p ai-skills/skills/layout
mkdir -p ai-skills/skills/structure
mkdir -p ai-skills/specs
mkdir -p ai-skills/examples
mkdir -p ai-skills/prompts
```

**创建核心文件**：

- `ai-skills/SKILL.md` - AI 全局行为约束（"宪法"）
- `ai-skills/README.md` - 仓库说明文档

---

### Step 3: 提取页面级 Skills

**目标**：根据现有页面代码，提取可复用的页面模式。

**执行内容**：

#### 3.1 分析列表页模式

1. 查看现有列表页（如 OrderList、UserList）
2. 识别通用模式：
   - 布局方式（PageContainer vs Card+Space）
   - 组件组合方式
   - 数据流管理方式（useXxxList hook）
3. 创建 `skills/list/list-page-composition.skill.md`

#### 3.2 分析详情页模式

1. 查看现有详情页（如 UserDetail）
2. 识别通用模式：
   - 数据获取方式（useSearchParams + useEffect）
   - 展示方式（Card + Descriptions）
3. 创建 `skills/layout/detail-page-composition.skill.md`

#### 3.3 提取业务 Hooks

1. 分析现有 hooks（如 useUserList、useOrderList）
2. 识别通用模式：
   - 状态管理（list、loading、pagination）
   - 操作方法（search、reset、changePage）
3. 创建 `skills/list/list-data-hook.skill.md`

---

### Step 4: 提取组件级 Skills

**目标**：根据 features 层代码，提取可复用的组件模式。

**执行内容**：

#### 4.1 表格相关

1. 分析 Table 组件结构
2. 分离列定义（\_columns.tsx）
3. 创建：
   - `skills/list/table-component.skill.md`
   - `skills/list/table-columns-builder.skill.md`

#### 4.2 搜索表单相关

1. 分析 SearchForm / FilterForm 组件
2. 识别两种模式：
   - 带 Card 包裹的版本（独立使用）
   - 纯表单版本（嵌入 Card）
3. 创建：
   - `skills/list/search-form-component.skill.md`
   - `skills/list/filter-form-component.skill.md`

#### 4.3 弹窗表单

1. 分析 EditModal 组件
2. 识别模式：Form + Modal 组合
3. 创建 `skills/form/modal-form.skill.md`

---

### Step 5: 提取数据层 Skills

**目标**：定义 Service 层和类型定义规范。

**执行内容**：

#### 5.1 Service 层规范

1. 分析现有 service 文件
2. 识别函数命名模式（fetchXxxList、fetchXxxDetail、updateXxx）
3. 创建 `skills/request/feature-service.skill.md`

#### 5.2 类型定义规范

1. 分析 types.ts 文件
2. 识别类型命名模式（Xxx、XxxListQuery、XxxListResult）
3. 创建 `skills/request/business-types.skill.md`

---

### Step 6: 定义目录结构 Skills

**目标**：明确项目目录组织规范。

**执行内容**：

#### 6.1 Features 目录结构

1. 定义 features/{domain}/ 下的标准结构：
   ```
   components/
   hooks/
   services/
   types.ts
   ```
2. 创建 `skills/structure/feature-directory-structure.skill.md`

#### 6.2 Pages 目录结构

1. 定义 pages/{domain}/{PageName}/ 下的标准结构：
   ```
   └── index.tsx
   ```
2. **重要**：明确禁止在 pages 下创建 types.ts
3. 创建 `skills/structure/pages-directory-structure.skill.md`

---

### Step 7: 创建通用 Conventions

**目标**：定义跨文件的通用规范。

**执行内容**：

根据项目实际情况，创建以下 conventions：

| 文件 | 内容 |
| --- | --- |
| `conventions/naming-convention.md` | 目录、文件、变量、函数、类型命名规范 |
| `conventions/git-commit-convention.md` | Commit Message 格式规范 |
| `conventions/code-comment-convention.md` | 注释风格、JSDoc 规范 |
| `conventions/error-handling-convention.md` | 错误分类、处理层级规范 |
| `conventions/api-design-convention.md` | RESTful API 设计规范 |
| `conventions/testing-convention.md` | 测试代码编写规范 |
| `conventions/code-organization.md` | 导入顺序、代码排版规范 |

---

### Step 8: 编写入口文档

**目标**：创建 README.md 和 SKILL.md。

**执行内容**：

#### 8.1 SKILL.md（AI 行为约束）

定义全局规则：

- 技术栈约束（React 18、TypeScript、Ant Design v5）
- 基础行为规则（禁止 any、禁止直接 request 调用，必须使用 service 层）
- 目录结构与职责边界
- 代码风格要求

#### 8.2 README.md（人类入口）

包含：

- 目录结构说明
- 各模块说明（conventions、skills、specs、examples、prompts）
- 项目架构图
- 使用流程
- 关键原则

---

### Step 9: 验证与修正

**目标**：确保所有 Skills 符合项目实际。

**检查清单**：

- [ ] 所有文件路径正确（相对于项目根目录）
- [ ] 代码模板可编译（TypeScript 类型正确）
- [ ] 导入路径使用项目实际别名（如 @/features/）
- [ ] 明确禁止项（如禁止 pages 下 types.ts）
- [ ] 样式导入示例正确（import styles from './index.less'）

**常见修正**：

1. **移除 pages 下 types.ts**：确保所有 skills 不生成 pages/{Page}/types.ts
2. **补充样式导入**：在代码模板中添加样式导入示例
3. **统一占位符**：使用 {Domain}、{PageName} 等统一占位符

---

## 输出成果

完成后的 ai-skills 目录结构：

```
ai-skills/
├── README.md                 # 人类入口文档
├── SKILL.md                  # AI 全局约束
├── conventions/              # 通用约定（7+ 个文件）
│   ├── naming-convention.md
│   ├── git-commit-convention.md
│   ├── code-comment-convention.md
│   ├── error-handling-convention.md
│   ├── api-design-convention.md
│   ├── testing-convention.md
│   └── code-organization.md
├── skills/                   # 核心能力（12+ 个文件）
│   ├── list/
│   ├── form/
│   ├── request/
│   ├── layout/
│   └── structure/
├── specs/                    # 页面规格
├── examples/                 # 示例代码
└── prompts/                  # 调用模板
```

## 使用方式

1. **新增页面**：根据页面类型选择 spec → 组合 skills → 遵循 conventions
2. **新增组件**：查看对应 skill → 按模板生成 → 确保符合命名规范
3. **代码审查**：对照 conventions 检查代码风格

## 注意事项

1. **保持同步**：项目架构变更时，同步更新 skills
2. **持续迭代**：根据实际使用反馈，不断完善 skills
3. **示例验证**：定期用 examples 验证 skills 的有效性
4. **版本管理**：重大变更时，更新 skill 的 version metadata

## 示例 Prompt

```markdown
你是一个前端工程师，请根据以下要求生成代码：

1. 遵循 ai-skills/SKILL.md 中的全局规则
2. 参考 ai-skills/conventions/ 中的命名和代码组织规范
3. 根据 spec 选择合适的 skills 组合使用
4. 生成的代码必须包含完整的 TypeScript 类型定义
5. 样式部分补充 import styles from './index.less'
6. 禁止在 pages 目录下创建 types.ts 文件
```
