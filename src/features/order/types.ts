export interface OrderDTO {
  id: string;
  orderNo: string; // 后端可能返回下划线命名
  orderAmount: number;
  statusCode: number; // 后端可能是状态码
  createdAt: string; // 原始时间戳字符串
  customerInfo: {
    firstName: string;
    lastName: string;
  };
}

export interface OrderListQuery {
  pageNo: number;
  pageSize: number;
  name?: string;
  role?: string;
}

export interface OrderListInfo {
  list: OrderDTO[];
  total: number;
  pageNo: number;
  pageSize: number;
}
