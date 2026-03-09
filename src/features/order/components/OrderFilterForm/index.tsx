import React from 'react';

import type { FormInstance } from 'antd';
import { Button, Card, Form, Input, Select, Space } from 'antd';

interface OrderFilterFormProps {
  onSearch: () => void;
  form: FormInstance;
}

const statusOptions = [
  { value: '待支付', label: '待支付' },
  { value: '进行中', label: '进行中' },
  { value: '已完成', label: '已完成' },
];

const OrderFilterForm: React.FC<OrderFilterFormProps> = ({
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
        <Form.Item name="orderNo" label="订单号">
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

export default OrderFilterForm;
