# Order List Page Spec

## 需求描述

创建一个订单列表页面，展示订单数据，支持搜索、分页和编辑功能。

## 功能需求

1. **列表展示**

   - 展示订单号、客户名称、订单金额、状态、创建时间
   - 支持分页（默认每页 10 条）
   - 支持每页条数切换

2. **搜索功能**

   - 按订单号搜索
   - 支持重置搜索条件

3. **操作功能**
   - 新建订单（弹窗）
   - 编辑订单（弹窗）
   - 编辑成功后自动刷新列表

## 页面布局

使用 ProLayout 的 PageContainer 作为页面容器，包含：

- 顶部：搜索表单区域（Card 包裹）
- 中部：数据表格区域 + 新建按钮
- 弹窗：编辑/新建订单弹窗
- 底部分页内嵌在表格中

## 数据结构

### Order（实体类型）

```typescript
interface Order {
  id: string;
  orderNo: string;
  orderAmount: number;
  statusCode: number;
  createdAt: string;
  customerInfo: {
    firstName: string;
    lastName: string;
  };
}
```

### OrderListQuery（查询参数）

```typescript
interface OrderListQuery {
  pageNo?: number;
  pageSize?: number;
  orderNo?: string;
}
```

### OrderListInfo（响应结构）

```typescript
interface OrderListInfo {
  list: Order[];
  total: number;
  pageNo: number;
  pageSize: number;
}
```

### ModalInfo（弹窗状态）

```typescript
interface ModalInfo {
  type: 'add' | 'edit';
  record: Order | null;
}
```

## 使用的 Skills

- `list-page-composition` - 列表页面组合规范
- `list-data-hook` - 列表数据管理 Hook
- `table-component` - 表格组件规范
- `search-form-component` - 搜索表单组件
- `modal-form` - 弹窗表单组件
- `feature-service` - Service 层规范
- `business-types` - 类型定义规范

## 目录结构

```
src/
├── pages/order/OrderList/index.tsx
└── features/order/
    ├── components/
    │   ├── OrderSearchForm/index.tsx    # 搜索表单
    │   ├── OrderTable/
    │   │   ├── index.tsx                # 表格组件
    │   │   └── _columns.tsx             # 列定义
    │   ├── OrderEditModal/index.tsx     # 编辑弹窗
    │   └── OrderListWithModal/index.tsx # 列表+弹窗容器
    ├── hooks/
    │   ├── useOrderList.ts              # 列表数据管理
    │   └── useOrderEdit.ts              # 编辑状态管理
    ├── services/
    │   └── index.ts
    └── types.ts
```

## 代码文件

- `index.tsx` - 页面组件（弹窗编辑模式）
- `useOrderList.ts` - 列表数据管理 Hook
- `useOrderEdit.ts` - 编辑弹窗状态 Hook
- `OrderSearchForm.tsx` - 搜索表单组件
- `OrderTable.tsx` - 表格组件
- `OrderEditModal.tsx` - 编辑弹窗组件
- `OrderListWithModal.tsx` - 列表+弹窗容器组件
- `service.ts` - Service 层
- `types.ts` - 类型定义

## 关键设计

1. **Form 外置**：form 实例在 Page 层创建，通过 props 传递给 SearchForm 和 useOrderList
2. **职责分离**：Page 层只负责组合，编辑弹窗逻辑封装在 OrderListWithModal 中
3. **ModalInfo 模式**：使用 `{type, record}` 结构区分新建和编辑
4. **方法命名**：统一使用 `onXXX` 命名（onSearch, onEdit, onCreate 等）
5. **不使用 useCallback**：保持代码简洁，除非有性能问题
