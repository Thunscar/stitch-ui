<template>
  <el-container>
    <s-sidebar/>
    <el-container>
      <s-header/>
      <s-tabs/>
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
import SSidebar from "@/layout/VerticalLayout/siderBar/s-sidebar.vue"
import SHeader from "@/layout/VerticalLayout/header/s-header.vue"
import STabs from "@/layout/VerticalLayout/tabs/s-tabs.vue";

const copyRight = import.meta.env.VITE_COPYRIGHT ? import.meta.env.VITE_COPYRIGHT : 'Copyright ©2023 Created by StitchCoder'
</script>
<style scoped>

.footer {
  background-color: var(--layout-backgroud-color);
  text-align: center;
  font-size: 12px;
  margin-bottom: 10px;
  z-index: 1;
}

.main {
  min-height: 70vh;
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