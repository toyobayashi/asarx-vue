import Vue from 'vue'
import { extname, basename } from 'path'
import { remote } from 'electron'
import { openFile } from '../utils'
import { setAsarPath, getters, setTree } from '../store/export'
import Tree from '../components/Tree.vue'

export default Vue.extend({
  components: {
    Tree
  },
  data () {
    return {
      point: null
    }
  },
  computed: {
    ...getters,
    title (): string {
      return basename(this.asarPath || '')
    }
  },
  methods: {
    onMouseMove () {
      // todo
    },
    onMouseUp () {
      // todo
    },
    onItemClicked () {
      // todo
    },
    async open () {
      const path = await openFile()
      if (!path) return
      if (extname(path) === '.asar') {
        setAsarPath(path)
        this.readHeader()
      } else {
        alert('Not an asar file.')
      }
    },
    readHeader () {
      // if (this.asarPath) {
      // this._asar.load(this.props.asarPath)
      // this.props.setTree && this.props.setTree(this._asar.header)
      // this._onItemClicked(this._asar.header)
      // } else {
      setTree({
        files: {
          folder1: {
            files: {
              file1: {
                size: 80,
                offset: '0'
              },
              file2: {
                size: 40,
                offset: '80'
              },
              file3: {
                size: 233,
                unpacked: true
              }
            }
          },
          folder2: {
            files: {
              file4: {
                size: 20,
                offset: '120'
              }
            }
          },
          file5: {
            size: 100,
            offset: '140'
          }
        }
      })
      // }
    },
    goback () {
      this.$router.back()
    },
    extractClicked () {
      // if (!this.props.list) return
      // const selected = this.props.list.filter((item) => item.focused)
      remote.dialog.showOpenDialog({
        properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate']
      }).then(({ filePaths }) => {
        console.log(filePaths)
        // await extractItem(this._asar, paths && paths[0], selected, true)
      }).catch(err => {
        console.log(err)
      })
    },
    openAboutDialog () {
      const isSnap = process.platform === 'linux' && process.env.SNAP && process.env.SNAP_REVISION
      const pkg: any = remote.require('../package.json')

      let detail: string = ''
      let commit: string = 'Unknown'
      let date: string = 'Unknown'

      if (process.env.NODE_ENV === 'production') {
        commit = pkg._commit || 'Unknown'
        date = pkg._commitDate || 'Unknown'
      } else {
        const { execSync } = remote.require('child_process')
        try {
          commit = execSync('git rev-parse HEAD').toString().replace(/[\r\n]/g, '')
          date = new Date(execSync('git log -1').toString().match(/Date:\s*(.*?)\n/)[1]).toISOString()
        } catch (_err) {
          console.warn('Git not found in environment')
        }
      }

      const os = remote.require('os')
      detail = `Version: ${pkg.version}\n` +
        `Commit: ${commit}\n` +
        `Date: ${date}\n` +
        `Electron: ${process.versions.electron}\n` +
        `Chrome: ${process.versions.chrome}\n` +
        `Node.js: ${process.versions.node}\n` +
        `V8: ${process.versions.v8}\n` +
        `OS: ${os.type()} ${os.arch()} ${os.release()}${isSnap ? ' snap' : ''}`

      const buttons = process.platform === 'linux' ? ['Copy', 'OK'] : ['OK', 'Copy']

      remote.dialog.showMessageBox({
        title: pkg.name,
        type: 'info',
        message: pkg.name,
        detail: `\n${detail}`,
        buttons,
        noLink: true,
        defaultId: buttons.indexOf('OK')
      }).then(({ response }) => {
        if (buttons[response] === 'Copy') {
          remote.clipboard.writeText(detail)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openGithub () {
      remote.shell.openExternal('https://github.com/toyobayashi/asarx-vue').catch(err => console.log(err))
    }
  },
  mounted () {
    this.$nextTick(() => {
      // todo
    })
  }
})
