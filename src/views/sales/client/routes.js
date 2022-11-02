const SalesViewRoutes = [
  {
    path: '/sales/client-list',
    name: 'SalesClientList',
    component: () => import('./views/SalesClientList'),
  },
  {
    path: '/sales/client-list/:id',
    name: 'SalesClientDetail',
    component: () => import('./views/SalesClientDetail'),
  },
  {
    path: '/sales/client-detail',
    name: 'SalesClientDetailList',
    component: () => import('./views/SalesClientDetailList'),
  },
  {
    path: '/sales/estimate-list',
    name: 'SalesEstimateList',
    component: () => import('../estimate/SalesEstimateList'),
  },
  {
    path: '/sales/estimate-list/:id',
    name: 'SaleseEstimateDetail',
    component: () => import('@/views/sales/estimate/SalesEstimateDetail'),
  }
]
export default SalesViewRoutes