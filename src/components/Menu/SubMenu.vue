<template>
  <template v-for="(item,index) in props.menus" :key="index">
    <el-sub-menu v-if="item.children && item.visible" :index="item.path" :key="item.path">
      <template #title>
        <el-icon>
          <svg-icon :icon-class="item.meta.icon" class="sub-menu"/>
        </el-icon>
        <span class="sub-menu">{{ item.meta.title }}</span>
      </template>
      <SubMenu :menus="item.children"/>
    </el-sub-menu>
    <el-menu-item v-else-if="item.visible" :index="item.path" @click="handleClick(item)">
      <el-icon>
        <svg-icon :icon-class="item.meta.icon"/>
      </el-icon>
      <template #title>
        {{ item.meta.title }}
      </template>
    </el-menu-item>
  </template>
</template>
<script setup>
import router from "@/router/index.js";
import SvgIcon from "@/components/Icon/SvgIcon.vue";

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
.sub-menu {
  color: var(--text-color);
}

.el-menu-item {
  color: var(--text-color);
}

.el-menu-item.is-active {
  color: var(--menu-active-text-color);
  background-color: var(--meun-active-backgroud-color);
}

</style>