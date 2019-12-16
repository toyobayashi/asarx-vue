<template>
  <div>
    <div class="menu">
      <button class="menu-button" @click="open">Open</button>
      <button class="menu-button" @click="goback">Close</button>
      <button class="menu-button" @click="extractClicked">Extract</button>
      <button class="menu-button" @click="openAboutDialog">About</button>
      <button class="menu-button" @click="openGithub">Github</button>
    </div>
    <div class="content" :class="{ resize: point }" @mousemove="onMouseMove" @mouseup="onMouseUp">
      <div class="tree-view" :style="{ width: treeWidth + 'px' }">
        <Tree ref="tree" v-model="activeDir" :tree="tree" :title="title" :hideFile="true" />
      </div>
      <div class="list-view" :style="{ width: `calc(100% - ${treeWidth}px)` }" @click="clearListFocus">
        <FileList v-model="selectedItems" :tree="tree" :dir.sync="activeDir" @dragstart="onDragStart" @itemdoubleclick="onListItemDoubleClicked" />
      </div>
      <div class="resize" :style="{ left: `${treeWidth - 4}px` }" @mousedown="onMouseDown"></div>
    </div>
    <div class="footer">
      <span>{{activeDir}}</span>
      <span>{{asarDetailString}}</span>
    </div>
    <ModalExtract v-if="extractModalShow" :cmax="modal.cmax" :cpos="modal.cpos" :tmax="modal.tmax" :tpos="modal.tpos" :text="modal.text" />
    <!-- <div>{{asarPath}}</div>
    <div>{{activeDir}}</div>
    <div>{{activePath}}</div> -->
  </div>
</template>

<script lang="ts" src="./detail.ts">
</script>

<style lang="stylus" scoped>
.menu
  width 100%
  height 40px
  background linear-gradient(45deg, rgb(0, 120, 215), rgb(93, 169, 228))
  display flex
  justify-content flex-start
  align-items stretch
  box-sizing border-box
  /* border-top: 1px solid rgb(204, 204, 204); */
  border-bottom 1px solid rgb(204, 204, 204)
  .menu-button
    outline none
    background transparent
    border none
    color #fff
    width 70px
    transition background 0.2s
    &:hover
      background rgba(0, 0, 0, 0.2)
    &:active
      background rgba(0, 0, 0, 0.4)
.tree-view
  background-color rgb(243, 243, 243)
  height 100%
  overflow auto
  box-sizing border-box
  border 1px solid #fff
.list-view
  overflow auto
  box-sizing border-box
  border 1px solid #fff
.content
  display flex
  justify-content space-between
  height calc(100% - 70px)
  >.resize
    width 4px
    height 100%
    position absolute
    cursor ew-resize
    top 0
.content.resize
  cursor ew-resize
.footer
  height 29px
  line-height 29px
  background rgb(240, 240, 240)
  border-top 1px solid rgb(204, 204, 204)
  padding 0 5px 0 5px
  display flex
  justify-content space-between
  font-size 14px
</style>
