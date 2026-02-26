import React from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Form, Spin } from 'antd';

import UserFilterForm from '@/features/user/components/UserFilterForm';
import UserListWithModal from '@/features/user/components/UserListWithModal';
import useUserList from '@/features/user/hooks/useUserList';

const UserListPage: React.FC = () => {
  const [form] = Form.useForm();

  const { loading, userListInfo, onPageChange, onSearch, refresh } =
    useUserList({
      form,
    });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <UserFilterForm onSearch={onSearch} form={form} />
        <UserListWithModal
          userListInfo={userListInfo}
          onPageChange={onPageChange}
          onRefresh={refresh}
        />
      </PageContainer>
    </Spin>
  );
};

export default UserListPage;
