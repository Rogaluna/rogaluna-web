// event-bus.js
import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    sharedState: {
      isVisible: true,
      dir: [{
        text: "root"
      }],
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
  }
});
