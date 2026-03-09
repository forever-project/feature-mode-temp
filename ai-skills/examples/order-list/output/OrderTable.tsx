// src/features/order/components/OrderTable/index.tsx

import React from 'react';

import { Table } from 'antd';

import { OrderListInfo } from '@/features/order/types';
import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { getOrderColumns } from './_columns';

interface OrderTableProps {
  orderListInfo?: OrderListInfo;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (record: any) => void;
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const { orderListInfo = {}, onPageChange, onEdit } = props;

  const columns = getOrderColumns({
    onEdit,
  });

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orderListInfo.list}
      pagination={{
        current: orderListInfo.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
        pageSize: orderListInfo.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        total: orderListInfo.total,
        onChange: onPageChange,
        showSizeChanger: f,
      }}
    />
  );
};

export default OrderTable;
