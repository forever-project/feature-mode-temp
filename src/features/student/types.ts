export interface Student {
  id: number;
  name: string;
  studentNo: string;
  gender: 'male' | 'female';
  age: number;
  grade: string;
  className: string;
  phone: string;
  email: string;
  status: 0 | 1;
  createdAt: string;
}

export interface StudentListQuery {
  pageNo: number;
  pageSize: number;
  name?: string;
  studentNo?: string;
  grade?: string;
  status?: number;
}

export interface StudentListInfo {
  list: Student[];
  total: number;
  pageNo: number;
  pageSize: number;
}

export interface StudentDTO {
  id: number;
  name: string;
  student_no: string;
  gender: 'male' | 'female';
  age: number;
  grade: string;
  class_name: string;
  phone: string;
  email: string;
  status: number;
  created_at: string;
}
