import Vue from 'vue'
import { PropValidator } from 'vue/types/options'

let clickTime = -1
let clickItemPath = ''

export default Vue.extend({
  props: {
    columns: {
      type: Array,
      default: () => []
    } as PropValidator<Array<{
      className?: string
      style?: any
      text?: string | number
    }>>,
    value: {
      type: Object,
      required: true
    } as PropValidator<ListItem>
  },
  data () {
    return {
      clickTime: -1,
      clickItemPath: ''
    }
  },
  methods: {
    onClick (e: MouseEvent) {
      const data = this.value
      this.$emit('click', e, data)

      if (clickTime === -1) {
        clickTime = Date.now()
        clickItemPath = data.path
      } else {
        if (Date.now() - clickTime <= 300 && data.path === clickItemPath) {
          clickTime = -1
          clickItemPath = ''
          this.$emit('doubleclick', e, data)
        } else {
          clickTime = Date.now()
          clickItemPath = data.path
        }
      }
    },
    onDragStart () {
      this.$emit('dragstart')
    }
  }
})
