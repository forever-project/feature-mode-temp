import { useEffect, useState } from 'react';

import type { FormInstance } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { fetchUserList } from '../services';
import type { UserListInfo } from '../types';

function getValues(form: FormInstance) {
  return form.getFieldsValue();
}

interface UseUserListOptions {
  form: FormInstance;
}

const useUserList = (options: UseUserListOptions) => {
  const { form } = options;

  const [userListInfo, setUserListInfo] = useState<UserListInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList(params: { pageNo?: number; pageSize?: number } = {}) {
    setLoading(true);

    const values = getValues(form);

    fetchUserList({ ...DEFAULT_PAGINATION_PARAMS, ...params, ...values })
      .then((res) => {
        setUserListInfo({
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
    userListInfo,
    onPageChange,
    onSearch,
    refresh: fetchList,
  };
};

export default useUserList;
