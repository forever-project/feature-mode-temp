import React from 'react';

import { Card } from 'antd';

import OrderTable from '../OrderTable';
import type { OrderListInfo } from '../../types';

interface OrderListWithModalProps {
  orderListInfo?: OrderListInfo;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onRefresh: () => void;
}

const OrderListWithModal: React.FC<OrderListWithModalProps> = (props) => {
  const { orderListInfo, loading, onPageChange, onRefresh } = props;

  return (
    <Card title="订单列表">
      <OrderTable
        orderListInfo={orderListInfo}
        loading={loading}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

export default OrderListWithModal;
