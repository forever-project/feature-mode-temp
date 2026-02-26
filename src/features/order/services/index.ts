import type { OrderDTO, OrderListQuery } from '../types';

/**
 * 模拟后端接口：获取订单列表
 * 包含：DTO 模拟、异步延迟、数据转换逻辑
 */
export async function queryOrderList(
  params: OrderListQuery,
): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 模拟后端返回的原始数据 (DTO 数组)
      const list: OrderDTO[] = Array.from({ length: params.pageSize }).map(
        (_, i) => {
          const id = (params.pageNo - 1) * params.pageSize + i + 1;
          return {
            id: `${id}`,
            orderNo: `SN2026${id.toString().padStart(6, '0')}`,
            orderAmount: Math.floor(Math.random() * 5000) + 100,
            statusCode: (id % 5) + 1, // 模拟 1-5 的状态码
            createdAt: '2026-02-02T10:00:00Z',
            customerInfo: {
              firstName: '王',
              lastName: `小${id}`,
            },
          };
        },
      );

      // 3. 返回清洗后的结果
      resolve({
        code: 200,
        data: {
          list,
          total: 100, // 模拟总条数
          pageNun: params.pageNo,
          pageSize: params.pageSize,
        },
      });
    }, 400);
  });
}
