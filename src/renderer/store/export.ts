import store from './index'
import Types from './types'
import Asar from '../utils/asar'
import { deepCopy } from '../utils'

export function setAsarPath (path: string): void {
  store.commit(Types.SET_ASAR_PATH, path)
}

export function setTree (tree: AsarNode): void {
  store.commit(Types.SET_TREE, tree)
}

export function clickTree (node: AsarNode): void {
  Asar.each(store.state.tree, (n) => {
    n._active = false
    if (n === node) {
      if (n.files) {
        // if (fold) {
        n._open = !n._open
        // } else {
        //   if (!n._open) n._open = true
        // }
      }
      n._active = true
    }
  }, '/')
  const tree = deepCopy(store.state.tree)
  setTree(tree)
}

export const getters = {
  asarPath (): string {
    return store.state.asarPath
  },
  tree (): AsarNode {
    return store.state.tree
  }
}
