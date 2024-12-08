<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <header-tool-bar></header-tool-bar>
    <file-operate-panel style="flex-grow: 1;"></file-operate-panel>
    <upload-panel/>
  </div>
</template>

<script>
import { EventBus } from '../bus/fileManager.js';

import HeaderToolBar from './components/HeaderToolBar.vue'
import FileOperatePanel from './components/FileOperatePanel.vue';

import UploadPanel from './components/UploadPanel.vue';

export default {
  provide() {
    return {
      eventBus: EventBus
    };
  },
  components: { 
    HeaderToolBar,
    FileOperatePanel,
    UploadPanel
  },
  computed: {

  },
  watch: {
    'eventBus.sharedState.isUploadPanelVisible': {
      handler(newVal, oldVal) {
        
      },
      deep: true, // 使得监听器可以检测数组或对象的变化
    }
  },
  data() {
    return {
      breadcrumbs: [],
    }
  }
}
</script>

<style lang="scss" scoped>

</style>