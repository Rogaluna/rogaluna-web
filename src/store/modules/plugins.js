// store/modules/plugins.js
import Vue from 'vue';

const state = {
  rogalunaBkManager: {
    componentPath: 'SolarSystem/MainComponent.vue'
  }
};

const mutations = {
  setNestedState(state, { path, value }) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const nestedState = keys.reduce((acc, key) => acc[key], state);
    Vue.set(nestedState, lastKey, value);
  }
};

const actions = {
  updateNestedState({ commit }, payload) {
    commit('setNestedState', payload);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
