import Vue from 'vue';

/**
 * @class EventBus
 * 用于管理当前文件夹UID、历史记录、导航操作的事件总线
 */
export const EventBus = new Vue({
  data: {
    sharedState: {
      isVisible: true,
      isUploadPanelVisible: false,

      uploadList: [],

      /**
       * @property {Array} path - 当前文件夹的格式化展平路径
       */
      path: [],

      /**
       * @property {string} currentFolderUid - 当前文件夹的UID
       */
      currentFolderUid: '',

      /**
       * @property {string} rootUid - 根文件夹的UID
       */
      rootUid: 'root',

      /**
       * @property {Array<string>} historyDir - 文件夹UID的历史记录
       */
      historyDir: [],

      /**
       * @property {number} maxHistorySize - 最大历史记录长度
       */
      maxHistorySize: 10,

      /**
       * @property {number} historyIndex - 当前历史记录的索引
       * -1 表示没有进行历史操作
       */
      historyIndex: -1 
    }
  },
  created() {
    // 自动调用init函数进行初始化
    this.init();
  },
  methods: {
    /**
     * 初始化，清空历史记录并设置初始目录
     */
    init() {
      this.clearHistory();
      this.setDir("");
    },

    /**
     * 格式化字符串数组，将其转化为以 '/' 分割的路径字符串
     * @param {Array<Object>} objectArray - 对象数组，每个对象包含 text 属性，例如 [{ text: 'root' }, { text: 'test' }]
     * @returns {string} - 返回一个以 '/' 分割的路径字符串
     */
    formatArrayToPath(objectArray) {
      // 使用 JavaScript 的 join 方法将数组元素以 '/' 拼接成字符串
      return objectArray.map(item => item.text).join('/');
    },

    /**
     * 格式化路径，将形如 "root/test" 的字符串转化为以 '/' 分割的字符串数组
     * @param {string} path - 要格式化的路径字符串，例如 "root/test"
     * @returns {Array<Object>} - 返回一个对象数组，每个对象包含 text 属性
     */
    formatPathToArray(path) {
      // 使用 JavaScript 的 split 方法将路径按照 '/' 分割成数组
      return path.split('\\').map(item => ({ text: item }));
    },

    /**
     * 设置当前目录并添加到历史记录中。
     * @param {string} newFolderUid - 新的文件夹UID
     */
    setDir(newFolderUid) {
      this.sharedState.currentFolderUid = newFolderUid;
      this.addHistory(newFolderUid);
    },

    /**
     * 添加新的文件夹UID到历史记录中。
     * 如果当前索引不是在历史末尾，将移除后面的历史记录。
     * 历史记录超过最大长度时，删除最早的记录。
     * @param {string} folderUid - 要添加到历史记录中的文件夹UID
     */
    addHistory(folderUid) {
      const state = this.sharedState;

      // 如果历史记录不为空，并且当前索引不是在历史末尾，移除后面的记录
      if (state.historyIndex < state.historyDir.length - 1) {
        state.historyDir = state.historyDir.slice(0, state.historyIndex + 1);
      }

      // 将新的文件夹UID添加到历史记录中
      state.historyDir.push(folderUid);

      // 确保历史记录不超过最大长度
      if (state.historyDir.length > state.maxHistorySize) {
        state.historyDir.shift(); // 删除最早的记录
      } else {
        state.historyIndex++;
      }
    },

    /**
     * 回退到上一个文件夹UID。
     */
    undo() {
      const state = this.sharedState;

      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.currentFolderUid = state.historyDir[state.historyIndex];
      }
    },

    /**
     * 前进到下一个文件夹UID。
     * @fires EventBus#folderChanged
     */
    redo() {
      const state = this.sharedState;

      if (state.historyIndex < state.historyDir.length - 1) {
        state.historyIndex++;
        state.currentFolderUid = state.historyDir[state.historyIndex];
      }
    },

    /**
     * 清空历史记录和当前历史索引。
     */
    clearHistory() {
      this.sharedState.historyDir = [];
      this.sharedState.historyIndex = -1;
    }
  }
});
