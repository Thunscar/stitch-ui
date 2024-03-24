<template>
  <el-drawer v-model="visible" :close-on-click-modal="false" size="80%" :title="title" @closed="clearDrawer"
    destroy-on-close>
    <template #default>
      <div>
        <div class="search">
          <el-input class="s-search-input" placeholder="用户名" v-model="queryUser.userName" />
          <el-input class="s-search-input" placeholder="手机号" v-model="queryUser.phone" />
          <el-input class="s-search-input" placeholder="邮箱" v-model="queryUser.email" />
          <el-select class="s-search-input" @change="onAllocateStatusChange" placeholder="分配状态"
            v-model="allocateStatus">
            <el-option :value="0" label="已分配" />
            <el-option :value="1" label="未分配" />
          </el-select>
          <el-button type="primary" @click="queryUserList">搜索</el-button>
          <el-button type="default" @click="resetQueryCondition">重置</el-button>
          <el-button type="primary" text bg v-if="allocateStatus === 1"
            :disabled="allocateStatus === 0 || selectedUsers.length === 0" @click="allocateBatchUsers">分配角色
          </el-button>
          <el-button type="success" text bg v-if="allocateStatus === 0"
            :disabled="allocateStatus === 1 || selectedUsers.length === 0" @click="cancelBatchConferRole">取消分配
          </el-button>
        </div>
        <div class="table">
          <el-table :data="userList" :row-key="(record) => record.userId" max-height="64vh" :default-expand-all="false"
            :indent="8" border :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectUserHandler"
            class="table-content">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" fixed="left" width="140"
              align="center" />
            <el-table-column label="昵称" prop="nickName" :show-overflow-tooltip="true" width="100" align="center" />
            <el-table-column label="类型" prop="userType" width="110" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.userType === '00'">系统用户</el-tag>
                <el-tag v-else type="warning">普通用户</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="sex" width="70" align="center">
              <template #default="scope">
                <stitch-tag :tag-value="scope.row.sex" dict-type="user_gender" />
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="80" align="center">
              <template #default="scope">
                <stitch-tag :tag-value="scope.row.status" dict-type="user_status" />
              </template>
            </el-table-column>
            <el-table-column label="所属部门" prop="dept.deptName" width="120" :show-overflow-tooltip="true"
              align="center" />
            <el-table-column label="电话" prop="phone" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="createTime" label="创建时间" width="130" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="loginTime" label="最后登录时间" width="130" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="操作" min-width="160" fixed="right" align="center">
              <template #default="scope">
                <el-button type="primary" v-if="allocateStatus === 1" link @click="allocateUser(scope.row.userId)">分配角色
                </el-button>
                <el-button type="primary" v-else-if="allocateStatus === 0" link
                  @click="cancelConferRole(scope.row.userId)">取消分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:current-page="queryUser.pageNum" v-model:page-size="queryUser.pageSize"
            :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="queryUser.total"
            @size-change="queryUserList" @current-change="queryUserList" class="table-pagination" />
        </div>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import { reactive, ref } from "vue";
import { allocateUsers, cancelAllocateUsers, selectAllocatedUsers, selectUnAllocatedUsers } from "@/api/perms/role.js";
import { ElMessage, ElMessageBox } from "element-plus";
import StitchTag from "@/components/Dict/stitch-tag.vue";

const visible = ref(false)
const title = ref()
const userList = ref([])
const selectedUsers = ref([])
const allocateStatus = ref(0)
const queryUser = reactive({
  userName: '',
  phone: '',
  email: '',
  roleId: '',
  roleName: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})

function selectUserHandler(rows) {
  selectedUsers.value = rows.map(row => row.userId)
}

function allocateUser(userId) {
  ElMessageBox.confirm('确认要将角色[' + queryUser.roleName + ']分配该用户?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }
  ).then(() => {
    const userRole = {
      roleId: queryUser.roleId,
      userIds: userId
    }
    allocateUsers(userRole).then(() => {
      ElMessage.success('分配成功')
      queryUserList()
    })
  })
}

const allocateBatchUsers = () => {
  ElMessageBox.confirm('确认要将角色[' + queryUser.roleName + ']分配选中的用户?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }
  ).then(() => {
    const userRole = {
      roleId: queryUser.roleId,
      userIds: selectedUsers.value.toString()
    }
    allocateUsers(userRole).then(() => {
      ElMessage.success('分配成功')
      queryUserList()
    })
  })
}


const cancelConferRole = (userId) => {
  ElMessageBox.confirm('确认要取消分配给该用户的角色[' + queryUser.roleName + ']?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }
  ).then(() => {
    const userRole = {
      roleId: queryUser.roleId,
      userIds: userId
    }
    cancelAllocateUsers(userRole).then(() => {
      ElMessage.success('取消分配成功')
      queryUserList()
    })
  })
}

const cancelBatchConferRole = () => {
  ElMessageBox.confirm('确认要取消分配选中用户的角色[' + queryUser.roleName + ']?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }
  ).then(() => {
    const userRole = {
      roleId: queryUser.roleId,
      userIds: selectedUsers.value.toString()
    }
    cancelAllocateUsers(userRole).then(() => {
      ElMessage.success('取消分配成功')
      queryUserList()
    })
  })
}

const getAllocatedUsers = () => {
  selectAllocatedUsers(queryUser).then(res => {
    userList.value = res.list
    queryUser.total = res.total
  })
}

function getUnAllocatedUsers() {
  selectUnAllocatedUsers(queryUser).then(res => {
    userList.value = res.list
    queryUser.total = res.total
  })
}

function queryUserList() {
  if (allocateStatus.value === 0) {
    getAllocatedUsers()
  } else {
    getUnAllocatedUsers()
  }
}

function resetQueryCondition() {
  queryUser.userName = ''
  queryUser.phone = ''
  queryUser.email = ''
  queryUser.pageNum = 1
  queryUser.pageSize = 10
  queryUser.total = 0
  queryUserList()
}

function initDrawer(roleId, roleName) {
  allocateStatus.value = 0
  title.value = '分配用户 - ' + roleName
  visible.value = true
  queryUser.roleId = roleId
  queryUser.roleName = roleName
  queryUserList()
}

const clearDrawer = () => {
  queryUser.userName = ''
  queryUser.phone = ''
  queryUser.email = ''
  queryUser.roleId = ''
  queryUser.roleName = ''
  queryUser.pageNum = 1
  queryUser.pageSize = 10
  queryUser.total = 0
}

function onAllocateStatusChange() {
  queryUserList()
}


defineExpose({
  initDrawer
})
</script>
<style scoped></style>