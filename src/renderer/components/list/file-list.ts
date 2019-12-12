import Vue from 'vue'
import { PropValidator } from 'vue/types/options'
import FileListItem from './FileListItem.vue'
import { formatSize } from '../../utils'

export default Vue.extend({
  components: {
    FileListItem
  },
  props: {
    tree: {
      type: Object,
      default: () => ({ files: {} })
    } as PropValidator<AsarNode>,
    dir: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  watch: {
    tree: {
      immediate: true,
      handler (val) {
        this.computeList(val, this.dir)
      }
    },
    dir (val) {
      this.computeList(this.tree, val)
    }
  },
  data () {
    const data: {
      point: null | [number, number]
      nameWidth: number
      cdDotDotFocused: boolean
      list: ListItem[]
    } = {
      nameWidth: 300,
      point: null,
      cdDotDotFocused: false,
      list: []
    }
    return data
  },
  methods: {
    computeList (tree: AsarNode, dir: string) {
      const node = getNode(tree, dir)
      if (!node || !node.files) {
        this.list = []
        return
      }
      const files = Object.keys(node.files)
      const res: ListItem[] = []
      for (let i = 0; i < files.length; i++) {
        res.push({
          node: node.files[files[i]],
          path: `${dir}/${files[i]}`,
          focused: false
        })
      }
      this.list = res
    },
    onMouseMove (e: MouseEvent) {
      if (this.point) {
        const x: number = e.pageX
        let target: any = e.target
        while (target && !target.classList.contains('file-list')) {
          target = target.parentNode
        }
        if (!target) return
        const targetLeft = target.offsetLeft as number
        const left: number = this.point[0] - targetLeft
        const newWidth = left + x - this.point[0]
        this.nameWidth = newWidth < 100 ? 100 : newWidth
      }
    },
    onMouseUp () {
      if (this.point) {
        this.point = null
      }
    },
    onMouseDown (e: MouseEvent) {
      if (!this.point) {
        this.point = [e.pageX, e.pageY]
      }
    },
    onItemDoubleClicked (e: any) {
      this.$emit('itemdoubleclick', e)
    },
    onItemClicked (e: any, item: ListItem) {
      this.list.forEach((i) => {
        if (item === i) {
          i.focused = true
        } else {
          i.focused = false
        }
      })
      this.$emit('itemclick', e)
    },
    onDragStart (e: any) {
      this.$emit('dragstart', e)
    },
    basename (p: string): string {
      return require('electron').remote.require('path').basename(p)
    },
    formatSize (size: number) {
      return formatSize(size)
    }
  }
})

function getNode (node: AsarNode, ...path: string[]): AsarNode | null {
  if (!path.length) return null
  let p = require('electron').remote.require('path').join(...path)

  if (p[0] === '/' || p[0] === '\\') p = p.substring(1)
  if (p === '' || p === '.') return node || null

  const paths = p.split(require('electron').remote.require('path').sep)
  let pointer = node.files

  for (let i = 0; i < paths.length - 1; i++) {
    if (pointer === undefined) return null
    if (pointer[paths[i]] !== undefined) {
      pointer = pointer[paths[i]].files
    }
  }

  if (!pointer || pointer[paths[paths.length - 1]] === undefined) return null
  return pointer[paths[paths.length - 1]]
}
