## 1. 学生领域基础

- [x] 1.1 在 `src/features/student/` 下新增 `types.ts`，定义学生项类型、列表请求参数与列表响应类型（含 list、total 及分页字段）
- [x] 1.2 在 `src/features/student/services/` 下新增学生列表请求函数，接收分页与筛选参数、返回 `{ list, total }`；可先用 mock 或占位实现，对接项目现有请求封装与 `DEFAULT_PAGINATION_PARAMS`

## 2. 学生列表 Hook

- [x] 2.1 在 `src/features/student/hooks/` 下实现 `useStudentList`，接收 form 实例，内部调用学生列表服务，暴露 loading、studentListInfo、onPageChange、onSearch、refresh，行为与 `useUserList` 对齐

## 3. 学生列表组件

- [x] 3.1 在 `src/features/student/components/` 下实现 `StudentFilterForm`，包含筛选表单项（至少学号、姓名、班级、状态等可扩展字段）及「查询」按钮，通过 `onSearch` 与 form 受控
- [x] 3.2 在 `src/features/student/components/StudentTable/` 下实现学生表格：列定义至少包含学号、姓名、班级、状态等，支持接收 list、total、分页与 onPageChange，表格与分页器联动
- [x] 3.3 在 `src/features/student/components/` 下实现 `StudentListWithModal` 或等效列表容器，组合 StudentTable 与分页，接收 studentListInfo、onPageChange、onRefresh；本迭代可不含弹窗编辑，仅封装表格与分页

## 4. 页面与路由

- [x] 4.1 在 `src/pages/student/StudentList/` 下实现学生列表页面：使用 PageContainer、StudentFilterForm、StudentListWithModal（或 Table+分页），数据与事件由 useStudentList 提供，用 Spin 包裹 loading
- [x] 4.2 在 `src/routes.ts` 中新增学生列表路由（path 如 `/student/list`），并配置菜单名「学生列表」，使菜单与直接访问均可进入该页

