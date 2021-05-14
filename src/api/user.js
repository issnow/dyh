import axios from './request'

// 获取用户管理列表
export const getTableData = (params) => {
  return axios.post('/user/getUserList', params)
}

// login
export const loginApp = (params) => {
  return axios.post('/user/login',params)
}

// 注销
export const logout = (params) => {
  return axios.post('/user/logout')
}

// 设置用户禁用启用
export const setUserState = (params) => {
  return axios.post('/user/setUserState', params)
}

// 重置密码
export const resetUserPassword = (params) => {
  return axios.post('/user/resetUserPassword', params)
}


// 检测登录状态
export const checkLogin = (params) => {
  return axios.post('/user/checkLogin')
}

// 上传用户头像
export const uploadPhoto = (params) => {
  return axios.post('/user/upload', params)
}

// 获取用户信息
export const getUserInfo = (params) => {
  return axios.post('/user/getUserInfo', params)
}

// 账号设置
export const saveUser = (params) => {
  return axios.post('/user/saveUser', params)
}

// 修改本人密码
export const saveOwnPassword = (params) => {
  return axios.post('/user/saveOwnPassword', params)
}
