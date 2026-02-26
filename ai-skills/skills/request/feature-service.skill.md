---
name: feature-service
description: 规范业务域 service 层的标准实现方式，指导 AI 在 features 层创建类型安全的接口封装函数。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Feature Service Skill

本 Skill 定义**业务域 service 层**的标准实现方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/services/` 下创建新的 service 文件
- 为新的后端接口创建前端调用封装
- 需要为列表查询、详情查询、新增、编辑、删除等操作提供统一访问入口

## Inputs

- 接口基础信息：
  - `url`: 接口地址（如 `/api/{domain}/list`）
  - `method`: HTTP 方法（`GET` / `POST` / `PUT` / `DELETE` 等）
- 请求工具：
  - 使用 `import { request } from '@umijs/max'`
  - 全局配置在 `src/app.ts` 中的 `request` 字段
- 类型与数据结构：
  - 请求参数类型名（如 `{Domain}ListQuery`）
  - 响应数据类型名（如 `{Domain}ListResult`, `{Domain}Detail`）
- 业务域名称：如 `user`、`order`

## Output Structure

文件路径：`src/features/{domain}/services/index.ts`

返回类型：

- 列表查询：`Promise<{Domain}ListResult>`
- 详情查询：`Promise<{Domain}>`
- 更新操作：`Promise<boolean>` 或 `Promise<void>`

## File Structure

```
src/features/{domain}/services/
├── index.ts           # 对外出口（可选）
└── index.ts # service 实现（必须）
```

## Code Template

### 基础 Service 文件（使用 Umi Max Request）

```ts
import { request } from '@umijs/max';

import { {Domain}, {Domain}ListQuery, {Domain}ListResult } from '../types';

// ============================================
// 列表查询
// ============================================
export async function fetch{Domain}List(
  params: {Domain}ListQuery,
): Promise<{Domain}ListResult> {
  return request('/api/{domain}/list', {
    method: 'GET',
    params,
  });
}

// ============================================
// 详情查询
// ============================================
export async function fetch{Domain}Detail(id: number): Promise<{Domain}> {
  return request(`/api/{domain}/${id}`, {
    method: 'GET',
  });
}

// ============================================
// 创建
// ============================================
export async function create{Domain}(data: Partial<{Domain}>) {
  return request('/api/{domain}', {
    method: 'POST',
    data,
  });
}

// ============================================
// 更新
// ============================================
export async function update{Domain}(id: number, data: Partial<{Domain}>) {
  return request(`/api/{domain}/${id}`, {
    method: 'PUT',
    data,
  });
}

// ============================================
// 删除
// ============================================
export async function delete{Domain}(id: number) {
  return request(`/api/{domain}/${id}`, {
    method: 'DELETE',
  });
}
```

### 模拟数据 Service 文件（开发调试使用）

```ts
import { {Domain}, {Domain}ListQuery, {Domain}ListResult } from '../types';

// ============================================
// 列表查询（模拟）
// ============================================
export async function fetch{Domain}List(
  params: {Domain}ListQuery,
): Promise<{Domain}ListResult> {
  // 模拟实现，实际项目替换为真实请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: {Domain}[] = Array.from({ length: params.pageSize }).map(
        (_, i) => {
          const id = (params.page - 1) * params.pageSize + i + 1;
          return {
            id,
            name: `{domain}${id}`,
            role: id % 2 === 0 ? 'admin' : 'user',
            status: id % 2 === 0 ? 1 : 0,
            createdAt: '2025-01-01',
          };
        },
      );

      resolve({
        list,
        total: 128,
      });
    }, 400);
  });
}

// ============================================
// 详情查询
// ============================================
export async function fetch{Domain}Detail(id: number): Promise<{Domain}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: `{domain}${id}`,
        role: 'admin',
        status: 1,
        createdAt: '2025-01-01',
      });
    }, 300);
  });
}

// ============================================
// 更新操作
// ============================================
export async function update{Domain}(payload: Partial<{Domain}>) {
  console.log('update {domain}:', payload);
  return true;
}
```

### 带 DTO 转换的 Service

```ts
import type { {Domain}DTO, {Domain}ListQuery, {Domain}ListResult } from '../types';

/**
 * 模拟后端接口：获取列表
 * 包含：DTO 模拟、异步延迟、数据转换逻辑
 */
export async function query{Domain}List(
  params: {Domain}ListQuery,
): Promise<{Domain}ListResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 模拟后端返回的原始数据 (DTO 数组)
      const list: {Domain}DTO[] = Array.from({ length: params.pageSize }).map((_, i) => {
        const id = (params.pageNo - 1) * params.pageSize + i + 1;
        return {
          id: `${id}`,
          code: `SN2026${id.toString().padStart(6, '0')}`,
          amount: Math.floor(Math.random() * 5000) + 100,
          statusCode: (id % 5) + 1,
          createdAt: '2026-02-02T10:00:00Z',
          extraInfo: {
            field1: '值1',
            field2: '值2',
          },
        };
      });

      // 3. 返回清洗后的结果
      resolve({
        list,
        total: 100,
      });
    }, 400);
  });
}
```

## Key Behaviors

- Service 函数负责与后端接口耦合的请求封装
- 使用 TypeScript 类型确保请求参数和响应数据的类型安全
- 分页接口返回结构中包含 `list` 与 `total` 字段
- 支持模拟数据实现，便于前端独立开发

## Rules

- **页面禁止直接请求**
  - 任何页面组件中不得直接出现 `request`（`import { request } from '@umijs/max'`）、`fetch` 等调用，只能调用 service 函数
- **类型完备**
  - 请求与响应类型必须显式声明，不得使用 `any`
  - 函数返回类型必须声明（如 `Promise<{Domain}ListResult>`）
- **命名规范**
  - 列表查询：`fetch{Domain}List` 或 `query{Domain}List`
  - 详情查询：`fetch{Domain}Detail` 或 `get{Domain}Detail`
  - 更新操作：`update{Domain}` 或 `save{Domain}`
  - 创建操作：`create{Domain}`
  - 删除操作：`delete{Domain}` 或 `remove{Domain}`
- **DTO 转换**
  - 当后端返回与前端模型不一致时，在 service 层完成 DTO 到领域模型的转换
  - 分页参数与后端字段的映射在 service 层完成（如 `page` -> `pageNo`）
- **错误处理**
  - 具体错误处理策略遵循 `error-handler.skill.md` 中的约定
  - service 层可将业务错误转化为异常抛出，由调用方按需捕获

## Usage Scenarios

- 新增列表、详情、编辑等功能时同步增加对应 service 函数
- 迁移老代码，将散落在组件内的请求逻辑集中到 features 层
- 需要统一接口调用和错误处理的场景
