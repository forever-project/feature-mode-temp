## Context

项目已有用户列表页（UserList）及配套的 `features/user` 领域结构（FilterForm、Table、ListWithModal、useUserList、useUserEdit 等），列表页采用「PageContainer + 搜索表单 + 列表/弹窗」的组合模式。技术栈为 Umi + Ant Design + ProComponents，并遵循 `ai-skills` 下的 list-page-composition、filter-form、table 等约定。本次在无既有订单能力的前提下，新增订单列表页面，需从零搭建订单领域并保持与用户列表一致的架构与交互。

## Goals / Non-Goals

**Goals:**

- 实现订单列表页面：支持按条件筛选、分页展示、表格列展示，并与路由和菜单集成。
- 订单领域与页面实现与现有 UserList 架构对齐（目录结构、命名、组合方式），便于后续维护与扩展。
- 列表数据通过领域服务与 hook 管理，页面组件保持「薄」、只做组合。

**Non-Goals:**

- 本阶段不强制实现订单编辑（弹窗或详情页）；若实现则优先弹窗模式以与 UserList 一致，但不作为本设计的必选范围。
- 不改变现有用户模块或全局路由架构，仅新增订单路由与页面。
- 不引入新的 UI 库或全局状态方案。

## Decisions

1. **领域与页面结构**  
   - 采用与 `features/user` 对称的 `features/order`：`types`、`services`、`hooks`（useOrderList 等）、`components`（OrderFilterForm、OrderTable，可选 OrderEditModal/OrderListWithModal）。  
   - 页面放在 `src/pages/order/OrderList/index.tsx`，路由为 `/order/list`。  
   - **理由**：与现有 list-page-composition 及 UserList 一致，降低认知负担，便于复用 conventions。

2. **列表数据与筛选**  
   - 使用 `useOrderList(form)` 管理列表请求、分页与刷新；筛选条件由表单受控，查询时合并 form 值与分页参数调用列表 API。  
   - 列表接口约定：接收分页（pageNo/pageSize）与筛选字段，返回 `{ list, total }`。  
   - **理由**：与 useUserList 模式一致，便于后续与 ProTable 或其它列表形态统一。

3. **编辑能力（可选）**  
   - 若本迭代包含编辑：优先采用「弹窗编辑」+ `OrderListWithModal` 封装 Table + Modal + useOrderEdit，与 UserList 一致。  
   - 若本迭代不包含编辑：仅实现 OrderFilterForm + OrderTable + 分页，页面直接组合两者，不做 ListWithModal。  
   - **理由**：Proposal 中编辑为可选，设计上保留两种形态的兼容性，由 tasks 决定是否实现编辑。

4. **API 与类型**  
   - 订单列表请求/响应类型与表格列所需字段在 `features/order/types` 中定义；服务层封装请求函数，对接现有请求封装与常量（如 DEFAULT_PAGINATION_PARAMS）。  
   - **理由**：与 user 的 types/services 分层一致，便于后续接真实后端或 mock。

## Risks / Trade-offs

- **API 未就绪**：若后端列表接口尚未存在，需在 services 中先用 mock 或占位实现，并在 tasks 中标注「可替换为真实 API」。  
- **订单字段未定**：表格列与筛选表单项依赖业务字段；若需求未细化，可在 spec 中先约定最小集合（如订单号、状态、时间），design 与 tasks 按此实现，后续再扩展。

## Migration Plan

- 纯新增功能，无数据迁移或下线逻辑。部署后通过菜单/路由访问订单列表即可；若后续接真实 API，仅需替换 `features/order/services` 中的实现。

## Open Questions

- 订单列表的筛选字段与表格列最终清单是否以产品文档为准？若是，可在首版实现最小集合，后续按文档迭代。
