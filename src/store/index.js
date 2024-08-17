import Vue from 'vue'
import Vuex from 'vuex'

// modules
import plugins from './modules/plugins';
import globalAttributes from './modules/globalAttributes';

Vue.use(Vuex)

const store =  new Vuex.Store({
  modules: {
    plugins,
    globalAttributes
  }
})

store.dispatch('globalAttributes/loadFileTypeMapping');
store.dispatch('globalAttributes/loadFileIconTypeMapping')

export default store;