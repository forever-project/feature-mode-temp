import React from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Form, Spin } from 'antd';

import StudentFilterForm from '@/features/student/components/StudentFilterForm';
import StudentListWithModal from '@/features/student/components/StudentListWithModal';
import useStudentList from '@/features/student/hooks/useStudentList';

const StudentListPage: React.FC = () => {
  const [form] = Form.useForm();

  const { loading, studentListInfo, onPageChange, onSearch, refresh } =
    useStudentList({
      form,
    });

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <StudentFilterForm onSearch={onSearch} form={form} />
        <StudentListWithModal
          studentListInfo={studentListInfo}
          onPageChange={onPageChange}
          onRefresh={refresh}
        />
      </PageContainer>
    </Spin>
  );
};

export default StudentListPage;

