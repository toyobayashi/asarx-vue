import state from './state'
import { MutationTree } from 'vuex'
import Types from './types'

type S = typeof state

const mutations: MutationTree<S> = {
  [Types.SET_ASAR_PATH] (state, value: string) {
    state.asarPath = value
  },
  [Types.SET_TREE] (state, value: AsarNode) {
    state.tree = value
  }
}

export default mutations
