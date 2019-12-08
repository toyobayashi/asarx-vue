import Vue from 'vue'
import { extname } from 'path'
import { openFile } from '../utils/index'
import { setAsarPath } from '../store/export'

export default Vue.extend({
  methods: {
    onDrop (e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      this.goDetail(e.dataTransfer!.files[0].path)
      // this.handleDrop(e.dataTransfer.files)
    },
    onDragOver (e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
    },
    goDetail (path: string) {
      if (extname(path) === '.asar') {
        setAsarPath(path)
        this.$router.push({ name: 'detail' }).catch(err => console.log(err))
      } else {
        alert('Not an asar file.')
      }
    },

    async open () {
      const path = await openFile()
      if (path) {
        this.goDetail(path)
      }
    },

    toggleDevtools () {
      const webContents = require('electron').remote.webContents.getFocusedWebContents()
      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools()
      } else {
        webContents.openDevTools()
      }
    }
  }
})
