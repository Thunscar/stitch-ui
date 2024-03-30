<template>
  <el-dialog v-model="visible"
             :title="postFormTitle"
             width="620"
             @close="closeForm">
    <el-form :model="postInfo" ref="postFormRef" :rules="checkRules" label-width="100" inline v-loading="loading">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input placeholder="岗位编码" v-model="postInfo.postCode" class="form-input"/>
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input placeholder="岗位名称" v-model="postInfo.postName" class="form-input"/>
      </el-form-item>
      <el-form-item label="岗位排序">
        <el-input type="number" :min="0" :max="999" placeholder="排序" v-model="postInfo.postSort" class="sort-input"/>
      </el-form-item>
      <el-form-item label="状态">
        <stitch-radio-group v-model="postInfo.status" dict-type="post_status"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="postInfo.remark" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeForm">取消</el-button>
          <el-button type="primary" @click="submitPostHandler">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {reactive, ref} from "vue";
import '@/assets/css/form/form.css'
import {getSysPostById, insertSysPost, updateSysPost} from "@/api/perms/post.js";
import {ElMessage} from "element-plus";
import StitchRadioGroup from "@/components/Dict/stitch-radio-group.vue";

const emits = defineEmits(['refreshDataList'])
const postFormTitle = ref('')
const visible = ref(false)
const postFormRef = ref()
const postInfo = reactive({
  postId: null,
  postCode: '',
  postName: '',
  postSort: 0,
  status: '0',
  remark: ''
})

const checkRules = ref({
  postName: {
    required: true,
    message: '岗位名称不可为空',
    trigger: 'blur'
  },
  postCode: {
    required: true,
    message: '岗位编码不可为空',
    trigger: 'blur'
  }
})
const loading = ref(false)


// 提交表单
function submitPostHandler() {
  postFormRef.value.validate((valid) => {
    if (valid) {
      if (postInfo.postId) {
        updateSysPost(postInfo).then(res => {
          ElMessage.success('修改成功')
          closeForm()
          emits('refreshDataList')
        })
      } else {
        insertSysPost(postInfo).then(res => {
          ElMessage.success('新增成功')
          closeForm()
          emits('refreshDataList')
        })
      }
    }
  })
}

function closeForm() {
  visible.value = false
  postFormRef.value.resetFields()
  clearForm()
}

//清空表单
function clearForm() {
  postInfo.postId = null
  postInfo.postCode = ''
  postInfo.postName = ''
  postInfo.postSort = 0
  postInfo.status = '0'
  postInfo.remark = ''
}

function init(postId) {

//清空表单
  clearForm()

  visible.value = true

  if (postId) {
    postFormTitle.value = '修改岗位'
    loading.value = true
    getSysPostById(postId).then(res => {
      Object.assign(postInfo, res.data)
    }).finally(() => {
      loading.value = false
    })
  } else {
    postFormTitle.value = '新增参数'
  }
}

defineExpose({
  init
})
</script>
<style scoped>

</style>