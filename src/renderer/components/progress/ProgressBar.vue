<template>
  <div class="progress" :style="{ backgroundColor: infinity ? '#e6e6e6' : '#06b025' }">
    <template v-if="infinity">
      <div class="progress-infinity"></div>
    </template>
    <template v-else>
      <div class="slide"></div>
      <div class="progress-rest" :style="{ width: 100 - percent + '%' }"></div>
    </template>
  </div>
</template>

<script lang="ts" src="./progress-bar.ts">
</script>

<style lang="stylus" scoped>
@keyframes progress-move
  from
    left -100px
  to
    left 100%
@keyframes progress-move-infinity
  from
    left -127px
  to
    left 100%
.progress
  position relative
  width 100%
  height 25px
  border 1px solid #bcbcbc
  box-sizing border-box
  overflow hidden
  .progress-rest
    background-color #e6e6e6
    height 100%
    position absolute
    right 0
  .slide
    animation progress-move 2s infinite linear
    position absolute
    width 100px
    height 100%
    background linear-gradient(to right, #06b025 calc(50% - 40px), rgb(111, 224, 117) 50%, #06b025 calc(50% + 40px))
  .progress-infinity
    animation progress-move-infinity 2.5s infinite linear
    background-color #06b025
    width 127px
    height 100%
    position absolute
</style>
