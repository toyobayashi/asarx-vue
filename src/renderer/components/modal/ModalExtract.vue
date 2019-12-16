<template>
  <div class="modal-wrapper">
    <div class="modal-window">
      <div class="modal-info">
        <span>{{tpercent + '%'}}</span>
        <span>{{tpos + ' / ' + tmax}}</span>
      </div>
      <ProgressBar :max="tmax" :pos="tpos" />
      <div class="modal-info">
        <span>{{cpercent + '%'}}</span>
        <span>{{cpos + ' / ' + cmax}}</span>
      </div>
      <ProgressBar :max="cmax" :pos="cpos" />
      <div class="modal-info">
        <span>{{text}}</span>
      </div>
      <!-- <div class="modal-button-group">
        <button class="button" onClick="{this._cancel}">Cancel</button>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" src="./modal-extract.ts">
</script>

<style lang="stylus" scoped>
.modal-wrapper
  position absolute
  z-index 100
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.7)
  top 0
  left 0
  display flex
  justify-content center
  align-items center
.modal-window
  background rgb(240, 240, 240)
  width 550px
  /* height: 295px; */
  padding 10px
.modal-info
  height 25px
  line-height 25px
  display flex
  justify-content space-between
  font-size 14px
.modal-button-group
  display flex
  flex-direction row-reverse
  > button
    margin-left 10px
</style>
