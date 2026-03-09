---
name: modal-form
description: 规范弹窗表单组件的标准实现方式，指导 AI 在 features 层创建可复用的编辑弹窗组件。
license: MIT
metadata:
  author: frontend-team
  version: '2.0.0'
---

# Modal Form Skill

本 Skill 定义**弹窗表单组件**的标准实现方式。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`，并优先复用 `features/<domain>` 下已有类型与约定。

## When to Apply

- 在 `src/features/{domain}/components/{Domain}EditModal/` 下创建编辑弹窗组件
- 需要通过弹窗编辑实体信息时
- 为其他业务域创建类似的编辑弹窗时，可参考本 Skill 作为模板

## Inputs

- 组件名称：如 `{Domain}EditModal`
- 领域类型：如 `{Domain}` 类型定义（位于 `src/features/{domain}/types.ts`）
- 字段配置：需要编辑的字段列表
- Modal 信息类型：如 `ModalInfo`（区分新建/编辑）

## Output Structure

文件路径：`src/features/{domain}/components/{Domain}EditModal/index.tsx`

组件结构：

```text
<Modal
  title={isEdit ? '编辑{domain}' : '新建{domain}'}
  open={open}
  onOk={onOkClick}
  onCancel={onCancel}
  destroyOnHidden
>
  <Form form={form} layout="vertical">
    <Form.Item name="field1" label="字段1" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="field2" label="字段2">
      <Select ...options />
    </Form.Item>
  </Form>
</Modal>
```

## File Structure

```
src/features/{domain}/components/{Domain}EditModal/
├── index.tsx          # 弹窗组件（必须）
└── ...
```

## Code Template

### 推荐版本（使用 ModalInfo）

文件路径：`src/features/{domain}/components/{Domain}EditModal/index.tsx`

```tsx
import { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';

import type { {Domain} } from '../../types';
import type { ModalInfo } from '../../hooks/use{Domain}Edit';

interface {Domain}EditModalProps {
  modalInfo: ModalInfo | null;
  onCancel(): void;
  onOk(values: Partial<{Domain}>): void;
}

const {Domain}EditModal = ({ modalInfo, onCancel, onOk }: {Domain}EditModalProps) => {
  const [form] = Form.useForm();
  const open = !!modalInfo;
  const isEdit = modalInfo?.type === 'edit';

  useEffect(() => {
    if (modalInfo?.record) {
      form.setFieldsValue(modalInfo.record);
    } else {
      form.resetFields();
    }
  }, [modalInfo, form]);

  const onOkClick = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  return (
    <Modal
      title={isEdit ? '编辑{domain}' : '新建{domain}'}
      open={open}
      onOk={onOkClick}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="role" label="角色">
          <Select
            options={[
              { value: 'admin', label: '管理员' },
              { value: 'user', label: '普通用户' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default {Domain}EditModal;
```

### 替代版本（简单场景，使用 boolean open）

文件路径：`src/features/{domain}/components/{Domain}EditModal/index.tsx`

```tsx
import { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';

import { {Domain} } from '../../types';

interface {Domain}EditModalProps {
  open: boolean;
  record: {Domain} | null;
  onCancel(): void;
  onOk(values: Partial<{Domain}>): void;
}

const {Domain}EditModal = ({ open, record, onCancel, onOk }: {Domain}EditModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [record, form]);

  const onOkClick = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  return (
    <Modal
      title="编辑{domain}"
      open={open}
      onOk={onOkClick}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="role" label="角色">
          <Select
            options={[
              { value: 'admin', label: '管理员' },
              { value: 'user', label: '普通用户' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default {Domain}EditModal;
```

## Key Behaviors

- 打开弹窗时，如存在 `record`，通过 `form.setFieldsValue(record)` 填充表单
- 点击「确定」时使用 `form.validateFields()` 校验表单，通过后调用 `onOk`
- 使用 `destroyOnHidden` 确保弹窗关闭时销毁表单状态（Ant Design v5 推荐）
- 表单布局使用 `vertical`（垂直布局）
- 支持通过 `ModalInfo` 区分新建和编辑，动态显示标题

## Rules

- **解耦数据与 UI**
  - 弹窗组件不负责请求提交，只负责收集表单数据并通过 `onOk` 回传
- **类型安全**
  - 明确使用 `{Domain}` 与 `Partial<{Domain}>` 类型，而非 `any`
- **Props 定义**
  - `modalInfo: ModalInfo | null`：控制弹窗显示与类型（新建/编辑）
  - `onCancel(): void`：取消 / 关闭弹窗回调
  - `onOk(values: Partial<{Domain}>): void`：表单校验通过后的提交回调
- **复用性**
  - 字段结构可通过 `render-form-items` Skill 抽离为可复用的字段集合
  - 便于在创建与编辑场景中共享
- **表单布局**
  - 统一使用 `layout="vertical"`
  - 必填项必须具备 `rules={[{ required: true }]}`
- **方法声明与提升**
  - 在 `useEffect` 中调用的组件内部方法必须使用 `function` 关键字声明并放置在 hook 调用之后。
  - 普通事件处理方法（如 `onOkClick`）和 Props 回调使用 `const` 箭头函数。
- **属性更新**
  - 使用 `destroyOnHidden` 替代已废弃的 `destroyOnClose`

## Usage Scenarios

- 在列表页中通过弹窗进行行内编辑
- 复制本模式到其他实体的编辑弹窗（如 `{DomainA}EditModal`），只需替换字段与类型定义
- 需要快速编辑少量字段的场景
