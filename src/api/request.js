import router from '../router'
import {
  Message
} from 'element-ui'
// export const baseURL = process.env.NODE_ENV == 'development' ? 'http://123.60.24.237:8085' : 'https://api-dyh.videoyi.com'
export const baseURL = 'https://api-dyh.videoyi.com'
// export const baseURL = 'http://123.60.24.237:8085'

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
    config.baseURL = baseURL
  }
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
  // 对响应数据做点什么
  // console.log(response.data, 'res --success');
  let {
    status,
    msg
  } = response.data
  if (status != 1) {
    Message.error({
      type: 'error',
      message: msg,
    })
  }
  return response.data;
}, function (error) {
  let msg
  // 对响应错误做点什么
  // return Promise.reject(error);
  const res = error.response

  if (res) {
    switch (res.status) {
      case 400:
        msg = '请求错误，请检查您的网络是否可用！';
        break;
      case 401:
        msg = '请先登陆！';
        break;
      case 402:
        msg = '登陆过期，请重新登陆！';
        break;
      case 403:
        msg = '拒绝访问！';
        break;
      case 404:
        msg = '请求地址错误：' + err.response.config.url;
        break;
      case 408:
        msg = '请求超时，请重试！';
        break;
      case 500:
        msg = '服务器内部错误！';
        break;
      case 501:
        msg = '服务未实现！';
        break;
      case 502:
        msg = '网关错误！';
        break;
      case 503:
        msg = '服务不可用！';
        break;
      case 504:
        msg = '网关超时！';
        break;
      case 505:
        msg = 'HTTP版本不受支持！';
        break;
        // default: msg = '未知错误！'; break;
    }
  }
  if (msg) {
    Message.error({
      type: 'error',
      message: msg,
    })
  }
});

export default instance