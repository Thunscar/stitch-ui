<template>
  <el-card class="user-info">
    <template #header>
      个人信息
    </template>
    <el-avatar :src="userProfile.avatar" :size="32" class="user-avatar"/>
    <el-divider/>
    <p>用户名称
      <el-text type="info" truncated>{{ userProfile.userName }}</el-text>
    </p>
    <p>用户昵称
      <el-text type="info" truncated>{{ userProfile.nickName }}</el-text>
    </p>
    <p>联系电话
      <el-text type="info" truncated>{{ userProfile.phone }}</el-text>
    </p>
    <p>联系邮箱
      <el-text type="info" truncated>{{ userProfile.email }}</el-text>
    </p>
    <p>所属部门
      <el-text type="info" truncated>{{ userProfile.deptName }}</el-text>
    </p>
    <p>所属岗位
      <el-text type="info" truncated>{{ userProfile.postGroup }}</el-text>
    </p>
    <p>所属角色
      <el-text type="info" truncated>{{ userProfile.roleGroup }}</el-text>
    </p>
  </el-card>
</template>
<script setup>
const props = defineProps({
  userProfile: {
    type: Object,
    required: true
  }
})
const userProfile = props.userProfile
</script>
<style scoped>

.user-info {
  box-shadow: var(--el-box-shadow-light);
}

.user-info .el-avatar {
  width: 160px;
  height: 160px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.user-info * {
  font-size: 16px;
  font-weight: 200;
}

.user-info p {
  margin-top: -10px;
}

.user-info p span {
  width: 200px;
  text-align: right;
  font-weight: unset;
  float: right !important;
}
</style>