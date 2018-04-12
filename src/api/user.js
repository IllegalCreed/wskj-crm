import api from './config'

// 登录
export function login(phone, pwd) {
  return api.post('user/login', {
    phone,
    pwd
  })
}

// 添加修改用户
export function addOrUpdateUser(to_user_id, name, phone, md_department_id, position, pwd, role_ids) {
  return api.post('user/addOrUpdateUser', {
    to_user_id,
    name,
    phone,
    md_department_id,
    position,
    pwd,
    role_ids,
    token: localStorage.getItem('token')
  })
}

// 重置密码
export function resetPwd(to_user_id, pwd) {
  return api.post('user/resetPwd', {
    to_user_id,
    pwd,
    token: localStorage.getItem('token')
  })
}

// 获取用户列表
export function getUserList(page_index, page_size, name) {
  return api.post('user/getList', {
    page_index,
    page_size,
    name,
    token: localStorage.getItem('token')
  })
}

// 获取用户详情
export function getUserDetail(to_user_id) {
  return api.post('user/getDetail', {
    to_user_id,
    token: localStorage.getItem('token')
  })
}

// 冻结或解冻用户
export function setFreeze(to_user_id) {
  return api.post('user/setFreeze', {
    to_user_id,
    token: localStorage.getItem('token')
  })
}

// 获取权限列表
export function getRoleList() {
  return api.post('user/getRoleList', {
    token: localStorage.getItem('token')
  })
}