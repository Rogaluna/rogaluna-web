import Vue from 'vue';
import RogalunaContextMenu from './widgets/sundries/RogalunaContextMenu.vue';
import RogalunaLoading from './widgets/sundries/RogalunaLoading.vue';
import RogalunaSnackbar from './widgets/sundries/RogalunaSnackbar.vue';

const ContextMenuConstructor = Vue.extend(RogalunaContextMenu);
const LoadingConstructor = Vue.extend(RogalunaLoading);
const SnackbarConstructor = Vue.extend(RogalunaSnackbar);

export const RogalunaWidgetsPlugin = {
  install(Vue, { vuetify }) {
    Vue.prototype.$rogalunaWidgets = {
      
      contextMenuInstance: null,
      loadingInstances: [],

      // 右键菜单
      showContextMenu(position, items) {
        if (!this.contextMenuInstance) {
          this.contextMenuInstance = new ContextMenuConstructor({
            vuetify,
            el: document.createElement('div')
          });
          document.body.appendChild(this.contextMenuInstance.$el);
        }
        this.contextMenuInstance.showMenu(position, items);
      },

      // Loading界面
      showLoading(refElement = null, callback = null) {
        let loadingInstance;

        const appendToElement = (element) => {
          loadingInstance = new LoadingConstructor({
            vuetify,
          });
          element.appendChild(loadingInstance.$mount().$el);
          this.loadingInstances.push(loadingInstance);

          const stopLoading = () => {
            loadingInstance.$destroy();
            if (loadingInstance.$el && loadingInstance.$el.parentNode) {
              loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
            }
            this.loadingInstances = this.loadingInstances.filter(inst => inst !== loadingInstance);
          };

          if (callback) {
            callback(stopLoading);
          }
        };

        if (refElement) {
          if (refElement.$el) {
            refElement.$el.style.position = "relative";
            appendToElement(refElement.$el);
          } else {
            appendToElement(refElement);
            refElement.style.position = "relative";
          }
        } else {
          appendToElement(document.body);
        }
      },

      // 文件选择器
      showFileSelector({ accept = '*', multiple = false } = {}, callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept; // 设置文件类型限制
        input.multiple = multiple; // 设置是否多选

        input.onchange = (event) => {
          const files = event.target.files;
          if (callback) {
            callback(files);
          }
          // 销毁创建的 input 元素
          input.remove();
        };

        input.click();
      },

      // 消息条
      showSnackbar(message, timeout = 3000) {
        const snackbarInstance = new SnackbarConstructor({
          vuetify,
          propsData: {
            message,
            timeout
          }
        });

        const component = snackbarInstance.$mount();
        document.body.appendChild(component.$el);

        // 自动移除 Snackbar 实例
        setTimeout(() => {
          snackbarInstance.show = false;
          setTimeout(() => {
            component.$destroy();
            document.body.removeChild(component.$el);
          }, 300);
        }, timeout);
      },

      /**
       * 动态创建对话框
       * @param {Object} DialogComponent 组件的路径或组件名称（需使用 import() 动态引入）
       * @param {Object} props 对话框需要的props
       * @param {Object} events 对话框的事件回调函数，如 confirm 和 cancel
       */
      async showDialog(DialogComponent, props = {}, events = {}) {
        // 创建对话框组件构造器
        const DialogConstructor = Vue.extend(DialogComponent);

        const dialogInstance = new DialogConstructor({
          vuetify,
          propsData: props
        });

        // 绑定传入的事件回调
        Object.keys(events).forEach(event => {
          dialogInstance.$on(event, events[event]);
        });

        // 挂载并显示对话框
        const component = dialogInstance.$mount();
        document.body.appendChild(component.$el);

        // 销毁对话框实例
        const destroyDialog = () => {
          dialogInstance.$destroy();
          if (component.$el && component.$el.parentNode) {
            component.$el.parentNode.removeChild(component.$el);
          }
        };

        // 监听关闭对话框的事件（假设对话框组件内部有 'close' 事件）
        dialogInstance.$on('close', destroyDialog);
      }
    };
  }
};