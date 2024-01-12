<template>
  <el-drawer v-model="visible"
             :close-on-click-modal="false"
             size="60%"
             :title="title">
    <template #title>
      <span class="drawer-title">{{ title }}</span>
    </template>
    <template #default>
      <div>
        <div class="search">
          <span><el-input class="s-search-input" placeholder="用户名" v-model="queryUser.roleName"/></span>
          <span><el-input class="s-search-input" placeholder="手机号" v-model="queryUser.phone"/></span>
          <span><el-input class="s-search-input" placeholder="邮箱" v-model="queryUser.email"/></span>
          <span>
            <el-select class="s-search-input" placeholder="授予状态" v-model="conferStatus">
              <el-option :value="0" label="已授予"/>
              <el-option :value="1" label="未授予"/>
            </el-select>
          </span>
          <span style="position: relative;right: 0">
            <el-button type="primary" @click="queryUserList">搜索</el-button>
            <el-button type="default" @click="resetQueryCondition">重置</el-button>
          </span>
        </div>
        <div class="operation">
          <el-button type="primary" text bg size="default" @click="conferRole">授予角色</el-button>
          <el-button type="success" text bg size="default" @click="cancelBatchConferRole">取消授予</el-button>
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
            <el-table-column prop="createTime" label="创建时间" width="130" :show-overflow-tooltip="true"
                             align="center"/>
            <el-table-column prop="loginTime" label="最后登录时间" width="130" :show-overflow-tooltip="true"
                             align="center"/>
            <el-table-column prop="remark" label="备注" width="200" :show-overflow-tooltip="true" align="center"/>
            <el-table-column label="操作" min-width="160" fixed="right" align="center">
              <template #default="scope">
                <el-button type="primary" size="default" link @click="updateUserHandler(scope.row.userId)">取消授予
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
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import {reactive, ref} from "vue";
import {getSysUserList} from "@/api/perms/user.js";
import {ElMessage} from "element-plus";

const visible = ref(false)
const title = ref()
const userList = ref([])
const selectedUsers = ref([])
const conferStatus = ref(0)
const queryUser = reactive({
  userName: '',
  phone: '',
  email: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})

function conferRole() {

}

function cancelBatchConferRole() {

}

function queryUserList() {
  getSysUserList(queryUser).then(res => {
    if (res.code === 200 && res.list) {
      userList.value = res.list
      queryUser.total = res.total
    } else {
      ElMessage.error(res.msg)
    }
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

function initDrawer(roleId, roleName) {
  title.value = '分配用户 - ' + roleName
  queryUserList()
  visible.value = true
}

defineExpose({
  initDrawer
})
</script>
<style scoped>
.drawer-title {
  font-size: 20px;
}
</style>