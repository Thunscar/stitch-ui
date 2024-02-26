<template>
  <div class="container">
    <div class="container-view">
      <div>
        <div class="bug"></div>
      </div>
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
  background-image: var(--login-bg-image);
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
  background: var(--login-bg-color);
  border-radius: 20px;
}

.logo-image {
  position: absolute;
  left: 0;
  width: 60%;
  height: 100%;
}

.logo-image img {
  width: 663px;
  height: 654px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
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