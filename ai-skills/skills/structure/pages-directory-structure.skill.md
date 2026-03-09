---
name: pages-directory-structure
description: 规范页面层目录结构的标准组织方式，指导 AI 在 pages 层创建符合项目规范的页面。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Pages Directory Structure Skill

本 Skill 定义**页面层目录结构**的标准组织方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/pages/` 下创建新的页面
- 需要组织页面层目录结构
- 需要保持页面层只负责组合，不承载复杂业务逻辑

## Directory Pattern

```
src/pages/
└── {domain}/                        # 业务域目录
    ├── {PageName}/                  # 页面目录（PascalCase）
    │   └── index.tsx                # 页面组件（必须）
    └── {AnotherPageName}/
        └── index.tsx
```

## File Structure Details

### 1. 业务域目录

```
src/pages/{domain}/
```

- 使用业务域名称的小写形式（如 `user`, `order`）
- 包含该业务域下的所有页面

### 2. 页面目录

```
src/pages/{domain}/{PageName}/
└── index.tsx           # 页面组件（必须）
```

- 页面目录使用 `PascalCase`（如 `UserList`, `OrderDetail`）
- 每个页面一个独立的目录
- 必须包含 `index.tsx` 作为页面入口
- **注意：不在 pages 目录下创建 types.ts，类型定义统一放在 features 层**

### 3. 页面组件文件

文件路径：`src/pages/{domain}/{PageName}/index.tsx`

- 使用 React Function Component
- 使用 TypeScript
- 只负责组合业务组件，不写复杂逻辑
- 允许少量与页面强相关的 UI 状态
- Props 类型直接在页面文件中定义（无需单独 types 文件）

## Complete Example

完整的页面层目录结构示例：

```
src/pages/
├── user/                            # 用户业务域
│   ├── UserList/                    # 用户列表页
│   │   └── index.tsx
│   └── UserDetail/                  # 用户详情页
│       └── index.tsx
│
├── order/                           # 订单业务域
│   ├── OrderList/                   # 订单列表页
│   │   └── index.tsx
│   └── OrderDetail/                 # 订单详情页
│       └── index.tsx
│
└── ...
```

## Page Code Structure

页面组件代码结构：

```tsx
// src/pages/{domain}/{PageName}/index.tsx

import { FC } from 'react';

import { PageContainer } from '@ant-design/pro-components';

import use{Domain}List from '@/features/{domain}/hooks/use{Domain}List';
import {Domain}SearchForm from '@/features/{domain}/components/{Domain}SearchForm';
import {Domain}Table from '@/features/{domain}/components/{Domain}Table';

// 如需要样式，取消下面注释
// import styles from './index.less';

interface {PageName}Props {
  // 页面级 props（通常路由页面无 props）
}

const {PageName}: FC<{PageName}Props> = () => {
  const { list, total, loading, queryParams, onSearch, onPageChange } = use{Domain}List();

  return (
    <PageContainer>
      <{Domain}SearchForm onSearch={onSearch} />
      <{Domain}Table
        dataSource={list}
        total={total}
        pagination={{
          current: queryParams.pageNo,
          pageSize: queryParams.pageSize,
        }}
        onPageChange={onPageChange}
      />
    </PageContainer>
  );
};

export default {PageName};
```

### 跨域数据桥接示例

订单详情页需要展示用户信息（跨域数据）：

```tsx
// pages/order/OrderDetail/index.tsx

import { useEffect } from 'react';

import { Card } from 'antd';

import { OrderDetailCard } from '@/features/order/components/OrderDetailCard';
import { useOrderDetail } from '@/features/order/hooks/useOrderDetail';

import { useUserDetail } from '@/features/user/hooks/useUserDetail';
import { UserInfoCard } from '@/features/user/components/UserInfoCard';

import { StatusTag } from '@/features/shared/components/StatusTag';

import { useSearchParams } from 'umi';

// 如需要样式，取消下面注释
// import styles from './index.less';

const OrderDetailPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get('id');

  // 获取订单数据
  const { order } = useOrderDetail(orderId);

  // 获取关联的用户数据（跨域获取）
  const { user } = useUserDetail(order?.userId);

  return (
    <div className={styles.container}>
      <OrderDetailCard order={order} />
      <UserInfoCard user={user} /> {/* 展示用户信息 */}
    </div>
  );
};

export default OrderDetailPage;
```

## Rules

- **目录命名**
  - 业务域目录使用 `camelCase`（如 `user`, `order`）
  - 页面目录使用 `PascalCase`（如 `UserList`, `OrderDetail`）
- **文件命名**
  - 页面组件文件固定为 `index.tsx`
  - **不在 pages 目录下创建 types.ts 文件**
- **职责边界**
  - 页面层只负责「组合」组件，不写复杂逻辑
  - 允许少量与页面强相关的 UI 状态（如当前 Tab、是否展示 Modal 等）
  - 数据请求逻辑下沉到 features 层
- **类型组织**
  - 领域通用类型放在 `src/features/{domain}/types.ts`
  - 页面级 Props 类型直接在页面文件中定义
  - **禁止在 pages 目录下创建 types.ts 文件**
- **路由关联**
  - 页面路径与路由配置对应
  - 路由配置位于 `src/routes.ts`

## Routing Configuration

页面与路由的关联配置：

```ts
// src/routes.ts
export default [
  {
    path: '/',
    redirect: '/user/list',
  },
  {
    name: '用户列表',
    path: '/user/list',
    component: './user/UserList',
  },
  {
    name: '用户详情',
    path: '/user/detail',
    component: './user/UserDetail',
  },
  {
    name: '订单列表',
    path: '/order/list',
    component: './order/OrderList',
  },
];
```

## Usage Scenarios

- 新建页面时快速搭建目录和文件结构
- 保持项目页面层结构一致性
- 明确页面层与 features 层的职责边界
