// event-bus.js
import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    sharedState: {
      isVisible: true,
      dir: [],
      currentFolderUid: '',
      isUploadPanelVisible: false,
      isDownloadPanelVisible: false,
      historyDir: [], // 历史记录，用于前进后退，需要做出大小限制
      maxHistorySize: 10, // 设置历史记录的最大长度
      historyIndex: -1 // 当前历史记录的索引，-1 表示没有进行历史操作
    }
  },
  computed: {
    formattedDir() {
      let newPath = this.sharedState.dir.map(b => b.text).join('/');

      // 如果path是"root"或者以"root/"开头，去掉它
      if (newPath === 'root') {
        newPath = ''; // 将path设置为空字符串
      } else if (newPath && newPath.startsWith('root/')) {
        newPath = newPath.substring(5); // 去掉前缀"root/"
      }

      return newPath;
    }
  },
  created() {
    // 自动调用init函数进行初始化
    this.init();
  },
  methods: {
    init() {
      // 初始化时，清空历史记录并设置初始目录
      this.clearHistory();
      this.setDir([{ text: "root" }]);
    },
    setDir(newDir) {
      this.sharedState.dir = newDir;
      // 每次设置新目录时，添加到历史记录
      this.addHistory(newDir);
    },
    pushDir(DirSeg) {
      this.sharedState.dir.push(DirSeg)
      this.setDir(this.sharedState.dir);
    },
    addHistory(newDir) {
      // 如果当前历史记录索引不是最后一个，说明存在未重做的操作，需要截断
      if (this.sharedState.historyIndex < this.sharedState.historyDir.length - 1) {
        this.sharedState.historyDir = this.sharedState.historyDir.slice(0, this.sharedState.historyIndex + 1);
      }

      // 添加新的目录到历史记录中
      this.sharedState.historyDir.push([...newDir]);

      // 限制历史记录的大小
      if (this.sharedState.historyDir.length > this.sharedState.maxHistorySize) {
        this.sharedState.historyDir.shift(); // 移除最早的记录
      } else {
        this.sharedState.historyIndex++;
      }
    },
    undo() {
      if (this.sharedState.historyIndex > 0) {
        this.sharedState.historyIndex--;
        this.sharedState.dir = [...this.sharedState.historyDir[this.sharedState.historyIndex]];
      }
    },
    redo() {
      if (this.sharedState.historyIndex < this.sharedState.historyDir.length - 1) {
        this.sharedState.historyIndex++;
        this.sharedState.dir = [...this.sharedState.historyDir[this.sharedState.historyIndex]];
      }
    },
    clearHistory() {
      this.sharedState.historyDir = [];
      this.sharedState.historyIndex = -1;
    }
  }
});
