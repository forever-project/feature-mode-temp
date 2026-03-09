---
name: ai-global-config
description: AI 全局行为约束（"宪法"）。所有 Skill 生成的代码必须遵守本文件规则，确保输出一致、可维护的前端代码。
license: MIT
metadata:
  author: frontend-team
  version: '2.0.0'
---

# AI Global Rules

本文件是 ai-skills 仓库中 **所有 Skill 的全局"宪法"**。无论是页面生成、组件生成还是 service 生成，AI 都必须优先遵守本文件规则。

当本文件与单个 Skill 的局部规则冲突时，**以本文件为最高优先级**。

---

## 1. 技术栈约束

- **框架**: React 18 Function Component
- **语言**: TypeScript（严格模式，禁止 `any`）
- **UI 库**: Ant Design v5 (核心原则：**首选 antd**。除 `PageContainer` 等容器组件外，若所需组件在本项目中尚未实现，必须默认从 `antd` 导入，保持代码透明度)
- **请求库**: Umi Max Request（`import { request } from '@umijs/max'`）
- **构建工具**: Umi Max（路由、状态管理、权限、请求）
- **样式**: 优先使用 Tailwind CSS（原子类），复杂样式或覆盖 antd 时使用 Less / CSS Modules

---

## 2. 目录结构与职责

### 2.1 核心目录

```
src/
├── pages/                    # 页面层 - 只做组合
│   └── {domain}/
│       └── {PageName}/
│           └── index.tsx
├── features/                 # 业务核心层 - 封装业务逻辑
│   └── {domain}/
│       ├── components/       # 业务组件
│       │   ├── {Domain}Table/         # 表格组件
│       │   ├── {Domain}SearchForm/    # 搜索表单
│       │   ├── {Domain}EditModal/     # 编辑弹窗
│       │   └── {Domain}ListWithModal/ # 列表+弹窗容器（可选）
│       ├── hooks/            # 业务 Hooks
│       │   ├── use{Domain}List.ts     # 列表数据管理
│       │   └── use{Domain}Edit.ts     # 编辑状态管理（可选）
│       ├── services/         # 业务接口
│       └── types.ts          # 业务类型
├── components/               # 基础组件 - 纯 UI
├── hooks/                    # 通用 Hooks
├── services/                 # 全局服务
└── utils/                    # 工具函数
```

### 2.2 职责边界

| 层级 | 职责 | 可以引入 | 禁止 |
| --- | --- | --- | --- |
| `pages/` | 组合业务组件、拼装布局 | 同域 feature、跨域 feature、shared | 复杂业务逻辑 |
| `features/` | 封装业务逻辑、组件、hooks | 同域模块、shared | 其他 feature |
| `components/` | 纯 UI 展示 | shared | 业务逻辑、接口调用 |

### 2.3 重要禁令

- **禁止** feature 之间直接 import（如 order 引入 user）
- **禁止** 在 pages 目录下创建 `types.ts` 文件
- **禁止** 在 pages 目录下创建 `service.ts` 文件
- **禁止** 页面组件中直接使用 `request` 或 `fetch`（必须通过 service 层封装）

### 2.4 跨域依赖处理

当需要在订单页面展示用户信息时：

**❌ 错误：feature 间直接引入**

```typescript
// features/order/components/OrderCard.tsx
import { UserInfo } from '@/features/user/components/UserInfo'; // 禁止！
```

**✅ 正确：通过 shared 层复用**

```typescript
// features/shared/components/UserInfoCard/index.tsx
// 将通用的用户信息展示组件放到 shared

// features/order/components/OrderCard.tsx
import { UserInfoCard } from '@/features/shared/components/UserInfoCard'; // 可以引入
```

---

## 3. 代码组织规范（强制遵守）

### 3.1 文件导入顺序（强制 7 步法）

所有文件必须严格遵守以下导入顺序，不同组之间必须保留空行：

```typescript
// 1. React
import { FC, useState, useEffect } from 'react';

// 2. 第三方 npm 包（antd、umi 等）
import { Button, Table } from 'antd';
import { history } from 'umi';

// 3. 组件
import UserTable from '@/components/UserTable';
import { useUserList } from '@/features/user/hooks/useUserList';

// 4. 其他（接口、常量、工具）
import { fetchUserList } from '@/services/user';
import { formatDate } from '@/utils/date';

// 5. 样式（优先使用 Tailwind CSS 类名，如需 index.less 则导入）
// import styles from './index.less';

// 6. Props 类型声明
interface UserListProps {
  // ...
}

// 7. 组件实现
const UserList: FC<UserListProps> = () => {
  // ...
};
```

