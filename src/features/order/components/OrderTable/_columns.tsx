import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { orderStatusMap } from '../../constants';
import type { OrderDTO } from '../../types';

export const getOrderColumns = (options?: any): ColumnsType<OrderDTO> => {
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
      render: (text) => text.firstName + text.lastName,
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
      render: (text) => orderStatusMap[text],
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'displayTime',
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
            onClick={() => options?.onEdit(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];
};
