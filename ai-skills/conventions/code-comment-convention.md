# Code Comment Convention

本规范定义代码注释的编写规则，确保注释清晰、有用、易于维护。

## 注释原则

- **必要原则**：注释应解释"为什么"，而不是"做了什么"
- **及时原则**：代码修改时同步更新注释
- **简洁原则**：注释应简洁明了，避免冗余
- **准确原则**：注释必须与代码逻辑一致

## 注释类型

### 1. 文件头注释

新文件建议添加文件头注释，说明文件用途：

```typescript
/**
 * 用户列表页面
 *
 * 功能：展示用户列表，支持搜索、分页、编辑
 * 路由：/user/list
 */
```

### 2. JSDoc 注释

公共 API、函数、类、复杂逻辑使用 JSDoc 格式：

````typescript
/**
 * 获取用户列表
 *
 * @param query - 查询参数，包含分页和筛选条件
 * @returns 返回用户列表和总数
 * @throws 当接口返回非 200 状态时抛出错误
 *
 * @example
 * ```ts
 * const { list, total } = await fetchUserList({ page: 1, pageSize: 10 });
 * ```
 */
export async function fetchUserList(
  query: UserListQuery,
): Promise<UserListResult> {
  // ...
}

/**
 * 用户表格组件 Props
 */
interface UserTableProps {
  /** 用户数据列表 */
  data: User[];
  /** 加载状态 */
  loading: boolean;
  /** 编辑回调 */
  onEdit: (user: User) => void;
}
````

### 3. 单行注释

简短说明使用单行注释：

```typescript
// 重置分页到第一页
setQuery({ ...query, pageNo: 1 });

// 缓存计算结果，避免重复计算
const memoizedData = useMemo(() => {
  return processData(data);
}, [data]);
```

### 4. 多行注释

复杂逻辑使用多行注释：

```typescript
/*
 * 处理逻辑说明：
 * 1. 先验证用户权限
 * 2. 再检查数据完整性
 * 3. 最后执行更新操作
 */
```

### 5. TODO / FIXME 注释

标记待办事项：

```typescript
// TODO: 添加权限校验
function deleteUser(id: number) {
  // ...
}

// FIXME: 处理大数据量时的性能问题
function renderTable(data: Item[]) {
  // ...
}

// HACK: 临时方案，后续需要优化
function tempSolution() {
  // ...
}
```

### 6. 代码组织

代码按以下顺序组织，**不需要**添加分区注释，仅通过空行分隔：

```typescript
import { FC, useState, useEffect } from 'react';

import { Button, Table } from 'antd';

import UserTable from '@/components/UserTable';

import { fetchUserList } from '@/services/user';

import styles from './index.less';
```

## 应该注释的场景

### 1. 复杂业务逻辑

```typescript
/**
 * 计算订单折扣价格
 *
 * 规则：
 * - 会员等级 1：9.5 折
 * - 会员等级 2：9 折
 * - 会员等级 3：8.5 折
 * - 订单金额满 1000 额外 9.5 折
 */
function calculateDiscountPrice(order: Order): number {
  // ...
}
```

### 2. 特殊处理 / 边界情况

```typescript
// 后端返回的数据可能为 null，需要做空值处理
const safeData = data ?? [];

// 兼容旧版本数据结构，新版本已废弃该字段
const value = item.oldField ?? item.newField;
```

### 3. 临时解决方案

```typescript
// FIXME: 临时使用 setTimeout 解决异步加载问题
// 后续需要改为使用 Promise 或 async/await
setTimeout(() => {
  loadData();
}, 100);
```

### 4. 性能优化说明

```typescript
// 使用 useMemo 缓存计算结果，避免每次渲染重新计算
// 该计算涉及大量数据处理，优化前耗时约 200ms
const processedData = useMemo(() => {
  return heavyCalculation(rawData);
}, [rawData]);
```

## 不应该注释的场景

### 1. 显而易见的代码

```typescript
// ❌ 不好的注释
// 设置用户名为张三
setUserName('张三');

// ❌ 不好的注释
// i 自增 1
i++;

// ✅ 不需要注释，代码自解释
setUserName('张三');
i++;
```

### 2. 过时的注释

```typescript
// ❌ 错误的注释（函数已修改但注释未更新）
// 获取用户详情
function fetchOrderList() {
  // ...
}
```

### 3. 冗余的注释

```typescript
// ❌ 重复代码逻辑的注释
// 如果 loading 为 true，返回加载中
if (loading) {
  return <Loading />;
}
```

## TypeScript 类型注释

优先使用类型系统代替注释：

```typescript
// ❌ 不好的做法
// userId 是数字类型
const userId: number = 123;

// ✅ 好的做法，类型已说明
const userId: number = 123;

// ❌ 不好的做法
// 返回用户列表，包含 id、name、email
function getUsers(): any {
  // ...
}

// ✅ 好的做法，使用类型定义
interface User {
  id: number;
  name: string;
  email: string;
}

function getUsers(): User[] {
  // ...
}
```

## 注释格式

### 单行注释

```typescript
// 空格后写注释内容
const count = 0; // 计数器

// 独占一行的注释，空行分隔
// 初始化数据
const data = [];
```

### 多行注释

```typescript
/*
 * 这是多行注释
 * 每行以 * 开头，与第一行的 * 对齐
 */

/**
 * JSDoc 注释
 * 使用双星号开头
 */
```

## 国际化注释

项目中统一使用中文注释：

```typescript
// ✅ 使用中文注释
// 获取用户列表
function fetchUserList() {}

// ❌ 避免中英文混用
// Get user list
function fetchUserList() {}
```

## Rules

- **解释意图**：注释解释"为什么"，代码解释"怎么做"
- **及时更新**：代码修改时同步更新注释
- **避免废话**：删除显而易见的注释
- **使用 JSDoc**：公共 API 使用 JSDoc 格式
- **标记 TODO**：使用 TODO/FIXME 标记待办事项
- **统一语言**：统一使用中文注释
