---
name: list-page-composition
description: 规范列表页面的标准组合方式，指导 AI 在生成列表页时复用既有组件与 hooks，保持与现有项目一致的页面结构和交互模式。
license: MIT
metadata:
  author: frontend-team
  version: '2.0.0'
---

# List Page Composition Skill

本 Skill 定义**列表页面**的标准组合方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`，并优先复用 `features/<domain>` 下已有能力。

## When to Apply

- 在 `src/pages/<Domain>/<PageName>/index.tsx` 下创建新的列表页
- 重构已有列表页，确保不破坏既有布局与交互模式
- 希望 AI 在生成列表相关页面时，与当前项目现有写法保持一致

## Architecture

### 推荐架构（职责分离）

```
Page (最薄，只负责组合)
├── Spin (loading 包裹)
├── SearchForm (筛选表单，接收外部 form)
└── {Domain}ListWithModal (可选容器，封装 Table + Modal + 编辑逻辑)
    ├── Table (纯展示)
    ├── Modal (纯展示)
    └── use{Domain}Edit (编辑状态管理)
```

### 两种编辑模式

| 模式         | 使用场景             | 组件结构                               |
| ------------ | -------------------- | -------------------------------------- |
| **弹窗编辑** | 快速编辑，无需跳转   | Page → ListWithModal → (Table + Modal) |
| **跳转编辑** | 复杂编辑，需要新页面 | Page → Table → history.push            |

## Inputs

- 页面信息：
  - 路径：`src/pages/{domain}/{PageName}/index.tsx`
  - 路由：如 `/{domain}/list`
- 领域能力：
  - `use{Domain}List` hook（位于 `src/features/{domain}/hooks/`）
  - `{Domain}Table` 组件（位于 `src/features/{domain}/components/`）
  - `{Domain}SearchForm` 组件（位于 `src/features/{domain}/components/`）
  - `use{Domain}Edit` hook（可选，位于 `src/features/{domain}/hooks/`）
  - `{Domain}EditModal` 组件（可选，位于 `src/features/{domain}/components/`）

## Output Structure

### 方式一：弹窗编辑模式（推荐）

文件路径：`src/pages/{domain}/{PageName}/index.tsx`

```tsx
import React from 'react';

import { Form, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

import use{Domain}List from '@/features/{domain}/hooks/use{Domain}List';
import {Domain}SearchForm from '@/features/{domain}/components/{Domain}SearchForm';
import {Domain}ListWithModal from '@/features/{domain}/components/{Domain}ListWithModal';

const {PageName}: React.FC = () => {
  const [form] = Form.useForm();

  const { loading, {domain}ListInfo, onPageChange, onSearch, refresh } = use{Domain}List({
    form,
  });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <{Domain}SearchForm onSearch={onSearch} form={form} />
        <{Domain}ListWithModal
          {domain}ListInfo={domain}ListInfo}
          onPageChange={onPageChange}
          onRefresh={refresh}
        />
      </PageContainer>
    </Spin>
  );
};

export default {PageName};
```

### 方式二：跳转编辑模式

文件路径：`src/pages/{domain}/{PageName}/index.tsx`

```tsx
import React from 'react';

import { Form, Spin, Card, Button, Space, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { history } from 'umi';

import use{Domain}List from '@/features/{domain}/hooks/use{Domain}List';
import {Domain}SearchForm from '@/features/{domain}/components/{Domain}SearchForm';
import {Domain}Table from '@/features/{domain}/components/{Domain}Table';

const {PageName}: React.FC = () => {
  const [form] = Form.useForm();

  const { loading, {domain}ListInfo, onPageChange, onSearch } = use{Domain}List({
    form,
  });

  const onCreate = () => {
    history.push('/{domain}/create');
  };

  const onEdit = (record: any) => {
    history.push(`/{domain}/edit?id=${record.id}`);
  };

  const onDetail = (record: any) => {
    history.push(`/{domain}/detail?id=${record.id}`);
  };

  const onExport = () => {
    message.success('已触发导出');
  };

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <{Domain}SearchForm onSearch={onSearch} form={form} />
        <Card
          title="列表标题"
          extra={
            <Space>
              <Button onClick={onExport}>导出</Button>
              <Button type="primary" onClick={onCreate}>
                新建
              </Button>
            </Space>
          }
        >
          <{Domain}Table
            {domain}ListInfo={domain}ListInfo}
            onPageChange={onPageChange}
            onEdit={onEdit}
            onDetail={onDetail}
          />
        </Card>
      </PageContainer>
    </Spin>
  );
};

