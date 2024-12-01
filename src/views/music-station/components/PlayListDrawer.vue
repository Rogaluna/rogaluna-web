<template>
  <div
    v-show="eventBus.playList.visible"
    class="play-list-container"
    style="width: 300px;"
  >
    <v-toolbar flat width="300">
      <v-toolbar-title>播放列表</v-toolbar-title>
      <!-- <v-spacer></v-spacer>
      <v-btn icon @click="closeDrawer">
        <svg class="__icon__s"
          aria-hidden="true"
          icon>
          <use xlink:href="#rogaluna-icon-delete"></use>
        </svg>
      </v-btn> -->
    </v-toolbar>

    <rogaluna-list :items="eventBus.playList.musicList" :itemStyle="{ padding: 0, borderWidth: 0 }">
      <template #item="{ item, index }">
        <div
          class="music-item"
          :class="{ 'dark-item': index % 2 === 0, 'light-item': index % 2 === 1, 'selected-item': eventBus.playList.currentIndex === index }"
          @mouseenter="handleHover(index)"
          @mouseleave="handleLeave"
          @click="playMusic(item)"
        >
          <!-- 图片 -->
          <v-img
            :src="errorImages[item.uid] ? require('@/assets/defaultAlbumCover.svg') : `/api/musicStation/cover?album=${item.uid}`"
            width="50"
            height="50"
            class="mr-2"
            @error="handleImageError(item.uid)"
          ></v-img>

          <!-- 两行文字 -->
          <div class="music-info">
            <rogaluna-scroll-text align="left" :scroll="index === hoveredIndex" class="music-title" :text="item.music_name"/>
            <rogaluna-scroll-text align="left" :scroll="index === hoveredIndex" class="music-artist" :text="item.artist"/>
          </div>
        </div>
      </template>
    </rogaluna-list>
  </div>
</template>

<script>
import RogalunaList from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaList.vue';
import RogalunaScrollText from '@/plugins/rogaluna-widgets/widgets/sundries/RogalunaScrollText.vue';

export default {
  inject: ['eventBus'],
  components: {
    RogalunaList,
    RogalunaScrollText
  },
  props: {
    
  },
  data() {
    return {
      hoveredIndex: -1,
      errorImages: {}, // 存储封面加载错误的 UID
    };
  },
  methods: {
    handleHover(index) {
      this.hoveredIndex = index;
    },
    handleLeave() {
      this.hoveredIndex = -1;
    },
    closeDrawer() {
      this.eventBus.playList.visible = false;
    },
    playMusic(item) {
      this.eventBus.setCurrentMusic(item)
    },
    handleImageError(uid) {
      this.$set(this.errorImages, uid, true);
    },
  },
};
</script>

<style lang="scss" scoped>

.play-list-container {

  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: var(--split-color);

  background-color: rgba($color: var(--light-background-color-rgb), $alpha: 0.1);;

  ::v-deep .v-toolbar__content {
    background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.1);
    color: var(--light-background-color);
  }

  .music-item {
    display: flex;
    align-items: center;
    padding: 10px;
    width: 100%;

    &.dark-item {
      background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.3); // 深色背景
    }

    &.light-item {
      background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.2); // 浅色背景
    }

    .music-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;

      .music-title {
        font-size: 14px;
        font-weight: bold;
        color: var(--primary-color);
      }

      .music-artist {
        font-size: 12px;
        color: #bbbbbb;
      }
    }

    &:hover {
      cursor: pointer;
      background: linear-gradient(to right, var(--light-background-color) 0%, var(--light-background-color) 0%, rgba($color: var(--deep-background-color-rgb), $alpha: 0.3) 5%), /* 横向渐变 */
    }

    &.selected-item {
      background: linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) 0%, rgba($color: var(--light-background-color-rgb), $alpha: 0.15) 5%)


    }
  }
}

</style>
