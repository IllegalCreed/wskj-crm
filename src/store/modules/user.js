import * as type from '../type'
import * as user from '../../api/user'
import dateFormat from '../../utils/dateFormat'

const state = {
  page_size: 15,
  page_index: 0,
  user_list: [],
  user_count: 0,
  roles: [],
  current_user: {},
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
    return new Promise((resolve, reject) => {
      user.addOrUpdateUser(payload.id, payload.name, payload.phone, payload.department, payload.position, payload.pwd, payload.permission).then(res => {
        if (res.data.res_code == 1) {
          resolve()
        } else {
          reject()
        }
      }).catch(reason => {
        console.log(reason)
        reject()
      });
    })
  },
  getUserDetail({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      user.getUserDetail(payload.id).then(res => {
        if (res.data.res_code == 1) {
          commit(type.USER_DETAIL, res.data.msg);
          resolve()
        } else {
          reject()
        }
      }).catch(reason => {
        console.log(reason)
        reject()
      });
    })
  },
  getUserList({
    state,
    commit
  }, payload) {
    user.getUserList(payload.page_index, payload.page_size, payload.name).then(res => {
      if (res.data.res_code == 1) {
        commit(type.USER_LIST, {
          data: res.data.msg.data,
          total_count: res.data.msg.total_count,
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
  getRoleList({
    state,
    commit
  }, payload) {
    user.getRoleList().then(res => {
      if (res.data.res_code == 1) {
        commit(type.GET_ROLE_LIST, res.data.msg);
      } else {
      }
    }).catch(reason => {
      console.log(reason)
    });
  },
  setFreeze({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      user.setFreeze(payload).then(res => {
        if (res.data.res_code == 1) {
          resolve();
        } else {
          reject();
        }
      }).catch(reason => {
        console.log(reason)
        reject();
      });
    })
  },
  resetPwd({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      user.resetPwd(payload.id,payload.pwd).then(res => {
        if (res.data.res_code == 1) {
          resolve();
        } else {
          reject();
        }
      }).catch(reason => {
        console.log(reason)
        reject();
      });
    })
  }
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
  [type.GET_ROLE_LIST]: (state, payload) => {
    state.roles = payload;
  },
  [type.USER_LIST]: (state, payload) => {
    if (payload.data) {
      let user_list = [];
      for (let item of payload.data) {
        let role = ""
        for (let r of item.role) {
          role += r.name + ','
        }
        role = role.substring(0, role.length - 1);
        user_list.push({
          user_id: item.user_id,
          name: item.name,
          phone: item.phone,
          md_department_name: item.md_department_name,
          position: item.position,
          role: role,
          freezeId: item.freeze,
          freeze: item.freeze == 0 ? "未冻结" : "已冻结",
          create_time: dateFormat(item.create_time, 'YYYY-MM-DD')
        })
      }

      state.user_list = user_list;
      state.user_count = payload.total_count;
    }
  },
  [type.USER_DETAIL]: (state, payload) => {
    state.current_user = payload;
  },
}

export default {
  state,
  actions,
  mutations
}