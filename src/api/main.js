import axios from './request'

export const getData = (params) => {
  return axios.get('/api/aaa')
}

// 视频编辑
// https://alieapi.meishesdk.com:8443/project/create
// 参数格式
// {"title":"aaa","resolvingPower":"540","coverUrl":"https://alieasset.meishesdk.com/image/default-project-cover.png"}: 

export const projectCreate = (params) => {
  let fd = new FormData()
  for(let [key, value] of Object.entries(params)) {
    fd.append(key,value)
  }
  return axios({
    method: 'post',
    url: '/api/project/create',
    // data: fd,
    data: params,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

