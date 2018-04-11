import * as type from '../type'
import * as metadata from '../../api/metadata'

const state = {
  // user_department: [],
  // customer_service: [],
  // customer_type: [],
  // customer_origin: [],
  // track_progress: [],
  metadata: []
}

const actions = {
  getMetadataList({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      metadata.getMetadataList().then(res => {
        if (res.data.res_code == 1) {
          commit(type.GET_METADATA_LIST, res.data.msg)
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
  addMetadata({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      metadata.addMetadata(payload.name, payload.type).then(res => {
        if (res.data.res_code == 1) {
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
  delMetadata({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      metadata.delMetadata(payload.id).then(res => {
        if (res.data.res_code == 1) {
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
}

const mutations = {
  [type.GET_METADATA_LIST]: (state, payload) => {
    if (payload) {
      let metadata = [];
      for (let item of payload) {
        let hasMetadata = false;
        for (let meta of metadata) {
          if (item.type == meta.id) {
            hasMetadata = true;
            meta.children.push({
              id: item.md_id,
              name: item.name,
              type: item.type
            })
          }
        }

        if (!hasMetadata) {
          let name = '未知'
          switch (item.type) {
            case 1:
              name = "用户部门"
              break;
            case 2:
              name = "客户主营业务"
              break;
            case 3:
              name = "客户类型"
              break;
            case 4:
              name = "客户来源"
              break;
            case 5:
              name = "追踪进度"
              break;
            default:
              break;
          }
          metadata.push({
            id: item.type,
            name: name,
            children: [{
              id: item.md_id,
              name: item.name,
              type: item.type
            }]
          })
        }
      }

      state.metadata = metadata;
    }
  },
}

export default {
  state,
  actions,
  mutations
}