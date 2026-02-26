---
name: list-data-hook
description: 规范列表数据管理 Hook 的标准实现方式，统一管理列表查询、分页、loading 状态以及编辑弹窗状态。
license: MIT
metadata:
  author: frontend-team
  version: '2.0.0'
---

# List Data Hook Skill

本 Skill 定义**列表数据管理 Hook**的标准实现方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/hooks/` 下创建新的列表数据管理 hook
- 需要统一管理列表查询、分页、loading 状态
- 需要支持编辑弹窗的开关和当前记录管理

## Architecture

### 职责分离模式

```
Page (Container)
├── Spin (loading 包裹)
├── SearchForm (筛选表单，接收外部 form)
└── ListSection (可选，业务逻辑封装)
    ├── Table (纯展示)
    ├── Modal (纯展示)
    └── useUserEdit (编辑状态管理)
```

## Inputs

- Hook 名称：如 `use{Domain}List`
- Service 函数：如 `fetch{Domain}List`（位于 `src/features/{domain}/services/`）
- 查询参数类型：`{Domain}ListQuery`（位于 `src/features/{domain}/types.ts`）
- 数据类型：`{Domain}`（位于 `src/features/{domain}/types.ts`）

## Output Structure

### 类型定义（统一结构）

```typescript
// types.ts
export interface {Domain}ListInfo {
  list: {Domain}[];
  total: number;
  pageNo: number;
  pageSize: number;
}
```

### Hook 返回对象

```typescript
{
  // 数据状态
  loading: boolean,
  {domain}ListInfo?: {Domain}ListInfo,

  // 操作方法
  onSearch: () => void,
  onPageChange: (pageNo: number, pageSize: number) => void,
  refresh: () => void,
}
```

## File Structure

```
src/features/{domain}/hooks/
├── use{Domain}List.ts      # 列表数据管理 hook
└── use{Domain}Edit.ts      # 编辑弹窗状态 hook（可选）
```

## Code Template

### use{Domain}List.ts - 列表数据管理

```tsx
import { useEffect, useState } from 'react';

import type { FormInstance } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { fetch{Domain}List } from '../services';
import type { {Domain}ListInfo } from '../types';

function getValues(form: FormInstance) {
  return form.getFieldsValue();
}

interface Use{Domain}ListOptions {
  form: FormInstance;
}

const use{Domain}List = (options: Use{Domain}ListOptions) => {
  const { form } = options;

  const [{domain}ListInfo, set{Domain}ListInfo] = useState<{Domain}ListInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList(params: { pageNo?: number; pageSize?: number } = {}) {
    setLoading(true);

    const values = getValues(form);

    fetch{Domain}List({ ...DEFAULT_PAGINATION_PARAMS, ...params, ...values })
      .then((res) => {
        set{Domain}ListInfo({
          list: res.list,
          total: res.total,
          pageNo: params.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
          pageSize: params.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onPageChange = (pageNo: number, pageSize: number) => {
    fetchList({ pageNo, pageSize });
  };

  const onSearch = () => {
    fetchList();
  };

  return {
    loading,
    {domain}ListInfo,
    onPageChange,
    onSearch,
    refresh: fetchList,
  };
};

export default use{Domain}List;
```

### use{Domain}Edit.ts - 编辑弹窗状态管理

```tsx
import { useState } from 'react';

import { update{Domain} } from '../services';
import type { {Domain} } from '../types';

export interface ModalInfo {
  type: 'add' | 'edit';
  record: {Domain} | null;
}

interface Use{Domain}EditOptions {
  onSuccess?: () => void;
}

export const use{Domain}Edit = (options: Use{Domain}EditOptions = {}) => {
  const { onSuccess } = options;

  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

  const openModal = (type: 'add' | 'edit', record?: {Domain}) => {
    setModalInfo({ type, record: record || null });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const submit = async (values: Partial<{Domain}>) => {
    await update{Domain}({
      ...modalInfo?.record,
      ...values,
    });
    closeModal();
    onSuccess?.();
  };

  return {
    modalInfo,
    openModal,
    closeModal,
    submit,
  };
};
```

## Key Behaviors

- 使用外部传入的 `form` 获取筛选值，不自己管理筛选状态
- Hook 内部不处理 UI 渲染，只管理数据和状态
- 编辑弹窗状态独立为 `use{Domain}Edit`，可复用
- 分页参数统一使用 `pageNo` / `pageSize`
- 方法命名使用 `onXXX` 而非 `handleXXX`

## Rules

- **状态集中管理**
  - 所有列表相关状态（数据、loading、分页）集中在 hook 中管理
- **Form 外置**
  - form 实例在 Page 层创建，通过 options 传入 hook
  - 这样可以让多个 hook 共享同一个 form
- **分页映射**
  - 组件层使用 `pageNo`/`pageSize`，与后端通信时做字段映射
- **类型安全**
  - 所有状态和参数必须显式声明类型，不得使用 `any`
- **职责单一**
  - Hook 只管理状态和调用 service，不处理 UI 渲染
- **不使用 useCallback**
  - 除非有性能问题，否则不使用 useCallback，保持代码简洁

## Usage Scenarios

- 任何需要列表数据管理的页面
- 需要统一列表查询逻辑的多个页面
- 需要支持分页、搜索、重置的标准列表页
- 需要弹窗编辑功能的列表页
