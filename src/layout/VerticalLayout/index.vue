<template>
  <el-container>
    <el-aside class="aside">
      <SideBar/>
    </el-aside>
    <el-container>
      <el-header style="background: #13ce66">Header</el-header>
      <el-main class="main">
        <div class="view-container">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <keep-alive>
                <component :is="Component"/>
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-main>
      <el-footer class="footer" height="45">{{ copyRight }}</el-footer>
    </el-container>
  </el-container>
</template>
<script setup>
import '@/assets/css/layout/layout.css'
import SideBar from "@/layout/VerticalLayout/Sidebar/index.vue"

const copyRight = import.meta.env.VITE_COPYRIGHT ? import.meta.env.VITE_COPYRIGHT : 'Copyright ©2023 Created by StitchCoder'
</script>
<style scoped>
.aside {
  width: 240px;
  overflow-y: hidden;
}

.footer {
  background-color: var(--layout-backgroud-color);
  text-align: center;
  font-size: 12px;
  margin-bottom: 10px;
  z-index: 1;
}

.main {
  min-height: 75vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>