import { useEffect, useState } from 'react';

import type { FormInstance } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { queryOrderList } from '../services';
import type { OrderListInfo } from '../types';

function getValues(form: FormInstance) {
  const values = form.getFieldsValue();

  // return transformer(values) // if need
  return values;
}

interface OrderListOptions {
  form: FormInstance;
}

const useOrderList = (options: OrderListOptions) => {
  const { form } = options;

  const [orderListInfo, setOrderListInfo] = useState<OrderListInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList(params: { pageNo?: number } = {}) {
    setLoading(true);

    const values = getValues(form);

    queryOrderList({ ...DEFAULT_PAGINATION_PARAMS, ...params, ...values })
      .then((res) => {
        setOrderListInfo(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onPageChange = (pageNo: number) => {
    fetchList({ pageNo });
  };

  const onSearch = () => {
    fetchList();
  };

  return {
    loading,
    orderListInfo,
    setLoading,
    onPageChange,
    onSearch,
  };
};

export default useOrderList;
