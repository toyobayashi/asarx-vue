<template>
  <div class="row" @click.stop="onClick" :draggable="false" @dragstart="onDragStart">
    <div v-for="c in columns" :key="c.key" :class="c.className" :style="c.style">{{c.text}}</div>
  </div>
</template>

<style lang="stylus" scoped>
.row
  display flex
</style>

<script lang="ts" src="./file-list-item.ts">
</script>
