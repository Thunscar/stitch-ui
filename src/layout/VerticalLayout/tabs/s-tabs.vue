<template>
  <el-tabs class="s-tabs" type="card" v-model="router.currentRoute.value.fullPath" @tabRemove="closeHandler"
           @tabChange="tabChange">
    <el-tab-pane v-for="view in visitedViews" :key="view.path" :name="view.path" :label="view.title"
                 :closable="view.close"/>
  </el-tabs>
</template>
<script setup>
import {useStore} from "@/store/index.js";
import {computed, onMounted, watch} from "vue";
import router from "@/router/index.js";
import {visitedStorageKey} from "@/store/modules/visit.js";
import {textToImage} from "@/utils/test.js";

const visitedStore = useStore().visit
const noCloseViews = visitedStore.noCloseViews

const visitedViews = computed(() => visitedStore.visitedViews)

watch(() => router.currentRoute.value.fullPath, () => {
  const currentRouter = router.currentRoute.value
  const view = {
    title: currentRouter.meta.title,
    path: currentRouter.fullPath,
    close: !noCloseViews.includes(currentRouter.path),
    cache: currentRouter.meta.cache
  }
  visitedStore.AddView(view)
})

function initTabs() {
  if (!localStorage.getItem(visitedStorageKey)) {
    const home = {
      title: '首页',
      path: '/home',
      close: !noCloseViews.includes('/home'),
      cache: true
    }
    visitedStore.AddView(home)
    const currentRouter = router.currentRoute.value
    if (currentRouter.fullPath !== home.path) {
      const view = {
        title: currentRouter.meta.title,
        path: currentRouter.fullPath,
        close: !noCloseViews.includes(currentRouter.fullPath),
        cache: currentRouter.meta.cache
      }
      visitedStore.AddView(view)
    }
  }
}

function closeHandler(view) {
  visitedStore.RemoveView(view)
}

function tabChange(view) {
  textToImage()
  router.push(view)
}

onMounted(() => {
  initTabs()
})

</script>
<style scoped>
.s-tabs {
  height: 40px;
  display: flex;
  flex-flow: row nowrap;
}
</style>