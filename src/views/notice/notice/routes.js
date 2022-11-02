const NoticeListRoutes = [
  {
    path: '/notice-list',
    component: () => import('./views/NoticeList')
  },
  {
    path: '/notice-create',
    name: 'NoticeCreate',
    component: () => import('./views/NoticeCreate')
  },
  {
    path: '/notice-detail/:id',
    name: 'NoticeDetail',
    component: () => import('./views/NoticeDetail')
  },
  {
    path: '/notice-view/:id',
    name: 'NoticeView',
    component: () => import('./views/NoticeView')
  },
  
]

export default NoticeListRoutes
