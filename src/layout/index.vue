<template>
  <component :is="LayoutComponents[globalStore.layout]" class="layout"/>
</template>
<script setup>
import VerticalLayout from './VerticalLayout/index.vue'
import HorizontalLayout from './HorizontalLayout/index.vue'
import ColumnlarLayout from './ColumnlarLayout/index.vue'
import {useStore} from "@/store/index.js";


const globalStore = useStore().global

const LayoutComponents = {
  vertical: VerticalLayout,
  horizontal: HorizontalLayout,
  columnlar: ColumnlarLayout
}
</script>
<style scoped>
.layout {
  min-height: 100vh;
  color: var(--text-color);
}
</style>