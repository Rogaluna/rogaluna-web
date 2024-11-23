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

      /**
       * 右键菜单
       * @param {Object} position - 位置对象 { x: 123, y: 456 }
       * @param {Array} items - 右键菜单的菜单项数组，每个菜单项对象应包含 label 、 value 属性和一个 handler 函数对象
       */
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

      /**
       * Loading界面
       * @param {Object} refElement - ref 参考元素，会在这个元素内显示 loading 界面，如果设置为null，则在整个网页内显示 loading 界面
       * @param {Function} callback - loading 时进行的回调函数，使用 (stopLoading) => { ...执行内容; stopLoading(); }
       */
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
            refElement.style.position = "relative";
            appendToElement(refElement);
          }
        } else {
          appendToElement(document.body);
        }
      },

      /**
       * 文件选择器
       * @param {Object} arg1 - 限制条件，包括可接受的类型和是否可选择多文件 { accept = '*', multiple = false }
       * @param {Function} callback - 确定选中文件的回调函数，使用 (files) => { ...执行内容; } 操作选中的文件
       */
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

      /**
       * 消息条
       * @param {String} message - 要显示的消息内容
       * @param {Integer} timeout - 超时时间，将在等待这段时间后销毁消息条（单位：ms）
       */
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
      },

      /**
       * 动态创建抽屉组件
       * @param {Object} DrawerComponent - 抽屉组件（需要用 import() 动态加载或直接传入）
       * @param {Object} props - 抽屉组件的 props
       * @param {Object} events - 抽屉组件的事件回调
       * @param {Object} refElement - ref 参考元素，会在这个元素内显示抽屉，如果设置为 null，则挂载到整个网页
       */
      showDrawer(DrawerComponent, props = {}, events = {}, refElement = null) {
        const DrawerConstructor = Vue.extend(DrawerComponent);

        const drawerInstance = new DrawerConstructor({
          vuetify,
          propsData: props,
        });

        Object.keys(events).forEach((event) => {
          drawerInstance.$on(event, events[event]);
        });

        // 如果 refElement 为 null，默认挂载到 document.body
        const mountElement = refElement ? (refElement.$el || refElement) : document.body;

        // 确保挂载点有定位样式
        const originalPosition = mountElement.style.position;
        if (!originalPosition || originalPosition === 'static') {
          mountElement.style.position = 'relative';
        }

        drawerInstance.$mount(); // 创建 Vue 实例

        // 追加到挂载点
        mountElement.appendChild(drawerInstance.$el);

        const destroyDrawer = () => {
          drawerInstance.$destroy();
          if (drawerInstance.$el && drawerInstance.$el.parentNode) {
            drawerInstance.$el.parentNode.removeChild(drawerInstance.$el);
          }
          // 恢复原始样式
          if (originalPosition) {
            mountElement.style.position = originalPosition;
          } else {
            mountElement.style.removeProperty('position');
          }
        };

        drawerInstance.$on('close', destroyDrawer);
      },
    };
  }
};