import * as type from '../type'
import * as chance from '../../api/chance'
import dateFormat from '../../utils/dateFormat'

const state = {
  page_size: 15,
  page_index: 0,
  chance_list: [],
  chance_count: 0,
  current_chance:{},
}

const actions = {
  getChanceList({
    state,
    commit
  }, payload) {
    chance.getChanceList(payload.page_index, payload.page_size, payload.name, payload.state).then(res => {
      if (res.data.res_code == 1 && res.data.msg.data) {
        commit(type.CHANCE_LIST, {
          data: res.data.msg.data,
          total_count: res.data.msg.total_count,
        });
      } else {
        commit(type.CHANCE_LIST, {
          data: [],
          total_count: 0,
        });
      }
    }).catch(reason => {
      console.log(reason)
      commit(type.CHANCE_LIST, {
        data: [],
        total_count: 0,
      });
    });
  },
  addOrUpdateChance({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      chance.addOrUpdateChance(payload.chance_id, payload.customer, payload.estimate, payload.real_amount, payload.rebate, payload.project_type, payload.project_desc, payload.progress, payload.state).then(res => {
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
  getChanceDetail({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      chance.getChanceDetail(payload.id).then(res => {
        if (res.data.res_code == 1) {
          commit(type.CHANCE_DETAIL, res.data.msg);
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
}

const mutations = {
  [type.SET_CHANCE_PAGE_INDEX]: (state, index) => {
    state.page_index = index;
  },
  [type.CHANCE_LIST]: (state, payload) => {
    if (payload.data) {
      let chance_list = [];
      for (let item of payload.data) {
        chance_list.push({
          chance_id: item.chance_id,
          customer_name: item.customer_name,
          last_progress_name: item.last_progress_name,
          contact: item.contact,
          phone: item.phone,
          project_type: item.project_type,
          project_desc: item.project_desc,
          head_user_name: item.head_user_name,
          real_amount: item.real_amount,
          last_progress_time: dateFormat(item.last_progress_time, 'YYYY-MM-DD'),
          state: item.state == 0 ? "未选" : item.state == 1 ? "成单" : "跑单",
          stateId: item.state,
          create_time: dateFormat(item.create_time, 'YYYY-MM-DD')
        })
      }
      state.chance_list = chance_list;
      state.chance_count = payload.total_count;
    }
  },
  [type.CHANCE_DETAIL]: (state, payload) => {
    state.current_chance = payload;
  },
}

export default {
  state,
  actions,
  mutations
}