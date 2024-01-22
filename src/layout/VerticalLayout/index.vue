<template>
  <el-container class="layout-back">
    <s-sidebar/>
    <el-container class="vertical-layout">
      <s-header/>
      <s-tabs/>
      <s-main/>
      <s-footer/>
    </el-container>
  </el-container>
</template>
<script setup>
import '@/assets/css/layout/layout.css'
import SSidebar from "@/layout/VerticalLayout/siderBar/s-sidebar.vue"
import SHeader from "@/layout/VerticalLayout/header/s-header.vue"
import STabs from "@/layout/VerticalLayout/tabs/s-tabs.vue";
import SMain from "@/layout/VerticalLayout/main/s-main.vue";
import SFooter from "@/layout/VerticalLayout/footer/s-footer.vue";
</script>
<style scoped>
.layout-back {
  background-color: var(--layout-backgroud-color)
}

.vertical-layout {
  display: flex;
  flex-flow: column;
}
</style>