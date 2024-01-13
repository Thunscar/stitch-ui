<template>
  <el-dialog v-model="visible"
             :title="postFormTitle"
             width="600">
    <el-form :model="postInfo" label-width="100" inline>
      <el-form-item label="岗位编码" :required="true">
        <el-input placeholder="岗位编码" v-model="postInfo.postCode" class="form-input"/>
      </el-form-item>
      <el-form-item label="岗位名称" :required="true">
        <el-input placeholder="岗位名称" v-model="postInfo.postName" class="form-input"/>
      </el-form-item>
      <el-form-item label="岗位排序" :required="true">
        <el-input type="number" :min="0" :max="999" placeholder="排序" v-model="postInfo.postSort"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="postInfo.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="备注" v-model="postInfo.remark" class="form-input"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
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

const emits = defineEmits(['refreshDataList'])
const postFormTitle = ref('')
const visible = ref(false)
const postInfo = reactive({
  postId: null,
  postCode: '',
  postName: '',
  postSort: 0,
  status: '0',
  remark: ''
})


// 提交表单
function submitPostHandler() {
  if (postInfo.postId) {
    updateSysPost(postInfo).then(res => {
      ElMessage.success('修改成功')
      visible.value = false
      emits('refreshDataList')
    })
  } else {
    insertSysPost(postInfo).then(res => {
      ElMessage.success('新增成功')
      visible.value = false
      emits('refreshDataList')
    })
  }
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
    getSysPostById(postId).then(res => {
      const post = res.data
      postInfo.postId = postId
      postInfo.postCode = post.postCode
      postInfo.postName = post.postName
      postInfo.postSort = post.postSort
      postInfo.status = post.status
      postInfo.remark = post.remark
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