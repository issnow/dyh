import router from '../router'
// export const baseURL = 'http://172.18.20.78/dayunhe/backend/public'
export const baseURL = 'http://123.60.24.237:8085'

const axios = require('axios')
let instance = axios.create({
  baseURL: '/',
  timeout: 30000,
  withCredentials: true,
  headers: {
    // 'X-Custom-Header': 'foobar',
    // post: {
    //   "Content-Type": 'application/json'
    // }
  },
  // transformRequest: [(data, headers)=>{
  //   console.log(data,headers, 'data1');
  //   return data
  // }]
});
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  if (process.env.NODE_ENV == 'production') {
    config.url = config.url.replace('/api', '')
    config.baseURL = 'http://123.60.24.237:8085/'
  }
  // if(config.method === 'post') {
  //   config.headers = {
  //     ...config.headers,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // }
  if (sessionStorage.getItem('token')) {
    config.headers = {
      ...config.headers,
      Authorization: sessionStorage.getItem('token')
    }
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  // return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  const {
    data
  } = response
  if (data.status == '-101') {
    // 用户未登录
    if(router.app._route.path !== '/login') {
      router.push('/login')
    }
  }
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  // return Promise.reject(error);
  const res = error.response
  if (res) {
    switch (res.status) {
      case 401:
        // 无权限处理
        // location.href = ''
        break;
      default:
        break;
    }
  }
});

export default instance