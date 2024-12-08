<template>
  <div class="music-player-bar">
    <v-divider />
    <div class="nav-main">
      <!-- 左侧：歌曲信息和操作按钮 -->
      <div class="nav-left">
        <v-img
          :src="albumCover"
          max-width="50"
          max-height="50"
          class="music-cover mr-2"
          @error="handleImageError"
        ></v-img>
        <div>
          <div class="song-name" align="left">
            <rogaluna-scroll-text :text="eventBus.currentMusic.title"/>
          </div>
          <div class="artist-info" align="left">
            <rogaluna-scroll-text :text="eventBus.currentMusic.artist"/>
          </div>
        </div>
      </div>

      <!-- 中间：播放控制按钮和进度条 -->
      <div class="nav-center">
        <!-- 控制按钮部分 -->
        <div class="control-buttons">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu top transition="slide-y-transition" offset-x>
                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                  <svg class="__icon__es control-button"
                    aria-hidden="true"
                    icon
                    v-bind="Object.assign({}, attrs, menuAttrs)"
                    v-on="Object.assign({}, on, menuOn)">
                    <use :xlink:href="getIcon(eventBus.playerSetting.mode)"></use>
                  </svg>
                </template>

                <v-list>
                  <v-list-item 
                    v-for="(label, mode) in $store.state.globalAttributes.playModeTypeMapping" 
                    :key="mode" 
                    @click="switchPlayMode(mode)"
                  >
                    <v-list-item-icon>
                      <svg class="__icon__s control-button"
                        aria-hidden="true"
                        icon>
                        <use :xlink:href="getIcon(mode)"></use>
                      </svg>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ label }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <span>{{ convertType(eventBus.playerSetting.mode) }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <svg class="__icon__es control-button"
                aria-hidden="true"
                icon
                v-bind="attrs"
                v-on="on"
                @click="previousTrack">
                <use xlink:href="#rogaluna-icon-previous"></use>
              </svg>
            </template>
            <span>上一首</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <svg class="__icon__es control-button"
                aria-hidden="true"
                icon
                v-bind="attrs"
                v-on="on"
                @click="playPause">
                <use :xlink:href="eventBus.playerSetting.isPlaying ? '#rogaluna-icon-play' : '#rogaluna-icon-timeout'"></use>
              </svg>
            </template>
            <span>{{ eventBus.playerSetting.isPlaying ? '暂停' : '播放' }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <svg class="__icon__es control-button"
                aria-hidden="true"
                icon
                v-bind="attrs"
                v-on="on"
                @click="nextTrack">
                <use xlink:href="#rogaluna-icon-nextsong"></use>
              </svg>
            </template>
            <span>下一首</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                top
                offset-x
              >
                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                  <svg class="__icon__es control-button"
                    aria-hidden="true"
                    icon
                    v-bind="Object.assign({}, attrs, menuAttrs)"
                    v-on="Object.assign({}, on, menuOn)"
                  >
                    <use xlink:href="#rogaluna-icon-soundsize"></use>
                  </svg>
                </template>

                <v-card width="70" class="pa-2">
                  <v-slider
                    v-model="eventBus.playerSetting.volume"
                    vertical
                    min="0"
                    max="100"
                    thumb-color="primary"
                    track-color="accent"
                    @input="updateVolume"
                  ></v-slider>
                  <div class="text-center white--text">
                    {{ eventBus.playerSetting.volume }}%
                  </div>
                </v-card>
              </v-menu>
            </template>
            <span>音量</span>
          </v-tooltip>
        </div>
        <!-- 进度条部分 -->
        <div class="progress-bar">
          <span class="time-span">{{ eventBus.formatTime(eventBus.currentMusic.currentDuration) }}</span>
          <v-slider
            v-model="eventBus.currentMusic.currentDuration"
            :max="eventBus.currentMusic.totalDuration"
            class="mx-2"
            hide-details
            @start="onSliderStart"
            @change="onSliderEnd"
          ></v-slider>
          <span class="time-span">{{ eventBus.formatTime(eventBus.currentMusic.totalDuration) }}</span>
        </div>
      </div>

      <!-- 右侧：其他操作按钮 -->
      <div class="nav-right">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <svg class="__icon__es nav-right-button"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on"
              @click="showPlaySetting">
              <use xlink:href="#rogaluna-icon-masterctrl"></use>
            </svg>
          </template>
          <span>播放设置</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <svg class="__icon__es nav-right-button"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on"
              @click="showPlayList">
              <use xlink:href="#rogaluna-icon-musiclist"></use>
            </svg>
          </template>
          <span>播放队列</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import PlaySettingDialog from './PlaySettingDialog.vue';

import RogalunaScrollText from '@/plugins/rogaluna-widgets/widgets/sundries/RogalunaScrollText.vue';

export default {
  name: "MusicPlayerBar",
  inject: ['eventBus'],
  components: {
    RogalunaScrollText,
  },
  data() {
    return {
      albumCover: require('@/assets/defaultAlbumCover.svg'),
      playModeStr: '随机播放',
      audioElement: null,
      isSeeking: false,
    };
  },
  watch: {
  },
  mounted() {
    this.handleLoadNewMusic = this.loadNewMusic.bind(this);

    // 加载新音乐事件
    this.eventBus.$on('load-new-music', this.handleLoadNewMusic);
  },
  methods: {
    handleImageError() {
      this.albumCover = require('@/assets/defaultAlbumCover.svg'); // 当封面加载失败时，使用默认图片
    },

    loadNewMusic() {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement.removeEventListener('canplay', this.onCanPlay);
        this.audioElement.removeEventListener('timeupdate', this.onTimeUpdate);
        this.audioElement.removeEventListener('loadedmetadata', this.onLoadedMetadata);
        this.audioElement.removeEventListener('ended', this.onEnded);
        this.audioElement = null;
      }

      this.audioElement = new Audio(`/api/musicStation/getMusic?id=${this.eventBus.currentMusic.uid}`);
      this.albumCover = `/api/musicStation/getCover?id=${this.eventBus.currentMusic.uid}`,

      this.audioElement.pause();
      this.audioElement.currentTime = 0;

      // 添加事件监听器
      this.audioElement.addEventListener('canplay', this.onCanPlay);
      this.audioElement.addEventListener('timeupdate', this.onTimeUpdate);
      this.audioElement.addEventListener('loadedmetadata', this.onLoadedMetadata);
      this.audioElement.addEventListener('ended', this.onEnded);

      this.audioElement.load();
    },
    playPause() {
      this.eventBus.playerSetting.isPlaying = !this.eventBus.playerSetting.isPlaying;
      if (this.eventBus.playerSetting.isPlaying) {
        this.audioElement.play()
      } else {
        this.audioElement.pause()
      }
    },
    onCanPlay() {
      this.eventBus.playerSetting.isPlaying = true;
      this.audioElement.play();
      this.updateVolume();
    },
    onTimeUpdate() {
      if (!this.isSeeking) {
        this.eventBus.currentMusic.currentDuration = Math.floor(
          this.audioElement.currentTime
        );
      }
    },
    onLoadedMetadata() {
      this.eventBus.currentMusic.totalDuration = Math.floor(
        this.audioElement.duration
      );
    },
    onEnded() {
      console.log("音乐播放完毕");
      // this.cleanupAudio();
      
      if (this.eventBus.playerSetting.mode == 'loop') {
        this.eventBus.currentMusic.currentDuration = 0;
      } else {
        this.nextTrack();
      }
    },
    // 当用户开始拖动时，设置 isSeeking 为 true
    onSliderStart() {
      this.isSeeking = true;
    },
    // 当用户停止拖动时，更新音乐时间并重置 isSeeking
    onSliderEnd() {
      this.isSeeking = false;
      this.audioElement.currentTime = this.eventBus.currentMusic.currentDuration;
    },
    updateVolume() {
      if (this.audioElement) {
        this.audioElement.volume = this.eventBus.playerSetting.volume / 100; // 将滑块值转换为 0-1 范围
        console.log(`this.audioElement.volume`, this.audioElement.volume);
      }
    },
    previousTrack() {
      this.eventBus.playPrevious();
    },
    nextTrack() {
      this.eventBus.playNext();
    },


    switchPlayMode(mode) {
      this.eventBus.setPlayerMode(mode);
    },
    convertType(type) {
      // 类型转换中文
      return this.$store.state.globalAttributes.playModeTypeMapping[type] || type;
    },
    getIcon(type) {
      // 如果找到图标，返回图标；否则返回默认图标
      return `#${this.$store.state.globalAttributes.playModeIconTypeMapping[type] || this.$store.state.globalAttributes.playModeIconTypeMapping['random']}`;
    },

    showPlaySetting() {
      this.$rogalunaWidgets.showDialog(
        PlaySettingDialog,
        {},
        {}
      )
    },
    showPlayList() {
      this.eventBus.playList.visible = !this.eventBus.playList.visible;
    }

  },
  beforeDestroy() {
    // 移除事件监听器
    this.eventBus.$off('load-new-music', this.handleLoadNewMusic);
    
    // 停止并移除 audio 元素
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement.removeEventListener('canplay', this.onCanPlay);
      this.audioElement.removeEventListener('timeupdate', this.onTimeUpdate);
      this.audioElement.removeEventListener('loadedmetadata', this.onLoadedMetadata);
      this.audioElement.removeEventListener('ended', this.onEnded);
      this.audioElement = null;
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  fill: var(--light-background-color);
}

.music-player-bar {
  height: 90px;
  background-color: transparent;
  display: flex;
  flex-direction: column;

  .nav-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 20px 0 20px;

    .music-cover {
      border-radius: 10%;
    }
  }

  .nav-left {
    flex-basis: 15%;
    display: flex;
    justify-content: left;
    align-items: center;

    .song-name {
      color: var(--light-background-color);

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // 设置容器最大宽度为200
      width: 200px; 

    }

    .artist-info {
      font-size: 12px;
      color: var(--split-color);

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // 设置容器最大宽度为200
      width: 200px; 
    }
  }

  .nav-right {
    height: 100%;
    flex-basis: 15%;
    display: flex;
    justify-content: right;
    align-items: center;

    .nav-right-button {
      cursor: pointer;
      font-size: 32px;
      margin: 0 20px;

      &:hover {
        fill: var(--primary-color)
      }
    }
  }

  .nav-center {
    flex-basis: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .progress-bar {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;

      .time-span {
        font-size: 12px;
        color: var(--split-color);
      }
    }

    .control-buttons {
      display: flex;
      justify-content: center;
      align-items: center;

      .control-button {
        cursor: pointer;
        font-size: 32px;
        margin: 0 40px;

        &:hover {
          fill: var(--primary-color);
        }
      }
    }
  }
}
</style>
