import * as type from '../type'
import * as user from '../../api/user'

const state = {
  page_size: 15,
  page_index: 0,
  user_list: [],
  user_count: 0
}

const actions = {
  login({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      user.login(payload.phone, payload.pwd).then(res => {
        if (res.data.res_code == 1) {
          commit(type.LOGIN, res.data.msg)
          resolve()
        } else {
          reject()
        }
      }).catch(error => {
        console.log(error);
        reject()
      })
    })
  },
  logout({
    state,
    commit
  }, payload) {
    commit(type.LOGOUT)
  },
  addOrUpdateUser({
    state,
    commit
  }, payload) {
    user.addOrUpdateUser(payload.user_id, payload.name, payload.phone, payload.department_id, payload.position, payload.pwd, payload.role_ids).then(res => {
      if (res.data.res_code == 1) {
        // commit(type.USER_LIST, {
        //   data: res.data.msg,
        //   total_count: res.data.total_count,
        // });
      } else {
        // commit(type.USER_LIST, {
        //   data: [],
        //   total_count: 0,
        // });
      }
    }).catch(reason => {
      console.log(reason)
    });
  },
  getUserList({
    state,
    commit
  }, payload) {
    user.getUserList(payload.page_index, payload.page_size, payload.name).then(res => {
      if (res.data.res_code == 1) {
        commit(type.USER_LIST, {
          data: res.data.msg,
          total_count: res.data.total_count,
        });
      } else {
        commit(type.USER_LIST, {
          data: [],
          total_count: 0,
        });
      }
    }).catch(reason => {
      console.log(reason)
      commit(type.USER_LIST, {
        data: [],
        total_count: 0,
      });
    });
  },
}

const mutations = {
  [type.LOGIN]: (state, payload) => {
    localStorage.setItem('name', payload.name)
    localStorage.setItem('token', payload.token)
    localStorage.setItem('role_ids', payload.role_ids)
  },
  [type.LOGOUT]: (state) => {
    localStorage.removeItem('role_ids')
    localStorage.removeItem('name')
    localStorage.removeItem('token')
  },
  [type.SET_USER_PAGE_INDEX]: (state, index) => {
    state.page_index = index;
  },
  [type.USER_LIST]: (state, payload) => {
    if (payload.data) {
      state.user_list = payload.data;
      state.user_count = payload.total_count;
    }
  },
}

export default {
  state,
  actions,
  mutations
}