// src/pages/order/OrderList/index.tsx
// 弹窗编辑模式示例

import React from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Form, Spin } from 'antd';

import OrderListWithModal from '@/features/order/components/OrderListWithModal';
import OrderSearchForm from '@/features/order/components/OrderSearchForm';
import useOrderList from '@/features/order/hooks/useOrderList';

const OrderListPage: React.FC = () => {
  const [form] = Form.useForm();

  const { loading, orderListInfo, onPageChange, onSearch, refresh } =
    useOrderList({
      form,
    });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <OrderSearchForm onSearch={onSearch} form={form} />
        <OrderListWithModal
          orderListInfo={orderListInfo}
          onPageChange={onPageChange}
          onRefresh={refresh}
        />
      </PageContainer>
    </Spin>
  );
};

export default OrderListPage;
