<template>
  <div class="user-center">
    <user-profile class="user-profile" :user-profile="userProfile"/>
    <user-profile-form class="user-profile-form" :user-profile="userProfile" @loadUserProfile="loadUserProfile"/>
  </div>
</template>
<script setup>

import UserProfile from "@/views/user/user-profile.vue";
import UserProfileForm from "@/views/user/user-profile-form.vue";
import {getUserProfile} from "@/api/profile.js";
import {onMounted, reactive} from "vue";

const userProfile = reactive({
  userId: null,
  userName: '',
  nickName: '',
  email: '',
  phone: '',
  sex: '',
  avatar: '',
  createTime: '',
  deptName: '',
  postGroup: '',
  roleGroup: ''
})

const loadUserProfile = () => {
  getUserProfile().then(res => {
    Object.assign(userProfile, res.profile)
    Object.assign(userProfile, res.postGroup)
    Object.assign(userProfile, res.roleGroup)
    userProfile.deptName = res.profile.dept.deptName
  })
}

onMounted(() => {
  loadUserProfile()
})
</script>
<style scoped>
.user-center {
  display: flex;
  flex-flow: row wrap;
}

.user-center * {
  display: block;
  margin-right: 20px;
  margin-bottom: 20px;
}

.user-center .user-profile{
  width: 400px;
}

.user-center .user-profile-form{
  flex: 1;
}

@media only screen and  (max-width: 768px) {
  .user-center{
    display: flex;
  }
  .user-profile-form{
    width: 400px;
  }
}
</style>