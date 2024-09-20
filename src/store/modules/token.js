// store/modules/token.js
import Vue from 'vue';

const state = {
  token: ""
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  },
};

const actions = {
  updateToken({ commit }, payload) {
    commit('setToken', payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
