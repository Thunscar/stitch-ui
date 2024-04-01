<template>
  <el-card class="edit-card">
    <template #header>
      基本资料
    </template>
    <el-tabs v-model="activeName">
      <el-tab-pane label="修改基本信息" name="user-profile">
        <el-form :model="newUserProfile" ref="userProfileRef" :rules="checkRules">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="newUserProfile.nickName" class="form-input"/>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="newUserProfile.phone" class="form-input"/>
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input v-model="newUserProfile.email" class="form-input"/>
          </el-form-item>
          <el-form-item label="性别">
            <stitch-radio-group v-model="newUserProfile.sex" dict-type="user_gender"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserProfile">保存</el-button>
            <el-button @click="resetFrom">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="user-password">
        <el-form :model="password" ref="userPasswordRef" :rules="passwordCheckRules">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="password.oldPassword" class="form-input" type="password"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="password.newPassword" class="form-input" type="password"/>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="password.confirmPassword" class="form-input" type="password"/>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="saveUserPassword">确认修改</el-button>
            <el-button @click="resetFrom">清空</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

  </el-card>
</template>
<script setup>
import {reactive, ref, watch} from "vue";
import StitchRadioGroup from "@/components/Dict/stitch-radio-group.vue";
import {ElMessage} from "element-plus";
import {updateUserPassword, updateUserProfile} from "@/api/profile.js";
import '@/assets/css/form/form.css'

const props = defineProps({
  userProfile: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['loadUserProfile'])
const userProfileRef = ref()
const userPasswordRef = ref()
const newUserProfile = reactive({
  userId: null,
  nickName: '',
  phone: '',
  email: '',
  sex: '0'
})
const checkRules = ref({
  nickName: {
    required: true,
    message: '昵称不可为空',
    trigger: 'blur'
  }
})
const activeName = ref('user-profile')
const password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== password.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const passwordCheckRules = ref({
  oldPassword: {
    required: true,
    message: '旧密码不可为空',
    trigger: 'blur'
  },
  newPassword: {
    required: true,
    message: '请输入新密码',
    trigger: 'blur'
  },
  confirmPassword: {
    validator: validateConfirmPassword,
    trigger: 'blur'
  }
})

watch(props.userProfile, () => {
  resetFrom()
}, {deep: true})

const resetFrom = () => {
  newUserProfile.userId = props.userProfile.userId
  newUserProfile.nickName = props.userProfile.nickName
  newUserProfile.phone = props.userProfile.phone
  newUserProfile.email = props.userProfile.email
  newUserProfile.sex = props.userProfile.sex
}

//修改用户个人信息
const saveUserProfile = () => {
  userProfileRef.value.validate((valid) => {
    if (valid) {
      checkPaswordValid()
      updateUserProfile(newUserProfile).then(() => {
        //触发父组件数据更新
        emits('loadUserProfile')
        ElMessage.success('更新个人信息成功')
      })
    }
  })
}



//修改用户密码
const saveUserPassword = () => {
  userPasswordRef.value.validate((valid) => {
    if (valid) {
      updateUserPassword(password.oldPassword,password.newPassword).then(() => {
        ElMessage.success('更新密码成功')
      })
    }
  })
}
</script>
<style scoped>
.edit-card {
  min-width: 400px;
}
</style>