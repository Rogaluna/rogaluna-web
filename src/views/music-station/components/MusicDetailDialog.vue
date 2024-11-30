<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">音乐详细信息</v-card-title>

      <v-card-text>
        <!-- 音乐信息显示 -->
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>音乐名称</v-list-item-title>
              <v-list-item-subtitle>{{ initData.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>艺术家</v-list-item-title>
              <v-list-item-subtitle>{{ initData.artist }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>专辑</v-list-item-title>
              <v-list-item-subtitle>{{ initData.album }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>时长</v-list-item-title>
              <v-list-item-subtitle>{{ formatDuration(initData.duration) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>流派</v-list-item-title>
              <v-list-item-subtitle>{{ initData.genre }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    initData: {
      type: Object,
      required: true,
      default: () => ({
        name: '',
        artist: '',
        album: '',
        duration: 0,
        genre: ''
      })
    }
  },
  data() {
    return {
      visible: true, // 控制对话框的显示
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.v-list-item-title {
  font-weight: bold;
}
</style>