### 3.2 变量声明顺序

```typescript
const Component = () => {
  // 1. props 解构
  const { initialData } = props;

  // 2. state 声明
  const [list, setList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 3. hooks 使用（性能优化相关）
  const memoizedData = useMemo(() => process(list), [list]);

  // 4. 方法定义（使用 onXXX 命名）
  // 注意：如果 useEffect 等 hook 调用了方法，该方法必须使用 function 声明并放在 hook 之后
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() { /* ... */ }

  const onSearch = () => { };
  const onSubmit = async () => { };

  // 5. JSX 返回
  return (...);
};
```

---

## 4. 命名规范

### 4.1 目录与文件

| 类型          | 命名规范   | 示例                           |
| ------------- | ---------- | ------------------------------ |
| 业务域目录    | camelCase  | `user`, `order`                |
| 组件目录      | PascalCase | `UserTable`, `OrderSearchForm` |
| 页面目录      | PascalCase | `UserList`, `OrderDetail`      |
| Hooks 文件    | camelCase  | `useUserList.ts`               |
| Services 文件 | index.ts   | `index.ts`                     |
| 私有文件      | 下划线前缀 | `_columns.tsx`                 |

### 4.2 代码标识符

| 类型         | 命名规范                       | 示例                                    |
| ------------ | ------------------------------ | --------------------------------------- |
| 组件         | PascalCase                     | `UserTable`, `OrderForm`                |
| Hooks        | camelCase + use 前缀           | `useUserList`, `useOrderDetail`         |
| 函数         | camelCase                      | `fetchUserList`, `onSearch`, `onSubmit` |
| 常量         | UPPER_SNAKE_CASE               | `DEFAULT_PAGE_SIZE`, `MAX_RETRY`        |
| 布尔变量     | is/has/can 前缀                | `isLoading`, `hasError`                 |
| 类型/接口    | PascalCase                     | `User`, `OrderListQuery`                |
| **事件处理** | **on + 动作**                  | `onSearch`, `onEdit`, `onCreate`        |
| 异步函数     | fetch/get/create/update/delete | `fetchUserList`, `createOrder`          |

### 4.3 Props 类型命名

```typescript
// 组件名 + Props
interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
}
```

---

## 5. 类型定义规范

### 5.1 类型文件位置

- **领域类型**: `src/features/{domain}/types.ts`
- **页面 Props**: 直接在页面文件中定义
- **禁止** 在 `pages/` 下创建 `types.ts`

### 5.2 列表响应结构（统一格式）

```typescript
// 统一的列表响应结构
export interface {Domain}ListInfo {
  list: {Domain}[];
  total: number;
  pageNo: number;      // 默认使用 pageNo，但必须优先遵循上下文（API/已有代码）中定义的字段名
  pageSize: number;    // 默认使用 pageSize，但必须优先遵循上下文中定义的字段名
}

// 弹窗状态结构
export interface ModalInfo {
  type: 'add' | 'edit';
  record: {Domain} | null;
}
```

### 5.3 TypeScript 约束

- **禁止** 使用 `any`，使用 `unknown` 或显式类型
- **必须** 为函数参数和返回值声明类型
- **必须** 为组件 Props 声明接口类型
- 泛型参数使用描述性名称：`Item`, `TData` 而非单字母

---

## 6. 接口与请求规范

### 6.1 Service 层规范

- 所有接口请求必须抽到 `features/{domain}/services/` 或 `services/`
- 页面组件中**禁止**直接调用 `request`
- Service 函数命名：`fetchXxxList`, `fetchXxxDetail`, `createXxx`, `updateXxx`, `deleteXxx`

### 6.2 请求示例

