import Vue from 'vue'
import { extname, basename } from 'path'
import { remote } from 'electron'
import { openFile, deepCopy, formatSize, showAboutDialog } from '../utils'
import { setAsarPath, getters, setTree } from '../store/export'
import Tree from '../components/tree/Tree.vue'
import FileList from '../components/list/FileList.vue'
import fakeHeader from '../mocks/header'
import * as Asar from 'asar-class-api'

export default Vue.extend({
  components: {
    Tree,
    FileList
  },
  data () {
    const data: {
      point: null | [number, number]
      treeWidth: number
      activeDir: string
      selectedItems: ListItem[]
      asar: Asar | null
    } = {
      point: null,
      treeWidth: 200,
      activeDir: '',
      selectedItems: [],
      asar: null
    }
    return data
  },
  computed: {
    ...getters,
    title (): string {
      return basename(this.asarPath || '')
    },
    asarDetailString (): string {
      let folders: number = 0
      let files: number = 0
      Asar.walk(this.tree as Asar.AsarNodeDirectory, (n: AsarNode) => {
        if (n.files) {
          folders++
        } else {
          files++
        }
      })
      return `Files: ${files}, Folders: ${folders - 1}, Size: ${formatSize((this as any).asarSize || 0) || 'Unknown'}`
    }
  },
  methods: {
    onMouseMove (e: MouseEvent) {
      if (this.point) {
        const x = e.pageX
        let target: any = e.target
        while (target && !target.classList.contains('content')) {
          target = target.parentNode
        }
        if (!target) return
        const targetLeft = target.offsetLeft as number
        const left = this.point[0] - targetLeft
        const newWidth = left + x - this.point[0]
        this.treeWidth = newWidth < 100 ? 100 : (newWidth > 250 ? 250 : newWidth)
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
    onItemClicked (_item: TreeItem) {
      // console.log(JSON.stringify(item, (key, value) => {
      //   if (key[0] === '_') {
      //     return undefined
      //   }
      //   return value
      // }, 2))
    },
    async open () {
      const path = await openFile()
      if (!path) return
      if (extname(path) === '.asar') {
        this.closeAsar()
        setAsarPath(path)
        this.asar = Asar.open(path)
        this.readHeader()
      } else {
        alert('Not an asar file.')
      }
    },
    readHeader () {
      if (this.asar) {
        setTree(this.asar.getHeader(true))
      } else {
        setTree(deepCopy(fakeHeader))
      }
      this.$nextTick(() => {
        (this.$refs.tree as any).openFolder('/')
        this.activeDir = '/'
      })
    },
    clearListFocus () {
      this.selectedItems.forEach(item => {
        item.focused = false
      })
      this.selectedItems = []
    },
    onDragStart () {
      // todo
    },
    onListItemClicked () {
      // todo
    },
    onListItemDoubleClicked (_e: MouseEvent, data: ListItem, path: string) {
      if (data.node?.files) {
        (this.$refs.tree as any).openFolder(path)
      }
    },
    goback () {
      this.closeAsar()
      this.$router.back()
    },
    extractClicked () {
      if (!this.selectedItems.length) return
      remote.dialog.showOpenDialog({
        properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate']
      }).then(async ({ filePaths }) => {
        if (!this.asar) return
        if (filePaths && filePaths[0]) {
          for (let i = 0; i < this.selectedItems.length; i++) {
            await this.asar.extract(this.selectedItems[i].path, filePaths[0])
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    closeAsar () {
      if (this.asar) {
        this.asar.close()
        this.asar = null
      }
    },
    openAboutDialog () {
      showAboutDialog()
    },
    openGithub () {
      remote.shell.openExternal('https://github.com/toyobayashi/asarx-vue').catch(err => console.log(err))
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.asarPath) {
        this.closeAsar()
        this.asar = Asar.open(this.asarPath)
        this.readHeader()
      }
    })
  }
})
