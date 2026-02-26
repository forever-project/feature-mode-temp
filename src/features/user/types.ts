export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  status: 0 | 1;
  createdAt: string;
}

export interface UserListQuery {
  pageNo: number;
  pageSize: number;
  name?: string;
  role?: string;
}

export interface UserListInfo {
  list: User[];
  total: number;
  pageNo: number;
  pageSize: number;
}
