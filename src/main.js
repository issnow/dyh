import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/indexc'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './css/index.scss'
import 'element-ui/lib/theme-chalk/index.css';

import './config/element.js'

import api from './api/request'

Vue.prototype.$api = api


Vue.config.productionTip = false

console.log('env',process.env.NODE_ENV);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
