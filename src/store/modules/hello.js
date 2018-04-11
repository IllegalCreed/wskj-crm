import * as type from '../type'
import * as hello from '../../api/hello'

const state = {
  hello: ''
}

const actions = {
  hello({
    state,
    commit
  }, payload) {
    hello.hello().then(res => {
      commit(type.HELLO, res.data.hello)
    }).catch(reason => {
      console.error(reason)
    })
  }
}

const mutations = {
  [type.HELLO]: (state, payload) => {
    state.hello = payload
  }
}

export default {
  state,
  actions,
  mutations
}
