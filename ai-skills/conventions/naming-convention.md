# Naming Convention

本规范定义项目中各类标识符的命名规则，确保代码风格统一、可读性强。

## 目录命名

| 场景          | 规范       | 示例                             |
| ------------- | ---------- | -------------------------------- |
| 业务域目录    | camelCase  | `user`, `order`, `systemSetting` |
| 组件目录      | PascalCase | `UserTable`, `OrderSearchForm`   |
| 页面目录      | PascalCase | `UserList`, `OrderDetail`        |
| Hooks 目录    | camelCase  | `hooks`, `useUserList.ts`        |
| Services 目录 | camelCase  | `services`, `index.ts`           |

## 文件命名

| 场景          | 规范                   | 示例                                   |
| ------------- | ---------------------- | -------------------------------------- |
| 组件文件      | PascalCase             | `UserTable.tsx`, `OrderSearchForm.tsx` |
| Hooks 文件    | camelCase              | `useUserList.ts`, `useOrderDetail.ts`  |
| Services 文件 | index.ts               | `index.ts`                             |
| 页面文件      | 固定 `index.tsx`       | `pages/user/UserList/index.tsx`        |
| 类型定义文件  | 固定 `types.ts`        | `features/user/types.ts`               |
| 私有文件      | 下划线前缀             | `_columns.tsx`, `_utils.ts`            |
| 样式文件      | 固定命名               | `index.less`, `styles.module.css`      |
| Skill 文件    | kebab-case + .skill.md | `list-page-composition.skill.md`       |

## 代码标识符命名

### 变量与常量

| 场景              | 命名方式         | 示例                           |
| ----------------- | ---------------- | ------------------------------ |
| 普通变量          | camelCase        | `const userList = []`          |
| 简单原始值常量    | UPPER_SNAKE_CASE | `const MAX_SIZE = 100`         |
| 映射对象/字典常量 | camelCase        | `const orderStatusMap = {...}` |

```typescript
// 普通变量 - camelCase
const userList = [];
const orderDetail = {};

// 简单原始值常量 - UPPER_SNAKE_CASE（全大写下划线）
const DEFAULT_PAGE_SIZE = 10;
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 映射对象/字典常量 - camelCase（首字母小写）
// 用于状态映射、枚举值映射等场景
const orderStatusMap = {
  1: '待支付',
  2: '已支付',
  3: '已发货',
  4: '已完成',
  5: '已取消',
} as const;

const userRoleMap: Record<number, string> = {
  1: '管理员',
  2: '普通用户',
  3: '访客',
};

// 枚举常量（简单枚举定义）- UPPER_SNAKE_CASE
const USER_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
} as const;

// 布尔变量 - 使用 is/has/can/should 前缀
const isLoading = false;
const hasError = true;
const canEdit = true;
const shouldRefresh = false;
```

### 函数与类

```typescript
// 普通函数 - camelCase
function formatDate(date: string): string {}
function getUserList(): User[] {}

// 类/构造函数 - PascalCase
class UserService {}
class OrderController {}

// React 组件 - PascalCase
function UserTable() {}
function OrderSearchForm() {}

// Hooks - camelCase，以 use 开头
function useUserList() {}
function useOrderDetail() {}

// 事件处理函数 - on + 事件名
const onClick = () => {};
const onSubmit = () => {};
const onSearch = () => {};

// 异步函数 - fetch/get/query/create/update/delete 前缀
const fetchUserList = async () => {};
const getUserDetail = async () => {};
const queryOrderList = async () => {};
const createUser = async () => {};
const updateUser = async () => {};
const deleteUser = async () => {};

// 方法声明方式建议：
// 1. 如果方法被 hook (如 useEffect) 内部直接引用，必须使用 function 关键字声明并置于 hook 之后（利用提升）。
// 2. 普通事件处理和业务逻辑建议使用 const 箭头函数。
```

### 类型定义

```typescript
// 接口 - PascalCase
interface User {
  id: number;
  name: string;
}

interface OrderListQuery {
  page: number;
  pageSize: number;
}

// 类型别名 - PascalCase
type UserRole = 'admin' | 'user';
type OrderStatus = 0 | 1 | 2;

// 枚举 - PascalCase + 值 UPPER_SNAKE_CASE
enum UserStatus {
  ENABLED = 1,
  DISABLED = 0,
}

// 泛型参数 - T / K / V / E / P 单字母或 PascalCase 描述性名称
interface Response<T> {
  data: T;
  code: number;
}

interface PaginatedResult<Item> {
  list: Item[];
  total: number;
}
```

### Props 与状态

```typescript
// Props 类型 - 组件名 + Props
interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
}

// State 类型 - 组件名 + State（可选）
interface UserListState {
  query: UserListQuery;
  selectedIds: number[];
}
```

## CSS 类名命名

### CSS Modules

```css
/* 使用 camelCase */
.userTable {
}
.searchForm {
}
.submitButton {
}
```

### 普通 CSS/Less

```css
/* 使用 BEM 命名规范 */
/* Block */
.user-table {
}

/* Element */
.user-table__header {
}
.user-table__cell {
}

/* Modifier */
.user-table__cell--active {
}
.user-table__cell--disabled {
}
```

## 路由与路径

```typescript
// URL 路径 - kebab-case
/user/list
/order/detail
/system-setting/permission

// 路由名称 - 中文，语义清晰
{ name: '用户列表', path: '/user/list' }
{ name: '订单详情', path: '/order/detail' }
```

## API 接口命名

```typescript
// RESTful 风格
GET    /api/users          // 获取列表
GET    /api/users/:id      // 获取详情
POST   /api/users          // 创建
PUT    /api/users/:id      // 更新
DELETE /api/users/:id      // 删除

// 函数命名对应
fetchUserList()      // 获取列表
fetchUserDetail(id)  // 获取详情
createUser(data)     // 创建
updateUser(id, data) // 更新
deleteUser(id)       // 删除
```

## 缩写规范

| 缩写     | 完整形式   | 使用场景             |
| -------- | ---------- | -------------------- |
| `btn`    | button     | 不推荐，使用完整单词 |
| `cnt`    | count      | 不推荐，使用完整单词 |
| `cfg`    | config     | 不推荐，使用完整单词 |
| `err`    | error      | 不推荐，使用完整单词 |
| `idx`    | index      | 不推荐，使用完整单词 |
| `len`    | length     | 不推荐，使用完整单词 |
| `msg`    | message    | 不推荐，使用完整单词 |
| `num`    | number     | 不推荐，使用完整单词 |
| `params` | parameters | 推荐，常用缩写       |
| `props`  | properties | 推荐，React 标准     |
| `ref`    | reference  | 推荐，React 标准     |

**原则**：除行业通用缩写（如 API、URL、HTTP、HTML）外，优先使用完整单词，避免不必要的缩写。

## 文件导出命名

```typescript
// 默认导出 - 与文件名一致
// UserTable/index.tsx
export default function UserTable() {}

// 命名导出 - 保持命名一致
// hooks/useUserList.ts
export function useUserList() {}

// 类型导出 - 使用 type 关键字
export type { User, UserListQuery };
```

## Rules

- **一致性**：同一项目中保持命名风格统一
- **可读性**：命名应清晰表达用途，避免无意义名称
- **避免单字母**：除循环变量（i, j, k）和泛型参数（T, K, V）外，避免使用单字母命名
- **语义化**：布尔值使用语义化前缀（is/has/can/should）
- **避免拼音**：禁止使用拼音命名，使用英文单词
