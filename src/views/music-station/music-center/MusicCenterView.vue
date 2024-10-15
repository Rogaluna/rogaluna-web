<template>
  <div style="display: flex; flex-direction: column; width: 100%;">
    <div>
      <search-bar></search-bar>
    </div>
    <div style="overflow: auto;">
      <rogaluna-grid :items="items" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
        <template v-slot:default="{ item }">
          <music-grid-item :item="item" />
        </template>
      </rogaluna-grid>
    </div>
  </div>
</template>

<script>
import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import MusicGridItem from '../components/MusicGridItem.vue';
import SearchBar from '../components/SearchBar.vue';

// import NewDialog from './components/NewDialog.vue';

export default {
  components: {
    RogalunaGrid,
    MusicGridItem,
    SearchBar
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    fetchData() {
      // 获取数据
      // 根据选项获取专辑或音乐列表
    },
  }
}
</script>

<style lang="scss" scoped>

</style>