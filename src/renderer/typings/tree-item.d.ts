declare interface TreeItem {
  title: string
  data: AsarNode
  indent: number
  key: string
}

declare interface ListItem {
  node: AsarNode | null
  path: string
  focused?: boolean
}
