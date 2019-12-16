import Vue from 'vue'

export default Vue.extend({
  props: {
    infinity: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    pos: {
      type: Number,
      default: 0
    }
  },
  computed: {
    computedMax (): number {
      return this.max <= this.min ? 100 : this.max
    },
    computedMin (): number {
      return this.max <= this.min ? 0 : this.min
    },
    computedPos (): number {
      let computedPos = 0
      if (this.pos < this.computedMin) {
        computedPos = this.computedMin
      } else if (this.pos > this.computedMax) {
        computedPos = this.computedMax
      } else {
        computedPos = this.pos
      }
      return computedPos
    },
    percent (): number {
      return (this.computedPos - this.computedMin) / (this.computedMax - this.computedMin) * 100
    }
  }
})
