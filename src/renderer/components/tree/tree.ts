import Vue from 'vue'
import { PropValidator } from 'vue/types/options'

const { join } = require('electron').remote.require('path').posix

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: ''
    },
    tree: {
      type: Object,
      default: () => ({ files: {} })
    } as PropValidator<AsarNode>,
    hideFile: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      copiedValue: JSON.parse(JSON.stringify(this.tree))
    }
  },
  computed: {
    renderList (): TreeItem[] {
      const items = this.renderNode('/', this.copiedValue, 0)
      return items
    }
  },
  watch: {
    tree: {
      immediate: true,
      handler (val) {
        this.copiedValue = JSON.parse(JSON.stringify(val))
      }
    }
  },
  methods: {
    renderNode (title: string, asarNode: AsarNode, indent: number, base: string = '/'): TreeItem[] {
      const node: AsarNode = asarNode || { files: {} }
      const curPath: string = join(base, title)
      let items: TreeItem[] = []
      if (!this.hideFile) items.push({ title: title, data: node, indent: indent, key: curPath })
      if (node.files) {
        if (this.hideFile) {
          items.push({ title: title, data: node, indent: indent, key: curPath })
        }
        if (node._open) {
          items = [...items, ...resolveArray(Object.keys(node.files).map(item => this.renderNode(item, (node.files as any)[item], indent + 8, curPath)))]
        }
      }
      return items
    },
    openFolder (dir: string): void {
      for (let i = 0; i < this.renderList.length; i++) {
        const item = this.renderList[i]
        if (dir.indexOf(item.key) !== -1 && item.data.files) {
          this.$set(item.data, '_open', true)
        }
      }
    },
    onItemClicked (item: TreeItem): void {
      asarEach(this.copiedValue, (n, path) => {
        if (n === item.data) {
          if (n.files) {
            this.$set(n, '_open', !n._open)
            this.$emit('input', path)
          }
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
        asarEach(node.files[name], callback, join(path, name))
      }
    }
  }
}
