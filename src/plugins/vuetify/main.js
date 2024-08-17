import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import zhHans from 'vuetify/lib/locale/zh-Hans';

import themes from './theme'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      dark: true, // 使用dark主题
      themes: themes
    },
    lang: {
      locales: { zhHans },
      current: 'zhHans',
    },
});
