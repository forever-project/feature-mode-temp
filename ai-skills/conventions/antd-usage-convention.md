# Ant Design 使用规范

本规范定义 Ant Design 组件的使用规则。

## 组件导入

### 基础导入

```typescript
// ✅ 正确：按组件导入
import { Button, Table, Form, Input } from 'antd';
import type { TableProps, FormProps } from 'antd';

// ❌ 错误：全量导入
import Antd from 'antd';
```

### ProComponents 导入与限制

```typescript
// ✅ 正确：首选 PageContainer 等布局容器组件
import { PageContainer } from '@ant-design/pro-components';

// 💡 导入原则：
// 1. 若所需组件在项目中未定义，必须默认从 'antd' 导入（如 Table, Form, Modal）。
// 2. 除非有明确的业务逻辑需求或团队共识，否则不应优先使用 ProTable、ProForm 等重型组件。
```

## 表单使用

### Form 组件

```typescript
// ✅ 正确：使用泛型指定表单值类型
const [form] = Form.useForm<UserForm>();

// 表单布局
<Form form={form} layout="vertical">
  <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
    <Input placeholder="请输入" />
  </Form.Item>
</Form>;
```

### 表单验证

- 必填项必须提供 `message`
- 使用清晰的错误提示

```typescript
<Form.Item
  name="email"
  label="邮箱"
  rules={[
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ]}
>
  <Input />
</Form.Item>
```

## 表格使用

### Table 组件

```typescript
// ✅ 正确：指定 rowKey
<Table
  rowKey="id"
  columns={columns}
  dataSource={data}
  pagination={{
    current: page,
    pageSize,
    total,
    showSizeChanger: false,
    showTotal: (total) => `共 ${total} 条`,
  }}
/>
```

### 表格列定义

```typescript
const columns: ColumnsType<User> = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status) => (
      <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>
    ),
  },
];
```

## 按钮使用

### 按钮类型

```typescript
// 主按钮：主要操作
<Button type="primary">提交</Button>

// 次按钮：取消、返回
<Button>取消</Button>

// 文字按钮：表格操作
<Button type="link">编辑</Button>

// 危险按钮：删除
<Button type="primary" danger>删除</Button>
```

### 按钮状态

```typescript
// 加载状态
<Button loading={submitting}>提交</Button>

// 禁用状态
<Button disabled={!canSubmit}>提交</Button>
```

## 弹窗使用

### Modal 组件

```typescript
<Modal
  title="编辑用户"
  open={visible}
  onOk={onOk}
  onCancel={handleConCancelancel}
  confirmLoading={submitting}
  destroyOnClose
>
  <Form form={form}>{/* 表单内容 */}</Form>
</Modal>
```

### 弹窗规范

- 必须设置 `destroyOnClose`
- 提交时显示 `confirmLoading`
- 标题使用动词 + 名词

## 消息提示

### 使用方式

```typescript
import { message } from 'antd';

// 成功
message.success('操作成功');

// 错误
message.error('操作失败');

// 警告
message.warning('请注意');

// 加载中
message.loading('加载中...', 0);
// 稍后关闭
message.destroy();
```

## 图标使用

### 导入方式

```typescript
// ✅ 正确：按需导入
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// 使用
<Button icon={<PlusOutlined />}>新增</Button>;
```

## 布局使用

### 常用布局组件

```typescript
import { Card, Space, Row, Col } from 'antd';

// 卡片容器
<Card title="标题" extra={<Button>操作</Button>}>
  内容
</Card>

// 间距
<Space direction="vertical" size="large">
  <div>1</div>
  <div>2</div>
</Space>

// 栅格
<Row gutter={16}>
  <Col span={12}>
    <Form.Item>...</Form.Item>
  </Col>
  <Col span={12}>
    <Form.Item>...</Form.Item>
  </Col>
</Row>
```

## ProComponents 使用

### PageContainer

```typescript
import { PageContainer } from '@ant-design/pro-components';

<PageContainer
  title="页面标题"
  extra={<Button type="primary">操作</Button>}
  breadcrumb={{
    items: [{ title: '首页', href: '/' }, { title: '列表' }],
  }}
>
  页面内容
</PageContainer>;
```

## 禁用规则

```typescript
// ❌ 不要直接修改组件内部状态
// ❌ 不要混用 Form 的受控和非受控模式
// ❌ 不要忽略 Table 的 rowKey
// ❌ 不要忽略 Modal 的 destroyOnClose
```
