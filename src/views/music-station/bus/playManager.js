import Vue from 'vue';

/**
 * @class EventBus
 * 用于管理应用音乐台的事件总线
 */
const EventBus = new Vue({
  data: {
    currentMusic: { // 当前播放音乐
      uid: '',
      title: 'R.I.P.',
      artist: 'eicateve',

      totalDuration: 0,      // 总时长 (秒)
      currentDuration: 0,    // 当前进度 (秒)
    },
    playerSetting: {
      mode: 'random', // 播放模式
      volume: 50,      // 声音大小
      isPlaying: false,    // 播放状态
    },
    playList: [ // 播放列表

    ]
  },
  methods: {
    /**
     * 设置当前播放的音乐
     * @param {Object} music 音乐对象
     */
    setCurrentMusic(music) {
      this.currentMusic.uid = music.uid;
      this.currentMusic.title = music.music_name;
      this.currentMusic.artist = music.artist;
      this.setTotalDuration(music.duration);
      this.updateCurrentDuration(0);

      // 设置当前音乐完毕后，发送一个事件，播放器将会从网络获取音乐数据并自动播放
      this.$emit('load-new-music');
    },

    /**
     * 更新播放进度 (以秒为单位)
     * @param {Number} currentDuration 当前播放进度（秒）
     */
    updateCurrentDuration(currentDuration) {
      this.currentMusic.currentDuration = currentDuration;
    },

    /**
     * 设置总时长 (以秒为单位)
     * @param {Number} totalDuration 音乐总时长（秒）
     */
    setTotalDuration(totalDuration) {
      this.currentMusic.totalDuration = totalDuration;
    },

    /**
     * 格式化秒数为 "0:00" 的时间格式
     * @param {Number} seconds 时间，单位为秒
     * @returns {String} 格式化后的时间字符串
     */
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },

    /**
     * 切换播放模式
     * @param {String} mode 新的播放模式 (e.g., 'random', 'loop', 'single')
     */
    setPlayerMode(mode) {
      this.playerSetting.mode = mode;
    },

    /**
     * 调整音量
     * @param {Number} sound 新的音量大小 (0-100)
     */
    setVolume(sound) {
      this.playerSetting.sound = sound;
    },

    /**
     * 切换播放状态 (播放/暂停)
     * @param {Boolean} state 播放状态 (true = 播放, false = 暂停)
     */
    togglePlayState(state) {
      this.playerSetting.isPlaying = state;
    },

    /**
     * 添加音乐到播放列表
     * @param {Object} music 音乐对象
     */
    addToPlayList(music) {
      this.playList.push(music);
    },

    /**
     * 从播放列表移除音乐
     * @param {String} uid 音乐的唯一ID
     */
    removeFromPlayList(uid) {
      this.playList = this.playList.filter(music => music.uid !== uid);
    },

    /**
     * 清空播放列表
     */
    clearPlayList() {
      this.playList = [];
    },

    /**
     * 获取当前播放的音乐信息
     * @returns {Object} 当前音乐对象
     */
    getCurrentMusic() {
      return this.currentMusic;
    },

    /**
     * 获取播放列表
     * @returns {Array} 当前播放列表
     */
    getPlayList() {
      return this.playList;
    }
  }
})

export default EventBus; 