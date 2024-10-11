<template>
  <div style="display: flex; flex-direction: column; width: 100%;">
    <div>
      <search-bar></search-bar>
    </div>
    <div  style="overflow: auto;">
      <rogaluna-grid :items="items" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
        <template v-slot:default="{ item }">
          <album-grid-item :album="item" />
        </template>
        <template #start>
          <add-grid-item text="导入" @click="newAlbum"></add-grid-item>
        </template>
      </rogaluna-grid>
    </div>
  </div>
</template>

<script>
import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import AlbumGridItem from '../components/AlbumGridItem.vue';
import AddGridItem from '../components/AddGridItem.vue';
import SearchBar from '../components/SearchBar.vue';

// import NewDialog from './components/NewDialog.vue';

export default {
  components: {
    RogalunaGrid,
    AlbumGridItem,
    AddGridItem,
    SearchBar
  },
  data() {
    return {
      items: [
        { title: 'Album 1', cover: 'cover1.jpg', artist: 'Artist 1' },
      ],
    };
  },
  methods: {
    fetchData() {
      // 获取数据
      // 根据选项获取专辑或音乐列表
    },
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