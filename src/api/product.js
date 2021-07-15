import axios from './request'

// 成片列表
export const getList = (params) => {
  return axios.post('/api/product/getList', params)
}

// 成片详情
export const detail = (params) => {
  return axios.post('/api/product/detail', params)
}

// 删除成片
export const del = (params) => {
  return axios.post('/api/product/del', params)
}

// 提交审核
export const applyAudit = (params) => {
  return axios.post('/api/product/applyAudit', params)
}

// 编辑成片
export const edit = (params) => {
  return axios.post('/api/product/edit', params)
}
