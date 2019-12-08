import '@/renderer/styles/index.styl'
import Vue from 'vue'
import App from '@/renderer/App.vue'
import store from '@/renderer/store/index'
import '@tybys/electron-ipc-handle-invoke/renderer'
import router from '@/renderer/routers/index'
import * as electron from 'electron'

Vue.prototype.electron = electron

const vm = new Vue({
  store,
  router,
  render: h => h(App)
})

vm.$mount('#root')

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
