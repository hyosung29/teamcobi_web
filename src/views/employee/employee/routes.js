const EmployeeViewRoutes = [
  {
    path: '/employee-list',
    component: () => import('../employee/views/EmployeeList')
  },
  {
    path: '/department-list',
    component: () => import('../department/views/DepartmentList')
  },
  {
    path: '/position-list',
    component: () => import('../position/views/PositionList')
  },
  {
    path: '/salary-list',
    component: () => import('../salary/views/SalaryList')
  },
  {
    path: '/employee/salaryView/:id',
    name: 'SalaryView',
    component: () => import('../salary/views/SalaryView')
  }
]

export default EmployeeViewRoutes
