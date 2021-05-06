import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/index.scss'
import 'element-ui/lib/theme-chalk/index.css';

import './config/element.js'

import api from './api/request'

Vue.prototype.$api = api


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
