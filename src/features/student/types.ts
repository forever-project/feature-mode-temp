export interface Student {
  id: number;
  studentNo: string;
  name: string;
  className: string;
  status: 0 | 1;
  enrolledAt: string;
}

export interface StudentListQuery {
  pageNo: number;
  pageSize: number;
  studentNo?: string;
  name?: string;
  className?: string;
  status?: 0 | 1;
}

export interface StudentListResult {
  list: Student[];
  total: number;
}

export interface StudentListInfo {
  list: Student[];
  total: number;
  pageNo: number;
  pageSize: number;
}