import type { TableColumnsType } from 'antd';
import { Tag } from 'antd';

import type { Order } from '../../types';

export function buildOrderColumns(): TableColumnsType<Order> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === '已完成' ? 'green' : status === '待支付' ? 'orange' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ];
}
