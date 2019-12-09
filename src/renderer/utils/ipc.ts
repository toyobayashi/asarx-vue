import { ipcRenderer } from 'electron'

export function getObjectId (): string {
  return ipcRenderer.sendSync('getObjectId')
}
