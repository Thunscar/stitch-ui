<template>
  <el-popover
      placement="bottom"
      width="560px"
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

    <el-tabs class="demo-tabs" tab-position="left" model-value="facial">
      <el-tab-pane label="面性风格" name="facial">
        <el-scrollbar>
          <div class="icon-view">
            <el-button class="icon-btn" text plain v-for="(item,index) in facialIcons" :key="index"
                       @click="selectedIconClick(item)">
              <svg-icon :icon-class="item" size="30"/>
            </el-button>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="彩色风格" name="color">
        <el-scrollbar>
          <div class="icon-view">
            <el-button class="icon-btn" text plain v-for="(item,index) in colorIcons" :key="index"
                       @click="selectedIconClick(item)">
              <svg-icon :icon-class="item" size="30"/>
            </el-button>
          </div>
        </el-scrollbar>
      </el-tab-pane>
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

const facialIcons = ref([
  'f-URL',
  'f-save',
  'f-delete1',
  'f-delete2',
  'f-like',
  'f-map',
  'f-finish',
  'f-left-move',
  'f-sort',
  'f-beautify',
  'f-doc',
  'f-doc1',
  'f-doc-download',
  'f-time',
  'f-location',
  'f-file',
  'f-locate',
  'f-component',
  'f-email',
  'f-config',
  'f-link-file',
  'f-lock2',
  'f-icon-kfckfc',
  'f-robot',
  'f-work',
  'f-client',
  'f-monitor',
  'f-wechat',
  'f-message',
  'f-quality',
  'f-business',
  'f-knowledge',
  'f-chart',
  'f-phone',
  'f-photo',
  'f-library',
  'f-survey',
  'f-folder',
  'f-online',
  'f-clue',
  'f-question',
  'f-error',
  'f-warning',
  'f-notice',
  'f-left',
  'f-up',
  'f-org',
  'f-voice',
  'f-play',
  'f-pause',
  'f-music',
  'f-clue-pool',
  'f-Alarm',
  'f-Bag',
  'f-Chart-pie-alt',
  'f-Clock',
  'f-Eye',
  'f-Filter',
  'f-Flask-alt',
  'f-Info-triangle',
  'f-Flask',
  'f-Key',
  'f-Lightbulb',
  'f-Lightning-alt',
  'f-Lock',
  'f-Moon',
  'f-Notification',
  'f-Palette',
  'f-Present',
  'f-Pulse',
  'f-Shopping-basket',
  'f-Sun',
  'f-Timer',
  'f-Umbrella',
  'f-statistic',
  'f-category',
  'f-event',
  'f-import',
  'f-made-call',
  'f-notifications',
  'f-open-in-new',
  'f-photo-camera',
  'f-wifi',
  'f-YX1',
  'f-YX2',
  'f-YX-C',
  'f-YX-G',
  'f-YX-P',
  'f-home'
])
const colorIcons = ref([
  'c-save',
  'c-insurance',
  'c-share',
  'c-delete',
  'c-pause',
  'c-safe',
  'c-finish',
  'c-locate',
  'c-custom',
  'c-application',
  'c-scan',
  'c-register',
  'c-play',
  'c-collect',
  'c-data',
  'c-data',
  'c-tag',
  'c-monitor',
  'c-photo',
  'c-gift',
  'c-Medicine',
  'c-setting',
  'c-shopping',
  'c-zizhi',
  'c-notice',
  'c-email',
  'c-purse',
  'c-color',
  'c-home',
  'c-ai',
  'c-task',
  'c-insurance2',
  'c-card',
  'c-share2',
  'c-work',
  'c-card1',
  'c-find',
  'c-shopping1',
  'c-recycle',
  'c-foundation',
  'c-custom1',
  'c-help',
  'c-Clock',
  'c-Prize',
  'c-recommand',
  'c-search',
  'c-collect1',
  'c-activity',
  'c-msg',
  'c-like1',
  'c-manager',
  'c-Blind-box',
  'c-photo1',
  'c-bonus',
  'c-score',
  'c-signin',
  'c-like2',
  'c-Red-packet',
  'c-draft',
  'c-collect2',
  'c-order',
  'c-record',
  'c-remark',
  'c-purse1',
  'c-near'
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
  height: 40px;
  margin-left: 14px;
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

