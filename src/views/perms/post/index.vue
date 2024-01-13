<template>
  <div>
    <div class="search">
      <span><el-input class="s-search-input" placeholder="岗位编码" v-model="queryPost.postCode"/></span>
      <span><el-input class="s-search-input" placeholder="岗位名称" v-model="queryPost.postName"/></span>
      <span>
        <el-select class="s-search-input" placeholder="状态" v-model="queryPost.status">
          <el-option value="0" label="正常"/>
          <el-option value="1" label="停用"/>
        </el-select>
      </span>
      <span style="position: relative;right: 0">
        <el-button type="primary" @click="queryPostList">搜索</el-button>
        <el-button type="default" @click="resetQueryCondition">重置</el-button>
      </span>
    </div>
    <div class="operation">
      <el-button type="primary" size="default" @click="createPostHandler">新增</el-button>
      <el-button type="danger" size="default" :disabled="selectedPostIds.length === 0"
                 @click="deleteBatchPostHandler">批量删除
      </el-button>
      <el-button type="info" size="default" @click="exportExcelHandler">导出Excel</el-button>
    </div>
    <div class="table">
      <el-table :data="postList"
                :row-key="(record) => record.postId"
                max-height="64vh"
                :default-expand-all="false"
                :indent="8"
                border
                :header-cell-style="{'text-align':'center'}"
                @selection-change="selectPostHandler"
                class="table-content">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column label="岗位编码" prop="postCode" :show-overflow-tooltip="true" width="180" fixed="left"
                         align="center"/>
        <el-table-column label="岗位名称" prop="postName" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="排序" prop="postSort" :show-overflow-tooltip="true" width="80" align="center"/>
        <el-table-column label="岗位状态" prop="status" width="85" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === '0'">正常</el-tag>
            <el-tag v-else-if="scope.row.status === '1'" type="warning">停用</el-tag>
            <el-tag v-else type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center"/>
        <el-table-column label="操作" width="120" min-width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" size="default" link @click="updatePostHandler(scope.row.postId)">修改
            </el-button>
            <el-button type="danger" size="default" link @click="deletePostHandler(scope.row.postId)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="queryPost.pageNum"
          v-model:page-size="queryPost.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryPost.total"
          @size-change="queryPostList"
          @current-change="queryPostList"
          class="table-pagination"
      />
    </div>
    <post_form ref="postFormRef" @refresh-data-list="queryPostList"/>
  </div>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import '@/assets/css/table/table.css'
import {deleteBatchSysPost, querySysPostList} from "@/api/perms/post.js";
import {ElMessage, ElMessageBox} from "element-plus";
import Post_form from "@/views/perms/post/post_form.vue";
import {download} from "@/api/download.js";

const postFormRef = ref()
const postList = ref([])
const selectedPostIds = ref([])
const queryPost = reactive({
  postCode: '',
  postName: '',
  postSort: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
  total: 0
})

function createPostHandler() {
  postFormRef.value.init()
}

function deleteBatchPostHandler() {
  ElMessageBox.confirm('确认删除选中的岗位?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBatchSysPost(selectedPostIds.value).then(res => {
      ElMessage.success('删除成功')
      queryPostList()
    })
  }).catch(() => {
  })
}

function exportExcelHandler() {
  download('/sys/post/export', {...queryPost}, `post_${new Date().getTime()}.xlsx`)
}

function selectPostHandler(rows) {
  selectedPostIds.value = rows.map(row => row.postId)
}

function updatePostHandler(postId) {
  postFormRef.value.init(postId)
}

function deletePostHandler(postId) {
  ElMessageBox.confirm('确认删除该岗位?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBatchSysPost(postId).then(res => {
      ElMessage.success('删除成功')
      queryPostList()
    })
  }).catch(() => {
  })
}

function resetQueryCondition() {
  queryPost.postCode = ''
  queryPost.postName = ''
  queryPost.postSort = ''
  queryPost.status = ''
  queryPost.pageNum = 1
  queryPost.pageSize = 10
  queryPost.total = 0
  queryPostList()
}

function queryPostList() {
  querySysPostList(queryPost).then(res => {
    postList.value = res.list
    queryPost.total = res.total
  })
}

onMounted(() => {
  queryPostList()
})

</script>
<style scoped>
</style>