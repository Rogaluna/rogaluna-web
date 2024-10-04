<template>
  <v-navigation-drawer
    absolute
    right
    v-show="eventBus.sharedState.isUploadPanelVisible"
  >
    <template v-slot:prepend>
      <v-list-item>
        <v-list-item-title align="left">上传列表</v-list-item-title>
        <!-- 添加关闭图标按钮 -->
        <v-btn icon @click="closeDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list dense>
      <!-- 添加上传item -->
      <v-list-item
        v-for="item in items"
        :key="item.title"
      >
        <v-list-item-content>
          <!-- 第一行：上传名称 -->
          <v-list-item-title align="left">{{ item.title }}</v-list-item-title>
          
          <!-- 第二行：进度条 -->
          <v-progress-linear
            :value="item.progress"
            height="5"
            class="mt-2"
          ></v-progress-linear>
          
          <!-- 第三行：上传大小/总文件大小 -->
          <v-list-item-subtitle class="text-right mt-2">
            {{ item.size }} / {{ item.totalSize }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  inject: ['eventBus'],
  data () {
    return {
      items: [
        // 示例数据
        { title: '文件1.mp4', progress: 50, size: '5MB', totalSize: '10MB' },
        { title: '文件2.mp3', progress: 70, size: '7MB', totalSize: '10MB' },
      ],
    }
  },
  methods: {
    closeDrawer() {
      this.eventBus.sharedState.isUploadPanelVisible = false;
      console.log(`this.eventBus.sharedState.isUploadPanelVisible`, this.eventBus.sharedState.isUploadPanelVisible);
    },
  },
}
</script>

<style lang="scss" scoped>
.v-list-item {
  display: flex;
  align-items: center;
}
</style>
