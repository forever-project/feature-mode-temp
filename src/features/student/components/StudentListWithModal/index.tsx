import React from 'react';

import { Card } from 'antd';

import StudentTable from '../StudentTable';
import type { StudentListInfo } from '../../types';

interface StudentListWithModalProps {
  studentListInfo?: StudentListInfo;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onRefresh: () => void;
}

const StudentListWithModal: React.FC<StudentListWithModalProps> = (props) => {
  const { studentListInfo, loading, onPageChange } = props;

  return (
    <Card title="学生列表">
      <StudentTable
        studentListInfo={studentListInfo}
        loading={loading}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

export default StudentListWithModal;

