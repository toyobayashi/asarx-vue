import store from './index'
import Types from './types'

export function setAsarPath (path: string): void {
  store.commit(Types.SET_ASAR_PATH, path)
}

export const getters = {
  asarPath () {
    return store.state.asarPath
  }
}
