<template>
  <div class="home-page">
    <img class="home-welcome-img" src="@/assets/img/home-welcome.svg" alt=""/>
    <div class="home-page-intro">
      <p>
        介绍<br/>
        前端使用的开发工具有Vue3、Element Plus、Vue
        Router、Pinia、Axios、Vite等，后端使用的开发工具有SpringBoot、Spring
        Security、MyBatis、MySQL、Redis等。前端与后端都尽量做到少依赖外部工具库为原则，以降低评估和维护依赖而产生的时间成本。采用MIT开源协议，可免费用于商业项目等场景。<br/>
        前端工程Github地址:<a href="https://github.com/Thunscar/stitch-ui" target="_blank">https://github.com/Thunscar/stitch-ui</a><br/>
        后端工程Github地址:<a href="https://github.com/Thunscar/stitch-framework" target="_blank">https://github.com/Thunscar/stitch-framework</a><br/>
        作者博客地址:<a href="https://blog.stitchcodes.com" target="_blank">https://blog.stitchcodes.com</a><br/>
        项目演示地址:<a href="https://blog.stitchcodes.com" target="_blank">暂未开放</a>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'home'
}
</script>
<script setup>

import {onActivated, onMounted} from "vue";

onMounted(() => {
  console.log('home init')
})

onActivated(() => {
  console.log('home active')
})
</script>
<style scoped>
.home-welcome-img {
  width: 80%;
  height: 80%;
  pointer-events: none;
  user-select: none
}

.home-page {
  padding-top: 5%;
  text-align: center;
}

.home-page-intro {
  width: 80%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
  font-size: 14px;
  line-height: 26px;
}

.home-page-intro a {
  color: rgb(104, 114, 197);
}

</style>