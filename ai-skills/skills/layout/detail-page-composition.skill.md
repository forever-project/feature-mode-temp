---
name: detail-page-composition
description: 规范详情页面的标准实现方式，指导 AI 生成只读详情页，保持与现有项目一致的结构和数据获取模式。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Detail Page Composition Skill

本 Skill 定义**只读详情页**的标准实现方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`，并优先复用 `features/<domain>` 下已有能力。

## When to Apply

- 在 `src/pages/<Domain>/<PageName>/index.tsx` 下创建新的详情页
- 需要展示单个实体详情信息的只读页面
- 希望 AI 在生成详情页时，与当前项目现有写法保持一致

## Inputs

- 页面信息：
  - 路径：`src/pages/{domain}/{PageName}/index.tsx`
  - 路由：如 `/{domain}/detail`
  - 参数：通常通过 URL 查询参数传递 id，如 `?id=123`
- 领域能力：
  - `fetch{Domain}Detail` service（位于 `src/features/{domain}/services/`）
  - 类型定义（位于 `src/features/{domain}/types.ts`）

## Output Structure

文件路径：`src/pages/{domain}/{PageName}/index.tsx`

```text
<Card title="详情标题">
  <Descriptions bordered column={1}>
    <Descriptions.Item label="字段1">
      {data?.field1}
    </Descriptions.Item>
    <Descriptions.Item label="字段2">
      {data?.field2}
    </Descriptions.Item>
    ...
  </Descriptions>
</Card>
```

## File Structure

```
src/pages/{domain}/{PageName}/
└── index.tsx          # 页面组件（必须）
```

**注意：不在 pages 目录下创建 types.ts，所有类型定义在 features 层管理。**

## Code Template

```tsx
// src/pages/{domain}/{PageName}/index.tsx

import { useEffect, useState } from 'react';

import { Card, Descriptions } from 'antd';
import { useSearchParams } from 'umi';


import { fetch{Domain}Detail } from '@/features/{domain}/services';
import { {Domain} } from '@/features/{domain}/types';

import styles from './index.less';

export default function {PageName}() {
  // 从 URL 获取参数
  const [params] = useSearchParams();
  const id = Number(params.get('id'));

  // 数据状态
  const [data, setData] = useState<{Domain} | null>(null);

  // 加载数据
  useEffect(() => {
    fetch{Domain}Detail(id).then(setData);
  }, [id]);

  return (
    <Card title="{domain}详情">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">
          {data?.id}
        </Descriptions.Item>
        <Descriptions.Item label="名称">
          {data?.name}
        </Descriptions.Item>
        <Descriptions.Item label="角色">
          {data?.role}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {data?.status === 1 ? '启用' : '停用'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
```

## Key Behaviors

- 通过 `useSearchParams` 从 URL 获取实体 ID
- 使用 `useEffect` 在组件挂载时加载详情数据
- 使用 AntD `Descriptions` 组件展示只读信息
- 数据获取逻辑调用 `features/{domain}/services/` 下的 service 函数
- 类型定义来自 `features/{domain}/types.ts`
- Props 类型（如有需要）直接在页面文件中定义

## Rules

- **只读展示**
  - 详情页为只读页面，修改入口通过按钮跳转或弹窗承载
- **数据获取**
  - 页面层负责请求接口，通过 props 向下传递数据
  - 禁止在页面中直接使用 `request`（`import { request } from '@umijs/max'`），必须调用 service 函数
- **类型安全**
  - 明确使用领域类型，而非 `any`
- **布局统一**
  - 使用 `Card` + `Descriptions` 实现详情展示
  - 根据信息复杂度选择 `column` 值（简单信息用 1-2 列，复杂信息用 3 列）
- **类型组织**
  - **禁止在 pages 目录下创建 types.ts 文件**
  - 所有类型定义统一在 `src/features/{domain}/types.ts` 管理

## Usage Scenarios

- 用户详情、订单详情等只读信息展示页面
- 作为编辑操作的预览页面
- 与其他列表页配合，形成完整的 CRUD 流程
