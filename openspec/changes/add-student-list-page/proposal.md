## Why

业务需要独立的学生列表页面，用于集中查询、筛选和浏览学生信息，并与现有用户列表等列表页保持一致的交互与架构（搜索表单 + 表格 + 分页，可选弹窗编辑）。当前系统只有用户相关的列表页，缺少面向学生维度的管理入口。

## What Changes

- 新增学生列表页面路由（如 `/student/list`），并在菜单中展示「学生列表」入口。
- 新增学生领域能力：学生列表数据拉取、筛选表单、表格展示、分页；可选支持弹窗编辑学生信息。
- 页面组合方式与现有 `UserList` 一致：PageContainer + 搜索表单 + 列表（Table/ListWithModal），数据与状态由 `useStudentList` 等 hook 管理。

## Capabilities

### New Capabilities

- `student-list`：学生列表页面能力。包含列表查询 API、筛选条件（如学号、姓名、班级、状态等）、表格列定义、分页，以及页面与路由集成；可选包含学生信息编辑（弹窗或跳转）的交互与数据结构。

### Modified Capabilities

- 无（当前 `openspec/specs/` 下无既有 spec，不涉及对现有能力的需求变更）。

## Impact

- **路由**：`src/routes.ts` 增加学生列表路由及菜单项。
- **页面**：新增 `src/pages/student/StudentList/` 页面组件。
- **领域层**：新增 `src/features/student/`：类型定义、服务（列表/编辑 API）、hooks（useStudentList、可选 useStudentEdit）、组件（StudentFilterForm、StudentTable、可选 StudentEditModal/StudentListWithModal）。
- **依赖**：复用现有技术栈（Ant Design、ProComponents、项目 conventions 与 list-page-composition 等 skills），无新增第三方依赖。

