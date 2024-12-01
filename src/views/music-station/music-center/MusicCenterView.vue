<template>
  <div style="width: 100%; display: flex; flex-direction: column;">
    <div>
      <v-banner
        single-line
        :sticky="false"
      >
        <svg class="__icon__m"
          aria-hidden="true"
          icon>
          <use xlink:href="#rogaluna-icon-tushuguan"></use>
        </svg>
        <span class="title-text">&nbsp;&nbsp;音乐台</span>

        <template v-slot:actions>
          <search-bar></search-bar>
        </template>
      </v-banner>
    </div>
    <rogaluna-div 
    :menuItems="menus.panel"
    ref="operatePanel"
    style="display: flex; flex-direction: column; width: 100%; flex-grow: 1; min-height: 0;">
      <div style="overflow: auto;">
        <rogaluna-grid :items="items" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
          <template v-slot:default="{ item }">
            <rogaluna-div
            :menuItems="menus.music"
            @rclick="handleItemRightClick(item)">
              <music-grid-item :item="item" @itemClick="handleItemClick"/>
            </rogaluna-div>
          </template>
        </rogaluna-grid>
      </div>
    </rogaluna-div>
  </div>
</template>

<script>
import RogalunaDiv from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaDiv.vue';
import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import MusicGridItem from '../components/MusicGridItem.vue';
import SearchBar from '../components/SearchBar.vue';

import MusicDetailDialog from '../components/MusicDetailDialog.vue';

import getMusicListAPI from '@/plugins/axios/api/music-station/getMusicList';

export default {
  components: {
    RogalunaDiv,
    RogalunaGrid,
    MusicGridItem,
    SearchBar
  },
  inject: ['eventBus'],
  data() {
    return {
      menus: {
        contextObject: {},
        panel: [
          {
            label: '刷新',
            icon: '#rogaluna-icon-timeout',
            value: '1',
            handler: () => {
              
            }
          },
        ],
        music: [
          {
            label: '播放',
            icon: '#rogaluna-icon-timeout',
            value: '1',
            handler: () => {
              this.handleItemClick(this.menus.contextObject);
            }
          },
          {
            label: '详细信息',
            icon: '#rogaluna-icon-file',
            value: '2',
            handler: () => {
              this.showMusicDetail(this.menus.contextObject);
            }
          }
        ]
      },
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

       this.$rogalunaWidgets.showLoading(this.$refs.operatePanel, (stopLoading) => {

        if (isAlbum) {
          // 检索专辑
          stopLoading();
        } else {
          // 检索音乐
          getMusicListAPI(opt, param)
            .then(response => {
              this.items = response.data;
              stopLoading();
            })
        }
      })
    },
    handleItemRightClick(item) {
      this.menus.contextObject = item;
    },
    handleItemClick(item) {
      // 设置播放列表，处于音乐台中，因此设置为默认播放列表，添加形式为 append
      this.eventBus.setPlayList([item], 'append');

      // 设置当前音乐
      this.eventBus.setCurrentMusic(item);
    },
    showMusicDetail(item) {
      console.log(`item`, item);
      // 显示音乐信息
      this.$rogalunaWidgets.showDialog(
        MusicDetailDialog,
        {
          initData: {
            name: 'Song Name',
            artist: 'Artist Name',
            album: 'Album Name',
            duration: 245, // in seconds
            genre: 'Genre Name'
          }
        },
        {} 
      )
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-banner__text {
  text-align: left;

  .title-text {
    background: linear-gradient(
      to right, 
      var(--light-background-color),
      var(--primary-color)
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    font-size: 24px;
  }
}
</style>