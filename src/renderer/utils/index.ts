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
