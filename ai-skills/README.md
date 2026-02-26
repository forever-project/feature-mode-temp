# AI Skills

AI Skills 是一套用于指导 AI 生成规范化前端代码的知识库。通过结构化的 Skill 定义，确保 AI 在不同任务中输出一致、可维护的代码。

## 设计理念

- **Spec 描述「要什么」** - 明确需求规格
- **Skill 描述「能做什么」** - 定义可复用能力
- **Example 告诉 AI「该怎么做」** - 提供学习示例
- **Prompt 决定「什么时候做」** - 固化调用模板
- **Convention 约束「不能乱来」** - 统一工程规范

## 目录结构

```
ai-skills/
├── README.md                 # 本文档
├── SKILL.md                  # AI 全局行为约束（"宪法"）
├── conventions/              # 前端工程约定集合
│   ├── naming-convention.md         # 命名规范
│   ├── git-commit-convention.md     # Git 提交规范
│   ├── code-comment-convention.md   # 代码注释规范
│   ├── error-handling-convention.md # 错误处理规范
│   ├── api-design-convention.md     # API 设计规范
│   ├── testing-convention.md        # 测试规范
│   ├── code-organization-convention.md    # 代码组织规范
│   ├── tech-stack-convention.md
│   ├── code-style-convention.md
│   ├── antd-usage-convention.md
│   └── folder-structure-convention.md
├── specs/                    # 页面级需求规格
│   ├── list-page.spec.md
│   ├── form-page.spec.md
│   └── detail-page.spec.md
├── skills/                   # 核心能力库
│   ├── list/                 # 列表页相关
│   │   ├── list-page-composition.skill.md
│   │   ├── list-data-hook.skill.md
│   │   ├── table-columns-builder.skill.md
│   │   ├── table-component.skill.md
│   │   ├── search-form-component.skill.md
│   │   └── filter-form-component.skill.md
│   ├── form/                 # 表单相关
│   │   └── modal-form.skill.md
│   ├── request/              # 接口与请求处理
│   │   ├── feature-service.skill.md
│   │   └── business-types.skill.md
│   ├── layout/               # 页面结构与布局
│   │   └── detail-page-composition.skill.md
│   └── structure/            # 目录结构规范
│       ├── feature-directory-structure.skill.md
│       └── pages-directory-structure.skill.md
├── examples/                 # 完整示例
└── prompts/                  # 调用模板
```

## 模块说明

### 1. SKILL.md

**AI 的全局行为约束（相当于"宪法"）**

定义所有 Skill 默认遵循的技术与行为规则，防止 AI 在不同 Skill 中表现不一致。

核心规则：

- 使用 React Function Component
- 使用 TypeScript，禁止使用 `any`
- 使用 Ant Design v5
- 所有接口请求必须抽到 service 层
- 禁止自行引入未声明的依赖

### 2. conventions/

**前端工程约定集合（事实标准）**

用于统一 AI 生成代码的结构与风格，避免"每个页面一个写法"。

| 文件 | 说明 |
| --- | --- |
| `naming-convention.md` | 目录、文件、变量、函数、类型、CSS 类名等命名规则 |
| `git-commit-convention.md` | Commit Message 格式、Type 类型、Scope 范围规范 |
| `code-comment-convention.md` | JSDoc、TODO、代码分区注释规则 |
| `error-handling-convention.md` | 错误分类、处理层级、反馈规范 |
| `api-design-convention.md` | RESTful 设计、响应格式、状态码、查询规范 |
| `testing-convention.md` | 组件测试、Hook 测试、Service 测试、E2E 测试规范 |
| `code-organization-convention.md` | 导入顺序、变量声明顺序、代码排版规则 |
| `tech-stack-convention.md` | 技术栈说明 |
| `code-style-convention.md` | 代码风格规范 |
| `antd-usage-convention.md` | Ant Design 使用规范 |
| `folder-structure-convention.md` | 目录结构规范 |

### 3. specs/

**页面级"需求蓝图"**

Spec 描述的是"我要一个什么样的页面"，而不是"怎么实现"。

- `list-page.spec.md` - 列表页规格
- `form-page.spec.md` - 表单页规格
- `detail-page.spec.md` - 详情页规格

### 4. skills/

**核心能力库（仓库的灵魂）**

Skill 是最小可复用能力单元，具备明确输入、明确输出、清晰边界。

#### skills/list/ - 列表页相关

| Skill | 说明 |
| --- | --- |
| `list-page-composition.skill.md` | 列表页面组合规范（PageContainer / Card + Space 两种风格） |
| `list-data-hook.skill.md` | 列表数据管理 Hook（含分页、搜索、编辑弹窗状态） |
| `table-columns-builder.skill.md` | 表格列定义构建规范 |
| `table-component.skill.md` | 表格组件规范 |
| `search-form-component.skill.md` | 搜索表单组件（带 Card 包裹） |
| `filter-form-component.skill.md` | 筛选表单组件（Card 内嵌） |

