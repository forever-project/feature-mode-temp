---
name: filter-form-component
description: 规范筛选表单组件的标准实现方式（Card 内嵌版本），指导 AI 在 features 层创建可复用的筛选表单组件。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Filter Form Component Skill

本 Skill 定义**筛选表单组件**的标准实现方式（Card 内嵌版本）。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/components/{Domain}FilterForm/` 下创建筛选表单组件
- 需要在 Card 组件内嵌筛选表单
- 希望筛选与重置行为在不同列表页中保持一致体验

## Inputs

- 业务域名称：如 `user`、`order`
- 查询参数类型：如 `{Domain}ListQuery`
- 筛选字段列表：字段名、标签、控件类型、占位符

## Output Structure

文件路径：`src/features/{domain}/components/{Domain}FilterForm/index.tsx`

组件结构：

```text
<Form form={form} layout="inline" initialValues={value}>
  <Form.Item name="name" label="名称">
    <Input placeholder="请输入" allowClear />
  </Form.Item>
  <Form.Item name="role" label="角色">
    <Select ...options />
  </Form.Item>
  <Form.Item>
    <Space>
      <Button type="primary" onClick={onSearch}>查询</Button>
      <Button onClick={onReset}>重置</Button>
    </Space>
  </Form.Item>
</Form>
```

使用方式：

```text
<Card>
  <{Domain}FilterForm
    value={query}
    onSearch={search}
    onReset={reset}
  />
</Card>
```

## File Structure

```
src/features/{domain}/components/{Domain}FilterForm/
└── index.tsx          # 筛选表单组件（必须）
```

## Code Template

文件路径：`src/features/{domain}/components/{Domain}FilterForm/index.tsx`

```tsx
import { Button, Form, Input, Select, Space } from 'antd';


import { {Domain}ListQuery } from '../../types';

// 如需要样式，取消下面注释
// import styles from './index.less';

interface {Domain}FilterFormProps {
  value?: Partial<{Domain}ListQuery>;
  onSearch: (values: Partial<{Domain}ListQuery>) => void;
  onReset: () => void;
}

export function {Domain}FilterForm(props: {Domain}FilterFormProps) {
  const [form] = Form.useForm();

  const onSearch = async () => {
    const values = await form.validateFields();
    props.onSearch(values);
  };

  const onReset = () => {
    form.resetFields();
    props.onReset();
  };

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={props.value}
    >
      <Form.Item name="name" label="名称">
        <Input placeholder="请输入" allowClear />
      </Form.Item>

      <Form.Item name="role" label="角色">
        <Select
          allowClear
          style={{ width: 120 }}
          options={[
            { value: 'admin', label: '管理员' },
            { value: 'user', label: '普通用户' },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
```

## Key Behaviors

- 使用 AntD `Form` 管理表单状态
- 通过 `initialValues` 接收初始值
- 搜索时触发 `onSearch` 回调并传递表单值
- 重置时清空表单并触发 `onReset` 回调
- 使用 `layout="inline"` 实现行内布局
- 支持 `allowClear` 允许清空输入

## Rules

- **职责单一**
  - 筛选表单组件只负责 UI 展示与字段收集，不负责调用 service
  - 通过回调通知上层进行搜索
- **受控组件**
  - 通过 `value` / `initialValues` 实现受控
  - 便于与父组件状态同步
- **布局统一**
  - 统一使用 `layout="inline"`，保证在不同页面中筛选区对齐、间距一致
- **交互一致**
  - 「查询」按钮触发表单校验，通过后将所有字段值传递给 `onSearch`
  - 「重置」按钮会重置表单字段为初始值，同时调用 `onReset`
- **类型安全**
  - Props 类型必须显式定义
  - 表单值类型使用领域定义的查询参数类型
- **字段控件**
  - 文本输入使用 `Input`，配置 `allowClear`
  - 枚举选择使用 `Select`，配置 `allowClear`
  - 日期选择使用 `DatePicker` 或 `RangePicker`

## Usage Scenarios

- 在 Card 组件内嵌筛选表单
- 需要与父组件状态同步的筛选场景
- 需要统一筛选交互风格的多个页面

## Comparison with SearchForm

| 特性     | FilterForm             | SearchForm            |
| -------- | ---------------------- | --------------------- |
| 使用场景 | Card 内嵌              | 独立使用（自带 Card） |
| 初始值   | 支持 `value` 属性      | 通过 Form 初始值      |
| 布局     | 需外部包裹 Card        | 自带 Card 包裹        |
| 回调参数 | `onSearch` / `onReset` | `onSearch`            |
