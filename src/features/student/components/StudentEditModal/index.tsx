import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

import type { Student } from '../../types';

interface StudentEditModalProps {
  open: boolean;
  record: Student | null;
  onCancel(): void;
  onOk(values: Partial<Student>): void;
}

const StudentEditModal = ({
  open,
  record,
  onCancel,
  onOk,
}: StudentEditModalProps) => {
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
      title="编辑学生"
      open={open}
      onOk={onOkClick}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="grade" label="年级">
          <Select
            options={[
              { value: '一年级', label: '一年级' },
              { value: '二年级', label: '二年级' },
              { value: '三年级', label: '三年级' },
              { value: '四年级', label: '四年级' },
              { value: '五年级', label: '五年级' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentEditModal;
