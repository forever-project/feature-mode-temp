// src/features/order/hooks/useOrderList.ts

import { useEffect, useState } from 'react';

import type { FormInstance } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { fetchOrderList } from '../services';
import type { OrderListInfo } from '../types';

function getValues(form: FormInstance) {
  return form.getFieldsValue();
}

interface UseOrderListOptions {
  form: FormInstance;
}

const useOrderList = (options: UseOrderListOptions) => {
  const { form } = options;

  const [orderListInfo, setOrderListInfo] = useState<OrderListInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList(params: { pageNo?: number; pageSize?: number } = {}) {
    setLoading(true);

    const values = getValues(form);

    fetchOrderList({ ...DEFAULT_PAGINATION_PARAMS, ...params, ...values })
      .then((res) => {
        setOrderListInfo({
          list: res.list,
          total: res.total,
          pageNo: params.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
          pageSize: params.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onPageChange = (pageNo: number, pageSize: number) => {
    fetchList({ pageNo, pageSize });
  };

  const onSearch = () => {
    fetchList();
  };

  return {
    loading,
    orderListInfo,
    onPageChange,
    onSearch,
    refresh: fetchList,
  };
};

export default useOrderList;
