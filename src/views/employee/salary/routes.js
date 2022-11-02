const SalaryViewRoutes = [
  {
  path: '/employee/salary-list',
  component: () => import('../salary/views/SalaryList')
  },
  {
  path: '/employee/salaryView/:id',
  name: 'SalaryView',
  component: () => import('../salary/views/SalaryView')
  }
]

export default SalaryViewRoutes
