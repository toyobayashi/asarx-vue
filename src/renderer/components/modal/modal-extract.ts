import Vue from 'vue'
import ProgressBar from '../progress/ProgressBar.vue'
export default Vue.extend({
  components: {
    ProgressBar
  },
  props: {
    tpos: {
      type: Number,
      default: 0
    },
    tmax: {
      type: Number,
      default: 100
    },
    cpos: {
      type: Number,
      default: 0
    },
    cmax: {
      type: Number,
      default: 100
    },
    text: {
      type: String,
      default: ''
    }
  },
  computed: {
    tpercent (): string {
      return (Math.floor(10000 * this.tpos / this.tmax) / 100).toFixed(2)
    },
    cpercent (): string {
      return (Math.floor(10000 * this.cpos / this.cmax) / 100).toFixed(2)
    }
  }
})
