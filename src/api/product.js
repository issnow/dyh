import axios from './request'

// 成片列表
export const getList = (params) => {
  return axios.post('/api/product/workList', params)
}
// 重新转码
export const reTranscode = (params) => {
  return axios.post('/product/reTranscode', params)
}
// 删除成片
export const del = (params) => {
  return axios.post('/api/product/del', params)
}
// 提交审核
export const applyAudit = (params) => {
  return axios.post('/api/product/applyAudit', params)
}
// 添加本地成品
export const add = (params) => {
  return axios.post('/api/product/add', params)
}

// 成片详情
export const detail = (params) => {
  return axios.post('/api/product/detail', params)
}

// 获取临时凭证
export const temporaryKey = (params) => {
  return axios.post('/api/product/temporaryKey')
}
