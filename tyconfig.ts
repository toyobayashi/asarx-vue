import { join } from 'path'
import { Configuration } from '@tybys/ty'

const config: Configuration = {
  iconSrcDir: join(__dirname, 'assets/icon'),
  inno: {
    src: join(__dirname, 'scripts/asarx.iss'),
    appid: {
      ia32: '750393B0-8ED1-4B64-939F-A609464AF064',
      x64: 'A69871B5-F7D5-47B1-8871-2FAB121C29DB'
    },
    url: 'https://github.com/toyobayashi/asarx-vue'
  }
}

export default config
