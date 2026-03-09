---
name: feature-directory-structure
description: 规范业务域目录结构的标准组织方式，指导 AI 在 features 层创建完整的业务域目录。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Feature Directory Structure Skill

本 Skill 定义**业务域目录结构**的标准组织方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/` 下创建新的业务域
- 需要为业务域创建完整的目录结构
- 需要保持业务模块之间解耦并支持长期扩展

## Directory Pattern

```
src/features/{domain}/
├── components/              # 业务组件
│   ├── {Domain}Table/       # 表格组件
│   │   ├── index.tsx
│   │   └── _columns.tsx
│   ├── {Domain}SearchForm/  # 搜索表单组件
│   │   └── index.tsx
│   └── {Domain}EditModal/   # 编辑弹窗组件
│       └── index.tsx
├── hooks/                   # 业务逻辑 hooks
│   └── use{Domain}List.ts   # 列表数据管理 hook
├── services/                # 业务接口 / 领域逻辑
│   └── index.ts             # service 实现
└── types.ts                 # 业务模型定义
```

## File Structure Details

### 1. Components 目录

```
components/
├── {Domain}Table/
│   ├── index.tsx           # 表格组件出口
│   └── _columns.tsx        # 列定义（私有）
├── {Domain}SearchForm/
│   └── index.tsx           # 搜索表单组件
└── {Domain}EditModal/
    └── index.tsx           # 编辑弹窗组件
```

每个组件目录：

- 必须包含 `index.tsx` 作为唯一对外出口
- 主组件文件与目录名保持一致
- 私有子组件使用下划线前缀（如 `_columns.tsx`）
- **优先使用 Tailwind CSS 类名处理样式，仅在必要时创建 `index.less`**

### 2. Hooks 目录

```
hooks/
└── use{Domain}List.ts      # 列表数据管理 hook
```

Hook 文件：

- 命名使用 `use` 前缀
- 功能单一，职责清晰
- 返回数据和操作方法

### 3. Services 目录

```
services/
├── index.ts                # 对外出口（可选）
└── index.ts                # service 实现
```

Service 文件：

- 命名使用 `camelCase`
- 包含列表查询、详情查询、更新等方法
- 类型定义完备

### 4. Types 文件

```
types.ts                    # 业务模型定义
```

类型定义文件：

- 包含实体类型、查询参数类型、响应类型
- 可选包含 DTO 类型
- 使用 TypeScript 接口定义

### 5. Pages 与路由（Umi Max 项目特有约束）

虽然本 Skill 主要约束 `src/features/` 目录，但在实际落地业务域时，**必须同时确保 pages 层与路由配置就绪**：

- 页面文件路径：

```text
src/pages/{domain}/
└── {PageName}/
    └── index.tsx
```

- 路由配置（`.umirc.ts`）中必须显式增加对应入口，例如订单列表：

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

> 规则：**创建/重构某个业务域的列表或详情页面时，AI 不仅要生成 `src/features/{domain}` 下的能力，还要确保在 `src/pages/{domain}/{PageName}` 创建页面文件，并在 `.umirc.ts` 的 `routes` 中挂上入口。**

## Complete Example

完整的业务域目录结构示例：

```
src/features/
├── user/                    # 用户业务域
│   ├── components/
│   │   ├── UserTable/
│   │   │   ├── index.tsx
│   │   │   └── _columns.tsx
│   │   ├── UserFilterForm/
│   │   │   └── index.tsx
│   │   └── UserEditModal/
│   │       └── index.tsx
│   ├── hooks/
│   │   └── useUserList.ts
│   ├── services/
│   │   └── index.ts
│   └── types.ts
│
├── order/                   # 订单业务域
│   ├── components/
│   │   ├── OrderTable/
│   │   │   ├── index.tsx
│   │   │   └── _columns.tsx
│   │   ├── OrderSearchForm/
│   │   │   └── index.tsx
│   │   └── OrderEditModal/
│   │       └── index.tsx
│   ├── hooks/
│   │   └── useOrderList.ts
│   ├── services/
│   │   └── index.ts
│   └── types.ts
│
└── shared/                   # 共享业务能力（可选）
    ├── components/
    ├── hooks/
    ├── services/
    └── types.ts
