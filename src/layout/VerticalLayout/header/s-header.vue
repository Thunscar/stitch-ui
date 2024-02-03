<template>
  <el-header class="header-content">
    <div class="left-header">
      <div class="operate-menu" @click="putAwayMenuClick">
        <img class="operate-menu-icon" :class="{'put-away-icon':!collapse,'expand-icon':collapse}" src="" alt="">
      </div>
      <div class="breadcrumb">
        <el-breadcrumb separator=" > ">
          <el-breadcrumb-item v-for="item in breadcrumb" key="index">
            <span>{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right-header">
      <div>
        <el-dropdown>
          <div class="layout-size">
            <img class="layout-size-icon" src="" alt="">
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item text-value="large" :disabled="size === 'large'" @click="setSize('large')">大型
              </el-dropdown-item>
              <el-dropdown-item text-value="default" :disabled="size === 'default'" @click="setSize('default')">默认
              </el-dropdown-item>
              <el-dropdown-item text-value="small" :disabled="size === 'small'" @click="setSize('small')">小型
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div>
        <div class="theme-mode" @click="toggleTheme">
          <img class="theme-mode-icon" src="" alt="">
        </div>
      </div>
      <div class="operate-fullscreen" @click="toggle">
        <img class="operate-fullscreen-icon" :class="{'full-screen':!isFullscreen,'exit-full-screen':isFullscreen}"
             src=""
             alt=""/>
      </div>
      <div class="user-info">
        <el-dropdown>
          <div class="avatar">
            <el-avatar :src="userStore.avatar" :size="40" class="user-avatar">User</el-avatar>
            <el-text truncated tag="b" class="user-name">{{ nickName }}</el-text>
            <el-icon :size="14" class="arrow-down">
              <ArrowDownBold/>
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>个性设置</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>
<script setup>
import router from "@/router/index.js";
import {computed, getCurrentInstance, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "@/store/index.js";
import {ArrowDownBold} from "@element-plus/icons-vue";
import {useFullscreen} from "@vueuse/core";

const instance = getCurrentInstance()
const bus = instance.appContext.config.globalProperties.bus

const collapse = ref(false)
const {isFullscreen, toggle} = useFullscreen()
const userStore = useStore().user
const nickName = computed(() => userStore.name)
const globalStore = useStore().global
const size = computed(() => globalStore.size)


const breadcrumb = computed(() => {
  //使用filter拷贝不会修改原数据
  let breadcrumb = router.currentRoute.value.matched.filter(() => {
    return true
  })
  if (breadcrumb[0].name === 'Layout') {
    breadcrumb.shift()
  }
  return breadcrumb
})

//收起菜单事件(利用全局事件总线设置菜单的collapse属性)
function putAwayMenuClick() {
  collapse.value = !collapse.value
  bus.emit('changeCollapseStatus', collapse.value)
}

//设置全局布局大小
function setSize(size) {
  //修改Store中的
  globalStore.SetUserSize(size)
}


//用户退出登录
async function loginOut() {
  ElMessageBox.confirm('确认要退出系统吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    userStore.UserLoginOut().then(() => {
      ElMessage.success('退出登录成功')
      router.push({path: '/login', replace: true})
    })
  }).catch(() => {
  })
}

//主题切换
function toggleTheme() {
  const theme = globalStore.theme === 'dark' ? 'default' : 'dark'
  globalStore.SetUserTheme(theme)
}

</script>
<style scoped>
.left-header {
  display: flex;
  flex-flow: row nowrap;
  max-width: max-content;
  position: absolute;
  left: 0;
}

.right-header {
  display: flex;
  flex-flow: row nowrap;
  max-width: max-content;
  height: 60px;
  position: absolute;
  right: 0;
}

.header-content {
  position: relative;
  background-color: var(--module-backgroud-color);
  display: flex;
  flex-flow: row nowrap;
  height: 60px;
  padding-left: 0;
  float: left;
}

.operate-menu {
  display: block;
  text-align: center;
  margin-left: 0;
  width: 45px;
  height: 60px;
  cursor: pointer;
}

.operate-menu:hover {
  background-color: var(--header-menu-hover-color);
}

.operate-menu-icon {
  user-select: none;
  width: 34px;
  height: 34px;
  padding-top: 13px;
}

.put-away-icon {
  content: var(--put-away-menu-icon);
}

.expand-icon {
  content: var(--expand-menu-icon);
}

.breadcrumb {
  user-select: none;
  text-align: left;
  padding-left: 10px;
  padding-top: 23px;
}

.breadcrumb span {
  font-size: 15px
}

.operate-fullscreen {
  display: block;
  text-align: center;
  margin-left: 0;
  width: 45px;
  height: 60px;
  cursor: pointer;
}

.operate-fullscreen:hover {
  background-color: var(--header-menu-hover-color);
}

.operate-fullscreen-icon {
  user-select: none;
  width: 24px;
  height: 24px;
  margin-top: 18px;
  align-self: center;
}

.full-screen {
  content: var(--full-screen-icon);
}

.exit-full-screen {
  content: var(--exit-full-screen-icon);
}

.user-info {
  width: 140px;
  text-align: center;
  position: relative;
}

.user-info:hover {
  background-color: var(--header-menu-hover-color);
}

.avatar {
  text-align: center;
  display: flex;
  flex-flow: row nowrap;
  outline: 0 !important;
}

.user-avatar {
  margin-top: 10px;
}

.user-name {
  width: 60px;
  margin-top: 10px;
  color: var(--text-color);
}

.arrow-down {
  margin-top: 23px;
}


.layout-size {
  display: block;
  text-align: center;
  margin-left: 0;
  width: 45px;
  height: 60px;
  cursor: pointer;
  outline: 0 !important;
}

.layout-size-icon {
  user-select: none;
  width: 24px;
  height: 24px;
  margin-top: 18px;
  align-self: center;
  content: var(--layout-size-icon);
}

.theme-mode {
  display: block;
  text-align: center;
  margin-left: 0;
  width: 45px;
  height: 60px;
  cursor: pointer;
  outline: 0 !important;
}

.theme-mode:hover {
  background-color: var(--header-menu-hover-color);
}

.theme-mode-icon {
  user-select: none;
  width: 24px;
  height: 24px;
  margin-top: 18px;
  align-self: center;
  content: var(--theme-mode-icon);
}
</style>