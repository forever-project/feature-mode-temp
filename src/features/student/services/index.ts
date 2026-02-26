import { request } from '@umijs/max';
import type { Student, StudentListQuery, StudentListResult } from '../types';

export async function fetchStudentList(
  params: StudentListQuery,
): Promise<StudentListResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: Student[] = Array.from({ length: params.pageSize }).map(
        (_, i) => {
          const id = (params.pageNo - 1) * params.pageSize + i + 1;
          const grades = ['一年级', '二年级', '三年级', '四年级', '五年级'];
          const classes = ['一班', '二班', '三班'];

          return {
            id,
            name: `学生${id}`,
            studentNo: `2024${id.toString().padStart(4, '0')}`,
            gender: id % 2 === 0 ? 'male' : 'female',
            age: 18 + (id % 5),
            grade: grades[id % grades.length],
            className: classes[id % classes.length],
            phone: `138${Math.floor(Math.random() * 100000000)
              .toString()
              .padStart(8, '0')}`,
            email: `student${id}@school.edu`,
            status: id % 3 === 0 ? 0 : 1,
            createdAt: '2024-01-15',
          };
        },
      );

      resolve({
        list,
        total: 100,
      });
    }, 400);
  });
}

export async function fetchStudentDetail(id: number): Promise<Student> {
  return request(`/api/students/${id}`, {
    method: 'GET',
  });
}

export async function createStudent(data: Partial<Student>) {
  return request('/api/students', {
    method: 'POST',
    data,
  });
}

export async function updateStudent(id: number, data: Partial<Student>) {
  return request(`/api/students/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteStudent(id: number) {
  return request(`/api/students/${id}`, {
    method: 'DELETE',
  });
}
