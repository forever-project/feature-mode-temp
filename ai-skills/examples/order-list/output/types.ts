// src/features/order/types.ts

// ============================================
// 实体类型
// ============================================
export interface Order {
  id: string;
  orderNo: string;
  orderAmount: number;
  statusCode: number;
  createdAt: string;
  customerInfo: {
    firstName: string;
    lastName: string;
  };
}

// ============================================
// 列表查询参数
// ============================================
export interface OrderListQuery {
  pageNo?: number;
  pageSize?: number;
  orderNo?: string;
}

// ============================================
// 列表响应结构（统一字段名）
// ============================================
export interface OrderListInfo {
  list: Order[];
  total: number;
  pageNo: number;
  pageSize: number;
}
