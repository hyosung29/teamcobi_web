const PurchaseViewRoutes = [
  {
    path: '/purchase/client-list',
    component: () => import('@/views/purchase/client/views/PurchaseClientList'),
  },
  {
    path: '/purchase/client-list/:id',
    name: 'PurchaseClientDetail',
    component: () => import('@/views/purchase/client/views/PurchaseClientDetail'),
  },
  {
    path: '/purchase/client-detail',
    name: 'PurchaseClientDetailList',
    component: () => import('@/views/purchase/client/views/PurchaseClientDetailList'),
  },
  {
    path: 'estimate-list',
    component: () => import('@/views/purchase/estimate/PurchaseEstimateList'),
  },
  {
    path: 'order-form-list',
    name: 'PurchaseOrderFormList',
    component: () =>
      import('@/views/purchase/orderForm/views/PurchaseOrderFormList'),
  },
  {
    path: 'order-form/:id',
    name: 'PurchaseOrderFormDetail',
    component: () =>
      import('@/views/purchase/orderForm/views/PurchaseOrderFormDetail'),
  },
  {
    path: 'estimate/:id',
    name: 'PurchaseEstimateDetail',
    component: () => import('@/views/purchase/estimate/PurchaseEstimateDetail'),
  },
]
export default PurchaseViewRoutes
