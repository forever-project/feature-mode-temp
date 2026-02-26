---
name: business-types
description: 规范业务域类型定义的标准方式，指导 AI 在 features 层定义实体类型、查询参数类型和响应类型。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Business Types Skill

本 Skill 定义**业务域类型定义**的标准方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/types.ts` 下创建新的业务类型定义
- 需要定义实体类型、查询参数类型、响应类型
- 需要为 DTO 和领域模型定义类型转换

## Inputs

- 业务域名称：如 `user`、`order`
- 实体字段列表：字段名、类型、是否可选、业务含义
- 查询参数：分页参数、筛选条件
- 后端 DTO 结构（如果与前端模型不一致）

## Output Structure

文件路径：`src/features/{domain}/types.ts`

```typescript
// 实体类型
export interface {Domain} {
  id: number;
  name: string;
  // ... 其他字段
}

// 列表查询参数
export interface {Domain}ListQuery {
  page: number;
  pageSize: number;
  name?: string;
  // ... 其他筛选条件
}

// 列表响应结构
export interface {Domain}ListResult {
  list: {Domain}[];
  total: number;
}
```

## File Structure

```
src/features/{domain}/
└── types.ts           # 业务域类型定义
```

**注意：所有类型定义统一在 features 层管理，禁止在 pages 目录下创建 types.ts。**

## Code Template

### 基础实体类型

```ts
// 基础实体类型
export interface {Domain} {
  id: number;
  name: string;
  role: 'admin' | 'user';
  status: 0 | 1;
  createdAt: string;
}
```

### 列表查询参数类型

```ts
// 列表查询参数
export interface {Domain}ListQuery {
  page: number;
  pageSize: number;
  name?: string;
  role?: string;
}
```

### 列表响应类型

```ts
// 列表响应结构
export interface {Domain}ListResult {
  list: {Domain}[];
  total: number;
}
```

### DTO 类型（当后端返回与前端模型不一致时）

```ts
// DTO 类型 - 对应后端原始返回结构
export interface {Domain}DTO {
  id: string;
  {domain}_name: string;         // 后端可能返回下划线命名
  status_code: number;           // 后端可能是状态码
  created_at: string;            // 原始时间戳字符串
  extra_info: {
    field1: string;
    field2: string;
  };
}
```

### 完整示例

```ts
// src/features/{domain}/types.ts

// ============================================
// 实体类型
// ============================================
export interface {Domain} {
  id: number;
  name: string;
  role: 'admin' | 'user';
  status: 0 | 1;
  createdAt: string;
}

// ============================================
// 列表查询参数
// ============================================
export interface {Domain}ListQuery {
  page: number;
  pageSize: number;
  name?: string;
  role?: string;
}

// ============================================
// 列表响应结构
// ============================================
export interface {Domain}ListResult {
  list: {Domain}[];
  total: number;
}

// ============================================
// DTO 类型（可选）
// ============================================
export interface {Domain}DTO {
  id: string;
  {domain}Name: string;
  statusCode: number;
  createdAt: string;
  extraInfo: {
    field1: string;
    field2: string;
  };
}
```

## Key Behaviors

- 实体类型定义核心业务对象的字段和类型
- 列表查询参数类型包含分页参数和业务筛选条件
- 列表响应类型统一包含 `list` 和 `total` 字段
- DTO 类型用于描述后端原始数据结构，与前端模型可能不一致

## Rules

- **类型完备**
  - 所有字段必须显式声明类型，禁止使用 `any`
  - 枚举值使用字面量联合类型（如 `'admin' | 'user'`）
- **命名规范**
  - 实体类型使用大驼峰命名（如 `User`, `Order`）
  - 查询参数类型使用 `{Domain}ListQuery` 命名
  - 响应类型使用 `{Domain}ListResult` 或 `{Domain}Detail` 命名
- **职责分离**
  - 领域通用类型必须集中在 `src/features/{domain}/types.ts`
  - **禁止在 pages 目录下创建 types.ts 文件**
  - 页面级 Props 类型直接在页面文件中定义
- **DTO 转换**
  - 当后端返回与前端模型不一致时，定义 DTO 类型
  - 在 service 层完成 DTO 到领域模型的转换

## Usage Scenarios

- 新建业务域时定义核心类型
- 与后端对接时定义 DTO 类型
- 为列表查询、表单提交等场景定义参数类型
