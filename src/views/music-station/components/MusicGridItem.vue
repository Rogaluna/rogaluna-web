<template>
  <div class="item-grid-item" @click="handleItemClick">
    <v-img
      :src="albumCover"
      alt="Album Cover"
      class="item-cover"
      @error="handleImageError"
    ></v-img>
    <div class="item-title">
      <rogaluna-scroll-text>{{ item.music_name }}</rogaluna-scroll-text>
    </div>
    <div class="artist-name">
      <rogaluna-scroll-text>{{ item.artist }}</rogaluna-scroll-text>
    </div>
  </div>
</template>

<script>
import RogalunaScrollText from '@/plugins/rogaluna-widgets/widgets/sundries/RogalunaScrollText.vue';

export default {
  components: {
    RogalunaScrollText
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      albumCover: `/api/musicStation/cover?album=${this.item.album_id}` // Initially use album cover
    };
  },
  methods: {
    handleImageError() {
      this.albumCover = require('@/assets/defaultAlbumCover.svg'); // Use default image when cover fails to load
    },
    handleItemClick() {
      this.$emit('itemClick', this.item);
    }
  }
};
</script>

<style lang="scss" scoped>
.item-grid-item {
  width: 170px;
  height: 300px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5%;

  &:hover {
    background-color: rgba(var(--light-background-color-rgb), 0.5);
  }
}

.item-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border: 1px solid;
  border-radius: 5%;
  border-color: var(--split-color);
}

.item-title {
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  flex-grow: 1;
  padding: 10px 0;

  color: var(--light-background-color);
}

.artist-name {
  width: 100%;
  font-size: 12px;
  color: var(--split-color);
  text-align: right;
  overflow: hidden;
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>