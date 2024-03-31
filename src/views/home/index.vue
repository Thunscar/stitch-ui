<template>
  <div class="home-page">
    <div class="home-title">
      <img style="width: 40%" src="@/assets/img/home-welcome.svg">
    </div>
    <div class="home-page-intro">
      <p>
        前端使用的开发工具有Vue3、Element Plus、Vue
        Router、Pinia、Axios、Vite等，后端使用的开发工具有SpringBoot、Spring
        Security、MyBatis、MySQL、Redis等。前端与后端都尽量做到少依赖外部工具库为原则，以降低评估和维护依赖而产生的时间成本。采用MIT开源协议，可免费用于商业项目等场景。<br/>
        前端工程Github地址:<a :href="frontGithubUrl" target="_blank">{{ frontGithubUrl }}</a><br/>
        后端工程Github地址:<a :href="backendGithubUrl" target="_blank">{{ backendGithubUrl }}</a><br/>
        作者博客地址:<a :href="authorBlogUrl" target="_blank">{{ authorBlogUrl }}</a><br/>
        项目演示地址:<a :href="demoUrl" target="_blank">{{ demoUrl }}</a>
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
const frontGithubUrl = import.meta.env.VITE_FRONT_GITHUB_URL
const backendGithubUrl = import.meta.env.VITE_BACKEND_GITHUB_URL
const authorBlogUrl = import.meta.env.VITE_BLOG
const demoUrl = import.meta.env.VITE_FRONT_URL
</script>
<style scoped>
.home-title{

}

.title-text h1{
  font-size: 40px;
}
.title-text span{
  font-size: 20px;
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