<template>
  <div class="file-list" :class="{ resize: point }" @mousemove="onMouseMove" @mouseup.stop="onMouseUp">
    <FileListItem
      class="head"
      :value="{}"
      :columns="[{
        className: 'name-column cell',
        style: { width: nameWidth + 'px' },
        text: 'Name'
      }, {
        className: 'size-column cell',
        style: { width: `calc(100% - ${nameWidth}px)` },
        text: 'Size'
      }]" />
    <div class="body">
      <FileListItem
        v-for="item in list"
        :key="item.path"
        @doubleclick="onItemDoubleClicked"
        @click="onItemClicked($event, item)"
        @dragstart="onDragStart"
        :value="item"
        :class="{ focused: item.focused }"
        :columns="[{
          className: 'name-column cell' + (!item.node || item.node.files ? ' folder' : ' file'),
          style: { width: nameWidth + 'px' },
          text: item.name
        }, {
          className: 'size-column cell' + (!item.node || item.node.files ? ' folder' : ' file'),
          style: { width: `calc(100% - ${nameWidth}px)` },
          text: item.node && typeof item.node.size === 'number' ? formatSize(item.node.size) : ''
        }]" />
    </div>
    <div class="resize" :style="{ left: `${nameWidth - 4}px` }" @mousedown.stop="onMouseDown"></div>
  </div>
</template>

<style lang="stylus">
.file-list
  width 100%
  font-size 14px
  border none
  position relative
  height 100%
  overflow auto
.file-list.resize
  cursor ew-resize
.file-list .head
  display flex
  width 100%
  position absolute
  top 0
.file-list .body
  margin-top 24px
  height calc(100% - 24px)
  overflow auto
.file-list .row
  display flex
.file-list .body .row:hover
  background rgb(229, 243, 255)
.file-list .row.focused, .file-list .row.focused:hover
  background rgb(204, 232, 255)
/* .file-list .name-column {
  display: flex;
  justify-content: flex-start;
  align-items: center;
} */
.file-list .size-column
  text-align right
.file-list .cell
  /* border-right: 1px solid rgb(235, 244, 254); */
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
  padding 0 5px
  height 22px
  line-height 22px
.file-list .head .cell
  height 24px
  line-height 24px
.file-list .name-column.cell.folder::before
  display inline-block
  content ''
  height 16px
  width 16px
  margin-right 5px
  vertical-align text-bottom
  background-image url('../../../../assets/images/Folder_16x.svg')
.file-list .name-column.cell.file::before
  display inline-block
  content ''
  height 16px
  width 16px
  margin-right 5px
  vertical-align text-bottom
  background-image url('../../../../assets/images/Document_16x.svg')
.file-list > .resize
  width 4px
  height 100%
  position absolute
  cursor ew-resize
  top 0
  border-right 1px solid rgb(235, 244, 254)
</style>

<script lang="ts" src="./file-list.ts">
</script>
