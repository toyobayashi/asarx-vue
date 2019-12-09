import Vue from 'vue'
import * as ObjectId from '@tybys/oid'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
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
      return (this as any).renderNode('/', this.data as AsarNode, 0)
    }
  },
  methods: {
    renderNode (title: string, asarNode: AsarNode, indent: number) {
      const node: AsarNode = asarNode || { files: {} }
      let items: any[] = []
      if (!this.hideFile) items.push({ title: title, data: node, indent: indent, key: (new ObjectId()).toHexString() })
      if (node.files) {
        if (this.hideFile) {
          items.push({ title: title, data: node, indent: indent, key: (new ObjectId()).toHexString() })
        }
        if (node._open) {
          items = [...items, ...resolveArray(Object.keys(node.files).map(item => this.renderNode(item, (node.files as any)[item], indent + 8)))]
        }
      }
      return items
    },
    onItemClicked () {
      // todo
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
