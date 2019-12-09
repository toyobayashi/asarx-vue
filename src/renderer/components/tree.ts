import Vue from 'vue'
import { getObjectId } from '../utils/ipc'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({ files: {} })
    },
    hideFile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    renderList () {
      const items = (this as any).renderNode('/', this.value as AsarNode, 0)
      console.log(items)
      return items
    }
  },
  methods: {
    renderNode (title: string, asarNode: AsarNode, indent: number) {
      const node: AsarNode = asarNode || { files: {} }
      let items: any[] = []
      if (!this.hideFile) items.push({ title: title, data: node, indent: indent, key: getObjectId() })
      if (node.files) {
        if (this.hideFile) {
          items.push({ title: title, data: node, indent: indent, key: getObjectId() })
        }
        if (node._open) {
          items = [...items, ...resolveArray(Object.keys(node.files).map(item => this.renderNode(item, (node.files as any)[item], indent + 8)))]
        }
      }
      return items
    },
    onItemClicked (item: TreeItem) {
      this.$emit('itemClick', item)
    }
  }
})

function resolveArray (arr: any[]): any[] {
  let res: any[] = []
  for (let i = 0; i < arr.length; i++) {
    Array.isArray(arr[i]) ? res = [...res, ...resolveArray(arr[i])] : res.push(arr[i])
  }
  return res
}
