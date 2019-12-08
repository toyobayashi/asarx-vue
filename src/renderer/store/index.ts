import Vuex from 'vuex'
import Vue from 'vue'

import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store<typeof state>({
  state,
  mutations,
  actions
})

export default store