```

## Rules

### 命名规范

- **目录命名**
  - 业务域目录使用 `camelCase`（如 `user`, `order`）
  - 组件目录使用 `PascalCase`（如 `UserTable`, `OrderSearchForm`）
- **文件命名**
  - 组件文件使用 `PascalCase`（如 `UserTable.tsx`）
  - Hooks 文件使用 `camelCase`（如 `useUserList.ts`）
  - Services 文件使用 `index.ts`
  - 私有文件使用下划线前缀（如 `_columns.tsx`）
- **类型命名**
  - 实体类型使用 `PascalCase`（如 `User`, `Order`）
  - 查询参数类型使用 `{Domain}ListQuery`
  - 响应类型使用 `{Domain}ListResult`

### 职责边界

- `components/`：属于该业务的私有组件
- `hooks/`：该业务的状态与副作用逻辑
- `services/`：该业务的接口定义与转换
- `types.ts`：业务模型定义

### 依赖规则（重要）

#### 1. 禁止跨域依赖

**严格禁止**一个 feature 直接 import 另一个 feature 的内容：

```typescript
// ❌ 禁止：order feature 直接引入 user feature
import { UserTable } from '@/features/user/components/UserTable';
import { useUserList } from '@/features/user/hooks/useUserList';
import { fetchUserList } from '@/features/user/services';
import type { User } from '@/features/user/types';
```

#### 2. 跨域数据通信方式

当需要在订单页面展示用户信息时，正确的方式：

**方式一：页面层桥接**（推荐）

```typescript
// pages/order/OrderDetail/index.tsx
import { useUserDetail } from '@/features/user/hooks/useUserDetail'; // ✅ 页面可以引入
import { OrderDetail } from '@/features/order/components/OrderDetail'; // ✅ 同域引入

const OrderDetailPage = () => {
  const { order } = useOrderDetail();
  const { user } = useUserDetail(order.userId); // 页面层获取用户数据

  return <OrderDetail order={order} user={user} />; // 通过 props 传递
};
```

**方式二：shared 层抽象**

将通用的组件、hooks、类型放到 `features/shared/`：

```
src/features/
├── shared/                  # 共享业务能力
│   ├── components/          # 跨业务复用的组件
│   │   ├── UserInfoCard/    # 用户信息卡片（在订单、商品等页面复用）
│   │   ├── StatusTag/       # 状态标签
│   │   └── DataTable/       # 通用表格封装
│   ├── hooks/               # 跨业务复用的 hooks
│   │   ├── useCurrentUser.ts
│   │   └── usePermission.ts
│   ├── services/            # 跨业务复用的 services
│   │   └── index.ts
│   └── types.ts             # 跨业务的基础类型
├── user/
└── order/
```

使用 shared 层：

```typescript
// ✅ 正确：从 shared 层引入
import { UserInfoCard } from '@/features/shared/components/UserInfoCard';
import { useCurrentUser } from '@/features/shared/hooks/useCurrentUser';
```

#### 3. shared 层原则

- **纯净性**：shared 层只能依赖第三方库，不能依赖任何业务 feature
- **稳定性**：shared 层内容变更需要谨慎，影响面广
- **通用性**：只有真正跨业务复用的内容才放入 shared

### 完整目录结构（含 shared）

```
src/features/
├── shared/                  # 共享业务能力
│   ├── components/          # 跨业务组件
│   ├── hooks/               # 跨业务 hooks
│   ├── services/            # 跨业务 services
│   └── types.ts             # 跨业务类型
├── user/                    # 用户业务域（仅依赖 shared）
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
└── order/                   # 订单业务域（仅依赖 shared）
    ├── components/
    ├── hooks/
    ├── services/
    └── types.ts
```

## Usage Scenarios

- 新建业务域时快速搭建目录结构
- 保持项目业务模块结构一致性
- 避免组件文件散落、职责不清
