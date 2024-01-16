<template>
  <el-popover
      placement="bottom"
      width="400px"
      v-model:visible="showPopover"
      trigger="click">
    <template #reference>
      <div class="selected-info">
        <el-button text plain>
          <div v-if="props.icon">
            <svg-icon :icon-class="props.icon"/>
          </div>
          <div v-else class="select-info">
            <img class="icon-select" src="@/assets/img/select.svg" alt="">
            <span>请选择图标</span>
          </div>
        </el-button>
      </div>
    </template>

    <el-tabs class="demo-tabs" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="面性风格" name="first">
        <el-scrollbar>
          <div class="icon-view">
            <el-button class="icon-btn" text plain v-for="(item,index) in menuIcons" :key="index"
                       @click="selectedIconClick(item)">
              <svg-icon :icon-class="item" size="24"/>
            </el-button>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="彩色风格" name="second">彩色风格</el-tab-pane>
    </el-tabs>
  </el-popover>
</template>
<script setup>

import SvgIcon from "@/components/Icon/SvgIcon.vue";
import {ref} from "vue";

const showPopover = ref(false)
const props = defineProps({
  icon: {
    type: String,
    required: false
  }
})
const emit = defineEmits(['iconSelected'])

const menuIcons = ref([
  'Alarm',
  'Bag',
  'Chart-pie-alt',
  'Clock',
  'Eye',
  'Filter',
  'Flask',
  'Flask-alt',
  'Info-triangle',
  'Key',
  'Lightbulb',
  'Lightning-alt',
  'Lock',
  'Moon',
  'Notification',
  'Palette',
  'Present',
  'Pulse',
  'Shopping-basket',
  'Sun',
  'Timer',
  'Umbrella',
  'statistic',
  'category',
  'event',
  'import',
  'made-call',
  'notifications',
  'open-in-new',
  'photo-camera',
  'wifi',
  'YX1',
  'YX2',
  'YX-C',
  'YX-G',
  'YX-P',
  'home'
])

//选择
function selectedIconClick(item) {
  showPopover.value = false
  emit('iconSelected', item)
}
</script>
<style scoped>
.icon-view {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  max-height: 200px;
}

.icon-btn {
  box-sizing: border-box;
  height: 36px;
  margin-left: 12px;
}

.select-info {
  display: flex;
  line-height: 20px;
}

.icon-select {
  width: 18px;
  height: 18px;
}

.selected-info {
  width: 240px;
}
</style>

