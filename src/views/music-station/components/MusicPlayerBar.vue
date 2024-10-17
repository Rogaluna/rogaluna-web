<template>
  <div class="music-player-bar">
    <v-divider />
    <div class="nav-main">
      <!-- 左侧：歌曲信息和操作按钮 -->
      <div class="nav-left">
        <v-img
          src="https://via.placeholder.com/50"
          max-width="50"
          max-height="50"
          class="mr-2"
        ></v-img>
        <div>
          <div class="song-name" align="left">{{ eventBus.currentMusic.title }}</div>
          <div class="artist-info" align="left">{{ eventBus.currentMusic.artist }}</div>
        </div>
      </div>

      <!-- 中间：播放控制按钮和进度条 -->
      <div class="nav-center">
        <!-- 控制按钮部分 -->
        <div class="control-buttons">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu top transition="slide-y-transition" offset-y>
                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                  <svg class="__icon__es control-button"
                    aria-hidden="true"
                    icon
                    v-bind="Object.assign({}, attrs, menuAttrs)"
                    v-on="Object.assign({}, on, menuOn)"
                    @click="switchPlayMode">
                    <use xlink:href="#rogaluna-icon-random"></use>
                  </svg>
                </template>

                <v-list>
                  <v-list-item @click="playMode = 'random'">
                    <v-list-item-title>随机播放</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="playMode = 'repeat'">
                    <v-list-item-title>循环播放</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="playMode = 'single'">
                    <v-list-item-title>单曲循环</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <span>{{ playModeStr }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <svg class="__icon__es control-button"
                aria-hidden="true"
                icon
                v-bind="attrs"
                v-on="on"
                @click="switchPlayMode">
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
                @click="switchPlayMode">
                <use xlink:href="#rogaluna-icon-nextsong"></use>
              </svg>
            </template>
            <span>下一首</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                top
                transition="scale-transition"
                offset-y
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
                    v-model="volume"
                    vertical
                    min="0"
                    max="100"
                    thumb-color="primary"
                    track-color="accent"
                  ></v-slider>
                  <div class="text-center white--text">
                    {{ volume }}%
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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <svg class="__icon__es nav-right-button"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on">
              <use xlink:href="#rogaluna-icon-musiclist"></use>
            </svg>
          </template>
          <span>播放列表</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <svg class="__icon__es nav-right-button"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on">
              <use xlink:href="#rogaluna-icon-masterctrl"></use>
            </svg>
          </template>
          <span>播放设置</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_HTTP_URL } from '@/plugins/axios/configs/baseUrl';

export default {
  name: "MusicPlayerBar",
  inject: ['eventBus'],
  data() {
    return {
      volume: 0,
      playModeStr: '随机播放',
      audioElement: null,
      isSeeking: false,
    };
  },
  watch: {
  },
  mounted() {
    // 加载新音乐事件
    this.eventBus.$on('load-new-music', () => {
      this.loadNewMusic();
    });
  },
  methods: {
    loadNewMusic() {
      if (!this.audioElement) {
        this.audioElement = new Audio();
      }
      this.audioElement.src = BASE_HTTP_URL + "/api/musicStation/getMusic?musicId=" + this.eventBus.currentMusic.uid; // uid 指示了目标音乐，通过它构建src

      this.audioElement.addEventListener("timeupdate", () => {
        if (!this.isSeeking) {
          this.eventBus.currentMusic.currentDuration = Math.floor(
            this.audioElement.currentTime
          );
        }
      });

      this.audioElement.addEventListener("loadedmetadata", () => {
        this.eventBus.currentMusic.totalDuration = Math.floor(
          this.audioElement.duration
        );
      });

      this.audioElement.load();
      this.eventBus.playerSetting.isPlaying = true;
      this.audioElement.play();
    },
    playPause() {
      this.eventBus.playerSetting.isPlaying = !this.eventBus.playerSetting.isPlaying;
      if (this.eventBus.playerSetting.isPlaying) {
        this.audioElement.play()
      } else {
        this.audioElement.pause()
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
    previousTrack() {
      console.log("上一曲");
    },
    nextTrack() {
      console.log("下一曲");
    },
    switchPlayMode() {
      console.log("随机播放");
    },
  },
};
</script>

<style lang="scss" scoped>
.music-player-bar {
  height: 90px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

.nav-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px 0 20px;
}

.nav-left {
  flex-basis: 15%;
  display: flex;
  justify-content: left;
  align-items: center;

  .song-name {
    color: var(--light-background-color);
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

.artist-info {
  font-size: 12px;
  color: var(--split-color);
}

svg {
  fill: var(--light-background-color);
}
</style>
