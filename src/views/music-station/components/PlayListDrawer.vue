<template>
  <v-navigation-drawer
    v-model="visible"
    app
    right
    temporary
    width="300"
  >
    <v-toolbar flat>
      <v-toolbar-title>播放列表</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDrawer">
        <svg class="__icon__s"
          aria-hidden="true"
          icon>
          <use xlink:href="#rogaluna-icon-delete"></use>
        </svg>
      </v-btn>
    </v-toolbar>

    <rogaluna-list :items="musicList" :itemStyle="{ padding: 0, borderWidth: 0 }">
      <template #item="{ item, index }">
        <div
          class="music-item"
          :class="{ 'dark-item': index % 2 === 0, 'light-item': index % 2 === 1, 'selected-item': selectedIndex === index }"
          @mouseenter="handleHover(index)"
          @mouseleave="handleLeave"
          @click="playMusic(item, index)"
        >
          <!-- 图片 -->
          <v-img :src="item.cover" alt="Cover" class="music-cover" contain />

          <!-- 两行文字 -->
          <div class="music-info">
            <rogaluna-scroll-text align="left" :scroll="index === hoveredIndex" class="music-title">{{ item.music_name }}</rogaluna-scroll-text>
            <rogaluna-scroll-text align="left" :scroll="index === hoveredIndex" class="music-artist">{{ item.artist }}</rogaluna-scroll-text>
          </div>
        </div>
      </template>
    </rogaluna-list>
  </v-navigation-drawer>
</template>

<script>
import RogalunaList from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaList.vue';
import RogalunaScrollText from '@/plugins/rogaluna-widgets/widgets/sundries/RogalunaScrollText.vue';

export default {
  components: {
    RogalunaList,
    RogalunaScrollText
  },
  props: {
    musicList: {
      type: Array,
      // required: true
      default: [
        {
          cover: 'image-url', // 图片地址
          music_name: 'La\'qryma of the Wasteland (Extended Mix)', // 标题
          artist: 'DJ Noriken' // 艺术家
        },
        {
          cover: 'image-url', // 图片地址
          title: 'La\'',
          artist: 'DJ Noriken' // 艺术家
        },
        {
          cover: 'image-url', // 图片地址
          title: 'La\'qryma of the Wasteland (Extended Mix)', // 标题
          artist: 'DJ Noriken' // 艺术家
        },
        {
          cover: 'image-url', // 图片地址
          title: 'La\'qryma of the Wasteland (Extended Mix)', // 标题
          artist: 'DJ Noriken' // 艺术家
        },
      ]
    },
    selectedIndex: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      visible: true, // 控制对话框的显示
      hoveredIndex: -1,
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
      this.$emit("close");
    },
    playMusic(item, index) {
      this.selectedIndex = index;
      this.$emit("play", item);
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-navigation-drawer__content {
  background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.7);

  .v-toolbar__content {
    background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.8);
    color: var(--light-background-color);
  }

}

.music-item {
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;

  &.dark-item {
    background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.2); // 深色背景
  }

  &.light-item {
    background-color: rgba($color: var(--deep-background-color-rgb), $alpha: 0.1); // 浅色背景
  }

  .music-cover {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    margin-right: 10px;
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
    background: linear-gradient(to right, var(--light-background-color) 0%, var(--light-background-color) 0%, transparent 5%), /* 横向渐变 */
  }

  &.selected-item {
    background: linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) 0%, transparent 5%)


  }
}

</style>
