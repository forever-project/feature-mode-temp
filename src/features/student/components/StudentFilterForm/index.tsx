import React from 'react';

import type { FormInstance } from 'antd';
import { Button, Card, Form, Input, Select, Space } from 'antd';

interface StudentFilterFormProps {
  onSearch: () => void;
  form: FormInstance;
}

const statusOptions = [
  { value: 1, label: '在读' },
  { value: 0, label: '停用' },
];

const StudentFilterForm: React.FC<StudentFilterFormProps> = ({
  onSearch,
  form,
}) => {
  const onReset = () => {
    form.resetFields();
    onSearch();
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item name="studentNo" label="学号">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item name="name" label="姓名">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item name="className" label="班级">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            style={{ width: 120 }}
            options={statusOptions}
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

export default StudentFilterForm;

