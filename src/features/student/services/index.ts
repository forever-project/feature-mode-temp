import type {
  Student,
  StudentListQuery,
  StudentListResult,
} from '../types';

export async function fetchStudentList(
  params: StudentListQuery,
): Promise<StudentListResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: Student[] = Array.from({ length: params.pageSize }).map(
        (_, i) => {
          const id = (params.pageNo - 1) * params.pageSize + i + 1;

          return {
            id,
            studentNo: `S${String(id).padStart(8, '0')}`,
            name: `学生${id}`,
            className: `高一(${(id % 6) + 1})班`,
            status: id % 4 === 0 ? 0 : 1,
            enrolledAt: '2024-09-01',
          };
        },
      );

      resolve({
        list,
        total: 256,
      });
    }, 400);
  });
}

