const LogisticsViewRoutes = [
  {
    path: '/logistics/receiving-list',
    name: 'LogisticsReceivingList',
    component: () =>
      import('@/views/logistics/receiving/LogisticsReceivingList'),
  },
  {
    path: '/logistics/inventory-list',
    name: 'LogisticsInventoryList',
    component: () =>
      import('@/views/logistics/inventory/LogisticsInventoryList'),
  },
  {
    path: '/logistics/receiving/instruction',
    name: 'LogisticsReceivingInstruction',
    component: () =>
      import('@/views/logistics/receiving/LogisticsReceivingInstruction'),
  },
  {
    path: '/logistics/warehouse-info',
    name: 'WarehouseList',
    component: () =>
      import('@/views/logistics/logistics/views/LogisticsWarehouseInfo'),
  },
  {
    path: '/logistics/section-info',
    name: 'SectionList',
    component: () => import('@/views/logistics/section/SectionList'),
  },
  {
    path: '/logistics/forwarding-list',
    name: 'LogisticsForwardingList',
    component: () =>
      import('@/views/logistics/forwarding/LogisticsForwardingList'),
  },
  {
    path: '/logistics/forwarding/instruction',
    name: 'LogisticsForwardinginstruction',
    component: () =>
      import('@/views/logistics/forwarding/LogisticsForwardinginstruction'),
  },
]
export default LogisticsViewRoutes
