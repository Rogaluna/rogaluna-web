<template>
  <div class="item-grid-item" @click="handleItemClick">
    <v-img
      :src="albumCover"
      alt="Album Cover"
      class="item-cover"
      @error="handleImageError"
    ></v-img>
    <div class="item-title">
      <span>{{ item.music_name }}</span>
    </div>
    <div class="artist-name">
      {{ item.artist }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumGridItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      albumCover: '/api/musicStation/cover?album=' + this.item.album_id // Initially use album cover
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
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.item-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border: 1px solid;
  border-radius: 5%;
  border-color: gray;
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

  color: white;
}

.artist-name {
  width: 100%;
  font-size: 12px;
  color: gray;
  text-align: right;
  overflow: hidden;
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>