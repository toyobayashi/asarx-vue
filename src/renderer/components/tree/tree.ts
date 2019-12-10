import Vue from 'vue'
import { getObjectId } from '../../utils/ipc'
import { Prop } from 'vue/types/options'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Object as Prop<AsarNode>,
      default: () => {
        const p: AsarNode = { files: {} }
        return p
      }
    },
    hideFile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      copiedValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  computed: {
    renderList (): TreeItem[] {
      const items = this.renderNode('/', this.copiedValue, 0)
      return items
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.copiedValue = JSON.parse(JSON.stringify(val))
        console.log(1)
      }
    }
  },
  methods: {
    renderNode (title: string, asarNode: AsarNode, indent: number): TreeItem[] {
      const node: AsarNode = asarNode || { files: {} }
      let items: TreeItem[] = []
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
    onItemClicked (item: TreeItem): void {
      asarEach(this.copiedValue, (n) => {
        this.$set(n, '_active', false)
        if (n === item.data) {
          if (n.files) {
            this.$set(n, '_open', !n._open)
          }
          this.$set(n, '_active', true)
        }
      }, '/')
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

function asarEach (node: AsarNode, callback: (node: AsarNode, path: string) => boolean | void, path: string = ''): void {
  if (!callback(node, path)) {
    if (node.files) {
      for (const name in node.files) {
        asarEach(node.files[name], callback, require('electron').remote.require('path').posix.join(path, name))
      }
    }
  }
}
