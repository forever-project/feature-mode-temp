export default [
  {
    path: '/',
    redirect: '/user/list',
  },
  {
    name: '用户列表',
    path: '/user/list',
    component: './user/UserList',
  },
  {
    name: '用户详情',
    path: '/user/detail',
    component: './user/UserDetail',
    hideInMenu: true,
  },
  {
    name: '订单列表',
    path: '/order/list',
    component: './order/OrderList',
  },
  {
    name: '学生列表',
    path: '/student/list',
    component: './student/StudentList',
  },
];