```typescript
// features/user/services/index.ts
export async function fetchUserList(params: UserListQuery): Promise<UserListInfo> {
  // 返回统一结构
  const res = await request.get('/api/users', { params });
  return {
    list: res.data.list,
    total: res.data.total,
    // 提示：字段名应优先匹配上下文/API 返回的字段名，fallback 为 pageNo/pageSize
    pageNo: res.data.pageNo || params.pageNo || res.data.page || params.page,
    pageSize: res.data.pageSize || params.pageSize,
  };
}
```

### 6.3 错误处理

- Service 层统一处理错误提示（`message.error`）
- 区分业务错误和系统错误
- 页面层可选择性捕获处理

---

## 7. 组件规范

### 7.1 组件结构

```typescript
// 1. 导入（按 7 步法）

// 2. Props 类型
interface Props {
  userListInfo?: UserListInfo;
  onEdit: (user: User) => void;
}

// 3. 组件实现
const UserTable: React.FC<Props> = (props) => {
  // 实现
};

// 4. 默认导出
export default UserTable;
```

### 7.2 组件目录结构

```
features/{domain}/components/{ComponentName}/
├── index.tsx          # 对外出口（优先使用 Tailwind CSS）
├── _SubComponent.tsx  # 私有子组件（下划线前缀）
└── index.less         # 样式（可选，仅在 Tailwind 无法满足时使用）
```

### 7.3 样式导入

优先使用 Tailwind CSS 提供的 Utility Classes。如果组件目录下确需 `index.less` 文件，则导入样式：

```typescript
// 5. 样式（优先使用 Tailwind CSS，仅在必要时导入）
// import styles from './index.less';
```

### 7.4 Ant Design 组件属性

```typescript
// Modal 使用 destroyOnHidden（v5 推荐）
<Modal destroyOnHidden ... />

// Table 必须设置 rowKey
<Table rowKey="id" ... />
```

---

## 8. Hooks 规范

### 8.1 Hook 命名

- 必须以 `use` 开头
- 描述性命名：`useUserList`, `useOrderForm`

### 8.2 Hook 结构

```typescript
// useUserList.ts - 列表数据管理
export const useUserList = (options: { form: FormInstance }) => {
  const { form } = options;
  const [userListInfo, setUserListInfo] = useState<UserListInfo>();
  const [loading, setLoading] = useState(false);

  // 不使用 useCallback，保持简洁
  const onSearch = () => {};
  const onPageChange = (pageNo: number, pageSize: number) => {};

  return { userListInfo, loading, onSearch, onPageChange, refresh };
};

// useUserEdit.ts - 编辑弹窗状态管理
export const useUserEdit = (options: { onSuccess?: () => void }) => {
  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

  const openModal = (type: 'add' | 'edit', record?: User) => {
    setModalInfo({ type, record: record || null });
  };

  const closeModal = () => setModalInfo(null);

  // 使用 !!modalInfo 判断弹窗是否打开
  const isOpen = !!modalInfo;

  return { modalInfo, openModal, closeModal, isOpen };
};
```

### 8.3 useCallback 使用原则

- **默认不使用** useCallback
- 只有在出现性能问题时才考虑添加
- 保持代码简洁优先

---

## 9. 页面组合规范

### 9.1 Form 外置模式

Form 实例在 Page 层创建，通过 props 传递给 SearchForm 和 Hook：

```typescript
const UserListPage = () => {
  const [form] = Form.useForm(); // Page 层创建

  const { loading, userListInfo, onSearch } = useUserList({ form });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <UserSearchForm form={form} onSearch={onSearch} />
        <UserTable userListInfo={userListInfo} />
      </PageContainer>
    </Spin>
  );
};
```

### 9.2 弹窗编辑模式

```typescript
const UserListPage = () => {
  const [form] = Form.useForm();
  const { loading, userListInfo, onSearch, refresh } = useUserList({ form });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <UserSearchForm form={form} onSearch={onSearch} />
        {/* 使用容器组件封装 Table + Modal */}
        <UserListWithModal userListInfo={userListInfo} onRefresh={refresh} />
      </PageContainer>
    </Spin>
  );
};
```

### 9.3 跳转编辑模式

```typescript
const StudentListPage = () => {
  const [form] = Form.useForm();
  const { loading, studentListInfo } = useStudentList({ form });

  const onCreate = () => history.push('/student/create');
  const onEdit = (record) => history.push(`/student/edit?id=${record.id}`);

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <StudentSearchForm form={form} onSearch={onSearch} />
        <Card extra={<Button onClick={onCreate}>新建</Button>}>
          <StudentTable onEdit={onEdit} />
        </Card>
      </PageContainer>
    </Spin>
  );
};
```

