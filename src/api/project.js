import axios from './request'

// 获取画幅，分辨率，状态列表
export const getChoicesList = (params) => {
  return axios.post('/api/product/choicesList', params)
}

// 创建项目
export const createProject = (params) => {
  return axios.post('/dayunhe.com/project/create',params)
}

// 获取项目列表
export const getProjectList = (params) => {
  return axios.post('/dayunhe.com/project/list', params)
}

// 删除项目
export const delProject = (params) => {
  return axios.post('/dayunhe.com/project/delProject', params)
}

