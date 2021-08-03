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


// 下载
export const download = (url,row) => {
  url = url.replace(/\\/g, "/");
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onprogress = res => {
    let percent = ((res.loaded / res.total) * 100).toFixed(0);
    if(percent == 100) {
      row.downloadLoading = false
    }
  }
  xhr.onload = () => {
    if (xhr.status === 200) {
      // 获取文件blob数据并保存
      var num = url.lastIndexOf("/") + 1;
      //把参数和文件名分割开
      var fileName = url.substring(num).split("?")[0];
      var export_blob = new Blob([xhr.response]);
      var save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = URL.createObjectURL(export_blob);
      save_link.download = fileName;
      save_link.click();
    }
  };
  xhr.send();
}