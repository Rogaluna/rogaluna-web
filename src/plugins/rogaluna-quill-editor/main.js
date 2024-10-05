// main.js
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import rogalunaTheme from './themes/rogalunaTheme';

const RogalunaQuillPlugin = {
  install(Vue) {
    // 将 Quill 附加到 Vue 的原型上，以便在组件中全局使用
    Vue.prototype.$Quill = Quill;

    // 注册自定义主题
    Quill.register('themes/rogaluna', rogalunaTheme);
  },
};

export default RogalunaQuillPlugin;
