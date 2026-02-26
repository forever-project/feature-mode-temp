import React from 'react';

import { Button, Card, Space } from 'antd';
import { history } from 'umi';

import UserEditModal from '../../components/UserEditModal';
import UserTable from '../../components/UserTable';
import { useUserEdit } from '../../hooks/useUserEdit';
import type { User, UserListInfo } from '../../types';

interface UserListWithModalProps {
  userListInfo?: UserListInfo;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onRefresh: () => void;
}

const UserListWithModal: React.FC<UserListWithModalProps> = (props) => {
  const { userListInfo, loading, onPageChange, onRefresh } = props;

  const { modalInfo, openModal, closeModal, submit } = useUserEdit({
    onSuccess: onRefresh,
  });

  const onCreate = () => openModal('add');

  const onEdit = (record: User) => openModal('edit', record);

  const onDetail = (record: User) => {
    history.push(`/user/detail?id=${record.id}`);
  };

  return (
    <>
      <Card
        title="用户列表"
        extra={
          <Space>
            <Button type="primary" onClick={onCreate}>
              新建
            </Button>
          </Space>
        }
      >
        <UserTable
          userListInfo={userListInfo}
          loading={loading}
          onPageChange={onPageChange}
          onEdit={onEdit}
          onDetail={onDetail}
        />
      </Card>
      <UserEditModal
        modalInfo={modalInfo}
        onCancel={closeModal}
        onOk={submit}
      />
    </>
  );
};

export default UserListWithModal;
