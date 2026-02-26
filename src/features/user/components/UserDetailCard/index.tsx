import React from 'react';

import { Card, Descriptions, Tag } from 'antd';

import type { User } from '../../types';

interface UserDetailCardProps {
  userDetailInfo?: User;
}

const UserDetailCard: React.FC<UserDetailCardProps> = (props) => {
  const { userDetailInfo } = props;

  return (
    <Card title="用户详情">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{userDetailInfo?.id}</Descriptions.Item>
        <Descriptions.Item label="姓名">
          {userDetailInfo?.name}
        </Descriptions.Item>
        <Descriptions.Item label="角色">
          {userDetailInfo?.role === 'admin' ? '管理员' : '普通用户'}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={userDetailInfo?.status === 1 ? 'green' : 'default'}>
            {userDetailInfo?.status === 1 ? '启用' : '停用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {userDetailInfo?.createdAt}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserDetailCard;
