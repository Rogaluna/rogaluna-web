<template>
  <div>
    <rogaluna-grid :items="albums" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
      <template v-slot:default="{ item }">
        <album-grid-item :album="item" />
      </template>
      <template #end>
        <add-grid-item text="导入" @click="newAlbum"></add-grid-item>
      </template>
    </rogaluna-grid>
  </div>
</template>

<script>
import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import AlbumGridItem from '../components/AlbumGridItem.vue';
import AddGridItem from '../components/AddGridItem.vue';

// import NewDialog from './components/NewDialog.vue';

export default {
  components: {
    RogalunaGrid,
    AlbumGridItem,
    AddGridItem
  },
  data() {
    return {
      albums: [
        { title: 'Album 1', cover: 'cover1.jpg', artist: 'Artist 1' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
        { title: 'Album 2', cover: 'cover2.jpg', artist: 'Artist 2' },
      ],
    };
  },
  methods: {
    newAlbum() {
      // 导入音乐
      // 将声音文件传入服务器，进行识别
      this.$rogalunaWidgets.showFileSelector();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>