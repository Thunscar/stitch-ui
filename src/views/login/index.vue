<template>
  <div class="container">
    <div class="container-view">
      <el-dropdown class="version-history">
        <el-link type="primary">演示版本变更历史</el-link>
        <template #dropdown>
          <el-dropdown-menu>
            <br/>
            <el-timeline style="min-width: 400px;max-height: 80vh">
              <el-timeline-item timestamp="2024-03-08">基本功能完成</el-timeline-item>
              <el-timeline-item timestamp="2024-03-28">
                1.新增登录与操作日志记录<br/>
                2.修复部分Bug<br/>
                3.优化页面交互
              </el-timeline-item>
            </el-timeline>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="logo-image">
        <img src="@/assets/img/login.svg" alt="">
      </div>
      <div class="login-view">
        <el-switch v-model="globalStore.theme"
                   active-value="default"
                   inactive-value="dark"
                   class="theme-switch"
                   @change="changeTheme"
                   style="--el-switch-on-color: #13ce66;--el-switch-off-color: #242424"/>
        <login-form/>
      </div>
    </div>
  </div>
</template>
<script setup>
import LoginForm from "@/views/login/login-form.vue"
import {useStore} from "@/store/index.js";

const globalStore = useStore().global

/**
 * switch框改变主题
 */
function changeTheme() {
  globalStore.ChangeUserTheme()
}

</script>
<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: -8px;
}

.container-view {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 96%;
  height: 94%;
  float: left;
  background-color: var(--login-bg-color);
  border-radius: 20px;
}

.logo-image {
  position: fixed;
  left: 0;
  width: 60%;
  height: 100%;
}

.logo-image img {
  width: 400px;
  height: 400px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.version-history {
  padding-top: 20px;
  padding-left: 30px;
}

.login-view {
  position: absolute;
  right: 0;
  width: 40%;
  height: 100%;
}

.theme-switch {
  position: absolute;
  top: 30px;
  right: 30px;
}

</style>