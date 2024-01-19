<template>
  <div>
    <el-aside class="aside">
      <div class="logo">
        <img src="@/assets/img/stitch-admin.svg" alt=""/>
        <span v-if="!collapse">{{ appName }}</span>
      </div>
      <el-scrollbar height="92vh">
        <el-menu class="el-menu--vertical menu"
                 :unique-opened="true"
                 :default-active="activeMenu"
                 :collapse="collapse"
                 :router="false">
          <SubMenu :menus="menuList"/>
        </el-menu>Ï
      </el-scrollbar>
    </el-aside>
  </div>
</template>
<script setup>

import {useStore} from "@/store/index.js"
import SubMenu from "@/components/Menu/SubMenu.vue"
import {computed, getCurrentInstance, ref} from "vue"
import router from "@/router/index.js"


const instance = getCurrentInstance()
const bus = instance.appContext.config.globalProperties.bus

// 是否折叠
const collapse = ref(false)

// 程序logo标题
const appName = computed(() => {
  return collapse.value ? (import.meta.env.VITE_APP_TITLE_COLLAPSE) : (import.meta.env.VITE_APP_TITLE)
})

const titleWidth = computed(() => {
  return collapse.value ? '60px' : '240px'
})

// 路由
const routerStore = useStore().router


//需要选中的菜单框
const menuList = computed(() => {
  return routerStore.routerState
})

// 当前选中的菜单框
const activeMenu = computed(() => {
  return router.currentRoute.value.path
})

//全局事件总线绑定修改collapse事件
bus.on('changeCollapseStatus', (newCollapse) => {
  collapse.value = newCollapse
})
//全局绑定获取collapse事件
bus.on('getCollapseStatus', () => {
  return collapse.value
})

</script>
<style scoped>
.aside {
  width: fit-content;
  overflow-y: hidden;
}

.menu {
  user-select: none;
  background-color: var(--menu-backgroud-color);
  min-height: 92vh;
}

.logo {
  width: v-bind(titleWidth);
  user-select: none;
  z-index: 999;
  height: 60px;
  text-align: center;
  font-weight: 800;
  font-size: 20px;
  display: flex;
}

.logo img {
  width: 36px;
  height: 36px;
  margin-top: 12px;
  margin-left: 14px;
}

.logo span{
  margin-left: 6px;
  margin-top: 20px;
}
</style>