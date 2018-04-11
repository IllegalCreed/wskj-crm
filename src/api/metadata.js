import api from './config'

// 获取元数据列表
export function getMetadataList() {
  return api.post('metadata/getList', {
    token: localStorage.getItem('token')
  })
}

// 添加元数据
export function addMetadata(name, type) {
  return api.post('metadata/add', {
    name, 
    type,
    token: localStorage.getItem('token')
  })
}

// 删除元数据
export function delMetadata(md_id) {
  return api.post('metadata/del', {
    md_id,
    token: localStorage.getItem('token')
  })
}