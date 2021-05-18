import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './css/index.scss'
import 'element-ui/lib/theme-chalk/index.css';

import './config/element.js'
import './iconfont/iconfont.css'

import api from './api/request'

Vue.prototype.$api = api


Vue.config.productionTip = false

console.log('env',process.env.NODE_ENV);


router.beforeEach((to, from, next)=>{
  if(to.path == '/login') {
    sessionStorage.removeItem('isLogin')
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
