import React from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form, Space, Spin, message } from 'antd';

import StudentSearchForm from '@/features/student/components/StudentSearchForm';
import StudentTable from '@/features/student/components/StudentTable';
import useStudentList from '@/features/student/hooks/useStudentList';

const StudentListPage: React.FC = () => {
  const [form] = Form.useForm();

  const { loading, studentListInfo, onPageChange, onSearch } = useStudentList({
    form,
  });

  const onEdit = () => {
    message.success('功能待开发');
  };

  const onExport = () => {
    message.success('已触发导出（示例）');
  };

  return (
    <Spin spinning={loading}>
      <PageContainer>
        <StudentSearchForm onSearch={onSearch} form={form} />
        <Card
          title="学生列表"
          extra={
            <Space>
              <Button onClick={onExport}>导出</Button>
              <Button type="primary" onClick={onEdit}>
                新建
              </Button>
            </Space>
          }
        >
          <StudentTable
            studentListInfo={studentListInfo}
            onPageChange={onPageChange}
            onEdit={onEdit}
            onDetail={onEdit}
          />
        </Card>
      </PageContainer>
    </Spin>
  );
};

export default StudentListPage;
