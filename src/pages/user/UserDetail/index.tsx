import React from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Spin } from 'antd';
import { useSearchParams } from 'umi';

import UserDetailCard from '@/features/user/components/UserDetailCard';
import useUserDetail from '@/features/user/hooks/useUserDetail';

const UserDetailPage: React.FC = () => {
  const [params] = useSearchParams();
  const id = Number(params.get('id'));

  const { loading, userDetailInfo } = useUserDetail(id);

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <UserDetailCard userDetailInfo={userDetailInfo} />
      </PageContainer>
    </Spin>
  );
};

export default UserDetailPage;
