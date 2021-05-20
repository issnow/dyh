import axios from './request.js'

// 作品列表
export const productGetList = (params) => {
  return axios.post('/api/product/getList', params)
}


// 获取画幅、分辨率、状态列表
export const productChoicesList = (params) => {
  return axios.post('/api/product/choicesList', params)
}
