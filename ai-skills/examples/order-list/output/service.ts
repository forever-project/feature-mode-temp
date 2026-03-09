// src/features/order/services/index.ts

import type { Order, OrderListInfo, OrderListQuery } from '../types';

export async function fetchOrderList(params: OrderListQuery): Promise<OrderListInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: Order[] = Array.from({ length: params.pageSize || 10 }).map((_, i) => {
        const id = (params.pageNo || 1 - 1) * (params.pageSize || 10) + i + 1;
        return {
          id: `${id}`,
          orderNo: `SN2026${id.toString().padStart(6, '0')}`,
          orderAmount: Math.floor(Math.random() * 5000) + 100,
          statusCode: (id % 5) + 1,
          createdAt: '2026-02-02T10:00:00Z',
          customerInfo: {
            firstName: '王',
            lastName: `小${id}`,
          },
        };
      });

      resolve({
        list,
        total: 100,
        pageNo: params.page || 1,
        pageSize: params.pageSize || 10,
      });
    }, 400);
  });
}

export async function updateOrder(payload: Partial<Order>) {
  console.log('update order:', payload);
  return true;
}
