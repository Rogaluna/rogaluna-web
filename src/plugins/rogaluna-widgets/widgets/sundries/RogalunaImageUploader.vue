<template>
  <v-container class="text-center">
    <!-- 图片展示区域，点击触发外部事件 -->
    <v-card
      class="d-flex align-center justify-center"
      height="200"
      width="200"
      elevation="3"
      @click="onImageClick"
    >
      <!-- 图片加载区域 -->
      <v-img
        :src="localSrc"
        v-if="isImageLoaded"
        cover
        height="100%"
        width="100%"
        @error="onImageError"
      ></v-img>
      <v-icon v-else size="48">mdi-image</v-icon>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "", // 外部传入图片源
    },
  },
  data() {
    return {
      localSrc: this.src,
      isImageLoaded: true,
    };
  },
  watch: {
    src() {
      this.localSrc = this.src;
      this.isImageLoaded = true;
    }
  },
  methods: {
    // 点击图片，通知父组件
    onImageClick() {
      this.$emit("click"); // 向外部触发点击事件
    },
    // 图片加载失败回调
    onImageError() {
      this.isImageLoaded = false;
    },
  },
};
</script>

<style scoped>
.v-card {
  cursor: pointer; /* 鼠标悬停时显示手型 */
}
</style>
