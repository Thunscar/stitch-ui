<template>
  <el-footer class="footer">
    <a href="https://blog.stitchcodes.com" target="_blank">{{ copyRight }}</a>
  </el-footer>
</template>
<script setup>
const copyRight = import.meta.env.VITE_COPYRIGHT ? import.meta.env.VITE_COPYRIGHT : 'Copyright ©2024 Created by StitchCoder'
</script>
<style scoped>
.footer {
  bottom: 0;
  height: 30px;
  text-align: center;
  background-color: var(--module-backgroud-color);
}

.footer a {
  text-decoration: none;
  font-size: 12px;
  color: var(--text-color);
}
</style>