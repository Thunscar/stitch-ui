<template>
  <el-header class="header-content">
    <div class="operate_menu" @click="putAwayMenuClick">
      <img class="operate_menu_icon" :class="{'put-away-icon':!collapse,'expand-icon':collapse}">
    </div>
    <div class="breadcrumb">
      <el-breadcrumb separator=" > ">
        <el-breadcrumb-item v-for="item in breadcrumb" key="index">
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-header>
</template>
<script setup>
import router from "@/router/index.js";
import {computed, getCurrentInstance, ref} from "vue";

const instance = getCurrentInstance()
const bus = instance.appContext.config.globalProperties.bus

const collapse = ref(false)

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

</script>
<style scoped>
.header-content {
  display: flex;
  flex-flow: row nowrap;
  height: 60px;
  line-height: 30px;
  padding-left: 0;
}

.operate_menu {
  display: block;
  text-align: center;
  padding-top: 13px;
  margin-left: 0;
  width: 45px;
  cursor: pointer;
}

.operate_menu:hover {
  background-color: var(--header-menu-hover-color);
}

.operate_menu_icon {
  user-select: none;
  width: 34px;
  height: 34px;
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
  margin-left: 10px;
  width: 40%;
  padding-top: 23px;
}

.breadcrumb span {
  font-size: 15px
}
</style>