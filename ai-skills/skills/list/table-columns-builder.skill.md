---
name: table-columns-builder
description: 规范表格列定义的标准构建方式，指导 AI 在 features 层创建可复用的列配置构建函数。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Table Columns Builder Skill

本 Skill 定义**表格列定义**的标准构建方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/components/{Domain}Table/` 下创建列定义文件
- 需要定义表格列配置，支持操作按钮渲染
- 需要在多个地方复用相同的列配置

## Inputs

- 业务域名称：如 `user`、`order`
- 实体类型：如 `User`、`Order`
- 操作回调：如 `onEdit`、`onDetail`
- 列字段列表：字段名、标题、宽度、渲染方式

## Output Structure

文件路径：`src/features/{domain}/components/{Domain}Table/_columns.tsx`

返回类型：`TableColumnsType<{Domain}>` 或 `ColumnsType<{Domain}>`

## File Structure

```
src/features/{domain}/components/{Domain}Table/
├── index.tsx          # 表格组件
├── _columns.tsx       # 列定义文件（必须以下划线开头）
└── ...
```

## Code Template

### 基础版本

```tsx
import { Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { {Domain} } from '../../types';

interface Options {
  onEdit(record: {Domain}): void;
  onDetail(record: {Domain}): void;
}

export function build{Domain}Columns(
  options: Options,
): ColumnsType<{Domain}> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v: number) => (
        <Tag color={v === 1 ? 'green' : 'default'}>
          {v === 1 ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => options.onDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            onClick={() => options.onEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
}
```

### 带复杂渲染的版本

```tsx
import { Space, Button, Tag } from 'antd';
import type { TableColumnsType } from 'antd';

import type { {Domain} } from '../../types';

interface Options {
  onEdit?(record: {Domain}): void;
  onDetail?(record: {Domain}): void;
}

export function build{Domain}Columns(
  options?: Options,
): TableColumnsType<{Domain}> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v: number) => (
        <Tag color={v === 1 ? 'green' : 'default'}>
          {v === 1 ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => options?.onDetail?.(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            onClick={() => options?.onEdit?.(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
}
```

### 嵌套对象渲染版本

```tsx
import { Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { {Domain}DTO } from '../../types';

// 如需要样式，取消下面注释
// import styles from './index.less';

interface Options {
  onEdit?(record: {Domain}DTO): void;
}

export const get{Domain}Columns = (options?: any): ColumnsType<{Domain}DTO> => {
  return [
    {
      title: '编号',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'customerInfo',
      width: 120,
      render: (info) => info.firstName + info.lastName,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'statusCode',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => options?.onEdit?.(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];
};
```

## Key Behaviors

- 列配置通过函数返回，支持传入操作回调
- 函数名使用 `build{Domain}Columns` 或 `get{Domain}Columns`
- 文件名为 `_columns.tsx`，以下划线开头表示私有文件
- 支持嵌套对象的渲染处理
- 操作列固定在最右侧（`fixed: 'right'`）

## Rules

- **类型安全**
  - 使用 `TableColumnsType<T>` 或 `ColumnsType<T>` 明确列配置类型
  - 选项参数类型必须显式定义
- **私有文件**
  - 列配置文件必须以下划线开头命名（如 `_columns.tsx`）
  - 只能通过 `index.tsx` 或表格组件内部引用
- **职责单一**
  - 列配置只负责列定义，不处理数据获取
  - 操作回调通过参数传入，保持组件解耦
- **渲染处理**
  - 状态字段使用 `Tag` 组件渲染
  - 嵌套对象在 `render` 中处理拼接
- **宽度设置**
  - ID 列宽度 80
  - 操作列宽度 100-160
  - 其他列根据内容设置合适宽度

## Usage Scenarios

- 列表页表格列定义
- 需要复用列配置的多个页面
- 需要自定义操作按钮的表格