export default {PageName};
```

## File Structure

```
src/pages/{domain}/{PageName}/
└── index.tsx          # 页面组件（必须）

src/features/{domain}/
├── components/
│   ├── {Domain}SearchForm/       # 搜索表单
│   ├── {Domain}Table/            # 表格组件
│   ├── {Domain}EditModal/        # 编辑弹窗（可选）
│   └── {Domain}ListWithModal/    # 列表+弹窗容器（可选）
├── hooks/
│   ├── use{Domain}List.ts        # 列表数据管理
│   └── use{Domain}Edit.ts        # 编辑状态管理（可选）
└── types.ts                      # 类型定义
```

**注意：不在 pages 目录下创建 types.ts，所有类型定义在 features 层管理。**

## Key Behaviors

- 列表数据、loading、分页参数等状态由 `use{Domain}List` 管理
- form 实例在 Page 层创建，通过 props 传递给 SearchForm 和 use{Domain}List
- 搜索行为通过 `onSearch` 驱动 hook 重新获取数据
- 分页行为通过 `{Domain}Table` 的 `onPageChange` 驱动 hook 更新分页
- 编辑弹窗通过 `{Domain}ListWithModal` + `use{Domain}Edit` 实现（弹窗模式）
- 详情/编辑跳转通过 `history.push` 从 Page 层触发（跳转模式）

### 路由挂载约定（Umi Max）

- **列表页面文件生成后，必须在 `.umirc.ts` 的 `routes` 中显式挂载路由入口**，否则页面无法通过菜单或 URL 访问。
- 常见约定：
  - 路径：`/{domain}/list`，例如 `/order/list`
  - 组件：`@/pages/{domain}/{PageName}`，例如 `@/pages/order/OrderList`
  - 可选字段：`name`（用于菜单展示）、`icon`、`access`（权限）
- 示例：

```ts
routes: [
  {
    path: '/',
    redirect: '/order/list',
  },
  {
    name: '订单列表',
    path: '/order/list',
    component: '@/pages/order/OrderList',
    icon: 'table',
  },
];
```

## Rules

- **必须复用已有能力**
  - 不得在页面内部重新实现列表查询逻辑，必须使用 `use{Domain}List`
  - 表格与搜索区域优先使用现有组件 `{Domain}Table` 与 `{Domain}SearchForm`
- **Form 外置**
  - form 实例在 Page 层通过 `Form.useForm()` 创建
  - 通过 props 传递给 SearchForm 和 use{Domain}List
- **保持布局一致**
  - 页面外层使用 `Spin` 包裹整个内容，控制 loading 状态
  - 使用 `PageContainer` 或 `Card` 提供页面级布局
  - **优先使用 Tailwind CSS 完成微调布局（如 Space、Margin、Padding）**
- **职责单一**
  - Page 只负责组合组件，不承载复杂业务逻辑
  - 编辑弹窗逻辑封装在 `{Domain}ListWithModal` 或独立 hook 中
- **类型组织**
  - **禁止在 pages 目录下创建 types.ts 文件**
  - Props 类型直接在页面文件中定义
  - 领域通用类型放在 `src/features/{domain}/types.ts`
- **方法声明与提升**
  - 在 `useEffect` 等 hook 中调用的组件内部方法，建议使用 `function` 关键字声明并放置在 hook 调用之后。
  - 其他普通事件回调建议使用 `const` 箭头函数。
- **路由必须显式配置**
  - 生成新的列表页后，AI 必须检查 `.umirc.ts` 中是否已存在对应路由；如不存在，生成或建议添加 routes 配置

## Usage Scenarios

- 作为 AI 在生成其他类似列表场景时的参考模板
- 重构列表相关逻辑时，确保不破坏既有布局与交互模式
- 需要选择弹窗编辑或跳转编辑的列表页
