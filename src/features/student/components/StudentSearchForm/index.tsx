import React from 'react';

import type { FormInstance } from 'antd';
import { Button, Card, Form, Input, Select, Space } from 'antd';

interface StudentSearchFormProps {
  onSearch: () => void;
  form: FormInstance;
}

const StudentSearchForm: React.FC<StudentSearchFormProps> = ({
  onSearch,
  form,
}) => {
  const onReset = () => {
    form.resetFields();
    onSearch();
  };

  const gradeOptions = [
    { value: '一年级', label: '一年级' },
    { value: '二年级', label: '二年级' },
    { value: '三年级', label: '三年级' },
    { value: '四年级', label: '四年级' },
    { value: '五年级', label: '五年级' },
  ];

  const statusOptions = [
    { value: 1, label: '启用' },
    { value: 0, label: '停用' },
  ];

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item name="name" label="姓名">
          <Input placeholder="请输入姓名" allowClear />
        </Form.Item>
        <Form.Item name="studentNo" label="学号">
          <Input placeholder="请输入学号" allowClear />
        </Form.Item>
        <Form.Item name="grade" label="年级">
          <Select
            allowClear
            style={{ width: 120 }}
            placeholder="请选择"
            options={gradeOptions}
          />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            style={{ width: 120 }}
            placeholder="请选择"
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

export default StudentSearchForm;
