<template>
  <div class="album-grid-item">
    <v-img
      :src="albumCover"
      alt="Album Cover"
      class="album-cover"
      @error="handleImageError"
    ></v-img>
    <div class="album-title">
      <span>{{ album.title }}</span>
    </div>
    <div class="artist-name">
      {{ album.artist }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumGridItem',
  props: {
    album: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      albumCover: this.album.cover // Initially use album cover
    };
  },
  methods: {
    handleImageError() {
      this.albumCover = require('@/assets/defaultAlbumCover.svg'); // Use default image when cover fails to load
    }
  }
};
</script>

<style lang="scss" scoped>
.album-grid-item {
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

.album-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border: 1px solid;
  border-radius: 5%;
  border-color: gray;
}

.album-title {
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
}
</style>