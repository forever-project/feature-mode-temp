## Why

业务需要独立的订单列表页面，用于查询、筛选和浏览订单数据，并与现有用户列表等列表页保持一致的交互与架构（搜索表单 + 表格 + 分页，可选弹窗编辑）。当前路由与页面仅有用户相关，缺少订单管理入口。

## What Changes

- 新增订单列表页面路由（如 `/order/list`），并在菜单中展示「订单列表」入口。
- 新增订单领域能力：订单列表数据拉取、筛选表单、表格展示、分页；可选支持弹窗编辑订单。
- 页面组合方式与现有 `UserList` 一致：PageContainer + 搜索表单 + 列表（Table/ListWithModal），数据与状态由 `useOrderList` 等 hook 管理。

## Capabilities

### New Capabilities

- `order-list`：订单列表页面能力。包含列表查询 API、筛选条件、表格列定义、分页，以及页面与路由集成；可选包含订单编辑（弹窗或跳转）的交互与数据结构。

### Modified Capabilities

- 无（当前 `openspec/specs/` 下无既有 spec，不涉及对现有能力的需求变更）。

## Impact

- **路由**：`src/routes.ts` 增加订单列表路由及菜单项。
- **页面**：新增 `src/pages/order/OrderList/` 页面组件。
- **领域层**：新增 `src/features/order/`（或沿用既有 order 结构）：类型定义、服务（列表/编辑 API）、hooks（useOrderList、可选 useOrderEdit）、组件（OrderFilterForm、OrderTable、可选 OrderEditModal/OrderListWithModal）。
- **依赖**：复用现有技术栈（Ant Design、ProComponents、项目 conventions 与 list-page-composition 等 skills），无新增第三方依赖。
