# Feature Mode Temp 前端项目

基于 React + TypeScript + Ant Design + Umi 的企业级中后台前端解决方案。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Umi 4
- **UI 组件库**: Ant Design 5
- **状态管理**: React Hooks
- **代码规范**: ESLint + Prettier

## 项目架构

### 目录结构

```
src/
├── pages/                    # 页面层（只做组合）
│   └── {domain}/
│       └── {PageName}/
│           └── index.tsx     # 页面入口
├── features/                 # 业务核心层
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
│       │   └── index.ts
│       └── types.ts          # 业务类型
├── components/               # 基础组件（纯 UI）
├── hooks/                    # 通用 Hooks
├── services/                 # 全局服务
└── utils/                    # 工具函数
```

### 分层职责

| 层级           | 职责                     | 示例                            |
| -------------- | ------------------------ | ------------------------------- |
| **pages**      | 页面组合，不处理复杂逻辑 | `Spin` + `SearchForm` + `Table` |
| **features**   | 封装业务逻辑，供页面复用 | `useUserList`, `UserTable`      |
| **components** | 纯 UI 组件，不含业务逻辑 | 通用 Button, Card 封装          |

## 核心设计原则

### 1. Form 外置模式

Form 实例在 Page 层创建，通过 props 传递给 SearchForm 和 Hook：

```typescript
const UserListPage = () => {
  const [form] = Form.useForm(); // Page 层创建

  const { loading, userListInfo, onSearch } = useUserList({ form });

  return (
    <>
      <UserSearchForm form={form} onSearch={onSearch} /> // 共享 form
      <UserTable userListInfo={userListInfo} loading={loading} />
    </>
  );
};
```

### 2. 职责分离

- **Page 层**: 极薄，只负责组件组合
- **Hook 层**: 管理数据和状态
- **组件层**: 纯展示，接收 props

### 3. 列表响应结构统一

```typescript
interface ListInfo<T> {
  list: T[];
  total: number;
  pageNo: number;
  pageSize: number;
}
```

### 4. 命名规范

- **事件处理**: 使用 `onXXX`（如 `onSearch`, `onEdit`）
- **布尔判断**: 使用 `!!value` 代替多余的 state
- **属性命名**: 使用 `destroyOnHidden` 替代废弃的 `destroyOnClose`

## 两种列表页模式

### 模式一：弹窗编辑（推荐）

适用于快速编辑场景，无需页面跳转。

```
Page
├── Spin
├── SearchForm
└── UserListWithModal      # 容器组件封装 Table + Modal
    ├── useUserEdit        # 编辑状态管理
    ├── UserTable
    └── UserEditModal
```

**示例**:

```typescript
const UserListPage = () => {
  const [form] = Form.useForm();
  const { loading, userListInfo, onPageChange, onSearch, refresh } =
    useUserList({ form });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <UserSearchForm form={form} onSearch={onSearch} />
        <UserListWithModal
          userListInfo={userListInfo}
          onPageChange={onPageChange}
          onRefresh={refresh}
        />
      </PageContainer>
    </Spin>
  );
};
```

### 模式二：跳转编辑

适用于复杂编辑场景，需要独立页面。

```
Page
├── Spin
├── SearchForm
└── Card
    ├── 新建按钮 (history.push)
    └── UserTable (onEdit -> history.push)
```

**示例**:

```typescript
const StudentListPage = () => {
  const [form] = Form.useForm();
  const { loading, studentListInfo, onPageChange, onSearch } = useStudentList({
    form,
  });

  const onCreate = () => history.push('/student/create');
  const onEdit = (record) => history.push(`/student/edit?id=${record.id}`);

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <StudentSearchForm form={form} onSearch={onSearch} />
        <Card title="学生列表" extra={<Button onClick={onCreate}>新建</Button>}>
          <StudentTable
            studentListInfo={studentListInfo}
            onPageChange={onPageChange}
            onEdit={onEdit}
          />
        </Card>
      </PageContainer>
    </Spin>
  );
};
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## AI Skills 规范

本项目遵循 `ai-skills/` 目录下的规范文档：

- `skills/list/` - 列表页相关 Skill
- `skills/form/` - 表单相关 Skill
- `conventions/` - 代码规范约定
- `examples/order-list/` - 完整示例

## 现有功能模块

| 模块     | 路径       | 编辑模式 |
| -------- | ---------- | -------- |
| 订单管理 | `/order`   | 弹窗编辑 |
| 用户管理 | `/user`    | 弹窗编辑 |
| 学生管理 | `/student` | 跳转编辑 |

## 许可证

MIT
