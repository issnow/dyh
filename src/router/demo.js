let a = [
  {
    path: '/user',
    children: [
      {
        path: '',
        name: 'userlist',
        meta: { title: '用户管理'}
      },
    ]
  },
  {
    path: '/work',
    meta: {
      title: '作品管理'
    },
    children: [
      {
        path: 'manager',
        name: 'manager',
        meta: { title: '作品管理'}
      },
      {
        path: 'detail',
        name: 'detail',
        meta: { title: '作品详情'}
      }
    ]
  },
  {
    path: '/project',
    meta: {
      title: '项目管理'
    },
    children: [
      {
        path: 'projectList',
        name: 'projectList',
        meta: { title: '项目列表', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/view',
    meta: {
      title: '审核管理'
    },
    children: [
      {
        path: 'viewList',
        name: 'viewList',
        meta: { title: '审核列表', icon: 'dashboard', affix: true }
      }
    ]
  },
]