#### skills/form/ - 表单相关

| Skill                 | 说明             |
| --------------------- | ---------------- |
| `modal-form.skill.md` | 弹窗表单组件规范 |

#### skills/request/ - 接口与请求处理

| Skill                      | 说明                  |
| -------------------------- | --------------------- |
| `feature-service.skill.md` | 业务域 Service 层规范 |
| `business-types.skill.md`  | 业务类型定义规范      |

#### skills/layout/ - 页面结构与布局

| Skill                              | 说明           |
| ---------------------------------- | -------------- |
| `detail-page-composition.skill.md` | 详情页组合规范 |

#### skills/structure/ - 目录结构规范

| Skill                                  | 说明                        |
| -------------------------------------- | --------------------------- |
| `feature-directory-structure.skill.md` | 业务域目录结构（features/） |
| `pages-directory-structure.skill.md`   | 页面层目录结构（pages/）    |

### 5. examples/

**Few-shot 示例（AI 学习用）**

提供完整的「输入 spec → 输出代码」示例，防止 AI 自由发挥或误解 Skill 作用。

#### order-list/

订单列表示例，展示完整的列表页实现：

```
examples/order-list/
├── spec.md                 # 需求规格文档
└── output/                 # 参考实现
    ├── index.tsx           # 页面组件
    ├── useOrderList.ts     # 数据管理 Hook
    ├── OrderSearchForm.tsx # 搜索表单组件
    ├── OrderTable.tsx      # 表格组件
    ├── _columns.tsx        # 表格列定义
    ├── service.ts          # Service 层（Umi Max request）
    └── types.ts            # 类型定义
```

使用的 Skills：

- `list-page-composition` - 列表页面组合
- `list-data-hook` - 列表数据管理
- `table-component` - 表格组件
- `search-form-component` - 搜索表单
- `feature-service` - Service 层
- `business-types` - 类型定义

建议包含：

- 一个 spec.md（需求描述）
- 对应生成的代码文件（参考实现）

### 6. prompts/

**Skill 的调用入口**

定义 AI 如何读取 spec、skills、conventions，固化团队使用 Skill 的标准 Prompt。

- `page-generator.prompt.md` - 用于生成完整页面
- `skill-selector.prompt.md` - 用于从 Skill 库中选择合适 Skill

## 项目架构

本 Skill 体系对应的项目架构：

```
src/
├── pages/                    # 页面层（只做组合）
│   └── {domain}/
│       └── {PageName}/
│           └── index.tsx
├── features/                 # 业务核心层
│   └── {domain}/
│       ├── components/       # 业务组件
│       │   ├── {Domain}Table/
│       │   ├── {Domain}SearchForm/
│       │   └── {Domain}EditModal/
│       ├── hooks/            # 业务 Hooks
│       │   └── use{Domain}List.ts
│       ├── services/         # 业务接口
│       │   └── index.ts
│       └── types.ts          # 业务类型
├── components/               # 基础组件（纯 UI）
├── hooks/                    # 通用 Hooks
├── services/                 # 全局服务
├── utils/                    # 工具函数
└── routes.ts                 # 路由配置
```

## 使用流程

1. **确定需求** - 根据页面类型选择对应的 spec（如列表页用 list-page.spec）
2. **选择 Skills** - 根据 spec 选择需要组合的 skills
3. **遵循 Conventions** - 确保生成的代码符合所有相关 conventions
4. **参考 Examples** - 如有疑问，查看 examples 中的示例
5. **生成代码** - 使用 prompts 中的模板生成代码

## 关键原则

### 1. 分层职责

- **pages/** - 只负责组合组件，不写复杂逻辑
- **features/** - 封装业务逻辑，供页面复用
- **components/** - 纯 UI 组件，不含业务逻辑

### 2. 禁止跨域依赖

- feature 之间禁止直接 import
- 通过页面层进行数据桥接
- 或通过 shared 层抽象公共能力

### 3. 类型组织

- 领域通用类型：`src/features/{domain}/types.ts`
- **禁止在 pages 目录下创建 types.ts 文件**
- Props 类型直接在页面文件中定义

### 4. 代码组织顺序

```tsx
// 1. React
// 2. 第三方包
// 3. 组件
// 4. 其他（接口、常量、工具）
// 5. 样式
// 6. Props 类型
// 7. 组件实现
```

## 贡献指南

1. 新增 Skill 时，需在对应目录创建 `.skill.md` 文件
2. 更新 README.md 中的目录结构和模块说明
3. 提供完整的 Code Template 和示例
4. 遵循现有的 Markdown 格式规范

## License

MIT
