// src/features/order/components/OrderListWithModal/index.tsx
// 弹窗编辑模式容器组件

import React from 'react';

import { Button, Card, Space } from 'antd';

import OrderEditModal from '../../components/OrderEditModal';
import OrderTable from '../../components/OrderTable';
import { useOrderEdit } from '../../hooks/useOrderEdit';
import type { OrderListInfo } from '../../types';

interface OrderListWithModalProps {
  orderListInfo?: OrderListInfo;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onRefresh: () => void;
}

const OrderListWithModal: React.FC<OrderListWithModalProps> = (props) => {
  const { orderListInfo, loading, onPageChange, onRefresh } = props;

  const { modalInfo, openModal, closeModal, submit } = useOrderEdit({
    onSuccess: onRefresh,
  });

  const onCreate = () => openModal('add');

  return (
    <>
      <Card
        title="订单列表"
        extra={
          <Space>
            <Button type="primary" onClick={onCreate}>
              新建
            </Button>
          </Space>
        }
      >
        <OrderTable
          orderListInfo={orderListInfo}
          loading={loading}
          onPageChange={onPageChange}
          onEdit={(record) => openModal('edit', record)}
        />
      </Card>
      <OrderEditModal
        modalInfo={modalInfo}
        onCancel={closeModal}
        onOk={submit}
      />
    </>
  );
};

export default OrderListWithModal;
