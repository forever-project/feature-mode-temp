---
name: search-form-component
description: 规范搜索表单组件的标准实现方式，指导 AI 在 features 层创建可复用的搜索表单组件。
license: MIT
metadata:
  author: frontend-team
  version: '2.0.0'
---

# Search Form Component Skill

本 Skill 定义**搜索表单组件**的标准实现方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 在 `src/features/{domain}/components/{Domain}SearchForm/` 下创建搜索表单组件
- 需要在列表页顶部添加搜索区域
- 希望搜索与重置行为在不同列表页中保持一致体验

## Inputs

- 业务域名称：如 `user`、`order`
- 查询参数类型：如 `{Domain}ListQuery`
- 搜索字段列表：字段名、标签、控件类型、占位符
- 外部 form 实例：通过 props 传入

## Output Structure

文件路径：`src/features/{domain}/components/{Domain}SearchForm/index.tsx`

组件结构：

```text
<Card style={{ marginBottom: 16 }}>
  <Form form={form} layout="inline" onFinish={onSearch}>
    <Form.Item name="field1" label="字段1">
      <Input placeholder="请输入" />
    </Form.Item>
    <Form.Item>
      <Space>
        <Button type="primary" htmlType="submit">查询</Button>
        <Button onClick={onReset}>重置</Button>
      </Space>
    </Form.Item>
  </Form>
</Card>
```

## File Structure

```
src/features/{domain}/components/{Domain}SearchForm/
├── index.tsx          # 搜索表单组件（必须）
└── ...
```

## Code Template

### 推荐版本（接收外部 form）

文件路径：`src/features/{domain}/components/{Domain}SearchForm/index.tsx`

```tsx
import React from 'react';

import { Form, Input, Select, Button, Space, Card } from 'antd';
import type { FormInstance } from 'antd';

interface {Domain}SearchFormProps {
  onSearch: () => void;
  form: FormInstance;
}

const {Domain}SearchForm: React.FC<{Domain}SearchFormProps> = ({ onSearch, form }) => {
  const onReset = () => {
    form.resetFields();
    onSearch();
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            style={{ width: 120 }}
            placeholder="请选择"
            options={[
              { value: 1, label: '启用' },
              { value: 0, label: '停用' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default {Domain}SearchForm;
```

### 替代版本（内部创建 form，适合简单场景）

文件路径：`src/features/{domain}/components/{Domain}SearchForm/index.tsx`

```tsx
import { Form, Input, Button, Space, Card } from 'antd';

interface {Domain}SearchFormProps {
  onSearch(values: any): void;
}

const {Domain}SearchForm = ({ onSearch }: {Domain}SearchFormProps) => {
  const [form] = Form.useForm();

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item name="code" label="编号">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default {Domain}SearchForm;
```

## Key Behaviors

- 使用 AntD `Form` 管理表单状态
- 推荐通过 props 接收外部 form 实例，实现与 hook 的数据共享
- 搜索表单提交时触发 `onSearch` 回调
- 重置按钮清空表单字段并触发 `onSearch` 回调（重新搜索）
- 使用 `layout="inline"` 实现行内布局
- 使用 `Card` 包裹搜索表单，提供统一的视觉边界

## Rules

- **职责单一**
  - 搜索表单组件只负责 UI 展示与字段收集，不负责调用 service
  - 通过回调通知上层进行搜索
- **Form 外置（推荐）**
  - 在 Page 层创建 form 实例，通过 props 传入 SearchForm
  - 这样可以让 hook 和表单共享同一个 form 实例
- **可配置性**
  - 字段渲染完全基于需求，不在组件内部硬编码过多业务字段
- **布局统一**
  - 统一使用 `layout="inline"`，保证在不同页面中搜索区对齐、间距一致
  - 使用 `Card` 包裹，设置 `marginBottom: 16`
- **交互一致**
  - 「查询」按钮触发表单提交，将表单值传递给 `onSearch`
  - 「重置」按钮会重置表单字段，并触发 `onSearch` 重新搜索
- **类型安全**
  - Props 类型必须显式定义
  - 表单值类型使用领域定义的查询参数类型
- **方法命名**
  - 回调方法使用 `onXXX` 命名，如 `onSearch`、`onReset`

## Usage Scenarios

- 在列表页顶部添加搜索区域
- 需要多个筛选条件的复杂搜索场景
- 需要统一搜索交互风格的多个页面