### 9.4 路由配置要求（Umi Max）

在本项目中，**页面文件本身并不等于路由已生效**，所有可访问入口必须显式配置在 Umi Max 路由中：

- **必须**在 `.umirc.ts` 的 `routes` 数组中为新页面增加配置，例如：

```ts
export default defineConfig({
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
  ],
});
```

- 生成新的列表页或详情页时：
  - 路径遵循 `/{domain}/{page}` 风格，如 `/order/list`、`/order/detail`
  - `component` 使用 `@/pages/{domain}/{PageName}` 形式，不带 `index.tsx`
  - 如需菜单展示，配置 `name`、`icon`，如需权限控制，结合 access 约定增加 `access` 字段

---

## 10. Git 提交规范

### 10.1 Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 10.2 Type 类型

| 类型       | 说明                   |
| ---------- | ---------------------- |
| `feat`     | 新功能                 |
| `fix`      | 修复 Bug               |
| `docs`     | 文档更新               |
| `style`    | 代码格式（不影响逻辑） |
| `refactor` | 重构                   |
| `perf`     | 性能优化               |
| `test`     | 测试相关               |
| `chore`    | 构建/工具相关          |

### 10.3 示例

```bash
feat(user): add user list page

- Add UserTable component with pagination
- Add UserSearchForm with filter options

Closes #123
```

---

## 11. 与其他文件的关系

### 11.1 优先级

当本文件与以下文件冲突时：

1. **单个 Skill 文件** → 以本文件为准
2. **conventions/\*.md** → 以本文件为准
3. **examples/** → 以本文件为准

### 11.2 协作关系

```
SKILL.md (本文件)
    ↓ 约束
conventions/*.md
    ↓ 具体化
skills/*.skill.md
    ↓ 实现
生成代码
```

---

## 12. 检查清单

生成代码前，确认以下事项：

- [ ] 使用了 React Function Component + TypeScript
- [ ] 没有使用 `any` 类型
- [ ] 导入顺序符合 7 步法
- [ ] 如有 `index.less` 文件则导入样式
- [ ] 没有在 pages 目录下创建 types.ts
- [ ] 没有在页面中直接使用 request
- [ ] **优先使用 Tailwind CSS 进行样式开发**
- [ ] 命名符合规范（事件处理使用 onXXX）
- [ ] **分页字段命名优先遵循上下文（API/TS 类型），无明确依据时使用 pageNo/pageSize**
- [ ] **Form 实例在 Page 层创建并传递给子组件**
- [ ] **Modal 使用 destroyOnHidden 而非 destroyOnClose**
- [ ] Props 有明确的类型定义
- [ ] 文件路径使用占位符（如 `{Domain}`, `{PageName}`）
- [ ] **TSX/JSX 文件代码行数不超过 300 行**

---

## 13. 快速参考

### 代码模板占位符

| 占位符            | 含义                     | 示例                  |
| ----------------- | ------------------------ | --------------------- |
| `{Domain}`        | 业务域名称（首字母大写） | User, Order           |
| `{domain}`        | 业务域名称（小写）       | user, order           |
| `{PageName}`      | 页面名称                 | UserList, OrderDetail |
| `{ComponentName}` | 组件名称                 | UserTable, OrderForm  |

### 文件路径模板

```
src/pages/{domain}/{PageName}/index.tsx
src/features/{domain}/components/{ComponentName}/index.tsx
src/features/{domain}/hooks/use{Domain}List.ts
src/features/{domain}/services/index.ts
src/features/{domain}/types.ts
```

### 常见类型模板

```typescript
// 列表响应结构
export interface {Domain}ListInfo {
  list: {Domain}[];
  total: number;
  pageNo: number;      // 首选上下文定义的名称，默认 pageNo
  pageSize: number;    // 首选上下文定义的名称，默认 pageSize
}

// 弹窗状态结构
export interface ModalInfo {
  type: 'add' | 'edit';
  record: {Domain} | null;
}
```

---

> 本文档由 ai-skills 体系中所有 conventions 和 skills 提炼生成。版本: 2.0.0 最后更新: 2026
