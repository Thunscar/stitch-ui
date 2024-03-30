<template>
  <el-card>
    <div class="search">
      <el-input class="s-search-input" placeholder="用户名" v-model="queryInfo.userName"/>
      <el-input class="s-search-input" placeholder="登录IP" v-model="queryInfo.ipaddr"/>
      <el-input class="s-search-input" placeholder="登录地址" v-model="queryInfo.loginLocation"/>
      <el-button type="primary" @click="queryInfoList">搜索</el-button>
      <el-button type="default" @click="resetQueryCondition">重置</el-button>
      <el-button v-auth="'sys:loginlog:export'" type="info" text bg @click="exportExcel">导出Excel</el-button>
    </div>
    <el-table :data="infoList" :row-key="(record) => record.infoId" :default-expand-all="false" :indent="8" border
              :header-cell-style="{ 'text-align': 'center' }" v-loading="tableLoading">
      <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" fixed="left" align="center"/>
      <el-table-column label="登录IP" prop="ipaddr" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="登录地址" prop="loginLocation" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="消息" prop="msg" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="登录时间" prop="loginTime" :show-overflow-tooltip="true" align="center"/>
    </el-table>
    <el-pagination v-model:current-page="queryInfo.pageNum" v-model:page-size="queryInfo.pageSize"
                   :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryInfo.total"
                   @size-change="queryInfoList" @current-change="queryInfoList" class="table-pagination"/>
  </el-card>
</template>
<script setup>
import {queryLoginInfoList} from '@/api/monitor/logininfo';
import '@/assets/css/table/table.css'
import {onMounted, reactive, ref} from "vue";
import {download} from "@/api/download.js";

const infoList = ref([])
const queryInfo = reactive({
  userName: '',
  ipaddr: '',
  loginLocation: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const tableLoading = ref(false)

//查询数据
const queryInfoList = () => {
  tableLoading.value = true
  queryLoginInfoList(queryInfo).then(res => {
    infoList.value = res.list
    queryInfo.total = res.total
  }).finally(() => {
    tableLoading.value = false
  })
}

//重置查询条件
const resetQueryCondition = () => {
  queryInfo.userName = ''
  queryInfo.ipaddr = ''
  queryInfo.loginLocation = ''
  queryInfo.pageNum = 1
  queryInfo.pageSize = 10
  queryInfo.total = 0
  queryInfoList()
}

const exportExcel = () => {
  download('/sys/loginlog/export', {...queryInfo}, `login_log_${new Date().getTime()}.xls`)
}

onMounted(() => {
  queryInfoList()
})

</script>
<style scoped></style>