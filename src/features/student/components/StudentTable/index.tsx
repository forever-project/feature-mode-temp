import React from 'react';

import { Table } from 'antd';

import { DEFAULT_PAGINATION_PARAMS } from '@/features/shared/constants';
import { StudentListInfo } from '@/features/student/types';
import { buildStudentColumns } from './_columns';

interface StudentTableProps {
  studentListInfo?: StudentListInfo;
  loading?: boolean;
  onPageChange: (pageNo: number, pageSize: number) => void;
  onEdit: (record: any) => void;
  onDetail: (record: any) => void;
}

const StudentTable: React.FC<StudentTableProps> = (props) => {
  const {
    studentListInfo = {},
    loading,
    onPageChange,
    onEdit,
    onDetail,
  } = props;

  const columns = buildStudentColumns({
    onEdit,
    onDetail,
  });

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={studentListInfo.list}
      loading={loading}
      pagination={{
        current: studentListInfo.pageNo || DEFAULT_PAGINATION_PARAMS.pageNo,
        pageSize:
          studentListInfo.pageSize || DEFAULT_PAGINATION_PARAMS.pageSize,
        total: studentListInfo.total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
    />
  );
};

export default StudentTable;
