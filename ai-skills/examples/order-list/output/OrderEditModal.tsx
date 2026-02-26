// src/features/order/components/OrderEditModal/index.tsx

import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

import type { ModalInfo } from '../../hooks/useOrderEdit';
import type { Order } from '../../types';

interface OrderEditModalProps {
  modalInfo: ModalInfo | null;
  onCancel(): void;
  onOk(values: Partial<Order>): void;
}

const OrderEditModal = ({ modalInfo, onCancel, onOk }: OrderEditModalProps) => {
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
      title={isEdit ? '编辑订单' : '新建订单'}
      open={open}
      onOk={onOkClick}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="orderNo" label="订单号" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            options={[
              { value: 1, label: '待支付' },
              { value: 2, label: '已支付' },
              { value: 3, label: '已发货' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderEditModal;
