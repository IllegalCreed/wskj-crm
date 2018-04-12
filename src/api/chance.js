import api from './config'

// 添加修改机会
export function addOrUpdateChance(chance_id, customer, estimate, real_amount, rebate, project_type, project_desc, progress, state) {
    return api.post('chance/addOrUpdateChance', {
        chance_id,
        customer,
        estimate,
        real_amount,
        rebate,
        project_type,
        project_desc,
        progress,
        state,
        token: localStorage.getItem('token')
    })
}

// 搜索客户名称
export function searchChanceByCustomerName(word) {
    return api.post('chance/getCustomerName', {
        word,
        token: localStorage.getItem('token')
    })
}

// 获取机会列表
export function getChanceList(page_index, page_size, customer_name, state) {
    return api.post('chance/getList', {
        page_index, 
        page_size, 
        customer_name, 
        state,
        token: localStorage.getItem('token')
    })
}

// 获取机会详情
export function getChanceDetail(chance_id) {
    return api.post('chance/getDetail', {
        chance_id,
        token: localStorage.getItem('token')
    })
}