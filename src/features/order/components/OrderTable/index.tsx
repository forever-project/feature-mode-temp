import React from 'react';

import { Table } from 'antd';

import { OrderListInfo } from '@/features/order/types';
import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { getOrderColumns } from './_columns';

interface OrderTableProps {
  orderListInfo: OrderListInfo;
  onPageChange: (pageNo: number, pageSize: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const { onPageChange, orderListInfo = {} } = props;

  const columns = getOrderColumns();

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
        showSizeChanger: false,
      }}
    />
  );
};

export default OrderTable;
