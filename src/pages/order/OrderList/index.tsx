import { PageContainer } from '@ant-design/pro-components';
import { Form, Spin } from 'antd';

import OrderSearchForm from '@/features/order/components/OrderSearchForm';
import OrderTable from '@/features/order/components/OrderTable';
import useOrderList from '@/features/order/hooks/useOrderList';

const OrderListPage = () => {
  const [form] = Form.useForm();

  const { loading, orderListInfo, onPageChange, onSearch } = useOrderList({
    form,
  });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <OrderSearchForm onSearch={onSearch} form={form} />
        <OrderTable orderListInfo={orderListInfo} onPageChange={onPageChange} />
      </PageContainer>
    </Spin>
  );
};

export default OrderListPage;
