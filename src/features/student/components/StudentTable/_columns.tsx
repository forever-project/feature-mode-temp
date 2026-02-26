import type { TableColumnsType } from 'antd';
import { Button, Space, Tag } from 'antd';
import type { Student } from '../../types';

interface ColumnOptions {
  onEdit?(record: Student): void;
  onDetail?(record: Student): void;
}

export function buildStudentColumns(
  options?: ColumnOptions,
): TableColumnsType<Student> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '学号',
      dataIndex: 'studentNo',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      render: (gender: string) => (gender === 'male' ? '男' : '女'),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
    },
    {
      title: '年级',
      dataIndex: 'grade',
      width: 100,
    },
    {
      title: '班级',
      dataIndex: 'className',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => options?.onDetail?.(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => options?.onEdit?.(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
}
