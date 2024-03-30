<template>
  <el-card>
    <div class="search">
      <el-input class="s-search-input" placeholder="用户名" v-model="queryUser.userName"/>
      <el-input class="s-search-input" placeholder="手机号" v-model="queryUser.phone"/>
      <el-input class="s-search-input" placeholder="邮箱" v-model="queryUser.email"/>
      <el-button type="primary" @click="queryUserList">搜索</el-button>
      <el-button type="default" @click="resetQueryCondition">重置</el-button>
      <el-button v-auth="'sys:user:create'" type="success" text bg @click="createUserHandler">新增</el-button>
      <el-button v-auth="'sys:user:delete'" type="danger" text bg :disabled="selectedUsers.length === 0"
                 @click="deleteBatchUserHandler">批量删除
      </el-button>
      <el-button v-auth="'sys:user:export'" type="info" text bg @click="exportExcelHandler">导出Excel</el-button>
      <el-button v-auth="'sys:user:import'" type="success" text bg @click="importExcelHandler">导入用户</el-button>
    </div>

    <el-table :data="userList" :row-key="(record) => record.userId" :default-expand-all="false" :indent="8" border
              :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectUserHandler"
              v-loading="tableLoading">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" fixed="left" width="140"
                       align="center"/>
      <el-table-column label="昵称" prop="nickName" :show-overflow-tooltip="true" width="100" align="center"/>
      <el-table-column label="类型" prop="userType" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.userType === '00'">系统用户</el-tag>
          <el-tag v-else type="warning">普通用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" width="70" align="center">
        <template #default="scope">
          <stitch-tag :tag-value="scope.row.sex" dict-type="user_gender"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="scope">
          <stitch-tag :tag-value="scope.row.status" dict-type="user_status"/>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" prop="dept.deptName" :show-overflow-tooltip="true" width="120" align="center"/>
      <el-table-column label="电话" prop="phone" :show-overflow-tooltip="true" width="130" align="center"/>
      <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" width="180" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="130" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="loginTime" label="最后登录时间" width="130" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作" width="180" min-width="160" fixed="right" align="center">
        <template #default="scope">
          <el-button v-auth="'sys:user:update'" type="primary" link
                     @click="updateUserHandler(scope.row.userId)">修改
          </el-button>
          <el-button v-auth="'sys:user:delete'" type="danger" link
                     @click="deleteUserHandler(scope.row.userId)">删除
          </el-button>
          <el-button type="primary" link>
            <el-dropdown>
              <el-button type="primary" link>更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <span v-auth="'sys:user:resetPassword'">
                    <el-dropdown-item @click="resetPassword(scope.row.userId)">重置密码</el-dropdown-item>
                  </span>
                  <span v-auth="'sys:user:unlock'">
                    <el-dropdown-item @click="unlockAccount(scope.row.userId)">
                      账户解锁
                    </el-dropdown-item>
                  </span>
                  <span v-auth="'sys:user:allocatedRole'">
                    <el-dropdown-item @click="allocatedRoles(scope.row.userId, scope.row.userName)">分配角色
                    </el-dropdown-item>
                  </span>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="queryUser.pageNum" v-model:page-size="queryUser.pageSize"
                   :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryUser.total"
                   @size-change="queryUserList" @current-change="queryUserList" class="table-pagination"/>
    <user-form ref="userFormRef" @refresh-data-list="queryUserList"/>
    <allocate-role-drawer ref="allocatedRoleDrawerRef"/>
  </el-card>
</template>
<script>
export default {
  name: 'user'
}
</script>
<script setup>
import {onActivated, onMounted, reactive, ref} from "vue";
import {deleteSysUser, getSysUserList, resetSysUserPassword, unlockUserAccount} from "@/api/perms/user.js";
import {ElMessage, ElMessageBox} from "element-plus";
import '@/assets/css/table/table.css'
import UserForm from "@/views/perms/user/user-form.vue";
import {download} from "@/api/download.js";
import AllocateRoleDrawer from "@/views/perms/user/allocate-role-drawer.vue";
import StitchTag from "@/components/Dict/stitch-tag.vue";

const userList = ref([])
const selectedUsers = ref([])
const userFormRef = ref()
const allocatedRoleDrawerRef = ref()
const queryUser = reactive({
  userName: '',
  phone: '',
  email: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const tableLoading = ref(false)


//新增用户
function createUserHandler() {
  userFormRef.value.init()
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
  })
}

//导出用户信息
function exportExcelHandler() {
  download('/sys/user/export', {...queryUser}, `user_${new Date().getTime()}.xls`)
}

//导入用户信息
function importExcelHandler() {
  ElMessage.info('开发中...')
}

//更新用户信息
function updateUserHandler(userId) {
  userFormRef.value.init(userId)
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
  })
}

// 重置密码
function resetPassword(userId) {
  resetSysUserPassword(userId).then(res => {
    ElMessage.success('重置成功')
  })
}

//解锁账户
const unlockAccount = (userId) => {
  unlockUserAccount(userId).then(() => {
    ElMessage.success('解锁成功')
  })
}

// 分配角色
function allocatedRoles(userId, userName) {
  allocatedRoleDrawerRef.value.initDrawer(userId, userName)
}

function queryUserList() {
  tableLoading.value = true
  getSysUserList(queryUser).then(res => {
    userList.value = res.list
    queryUser.total = res.total
  }).finally(() => {
    tableLoading.value = false
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
<style scoped></style>