<template>
  <el-card>
    <div class="search">
      <el-input class="s-search-input" placeholder="标题" v-model="queryInfo.title"/>
      <el-input class="s-search-input" placeholder="操作人" v-model="queryInfo.operateUser"/>
      <el-input class="s-search-input" placeholder="调用方法" v-model="queryInfo.method"/>
      <el-input class="s-search-input" placeholder="操作参数" v-model="queryInfo.operateParam"/>
      <el-select class="s-search-input" placeholder="状态" v-model="queryInfo.status">
        <el-option :value="0" label="成功"/>
        <el-option :value="1" label="失败"/>
      </el-select>
      <el-button type="primary" @click="queryOperLogList">搜索</el-button>
      <el-button type="default" @click="resetQueryCondition">重置</el-button>
      <el-button v-auth="'sys:operlog:export'" type="info" text bg @click="exportExcel">导出Excel</el-button>
    </div>
    <el-table :data="logList" :row-key="(record) => record.logId" :flexible="true" :indent="8" border
              :header-cell-style="{ 'text-align': 'center' }">
      <el-table-column label="标题" prop="title" width="160" :show-overflow-tooltip="true" fixed="left" align="center"/>
      <el-table-column label="业务类型" prop="businessType" width="90" :show-overflow-tooltip="true" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.businessType === '1'">新增</el-tag>
          <el-tag v-else-if="scope.row.businessType === '2'">修改</el-tag>
          <el-tag v-else-if="scope.row.businessType === '3'">删除</el-tag>
          <el-tag v-else-if="scope.row.businessType === '4'">导入</el-tag>
          <el-tag v-else-if="scope.row.businessType === '5'">导出</el-tag>
          <el-tag v-else>其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="调用方法" prop="method" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="请求方式" prop="requestMethod" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作角色" prop="operateType" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.operateType === '1'">后台用户</el-tag>
          <el-tag v-else-if="scope.row.operateType === '2'">移动用户</el-tag>
          <el-tag v-else>其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operateUser" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="Ip地址" prop="operateIp" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作地址" prop="operateLocation" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="部门名称" prop="deptName" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作路径" prop="operateUrl" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="操作参数" prop="operateParam" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="返回结果" prop="jsonResult" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="错误信息" prop="errorMsg" width="90" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'">成功</el-tag>
          <el-tag v-else-if="scope.row.status === '1'">失败</el-tag>
          <el-tag v-else>其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="operateTime" width="130" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="执行耗时(ms)" prop="costTime" width="130" :show-overflow-tooltip="true" align="center"/>
    </el-table>
    <el-pagination v-model:current-page="queryInfo.pageNum" v-model:page-size="queryInfo.pageSize"
                   :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryInfo.total"
                   @size-change="queryOperLogList" @current-change="queryOperLogList" class="table-pagination"/>
  </el-card>
</template>
<script setup>
import {queryOperateLogList} from '@/api/monitor/operlog'
import '@/assets/css/table/table.css'
import {onMounted, reactive, ref} from "vue";
import {download} from "@/api/download.js";

const logList = ref([])
const queryInfo = reactive({
  title: '',
  operateUser: '',
  operateParam: '',
  method: '',
  status: null,
  pageNum: 1,
  pageSize: 10,
  total: 0
})

//加载数据
const queryOperLogList = () => {
  queryOperateLogList(queryInfo).then(res => {
    logList.value = res.list
    queryInfo.total = res.total
  })
}

//重置查询条件
const resetQueryCondition = () => {
  queryInfo.title = ''
  queryInfo.operateUser = ''
  queryInfo.operateParam = ''
  queryInfo.method = ''
  queryInfo.status = null
  queryInfo.pageNum = 1
  queryInfo.pageSize = 10
  queryInfo.total = 0
  queryOperLogList()
}

//导出Excel
const exportExcel = () => {
  download('/sys/operlog/export', { ...queryInfo }, `operate_log_${new Date().getTime()}.xls`)
}

onMounted(() => {
  queryOperLogList()
})

</script>
<style scoped></style>