<template>
  <div class="home full-screen flex-center" @drop="onDrop" @dragover="onDragOver">
    <button class="open" @click="open">OPEN AN ASAR ARCHIVE</button>
  </div>
</template>

<script lang="ts" src="./home.ts">
</script>

<style lang="stylus" scoped>
.home
  background linear-gradient(45deg, rgb(0, 120, 215), rgb(93, 169, 228))
  .open
    outline none
    background transparent
    border none
    font-size 30px
    font-weight bold
    color #eee
    padding 20px
    cursor pointer
</style>
