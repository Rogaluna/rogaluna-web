import Vue from 'vue';
import RogalunaContextMenu from './widgets/sundries/RogalunaContextMenu.vue';
import RogalunaLoading from './widgets/sundries/RogalunaLoading.vue';

const ContextMenuConstructor = Vue.extend(RogalunaContextMenu);
const LoadingConstructor = Vue.extend(RogalunaLoading);

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
      }
    };
  }
};