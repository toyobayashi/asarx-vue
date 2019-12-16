import { ipcRenderer, remote } from 'electron'

let show = false
export function deepCopy<T> (obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj

  if (obj instanceof Date) return new Date(obj) as any

  if (Array.isArray(obj)) {
    const res: any = []
    for (let i = 0; i < obj.length; i++) {
      res.push(deepCopy(obj[i]))
    }
    return res
  }

  const res: any = {}

  for (const key in obj) {
    res[key] = deepCopy(obj[key])
  }
  return res
}

export function showWindow (): void {
  if (!show) {
    ipcRenderer.send('ready-to-show')
    show = true
  }
}

export function openFile (): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    remote.dialog.showOpenDialog({
      properties: ['openFile', 'showHiddenFiles']
    }).then(({ filePaths }) => {
      if (filePaths && filePaths.length) {
        resolve(filePaths[0])
      } else {
        resolve('')
      }
    }).catch(reject)
  })
}

export function showAboutDialog (): void {
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
}

export function formatSize (size: number): string {
  if (size < 1024) {
    return `${size} Byte`
  }

  if (size < 1024 * 1024) {
    return `${(Math.floor(100 * size / 1024) / 100).toFixed(2)} KB`
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(Math.floor(100 * size / 1024 / 1024) / 100).toFixed(2)} MB`
  }

  if (size < Number.MAX_SAFE_INTEGER) {
    return `${(Math.floor(100 * size / 1024 / 1024 / 1024) / 100).toFixed(2)} GB`
  }

  return 'Out of Range'
}
