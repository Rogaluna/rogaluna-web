import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 插件引入
import vuetify from '@/plugins/vuetify/main'

import { RogalunaWidgetsPlugin } from '@/plugins/rogaluna-widgets/main';
Vue.use(RogalunaWidgetsPlugin, { vuetify });

import GlobalIcons from '@/plugins/global-icons/main';
Vue.use(GlobalIcons);

import axiosPlugin from '@/plugins/axios/main';
Vue.use(axiosPlugin);

import quillPlugin from '@/plugins/rogaluna-quill-editor/main'
Vue.use(quillPlugin);



Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
