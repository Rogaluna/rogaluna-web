import Vue from 'vue';
import RogalunaContextMenu from './widgets/sundries/RogalunaContextMenu.vue';
import RogalunaLoading from './widgets/sundries/RogalunaLoading.vue';
import RogalunaSnackbar from './widgets/sundries/RogalunaSnackbar.vue';
import RogalunaProgressDialog from './widgets/sundries/RogalunaProgressDialog.vue';

const ContextMenuConstructor = Vue.extend(RogalunaContextMenu);
const LoadingConstructor = Vue.extend(RogalunaLoading);
const SnackbarConstructor = Vue.extend(RogalunaSnackbar);
const ProgressConstructor = Vue.extend(RogalunaProgressDialog);

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
        const loadingInstance = new LoadingConstructor({
            vuetify,
        });
    
        // 搜索 app 节点
        const appElement = document.querySelector('[data-app]') || document.body;
    
        // 如果 refElement 为 null，默认挂载到 app 节点
        const mountElement = refElement
            ? (refElement.$el || refElement)
            : appElement;
    
        // 确保挂载点有定位样式
        const originalPosition = mountElement.style.position;
        if (!originalPosition || originalPosition === 'static') {
            mountElement.style.position = 'relative';
        }
    
        loadingInstance.$mount(); // 创建 Vue 实例
        mountElement.appendChild(loadingInstance.$el); // 追加到挂载点
    
        const stopLoading = () => {
            loadingInstance.$destroy();
            if (loadingInstance.$el && loadingInstance.$el.parentNode) {
                loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
            }
            // 恢复挂载点的原始样式
            if (originalPosition) {
                mountElement.style.position = originalPosition;
            } else {
                mountElement.style.removeProperty('position');
            }
        };
    
        // 调用回调，传递停止加载的方法
        if (callback) {
            callback(stopLoading);
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
       * 动态创建进度对话框
       * @param {Function} callback 回调函数，用于设置进度相关的属性
       * @returns {Promise<void>} 包含关闭对话框的方法
       * 
       * @example
       */
      // await this.$rogalunaWidgets.showProgressDialog(async (progress) => {
      //   // 初始化对话框属性
      //   progress.taskName = '数据处理';
      //   progress.totalTasks = 2;
      //   progress.currentTask = 0;
      //   progress.useSubtitle = true;
      //   progress.subtitle = '初始化中...';
      //   progress.percentage = 0;
      //   progress.indeterminate = false;
      //   progress.autoComplete = true; // 显示“完成”按钮
      //   progress.useCancel = true; // 显示“取消”按钮
      //   progress.completed = false;

      //   // 执行第一个任务
      //   progress.currentTask = 1;
      //   progress.subtitle = '正在处理字符分割...';
      //   progress.percentage = 0;

      //   // 模拟耗时操作
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      //   progress.percentage = 50;

      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      //   progress.percentage = 100;

      //   // 标记第一个任务完成
      //   progress.completed = true;

      //   // 执行第二个任务
      //   progress.currentTask = 2;
      //   progress.subtitle = '正在进行合并...';
      //   progress.percentage = 0;
      //   progress.completed = false;

      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      //   progress.percentage = 50;

      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      //   progress.percentage = 100;

      //   // 所有任务完成
      //   progress.completed = true;
      //   progress.subtitle = '所有任务已完成！';
      // });
      async showProgressDialog(callback) {
        return new Promise((resolve, reject) => {
          // 创建组件实例，并传入初始 props
          const progressInstance = new ProgressConstructor({
            vuetify,
            propsData: {
              visible: true,
              width: 500,
              taskName: '任务',
              totalTasks: 1,
              currentTask: 0,
              useSubtitle: false,
              subtitle: '',
              percentage: 0,
              indeterminate: false,
              autoComplete: false,
              useCancel: false,
              completed: false,
            },
          });
      
          // 挂载组件并添加到 DOM
          const component = progressInstance.$mount();
          document.body.appendChild(component.$el);
      
          // 定义销毁对话框的方法
          const destroyDialog = () => {
            progressInstance.$destroy();
            if (component.$el && component.$el.parentNode) {
              component.$el.parentNode.removeChild(component.$el);
            }
          };
      
          // 绑定事件回调
          progressInstance.$on('cancel', () => {
            // 用户取消时，销毁对话框并拒绝 Promise
            destroyDialog();
            reject(new Error('用户取消了操作'));
          });
      
          progressInstance.$on('complete', () => {
            // 用户点击完成时，销毁对话框并解析 Promise
            destroyDialog();
            resolve();
          });
      
          // 创建 progress 对象，允许设置对话框的属性
          const progress = {};
      
          // 列出所有可设置的属性
          const props = [
            'taskName',
            'totalTasks',
            'currentTask',
            'useSubtitle',
            'subtitle',
            'percentage',
            'indeterminate',
            'autoComplete',
            'useCancel',
            'completed',
            'width',
          ];
      
          // 为每个属性定义 getter 和 setter
          props.forEach((prop) => {
            Object.defineProperty(progress, prop, {
              get() {
                return progressInstance[prop];
              },
              set(value) {
                progressInstance[prop] = value;
              },
              enumerable: true,
            });
          });
      
          // 执行回调函数，并确保对话框在完成后关闭
          (async () => {
            try {
              await callback(progress);
              // 回调完成后，自动关闭对话框
              resolve();
            } catch (error) {
              // 如果回调抛出错误，销毁对话框并拒绝 Promise
              destroyDialog();
              reject(error);
            }
          })();
        });
      
      }
    };
  }
};