<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view/>
  </el-config-provider>
</template>
<script setup>

import {useStore} from "@/store/index.js";
import {computed} from "vue";

const globalStore = useStore().global
const size = computed(() => globalStore.size || 'default')
const locale = computed(() => globalStore.locale)

</script>
<style scoped>
</style>