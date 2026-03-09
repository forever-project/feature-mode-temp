import type { TableColumnsType } from 'antd';
import { Tag } from 'antd';

import type { Student } from '../../types';

export function buildStudentColumns(): TableColumnsType<Student> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '学号',
      dataIndex: 'studentNo',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '班级',
      dataIndex: 'className',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v: 0 | 1) => (
        <Tag color={v === 1 ? 'green' : 'default'}>
          {v === 1 ? '在读' : '停用'}
        </Tag>
      ),
    },
    {
      title: '入学时间',
      dataIndex: 'enrolledAt',
    },
  ];
}

