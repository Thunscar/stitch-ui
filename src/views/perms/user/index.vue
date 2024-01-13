<template>
  <div>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="用户名" v-model="queryUser.roleName"/></span>
      <span><el-input class="s-search-input" placeholder="手机号" v-model="queryUser.phone"/></span>
      <span><el-input class="s-search-input" placeholder="邮箱" v-model="queryUser.email"/></span>
      <span style="position: relative;right: 0">
        <el-button type="primary" @click="queryUserList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
      </span>
    </div>
    <div class="operation">
      <el-button type="primary" size="default" @click="createUserHandler">新增</el-button>
      <el-button type="danger" size="default" :disabled="selectedUsers.length === 0"
                 @click="deleteBatchUserHandler">批量删除
      </el-button>
      <el-button type="info" size="default" @click="exportExcelHandler">导出Excel</el-button>
      <el-button type="success" size="default" @click="importExcelHandler">导入用户</el-button>
    </div>
    <div class="table">
      <el-table :data="userList"
                :row-key="(record) => record.userId"
                max-height="64vh"
                :default-expand-all="false"
                :indent="8"
                border
                :header-cell-style="{'text-align':'center'}"
                @selection-change="selectUserHandler"
                class="table-content">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" fixed="left" width="140"
                         align="center"/>
        <el-table-column label="昵称" prop="nickName" :show-overflow-tooltip="true" width="100" align="center"/>
        <el-table-column label="类型" prop="userType" width="95" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.userType === '00'">系统用户</el-tag>
            <el-tag v-else type="warning">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="sex" width="60" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.sex === '0'">男</el-tag>
            <el-tag v-else-if="scope.row.sex === '1'" type="warning">女</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === '0'">正常</el-tag>
            <el-tag v-else-if="scope.row.status === '1'" type="warning">停用</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" prop="dept.deptName" :show-overflow-tooltip="true" width="120"
                         align="center"/>
        <el-table-column label="电话" prop="phone" :show-overflow-tooltip="true" width="130" align="center"/>
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" width="180" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="130" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="loginTime" label="最后登录时间" width="130" :show-overflow-tooltip="true"
                         align="center"/>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="操作" width="160" min-width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" size="default" link @click="updateUserHandler(scope.row.userId)">修改</el-button>
            <el-button type="danger" size="default" link @click="deleteUserHandler(scope.row.userId)">删除</el-button>
            <el-button type="primary" size="default" link>
              <el-dropdown>
                <el-button type="primary" size="default" link>更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="resetPassword(scope.row.userId)">重置密码</el-dropdown-item>
                    <el-dropdown-item @click="allocatedRoles(scope.row.userId)">分配角色</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="queryUser.pageNum"
          v-model:page-size="queryUser.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryUser.total"
          @size-change="queryUserList"
          @current-change="queryUserList"
          class="table-pagination"
      />
    </div>
    <user-form ref="userFormRef" @refresh-data-list="queryUserList"/>
  </div>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {deleteSysUser, getSysUserList, resetSysUserPassword} from "@/api/perms/user.js";
import {ElMessage, ElMessageBox} from "element-plus";
import '@/assets/css/table/table.css'
import UserForm from "@/views/perms/user/user-form.vue";
import {download} from "@/api/download.js";

const userList = ref([])
const selectedUsers = ref([])
const queryUser = reactive({
  userName: '',
  phone: '',
  email: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})


//新增用户
function createUserHandler() {

}

//勾选事件
function selectUserHandler(rows) {
  selectedUsers.value = rows.map(row => row.configId)
}

//批量删除用户信息
function deleteBatchUserHandler() {
  ElMessageBox.confirm('确认删除选中的用户?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSysUser(selectedUsers.value).then(res => {
      ElMessage.success('删除成功')
      queryUserList()
    })
  }).catch(() => {
  })
}

//导出用户信息
function exportExcelHandler() {
  download('/sys/user/export', {...queryUser}, `user_${new Date().getTime()}.xlsx`)
}

//导入用户信息
function importExcelHandler() {

}

//更新用户信息
function updateUserHandler(userId) {

}

//删除用户
function deleteUserHandler(userId) {
  ElMessageBox.confirm('确认删除该用户?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSysUser(userId).then(res => {
      ElMessage.success('删除成功')
      queryUserList()
    })
  }).catch(() => {
  })
}

// 重置密码
function resetPassword(userId) {
  resetSysUserPassword(userId).then(res => {
    ElMessage.success('重置成功')
  })
}

// 分配角色
function allocatedRoles(userId) {

}

function queryUserList() {
  getSysUserList(queryUser).then(res => {
    userList.value = res.list
    queryUser.total = res.total
  })
}

function resetQueryCondition() {
  queryUser.roleName = ''
  queryUser.phone = ''
  queryUser.email = ''
  queryUser.pageNum = 1
  queryUser.pageSize = 10
  queryUser.total = 0
  queryUserList()
}


onMounted(() => {
  queryUserList()
})

</script>
<style scoped>
</style>