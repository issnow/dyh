import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueLazyload from 'vue-lazyload'
import OnFire from 'onfire.js';

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './css/index.scss'
import 'element-ui/lib/theme-chalk/index.css';

import './config/element.js'
import './iconfont05/iconfont.css'

import api from './api/request'

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
const hls = require('videojs-contrib-hls')
Vue.use(hls)
Vue.use(VideoPlayer)


Vue.use(VueLazyload)

Vue.prototype.$api = api

// 发布-订阅者
window.onfire = new OnFire();


Vue.config.productionTip = false

console.log('env', process.env.NODE_ENV);





new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
