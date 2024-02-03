<template>
  <div>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="参数名称" v-model="queryConfig.configName"/></span>
      <span><el-input class="s-search-input" placeholder="参数键名" v-model="queryConfig.configKey"/></span>
      <span>
        <el-select class="s-search-input" placeholder="是否内置" v-model="queryConfig.configType">
          <el-option value="Y" label="内置"/>
          <el-option value="N" label="非内置"/>
        </el-select>
      </span>
      <span>
        <el-button type="primary" @click="queryConfigList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
        <el-button type="primary" text bg @click="createConfigHandler">新增</el-button>
        <el-button type="danger" text bg :disabled="selectedConfigs.length === 0"
                   @click="deleteBatchConfigHandler">批量删除
        </el-button>
        <el-button type="info" text bg @click="exportExcelHandler">导出Excel</el-button>
        <el-button type="success" text bg @click="refreshCacheHandler">刷新缓存</el-button>
      </span>
    </div>
    <div class="table">
      <el-table :data="configList"
                :row-key="(record) => record.configId"
                max-height="64vh"
                :default-expand-all="false"
                :indent="8"
                border
                :header-cell-style="{'text-align':'center'}"
                @selection-change="selectConfigHandler"
                class="table-content">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column label="参数名称" prop="configName" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="参数键名" prop="configKey" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="参数值" prop="configValue" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="是否内置" prop="configType" width="85" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.configType === 'Y'">内置</el-tag>
            <el-tag v-else-if="scope.row.configType === 'N'" type="warning">非内置</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="createUser" label="创建人员" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="操作" width="120" min-width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="updateConfigHandler(scope.row.configId)">修改
            </el-button>
            <el-button type="danger" link @click="deleteConfigHandler(scope.row.configId)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="queryConfig.pageNum"
          v-model:page-size="queryConfig.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryConfig.total"
          @size-change="queryConfigList"
          @current-change="queryConfigList"
          class="table-pagination"
      />
    </div>
    <config-form ref="configFormRef" @refresh-data-list="queryConfigList"/>
  </div>
</template>
<script>
export default {
  name: 'config'
}
</script>
<script setup>
import {deleteConfig, getConfigList, refreshConfigCache} from "@/api/system/config.js";
import {onActivated, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import '@/assets/css/table/table.css'
import {download} from "@/api/download.js";
import ConfigForm from "@/views/system/config/config-form.vue";

const configList = ref([])
const selectedConfigs = ref([])
const queryConfig = reactive({
  configName: '',
  configKey: '',
  configType: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const configFormRef = ref()

//重置查询条件
function resetQueryCondition() {
  queryConfig.configName = ''
  queryConfig.configKey = ''
  queryConfig.configType = ''
  queryConfig.pageNum = 1
  queryConfig.pageSize = 10
  queryConfig.total = 0
  queryConfigList()
}

//获取参数数据
function queryConfigList() {
  getConfigList(queryConfig).then(res => {
    configList.value = res.list
    queryConfig.total = res.total
  })
}

//选中复选框事件
function selectConfigHandler(rows) {
  selectedConfigs.value = rows.map(row => row.configId)
}

//新增参数事件
function createConfigHandler() {
  configFormRef.value.init()
}

//更新参数事件
function updateConfigHandler(configId) {
  configFormRef.value.init(configId)
}

//删除参数事件
function deleteConfigHandler(configId) {
  ElMessageBox.confirm('确认删除该参数?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteConfig(configId).then(res => {
      ElMessage.success('删除成功')
      queryConfigList()
    })
  }).catch(() => {
  })
}

//批量删除事件
function deleteBatchConfigHandler() {
  ElMessageBox.confirm('确认删除选中的参数?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteConfig(selectedConfigs.value).then(res => {
      ElMessage.success('删除成功')
      queryConfigList()
    })
  }).catch(() => {
  })
}

//导出Excel
function exportExcelHandler() {
  download('/sys/config/export', {...queryConfig}, `config_${new Date().getTime()}.xlsx`)
}

//刷新缓存
function refreshCacheHandler() {
  refreshConfigCache().then(res => {
    ElMessage.success("刷新缓存成功")
  })
}

onMounted(() => {
  queryConfigList()
})

</script>
<style scoped>
</style>