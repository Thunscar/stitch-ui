<template>
  <el-tabs class="s-tabs" v-model="router.currentRoute.value.fullPath" @tabRemove="closeHandler"
           @tabChange="tabChange">
    <el-tab-pane v-for="view in visitedViews" :key="view.path" :name="view.path"
                 :closable="view.close">
      <template #label>
        {{ view.title }}
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import {useStore} from "@/store/index.js";
import {computed, onMounted, watch} from "vue";
import router from "@/router/index.js";

const visitedStore = useStore().visit
const visitedViews = computed(() => visitedStore.visitedViews)

watch(() => router.currentRoute.value.fullPath, () => {
  const currentRouter = router.currentRoute.value
  const view = {
    title: currentRouter.meta.title,
    path: currentRouter.fullPath,
    cache: currentRouter.meta.cache,
    icon: currentRouter.meta.icon
  }
  visitedStore.AddView(view)
})

function initTabs() {
  if (visitedStore.visitedViews.length === 0) {
    const home = {
      title: '首页',
      path: '/home',
      cache: true,
      icon: 'f-home'
    }
    visitedStore.AddView(home)
    const currentRouter = router.currentRoute.value
    if (currentRouter.fullPath !== home.path) {
      const view = {
        title: currentRouter.meta.title,
        path: currentRouter.fullPath,
        cache: currentRouter.meta.cache,
        icon: currentRouter.meta.icon
      }
      visitedStore.AddView(view)
    }
  }
}

function closeHandler(view) {
  visitedStore.RemoveView(view)
}

function tabChange(view) {
  router.push(view)
}

onMounted(() => {
  initTabs()
})

</script>
<style scoped>
.s-tabs {
  height: 40px;
  padding-left: 40px;
  user-select: none;
  background-color: var(--module-backgroud-color);
}


</style>