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
        <span class="title-text">&nbsp;&nbsp;收藏品</span>

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
          <template #start>
            <rogaluna-div
            :menuItems="menus.import">
              <add-grid-item text="导入" @click="newAlbum"></add-grid-item>
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
import AddGridItem from '../components/AddGridItem.vue';
import SearchBar from '../components/SearchBar.vue';

import MusicDetailDialog from '../components/MusicDetailDialog.vue';

import getMusicListAPI from '@/plugins/axios/api/music-station/getMusicList';
import postMusicAPI from '@/plugins/axios/api/music-station/postMusic';
import getAlbumsInfoAPI from '@/plugins/axios/api/music-station/getAlbumsInfo';

export default {
  components: {
    RogalunaDiv,
    RogalunaGrid,
    MusicGridItem,
    AddGridItem,
    SearchBar
  },
  inject: ['eventBus'],
  data() {
    return {
      menus: {
        contextObject: {},
        panel: [
          {
            label: '导入',
            icon: '#rogaluna-icon-timeout',
            value: '1',
            handler: () => {
              
            }
          },
        ],
        import: [
          {
            label: '导入',
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
    this.fetchData(false, 1, "#");
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
      // 设置播放列表，处于收藏中，因此设置为收藏播放列表，添加形式为 set
      this.eventBus.setPlayList(this.items, 'set');

      // 设置当前音乐
      this.eventBus.setCurrentMusic(item);
    },
    showMusicDetail(item) {
      console.log(`item`, item);
      // 显示音乐信息

      this.$rogalunaWidgets.showLoading(null, async (stopLoading) => {
        
        const response = await getAlbumsInfoAPI(item.album_id);
        const responseData = response.data[0];

        this.$rogalunaWidgets.showDialog(
          MusicDetailDialog,
          {
            initData: {
              name: item.music_name,
              artist: item.artist,
              album: responseData.album_name,
              duration: item.duration, // in seconds
              genre: responseData.genre
            }
          },
          {} 
        )

        stopLoading();
      })
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