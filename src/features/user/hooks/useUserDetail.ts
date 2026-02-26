import { useEffect, useState } from 'react';

import { fetchUserDetail } from '../services';
import type { User } from '../types';

const useUserDetail = (id: number) => {
  const [userDetailInfo, setUserDetailInfo] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    fetchDetail();
  }, [id]);

  function fetchDetail() {
    setLoading(true);
    fetchUserDetail(id)
      .then((res) => {
        setUserDetailInfo(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    loading,
    userDetailInfo,
  };
};

export default useUserDetail;
