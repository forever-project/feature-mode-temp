import {
  Order,
  OrderListQuery,
  OrderListResult,
} from '../types';

export async function fetchOrderList(
  params: OrderListQuery,
): Promise<OrderListResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: Order[] = Array.from({ length: params.pageSize }).map(
        (_, i) => {
          const id = (params.pageNo - 1) * params.pageSize + i + 1;
          return {
            id,
            orderNo: `ORD${String(id).padStart(6, '0')}`,
            status: id % 3 === 0 ? '已完成' : id % 3 === 1 ? '待支付' : '进行中',
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
