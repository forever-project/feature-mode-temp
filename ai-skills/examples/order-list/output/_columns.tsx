// src/features/order/components/OrderTable/_columns.tsx

import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { OrderDTO } from '../../types';

interface ColumnOptions {
  onEdit?(record: OrderDTO): void;
}

export const getOrderColumns = (
  options?: ColumnOptions,
): ColumnsType<OrderDTO> => {
  return [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'customerInfo',
      width: 120,
      render: (info) => info.firstName + info.lastName,
    },
    {
      title: '金额',
      dataIndex: 'orderAmount',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'statusCode',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => options?.onEdit?.(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];
};
