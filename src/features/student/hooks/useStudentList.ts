import { useEffect, useState } from 'react';

import type { FormInstance } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { fetchStudentList } from '../services';
import type { StudentListInfo } from '../types';

function getValues(form: FormInstance) {
  return form.getFieldsValue();
}

interface UseStudentListOptions {
  form: FormInstance;
}

const useStudentList = (options: UseStudentListOptions) => {
  const { form } = options;

  const [studentListInfo, setStudentListInfo] = useState<StudentListInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList(params: { pageNo?: number; pageSize?: number } = {}) {
    setLoading(true);

    const values = getValues(form);

    fetchStudentList({ ...DEFAULT_PAGINATION_PARAMS, ...params, ...values })
      .then((res) => {
        setStudentListInfo({
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
    studentListInfo,
    onPageChange,
    onSearch,
    refresh: fetchList,
  };
};

export default useStudentList;

