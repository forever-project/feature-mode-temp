import { User, UserListQuery, UserListResult } from '../types';

export async function fetchUserList(
  params: UserListQuery,
): Promise<UserListResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: User[] = Array.from({ length: params.pageSize }).map(
        (_, i) => {
          const id = (params.pageNo - 1) * params.pageSize + i + 1;
          return {
            id,
            name: `用户${id}`,
            role: id % 2 === 0 ? 'admin' : 'user',
            status: id % 2 === 0 ? 1 : 0,
            createdAt: '2025-01-01',
          };
        },
      );

      resolve({
        list,
        total: 128,
      });
    }, 400);
  });
}

export async function fetchUserDetail(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: `用户${id}`,
        role: 'admin',
        status: 1,
        createdAt: '2025-01-01',
      });
    }, 300);
  });
}

export async function updateUser(payload: Partial<User>) {
  console.log('update user:', payload);
  return true;
}
