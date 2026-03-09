---
name: table-component
description: 规范表格组件的标准实现方式，指导 AI 在 features 层创建可复用的数据表格组件。
license: MIT
metadata:
  author: frontend-team
  version: '2.0.0'
---

# Table Component Skill

本 Skill 定义**数据表格组件**的标准实现方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/components/{Domain}Table/` 下创建表格组件
- 需要展示列表数据并支持分页
- 需要统一表格样式和交互行为

## Inputs

- 业务域名称：如 `user`、`order`
- 实体类型：如 `{Domain}`
- 列表信息类型：如 `{Domain}ListInfo`
- 操作回调：如 `onEdit`、`onDetail`、`onPageChange`
- 列定义：来自 `_columns.tsx`

## Output Structure

文件路径：`src/features/{domain}/components/{Domain}Table/index.tsx`

组件结构：

```text
<Table
  rowKey="id"
  columns={columns}
  dataSource={listInfo.list}
  pagination={{
    current: listInfo.pageNo,
    pageSize: listInfo.pageSize,
    total: listInfo.total,
    onChange: onPageChange,
    showSizeChanger: false,
  }}
/>
```

## File Structure

```
src/features/{domain}/components/{Domain}Table/
├── index.tsx          # 表格组件（必须）
├── _columns.tsx       # 列定义文件（必须）
└── ...
```

## Code Template

### 基础版本

文件路径：`src/features/{domain}/components/{Domain}Table/index.tsx`

```tsx
import React from 'react';

import { Table } from 'antd';

import { get{Domain}Columns } from './_columns';
import { {Domain}ListInfo } from '@/features/{domain}/types';
import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';

interface {Domain}TableProps {
  {domain}ListInfo?: {Domain}ListInfo;
  onPageChange: (pageNo: number, pageSize: number) => void;
}

const {Domain}Table: React.FC<{Domain}TableProps> = (props) => {
  const { {domain}ListInfo = {}, onPageChange } = props;

  const columns = get{Domain}Columns();

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={listInfo.list}
      pagination={{
        current: {domain}ListInfo.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
        pageSize: {domain}ListInfo.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        total: {domain}ListInfo.total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
};

export default {Domain}Table;
```

### 带操作回调的版本

文件路径：`src/features/{domain}/components/{Domain}Table/index.tsx`

```tsx
import React from 'react';

import { Table } from 'antd';

import { build{Domain}Columns } from './_columns';
import { {Domain}ListInfo } from '@/features/{domain}/types';
import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';

interface {Domain}TableProps {
  {domain}ListInfo?: {Domain}ListInfo;
  onPageChange: (pageNo: number, pageSize: number) => void;
  onEdit: (record: any) => void;
  onDetail: (record: any) => void;
}

const {Domain}Table: React.FC<{Domain}TableProps> = (props) => {
  const { {domain}ListInfo = {}, onPageChange, onEdit, onDetail } = props;

  const columns = build{Domain}Columns({
    onEdit,
    onDetail,
  });

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={listInfo.list}
      pagination={{
        current: {domain}ListInfo.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
        pageSize: {domain}ListInfo.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        total: {domain}ListInfo.total,
        onChange: onPageChange,
        showSizeChanger: false,
        showTotal: (total) => `共 ${total} 条`,
      }}
    />
  );
};

export default {Domain}Table;
```

### \_columns.tsx 列定义

```tsx
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, Tag } from 'antd';
import type { {Domain} } from '../../types';

interface ColumnOptions {
  onEdit?(record: {Domain}): void;
  onDetail?(record: {Domain}): void;
}

export const build{Domain}Columns = (options?: ColumnOptions): ColumnsType<{Domain}> => {
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
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => options?.onDetail?.(record)}>
            详情
          </Button>
          <Button type="link" onClick={() => options?.onEdit?.(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];
};
```

## Key Behaviors

- 使用 AntD `Table` 组件展示数据
- 通过 `rowKey` 指定每行的唯一标识（通常为 `id`）
- 列配置通过 `_columns.tsx` 中的函数获取
- 分页配置从 `listInfo` 对象中解构
- 支持 `showSizeChanger` 允许用户切换每页条数

## Rules

- **列配置分离**
  - 列定义必须在独立的 `_columns.tsx` 文件中
  - 表格组件只负责传入操作回调
- **类型安全**
  - 使用 `Table<T>` 泛型指定数据类型
  - Props 类型必须显式定义
- **分页统一**
  - 统一使用 `listInfo` 对象传递分页数据（list/pageNo/pageSize/total）
  - 分页切换回调统一为 `onPageChange(page, pageSize)`
- **rowKey 设置**
  - 必须设置 `rowKey` 属性，通常为 `id`
- **职责单一**
  - 表格组件只负责展示数据和分页
  - 不处理数据获取逻辑
- **方法命名**
  - 回调方法使用 `onXXX` 命名，如 `onEdit`、`onPageChange`

## Usage Scenarios

- 列表页数据展示
- 需要统一表格样式的多个页面
- 需要分页功能的数据列表
