import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import hello from './modules/hello'
import chance from './modules/chance'
import metadata from './modules/metadata'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    hello,
    chance,
    metadata,
    user
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
