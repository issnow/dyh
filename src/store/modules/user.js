import Layout from '../../layout'
import router from '@/router'
import { getUserInfo } from '@api/user'
export default {
  namespaced: true,
  state: {
    userInfo: {},
    routes: []
  },
  mutations: {
    SET_USER_INFO(state, payload) {
      state.userInfo = payload
    },
    SET_ROUTES(state, payload) {
      const {permissionList} = payload
      let newRouter = formatRouter(permissionList)
      console.log('newRouter', newRouter);
      state.routes = newRouter
      console.log(router, 'router1');
      router.addRoutes(newRouter)
    }
  },
  actions: {
    async asyncGetUserInfo({state, commit}) {
      let {status, element} = await getUserInfo({id: state.userInfo.id})
      if (status == 1) {
        console.log(element, 'element');
        commit('SET_USER_INFO', element);
      }
    }
  }
}
 
export function formatRouter(list) {
  return list.map(({url, title, icon_class})=>({
    path: /\/.*(\/.*)/.exec(url)[1],
    component: Layout,
    children: [
      {
        path: '',
        component: ()=>import(`@/views${url}`),
        name: /\/.*\/(.*)/.exec(url)[1],
        meta: {title, icon:icon_class}
      }
    ]
  }))

}