<template>
  <div class="tree">
    <div
      v-for="item in renderList"
      :key="item.key"
      @click="onItemClicked(item)"
      class="tree-item"
      :class="{ active: item.key === value, root: item.indent === 0, open: item.data._open, doc: !item.data.files }"
      :style="{ paddingLeft: item.indent ? item.indent + 'px' : void 0 }"
    >{{item.title === '/' ? title : item.title}}</div>
  </div>
</template>

<script lang="ts" src="./tree.ts">
</script>

<style scoped lang="stylus" src="./tree.styl">
</style>
