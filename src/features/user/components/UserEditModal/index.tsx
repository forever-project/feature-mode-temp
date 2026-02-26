import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

import type { ModalInfo } from '../../hooks/useUserEdit';
import type { User } from '../../types';

interface UserEditModalProps {
  modalInfo: ModalInfo | null;
  onCancel(): void;
  onOk(values: Partial<User>): void;
}

const UserEditModal = ({ modalInfo, onCancel, onOk }: UserEditModalProps) => {
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
      title={isEdit ? '编辑用户' : '新建用户'}
      open={open}
      onOk={onOkClick}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
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

export default UserEditModal;
