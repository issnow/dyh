import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueLazyload from 'vue-lazyload'


import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './css/index.scss'
import 'element-ui/lib/theme-chalk/index.css';

import './config/element.js'
import './iconfont/iconfont.css'

import api from './api/request'
import {
  checkLogin
} from '@api/user'


Vue.use(VueLazyload)

Vue.prototype.$api = api


Vue.config.productionTip = false

console.log('env', process.env.NODE_ENV);


router.beforeEach(async (to, from, next) => {
  console.log(to, from, 'to');
  if(to.path !='/login') {
    let {
      status,
      element,
      msg
    } = await checkLogin()
    if (status == 1) {
      // store.commit('user/SET_ROUTES', element)
      next()
    } else if(status == '-101') {
      Vue.prototype.$message({
        type: 'error',
        message: msg
      })
      next('/login')
    }
  }else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')