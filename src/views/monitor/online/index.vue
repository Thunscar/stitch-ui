<template>
  <el-card>
    <div class="search">
      <el-input class="s-search-input" placeholder="用户名" v-model="queryInfo.userName"/>
      <el-input class="s-search-input" placeholder="登录IP" v-model="queryInfo.ipaddr"/>
      <el-button type="primary" @click="queryOnlineUserList">搜索</el-button>
      <el-button type="default" @click="resetQueryCondition">重置</el-button>
    </div>
    <el-table :data="userList" :row-key="(record) => record.userId" :default-expand-all="false" :indent="8" border
              :header-cell-style="{ 'text-align': 'center' }" v-loading="tableLoading">
      <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="部门名称" prop="deptName" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="登录IP" prop="ipaddr" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="登录地址" prop="location" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="登录时间" prop="loginTime" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作" width="120" min-width="120" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="offline(scope.row.sessionId)">强制下线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="queryInfo.pageNum" v-model:page-size="queryInfo.pageSize"
                   :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryInfo.total"
                   @size-change="queryOnlineUserList" @current-change="currentChangeHandler" class="table-pagination"/>
  </el-card>
</template>
<script>
export default {
  name: 'online'
}
</script>
<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import '@/assets/css/table/table.css'
import {getOnlineUserList, userOffline} from '@/api/monitor/online.js'
import {ElMessage} from "element-plus";

const userList = ref([])
const totalList = ref([])
const queryInfo = reactive({
  userName: '',
  ipaddr: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const tableLoading = ref(false)

//查询数据
const queryOnlineUserList = () => {
  tableLoading.value = true
  getOnlineUserList(queryInfo).then(res => {
    totalList.value = res.list
    queryInfo.total = res.total
  }).finally(() => {
    tableLoading.value = false
  })
}

//重置查询条件
const resetQueryCondition = () => {
  queryInfo.userName = ''
  queryInfo.ipaddr = ''
  queryInfo.pageNum = 1
  queryInfo.pageSize = 10
  queryInfo.total = 0
  queryOnlineUserList()
}

//用户下线
const offline = (token) => {
  userOffline(token).then(() => {
    ElMessage.success('强制下线成功')
    queryOnlineUserList()
  })
}

watch([queryInfo, totalList], () => {
  const start = (queryInfo.pageNum - 1) * queryInfo.pageSize
  const end = start + queryInfo.pageSize
  userList.value = totalList.value.slice(start, end)
})

onMounted(() => {
  queryOnlineUserList()
})
</script>
<style scoped>

</style>