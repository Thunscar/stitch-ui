<template>
  <el-drawer v-model="visible"
             :close-on-click-modal="false"
             size="30%"
             :title="title"
             destroy-on-close>
    <template #default>
      <div>
        <el-form>
          <el-form-item label="数据范围">
            <el-select>
              <el-option :value="0">全部数据权限</el-option>
              <el-option :value="1">自定义数据权限</el-option>
              <el-option :value="2">本部门数据权限</el-option>
              <el-option :value="3">本部门及子部门数据权限</el-option>
              <el-option :value="4">本人数据权限</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import {reactive, ref} from "vue";

const visible = ref(false)
const title = ref()
const dataScope = reactive({
  roleId:'',
  roleName:''
})

function initDrawer(roleId, roleName) {
  title.value = '数据权限 - ' + roleName
  visible.value = true
  dataScope.roleId = roleId
  dataScope.roleName = roleName
}

defineExpose({
  initDrawer
})
</script>
<style scoped>
</style>