<template>
  <el-main class="main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <KeepAlive :include="[...cacheViews]">
          <component :is="Component"/>
        </KeepAlive>
      </transition>
    </router-view>
  </el-main>
</template>
<script setup>

import {useStore} from "@/store/index.js";
import {computed} from "vue";

const visitStore = useStore().visit
const cacheViews = computed(() => {
  return visitStore.keepAliveViews
})

</script>
<style scoped>
.main {
  max-height: calc(100vh - 142px);
  overflow: hidden;
  border-color: black;
  margin: 6px 6px 6px 6px;
  padding-bottom: 10px;
  border-radius: 10px;
  background-color: var(--module-backgroud-color);
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