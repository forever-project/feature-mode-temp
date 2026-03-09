import React from 'react';

import { Table } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import type { OrderListInfo } from '@/features/order/types';
import { buildOrderColumns } from './_columns';

interface OrderTableProps {
  orderListInfo?: OrderListInfo;
  loading?: boolean;
  onPageChange: (pageNo: number, pageSize: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const {
    orderListInfo = {},
    loading,
    onPageChange,
  } = props;

  const columns = buildOrderColumns();

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orderListInfo.list}
      loading={loading}
      pagination={{
        current: orderListInfo.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
        pageSize: orderListInfo.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        total: orderListInfo.total,
        onChange: onPageChange,
        showSizeChanger: true,
      }}
    />
  );
};

export default OrderTable;
