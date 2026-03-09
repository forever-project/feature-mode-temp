export interface Order {
  id: number;
  orderNo: string;
  status: string;
  createdAt: string;
}

export interface OrderListQuery {
  pageNo: number;
  pageSize: number;
  orderNo?: string;
  status?: string;
}

export interface OrderListResult {
  list: Order[];
  total: number;
}

export interface OrderListInfo {
  list: Order[];
  total: number;
  pageNo: number;
  pageSize: number;
}
