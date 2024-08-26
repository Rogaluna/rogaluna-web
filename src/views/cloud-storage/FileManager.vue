<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <header-tool-bar></header-tool-bar>
    <file-operate-panel style="flex-grow: 1;"></file-operate-panel>
    <download-panel/>
    <upload-panel/>
  </div>
</template>

<script>
import { EventBus } from './bus/fileManager.js';

import HeaderToolBar from './file-manager/components/HeaderToolBar.vue'
import FileOperatePanel from './file-manager/components/FileOperatePanel.vue';

import DownloadPanel from './file-manager/components/DownloadPanel.vue';
import UploadPanel from './file-manager/components/UploadPanel.vue';

export default {
  provide() {
    return {
      eventBus: EventBus
    };
  },
  components: { 
    HeaderToolBar,
    FileOperatePanel,
    DownloadPanel,
    UploadPanel
  },
  computed: {

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