declare interface AsarNode {
  _open?: boolean
  _active?: boolean
  // _focused?: boolean
  // _path?: string
  files?: {
    [item: string]: AsarNode
  }
  size?: number
  offset?: string
  unpacked?: boolean
  executable?: boolean
  link?: string
}

declare interface IAsar {
  src: string
  header: AsarNode
  headerSize: number
  fd?: number
}
