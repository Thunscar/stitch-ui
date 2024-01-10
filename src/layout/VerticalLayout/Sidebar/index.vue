<template>
  <div>
    <div class="logo">
      <span>{{ appName }}</span>
    </div>
    <el-scrollbar height="92vh">
      <el-menu class="el-menu--vertical menu"
               :unique-opened="true"
               :default-active="activeMenu"
               :collapse="collapse"
               :router="false">
        <SubMenu :menus="menuList"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script setup>

import {useStore} from "@/store/index.js"
import SubMenu from "@/components/Menu/SubMenu.vue"
import {computed, ref} from "vue"
import router from "@/router/index.js"

// 程序logo标题
const appName = import.meta.env.VITE_APP_TITLE ? import.meta.env.VITE_APP_TITLE : 'Stitch Admin'
// 路由
const routerStore = useStore().router

// 是否折叠
const collapse = ref(false)

//需要选中的菜单框
const menuList = computed(() => {
  return routerStore.routerState
})

// 当前选中的菜单框
const activeMenu = computed(() => {
  return router.currentRoute.value.path
})

// 点击首页事件
function handleClickHome() {
  router.push("/home")
}

</script>
<style scoped>

.menu {
  user-select: none;
  background-color: var(--menu-backgroud-color);
  min-height: 92vh;
}

.logo {
  user-select: none;
  z-index: 999;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-weight: 800;
}
</style>