import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout'

Vue.use(VueRouter)

export const routes = [{
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@view/login/index'),
    // hidden: true
  },
  {
    // 作品管理详情页
    path: '/workDetail/:code/:isEdit',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@view/work/detail'),
      name: 'workDetail'
    }]
  },
  // {
  //   // 成品管理详情页
  //   path: '/productDetail/:code/:isEdit',
  //   component: Layout,
  //   children: [{
  //     path: '',
  //     component: () => import('@view/product/detail'),
  //     name: 'productDetail'
  //   }]
  // },
  {
    path: '/viewDetail',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@view/view/viewDetail'),
      name: 'viewDetail'
    }]
  }

  //   {
  //   path: '/userList',
  //   component: Layout,
  //   // redirect: '/user',
  //   // meta: {
  //   //   title: '用户管理'
  //   // },
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/user/userList'),
  //       name: 'userlist',
  //       meta: { title: '用户管理', icon: 'dashboard' }
  //     },
  //   ]
  // },
]
// const asyncRoutes = [
//   {
//     path: '/userlist',
//     component: Layout,
//     // redirect: '/user',
//     // meta: {
//     //   title: '用户管理'
//     // },
//     children: [
//       {
//         path: '',
//         component: () => import('@/views/user/userList'),
//         name: 'userlist',
//         meta: { title: '用户管理', icon: 'dashboard' }
//       },
//     ]
//   },
//   {
//     path: '/workManager',
//     component: Layout,
//     // meta: {
//     //   title: '作品管理'
//     // },
//     children: [
//       {
//         path: '',
//         component: () => import('@/views/work/workManager'),
//         name: 'workManager',
//         meta: { title: '作品管理', icon: 'dashboard' }
//       },
//     ]
//   },
//   {
//     path: '/projectList',
//     component: Layout,
//     // meta: {
//     //   title: '项目管理'
//     // },
//     children: [
//       {
//         path: '',
//         component: () => import('@/views/project/projectList'),
//         name: 'projectList',
//         meta: { title: '项目管理', icon: 'dashboard' }
//       }
//     ]
//   },
// ]
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })
const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const router = createRouter()

export const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}


export default router