import React from 'react';

import type { FormInstance } from 'antd';
import { Button, Card, Form, Input, Space } from 'antd';

interface OrderSearchFormProps {
  onSearch: () => void;
  form: FormInstance;
}

const OrderSearchForm: React.FC<OrderSearchFormProps> = ({
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
          <Input placeholder="请输入" />
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

export default OrderSearchForm;
