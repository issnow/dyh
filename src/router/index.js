import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component: ()=>import('@view/login/index'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/user',
  },
  {
    path: '/user',
    component: Layout,
    // redirect: '/user',
    meta: {
      title: '用户管理'
    },
    children: [
      {
        // path: 'userlist',
        path: '',
        component: () => import('@/views/user/userlist'),
        name: 'userlist',
        meta: { title: '用户列表', icon: 'dashboard', affix: true }
      },
      {
        path: 'usercenter',
        component: () => import('@/views/user/usercenter'),
        name: 'usercenter',
        meta: { title: '个人中心', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/work',
    component: Layout,
    meta: {
      title: '作品管理'
    },
    children: [
      {
        path: 'manager',
        component: () => import('@/views/work/manager'),
        name: 'manager',
        meta: { title: '作品管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'detail',
        component: () => import('@/views/work/detail'),
        name: 'detail',
        meta: { title: '作品详情', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    meta: {
      title: '项目管理'
    },
    children: [
      {
        path: 'projectList',
        component: () => import('@/views/project/projectList'),
        name: 'projectList',
        meta: { title: '项目列表', icon: 'dashboard', affix: true }
      }
    ]
  },
  
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
