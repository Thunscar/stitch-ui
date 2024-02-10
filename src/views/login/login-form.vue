<template>
  <div class="login-form" :class="{'code-form':loginForm.verifyCodeEnable}">
    <div class="form-title">
      <h2>{{ appTitle }}</h2>
    </div>
    <div class="form-content">
      <el-form :model="loginFormRule">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" class="login-input" :prefix-icon="User" style="letter-spacing:2px"
                    placeholder="请输入用户名" autocomplete="off"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" class="login-input" :prefix-icon="Lock" placeholder="请输入密码"
                    type="password" autocomplete="off"/>
        </el-form-item>
        <el-form-item prop="verifyCode" v-if="loginForm.verifyCodeEnable">
          <div class="code-img-group">
            <el-input v-model="loginForm.code" class="code-input" :prefix-icon="Lock" placeholder="验证码"/>
            <img :src="loginForm.verifyImage" alt="" class="code-img" @click="getVerifyCode">
          </div>
        </el-form-item>
      </el-form>
      <div class="login-btn-group">
        <el-button class="login-btn" :icon="UserFilled" @click="handlerLogin">登录</el-button>
        <el-button class="login-btn reset" :icon="Refresh" @click="handlerReset">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>

import {Lock, Refresh, User, UserFilled} from "@element-plus/icons-vue";
import {onMounted, reactive} from "vue";
import {getVerifyImage} from "@/api/login.js";
import router from "@/router/index.js";
import {useStore} from "@/store/index.js";
import {ElMessage} from "element-plus";
import {decrypt, encrypt} from "@/utils/encrypt.js";
import Cookies from 'js-cookie'

const appTitle = import.meta.env.VITE_APP_TITLE ? import.meta.env.VITE_APP_TITLE : 'Stitch Admin'
const loginForm = reactive({
  username: 'admin',
  password: '001010',
  code: '',
  uuid: '',
  verifyImage: '',
  rememberMe: false,
  verifyCodeEnable: false
})
const loginFormRule = reactive({
  username: '',
  password: '',
  verifyCode: ''
})

const visitedStore = useStore().visit

function getVerifyCode() {
  getVerifyImage().then(res => {
    loginForm.verifyCodeEnable = res.verifyEnable
    if (loginForm.verifyCodeEnable) {
      loginForm.verifyImage = 'data:image/jpg;base64,' + res.verifyImage
      loginForm.uuid = res.uuid
    }
  })
}

function getCookies() {
  const username = Cookies.get("username")
  const password = Cookies.get("password")
  const remember = Cookies.get("remember")
  loginForm.username = username === undefined ? loginForm.username : username
  loginForm.password = password === undefined ? loginForm.password : decrypt(password)
  loginForm.remember = remember === undefined ? false : Boolean(remember)
}

function setCookie() {
  Cookies.set("username", loginForm.username, {expires: 7})
  Cookies.set("password", encrypt(loginForm.password), {expires: 7})
  Cookies.set("remember", loginForm.remember, {expires: 7})
}

function removeCookie() {
  Cookies.remove("username")
  Cookies.remove("password")
  Cookies.remove("remember")
}

function handlerLogin() {
  loginForm.loading = true
  const userInfo = {
    username: loginForm.username,
    password: loginForm.password,
    uuid: loginForm.uuid,
    code: loginForm.code
  }
  useStore().user.Login(userInfo).then(() => {
    ElMessage.success('登录成功')
    if (loginForm.remember) {
      setCookie()
    } else {
      removeCookie()
    }
    //路由跳转
    router.push({path: router.currentRoute.value.query.redirect || "/"})
  }).catch(res => {
    loginForm.loading = false
    getVerifyCode()
    loginForm.code = ''
  })
}

function handlerReset() {
  loginForm.username = ''
  loginForm.password = ''
}

onMounted(() => {
  getVerifyCode()
  getCookies()
})
</script>
<style scoped>
.login-form {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 500px;
  height: 380px;
  background-color: var(--login-form-color);
  border-radius: 10px;
  box-shadow: 0 0 10px var(--login-form-shadow);
}

.code-form {
  height: 440px;
}

.form-title {
  position: absolute;
  text-align: center;
  width: 100%;
  height: 150px;
}

.form-title h2 {
  color: var(--text-color);
  font-size: 40px;
  font-weight: 900;
  animation: slide 5s ease-in-out infinite alternate;
}

@keyframes slide {
  to {
    color: var(--login-form-slide-color);
    text-shadow: 20px 0 70px var(--login-form-slide-color);
  }
}

.form-content {
  position: absolute;
  top: 120px;
  width: 100%;
}

.login-input {
  width: 80%;
  height: 40px;
  margin-bottom: 15px;
  margin-left: 10%;
}

.login-btn-group {
  margin-left: 10%;
  width: 80%;
  height: 40px;
}

.login-btn {
  width: 48%;
  height: 40px;
  margin-left: 0;
  font-size: 14px;
}

.reset {
  margin-left: 4%;
}

.code-img-group {
  margin-left: 10%;
  margin-bottom: 15px;
  width: 80%;
  height: 40px;
}

.code-input {
  width: 48%;
  height: 40px;
  margin-left: 0;
}

.code-img {
  width: 48%;
  height: 38px;
  margin-left: 4%;
  margin-top: 0;
  margin-bottom: 0;
  vertical-align: middle;
  border-radius: 3px;
}
</style>