import React from 'react';

import { Table } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import type { StudentListInfo } from '@/features/student/types';
import { buildStudentColumns } from './_columns';

interface StudentTableProps {
  studentListInfo?: StudentListInfo;
  loading?: boolean;
  onPageChange: (pageNo: number, pageSize: number) => void;
}

const StudentTable: React.FC<StudentTableProps> = (props) => {
  const { studentListInfo = {}, loading, onPageChange } = props;

  const columns = buildStudentColumns();

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={studentListInfo.list}
      loading={loading}
      pagination={{
        current: studentListInfo.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
        pageSize: studentListInfo.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        total: studentListInfo.total,
        onChange: onPageChange,
        showSizeChanger: true,
      }}
    />
  );
};

export default StudentTable;

