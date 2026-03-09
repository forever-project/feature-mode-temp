## 1. 订单领域基础

- [x] 1.1 在 `src/features/order/` 下新增 `types.ts`，定义订单项类型、列表请求参数与列表响应类型（含 list、total 及分页字段）
- [x] 1.2 在 `src/features/order/services/` 下新增列表请求函数，接收分页与筛选参数、返回 `{ list, total }`；可先用 mock 或占位实现，对接项目现有请求封装与 `DEFAULT_PAGINATION_PARAMS`

## 2. 列表 Hook

- [x] 2.1 在 `src/features/order/hooks/` 下实现 `useOrderList`，接收 form 实例，内部调用订单列表服务，暴露 loading、orderListInfo、onPageChange、onSearch、refresh，行为与 `useUserList` 对齐

## 3. 订单列表组件

- [x] 3.1 在 `src/features/order/components/` 下实现 `OrderFilterForm`，包含筛选表单项（至少订单号、状态等可扩展字段）及「查询」按钮，通过 `onSearch` 与 form 受控
- [x] 3.2 在 `src/features/order/components/OrderTable/` 下实现订单表格：列定义至少包含订单号、状态、创建时间等，支持接收 list、total、分页与 onPageChange，表格与分页器联动
- [x] 3.3 在 `src/features/order/components/` 下实现 `OrderListWithModal` 或等效列表容器，组合 OrderTable 与分页，接收 orderListInfo、onPageChange、onRefresh；本迭代可不含弹窗编辑，仅封装表格与分页

## 4. 页面与路由

- [x] 4.1 在 `src/pages/order/OrderList/` 下实现订单列表页面：使用 PageContainer、OrderFilterForm、OrderListWithModal（或 Table+分页），数据与事件由 useOrderList 提供，用 Spin 包裹 loading
- [x] 4.2 在 `src/routes.ts` 中新增订单列表路由（path 如 `/order/list`），并配置菜单名「订单列表」，使菜单与直接访问均可进入该页
