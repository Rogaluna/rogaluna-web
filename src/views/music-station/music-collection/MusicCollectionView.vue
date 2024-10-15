<template>
  <div style="display: flex; flex-direction: column; width: 100%;" ref="fileOperatePanel">
    <div>
      <search-bar></search-bar>
    </div>
    <div  style="overflow: auto;">
      <rogaluna-grid :items="items" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
        <template v-slot:default="{ item }">
          <music-grid-item :item="item" @itemClick="handleItemClick"/>
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
import MusicGridItem from '../components/MusicGridItem.vue';
import AddGridItem from '../components/AddGridItem.vue';
import SearchBar from '../components/SearchBar.vue';

import getMusicListAPI from '@/plugins/axios/api/music-station/getMusicList';
import postMusicAPI from '@/plugins/axios/api/music-station/postMusic';

export default {
  components: {
    RogalunaGrid,
    MusicGridItem,
    AddGridItem,
    SearchBar
  },
  inject: ['eventBus'],
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchData(false, 0)
  },
  methods: {
    fetchData(isAlbum, opt, param = "") {
      /* 获取数据
      根据选项获取专辑或音乐列表
      异步数据获取 */

      /**
       * @param {bool} isAlbum 是否检索专辑
       * @param {int} opt 检索选项
       * @param {string} param 检索参数
       * 
       * 0：随机检索，获取一般情况下的列表
       * 1：检索私有存储
       */

      this.$rogalunaWidgets.showLoading(this.$refs.fileOperatePanel, (stopLoading) => {

        if (isAlbum) {
          // 检索专辑
          stopLoading();
        } else {
          // 检索音乐
          getMusicListAPI(opt, param)
            .then(response => {
              this.items = response.data;
              console.log(`this.items`, this.items);
              stopLoading();
            })
        }

        // getFileListAPI(this.eventBus.sharedState.currentFolderUid) // 当前文件夹 uid 是空的，则默认会获取到根目录
        //   .then(response => { // 获取的回复将包括文件列表和当前目录的uid
        //     if (this.eventBus.sharedState.rootUid == 'root') {
        //       // 根目录未初始化，初始化根目录
        //       this.eventBus.sharedState.rootUid = response.currentFolderUid;
        //     }
        //     this.eventBus.sharedState.currentFolderUid = response.currentFolderUid; // 将当前目录 uid 更新到 bus 中
        //     this.eventBus.sharedState.path = this.eventBus.formatPathToArray(response.path); // 设置格式化的路径
        //     this.items = response.data;
        //     stopLoading();
        //   })
      })
    },
    handleItemClick(item) {
      console.log(`this.eventBus`, this.eventBus);
      this.eventBus.setCurrentMusic(item);
    },
    newAlbum() {
      // 导入音乐
      // 将声音文件传入服务器，进行识别
      this.$rogalunaWidgets.showFileSelector({ accept: 'audio/*', multiple: true }, (files) => {
        for (const file of files) {
          postMusicAPI(file)
            .then(response => {
              console.log(response);
              this.fetchData();
            });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>