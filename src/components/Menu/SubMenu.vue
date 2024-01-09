<template>
  <template v-for="(item,index) in props.menus" :key="index">
    <el-sub-menu v-if="item.children && item.visible" :index="item.path" :key="item.path">
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <SubMenu :menus="item.children"/>
    </el-sub-menu>
    <el-menu-item v-else-if="item.visible" :index="item.path" @click="handleClick(item)">
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>
<script setup>
import router from "@/router/index.js";

const props = defineProps({
  menus: {
    type: Array,
    required: true
  }
})

// 点击菜单事件
function handleClick(item) {
  if (item.meta.link) {
    return window.open(item.path)
  }
  router.push(item.path)
}
</script>
<style scoped>

</style>