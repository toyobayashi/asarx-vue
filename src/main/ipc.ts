import '@tybys/electron-ipc-handle-invoke/main'
import { ipcMain } from 'electron'
import * as ObjectId from '@tybys/oid'

export default function init (): void {
  ipcMain.on('getObjectId', (e) => {
    e.returnValue = (new ObjectId()).toHexString()
  })
}
