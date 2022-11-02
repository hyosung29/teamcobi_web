const SalesViewRoutes = [
  {
    path: '/sales/client-list',
    component: () => import('../client/views/SalesClientList'),
  },
  {
    path: '/sales/client/:id',
    name: 'SalesClientDetail',
    component: () => import('@/views/sales/client/views/SalesClientDetail'),
  },
  {
    path: '/sales/client-detail-list',
    name: 'SalesClientDetailList',
    component: () => import('@/views/sales/client/views/SalesClientDetailList'),
  },
  {
    path: '/sales/estimate-list',
    name: 'SalesEstimateList',
    component: () => import('../estimate/SalesEstimateList'),
  },
  {
    path: '/sales/estimate/:id',
    name: 'SalesEstimateDetail',
    component: () => import('@/views/sales/estimate/SalesEstimateDetail'),
  },
  {
    path: '/sales/order-form-list',
    name: 'SalesOrderFormList',
    component: () => import('@/views/sales/orderForm/views/SalesOrderFormList'),
  },
  {
    path: '/sales/order-form/:id',
    name: 'SalesOrderFormDetail',
    component: () =>
      import('@/views/sales/orderForm/views/SalesOrderFormDetail'),
  },
]
export default SalesViewRoutes
