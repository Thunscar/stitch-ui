<template>
  <el-dialog v-model="visible" :title="menuFormTitle" width="620" @close="closeForm">
    <el-form :model="menuInfo" ref="menuFormRef" label-width="100" :rules="checkRules" inline v-loading="loading">
      <el-form-item label="菜单类型">
        <el-radio-group v-model="menuInfo.menuType" :disabled="menuTypeDisabled">
          <el-radio label="M">菜单</el-radio>
          <el-radio label="B">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input placeholder="菜单名称" v-model="menuInfo.menuName" class="form-input"/>
      </el-form-item>
      <el-form-item label="菜单图标" v-if="menuInfo.menuType === 'M'" prop="icon">
        <icon-selector :icon="menuInfo.icon" @icon-selected="iconSelected" class="select-input"/>
      </el-form-item>
      <el-form-item label="菜单排序">
        <el-input type="number" placeholder="菜单排序" v-model="menuInfo.orderNum" :min="0" :max="999"
                  class="sort-input"/>
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-tree-select v-model="menuInfo.parentId" :data="selectMenuData" check-strictly class="select-input"/>
      </el-form-item>
      <el-form-item label="路由地址" v-if="menuInfo.menuType === 'M'" prop="path">
        <el-input placeholder="路由地址" v-model="menuInfo.path" class="form-input"/>
      </el-form-item>
      <el-form-item label="组件地址" v-if="menuInfo.menuType === 'M'">
        <el-input placeholder="组件地址" v-model="menuInfo.component" class="form-input"/>
      </el-form-item>
      <el-form-item label="权限标识符">
        <el-input placeholder="权限标识符" v-model="menuInfo.perms" class="form-input"/>
      </el-form-item>
      <el-form-item label="是否外链" v-if="menuInfo.menuType === 'M'">
        <el-radio-group v-model="menuInfo.isFrame">
          <el-radio label="0">非外链</el-radio>
          <el-radio label="1">外链</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否缓存" v-if="menuInfo.menuType === 'M'">
        <el-radio-group v-model="menuInfo.isCache">
          <el-radio label="1">缓存</el-radio>
          <el-radio label="0">不缓存</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否可见" v-if="menuInfo.menuType === 'M'">
        <el-radio-group v-model="menuInfo.visible">
          <el-radio label="1">可见</el-radio>
          <el-radio label="0">不可见</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单状态" v-if="menuInfo.menuType === 'M'">
        <stitch-radio-group v-model="menuInfo.status" dict-type="menu_status"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="submitMenuHandler(menuFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>

import {reactive, ref} from "vue"
import {createMenu, getMenuById, getMenuList, updateSysMenu} from "@/api/system/menu.js";
import {initSelectTree} from "@/utils/tree.js";
import '@/assets/css/form/form.css'
import {ElMessage, ElMessageBox} from "element-plus";
import IconSelector from "@/components/Icon/IconSelector.vue";
import StitchRadioGroup from "@/components/Dict/stitch-radio-group.vue";

const menuFormRef = ref()
const menuFormTitle = ref('')
const visible = ref(false)
const menuTypeDisabled = ref(false)
const menuInfo = reactive({
  menuId: null,
  menuName: '',
  parentId: 0,
  orderNum: 1,
  path: '',
  icon: '',
  component: '',
  isFrame: '0',
  isCache: '1',
  menuType: 'M',
  visible: "1",
  status: '0',
  perms: ''
})
const oldPath = ref()
const selectMenuData = ref([{
  label: '顶级',
  value: 0,
  children: null
}])
const checkRules = ref({
  menuName: {
    required: true,
    message: '菜单名称不可为空',
    trigger: ['blur']
  },
  path: {
    required: true,
    message: '菜单路由地址不可为空',
    trigger: ['blur']
  },
  icon: {
    required: true,
    message: '菜单图标不可为空',
    trigger: ['blur']
  }
})
const loading = ref(false)

const emits = defineEmits(['refreshDataList'])

//表单提交
function submitMenuHandler(menuFormRef) {
  menuFormRef.validate((valid, fields) => {
    if (valid) {
      if (menuInfo.menuId) {
        //update
        updateSysMenu(menuInfo).then(res => {
          ElMessage.success('修改成功')
          if (oldPath.value !== menuInfo.path) {
            ElMessageBox.alert('菜单路由发生改变，为避免页面无法访问请退出重新登入', '提示')
          }
          visible.value = false
          emits('refreshDataList')
        })
      } else {
        //save
        createMenu(menuInfo).then(res => {
          ElMessage.success('创建成功')
          visible.value = false
          emits('refreshDataList')
        })
      }
    }
  })
}

//关闭表单事件
function closeForm() {
  visible.value = false
  menuFormRef.value.resetFields()
  clearForm()
}

function iconSelected(icon) {
  menuInfo.icon = icon
}

//初始化菜单树选择框
function initSelectMenuData() {
  getMenuList().then(res => {
    selectMenuData.value[0].children = initSelectTree(res.data, 'menuId', 'menuName')
  })
}

//清空表单数据
function clearForm() {
  menuTypeDisabled.value = false
  menuInfo.menuId = null
  menuInfo.menuName = ''
  menuInfo.parentId = 0
  menuInfo.orderNum = 1
  menuInfo.path = ''
  menuInfo.icon = ''
  menuInfo.component = ''
  menuInfo.isFrame = '0'
  menuInfo.isCache = '1'
  menuInfo.menuType = 'M'
  menuInfo.visible = '1'
  menuInfo.status = '0'
  menuInfo.perms = ''
}

const init = (menuId) => {
  //清空表单数据
  clearForm()

  visible.value = true

  if (menuId) {
    menuFormTitle.value = '修改菜单'
    menuTypeDisabled.value = true
    loading.value = true
    getMenuById(menuId).then(res => {
      const menuData = res.data
      Object.assign(menuInfo, menuData)
      oldPath.value = menuInfo.path
    }).finally(() => loading.value = false)
  } else {
    menuFormTitle.value = '新增菜单'
  }

  initSelectMenuData()
}


defineExpose({
  init
})

</script>