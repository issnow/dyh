import axios from './request.js'

// 作品列表
export const productGetList = (params) => {
  return axios.post('/api/product/getList', params)
}

// 获取画幅、分辨率、状态列表
export const productChoicesList = (params) => {
  return axios.post('/api/product/choicesList', params)
}

// 删除作品
export const productDel = (p) => {
  return axios.post('/api/product/del', p)
}

// 提交审核
export const productApplyAudit = (params) => {
  return axios.post('/api/product/applyAudit', params)
}

// 标签列表
export const productTagList = (params) => {
  return axios.post('/api/product/tagList')
}



// 实体列表
export const newAllEntity = (params) => {
  return axios.post('/api/product/allEntity', params)
}
// 搜索实体
export const newSearchEntity= (params) => {
  return axios.post('/api/product/searchEntities', params)
}

// 作品详情
export const productDetail = (params) => {
  return axios.post('/api/product/detail', params)
}

// 编辑作品
export const productEdit = (params) => {
  return axios.post('/api/product/edit', params)
}

// 重新合成

export const againExportProduct = (params) => {
  return axios.post('/api/product/againExportProduct', params)
}

