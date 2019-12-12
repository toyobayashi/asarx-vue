import Vue from 'vue'
import { PropValidator } from 'vue/types/options'
import FileListItem from './FileListItem.vue'
import { formatSize } from '../../utils'

export default Vue.extend({
  components: {
    FileListItem
  },
  props: {
    // list: {
    //   type: Array,
    //   default: () => []
    // } as PropValidator<ListItem[]>,
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
    list (): ListItem[] {
      const node = getNode(this.tree, this.dir)
      if (!node || !node.files) return []
      const files = Object.keys(node.files)
      const res: ListItem[] = []
      for (let i = 0; i < files.length; i++) {
        res.push({
          node: node.files[files[i]],
          path: `${this.dir}/${files[i]}`,
          focused: false
        })
      }
      return res
    }
  },
  data () {
    const data: {
      point: null | [number, number]
      nameWidth: number
      cdDotDotFocused: boolean
    } = {
      nameWidth: 300,
      point: null,
      cdDotDotFocused: false
    }
    return data
  },
  methods: {
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
    onItemClicked (e: any) {
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
