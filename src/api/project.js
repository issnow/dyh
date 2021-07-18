import axios from './request'

// 以下为项目管理

// 获取画幅，分辨率，状态列表
export const getChoicesList = (params) => {
  return axios.post('/api/product/choicesList', params)
}

// 标签列表
export const getTagList = (params) => {
  return axios.post('/api/product/tagList', params)
}

// 实体列表
export const getEntityList = (params) => {
  return axios.post('/api/product/entityList', params)
}

// 创建项目
export const createProject = (params) => {
  return axios.post('/api/project/create',params)
}

// 获取项目列表
export const getProjectList = (params) => {
  return axios.post('/api/project/list', params)
}

// 删除项目
export const delProject = (params) => {
  return axios.post('/api/project/delProject', params)
}


// 以下为审核管理

// 获取审核列表
export const getList = (params) => {
  return axios.post('/api/task/getList', params)
}

// 审核详情
export const getAuditDetail = (params) => {
  return axios.post('/api/task/auditDetail', params)
}

// 审核结果
export const auditTask = (params) => {
  return axios.post('/api/task/audit', params)
}

