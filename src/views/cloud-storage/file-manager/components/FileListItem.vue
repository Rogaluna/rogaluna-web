<template>
  <div class="explorer-item">
    <v-col cols="auto" class="d-flex align-center">
      <v-avatar size="40" class="mr-4">
        <v-img :src="item.icon"></v-img>
      </v-avatar>
    </v-col>
    <v-col class="d-flex flex-column justify-center">
      <div>{{ item.name }}</div>
      <div class="text--secondary">{{ item.date }} | {{ item.size }}</div>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      require: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.explorer-item {
  border-bottom: 1px solid #e0e0e0; /* 为项目添加底部边框 */
  padding: 10px 0; /* 调整内边距 */
  display: flex;
  align-items: center;
  width: 100%;
}
</style>