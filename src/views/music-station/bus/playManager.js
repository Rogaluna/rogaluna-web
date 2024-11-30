import Vue from 'vue';

/**
 * @class EventBus
 * 用于管理应用音乐台的事件总线
 */
const EventBus = new Vue({
  data: {
    currentMusic: { // 当前播放音乐
      uid: '',
      title: '♪ ♪ ♪ ♪',
      artist: '♫ ♫ ♫ ♫',

      totalDuration: 0,      // 总时长 (秒)
      currentDuration: 0,    // 当前进度 (秒)
    },
    playerSetting: {
      mode: 'random', // 播放模式
      volume: 50,      // 声音大小
      isPlaying: false,    // 播放状态
    },
    playList: { // 播放列表
      musicList: [], // 音乐列表
      currentIndex: -1, // 当前播放索引
      indexRandomList: [] // 以音乐列表的数量生成的随机索引排布列表
    } 
  },
  methods: {
    /**
     * 设置当前播放列表
     * @param {Array} list 音乐列表
     * @param {String} opt 设置，“set” 表示覆盖列表， “append” 表示添加到当前列表
     */
    setPlayList(list, opt = "set") {
      switch(opt) {
        case "set": 
          {
            this.playList.musicList = list;
          }
        break;
        case "append":
          {
            this.playList.musicList.push(...list);
          }
        break;
        default: 
          return ;
      }
      
      // 生成索引随机数列表
      // 创建索引数组 [0, 1, 2, ..., n-1]
      const array = Array.from({ length: this.playList.musicList.length }, (_, i) => i);

      // Fisher-Yates 洗牌算法
      for (let i = array.length - 1; i > 0; i--) {
        // 生成一个范围在 [0, i] 的伪随机索引
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // 交换元素
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
      }

      this.playList.indexRandomList = array;

      // 设置当前音乐列表完毕后，发送一个事件
      this.$emit('load-music-list');
    },

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

      // 设置当前音乐在播放列表中索引
      this.playList.currentIndex = this.playList.musicList.findIndex(item => item.uid === this.currentMusic.uid);
      console.log(`this.playList.currentIndex`, this.playList.currentIndex);

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
     * 播放上一首
     * 
     */
    playPrevious() {
      switch (this.playerSetting.mode) {
        case 'random':
          {
            const len = this.playList.indexRandomList.length;
            const index = this.playList.indexRandomList.findIndex(i => i === this.playList.currentIndex)
            const preMusic = this.playList.musicList[this.playList.indexRandomList[(((index - 1) % len) + len) % len]];
            this.setCurrentMusic(preMusic);
          }
        break;
        case 'loop':
        case 'single':
          {
            const len = this.playList.musicList.length;
            const preMusic = this.playList.musicList[(((this.playList.currentIndex - 1) % len) + len) % len];
            this.setCurrentMusic(preMusic);
          }
        break;
      
        default:
          break;
      }
    },

    /**
     * 播放下一首
     * 
     */
    playNext() {
      switch (this.playerSetting.mode) {
        case 'random':
          {
            const len = this.playList.indexRandomList.length;
            const index = this.playList.indexRandomList.findIndex(i => i === this.playList.currentIndex)
            const nextMusic = this.playList.musicList[this.playList.indexRandomList[(((index + 1) % len) + len) % len]];
            this.setCurrentMusic(nextMusic);
          }
        break;
        case 'loop':
        case 'single':
          {
            const len = this.playList.musicList.length;
            const nextMusic = this.playList.musicList[(((this.playList.currentIndex + 1) % len) + len) % len];
            this.setCurrentMusic(nextMusic);
          }
        break;
      
        default:
          break;
      }
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