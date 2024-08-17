// store/modules/globalAttributes.js
import Vue from 'vue';

import yaml from 'js-yaml';
import fileTypeMappingYaml from 'raw-loader!@/configs/fileTypeMapping.yaml';
import fileIconTypeMappingYaml from 'raw-loader!@/configs/fileIconTypeMapping.yaml';

const state = {
  fileTypeMapping: {},
  fileIconTypeMapping: {}
};

const mutations = {
  setFileTypeMapping(state, mappings) {
    state.fileTypeMapping = mappings;
  },
  setFileIconTypeMapping(state, mappings) {
    state.fileIconTypeMapping = mappings;
  },
};

const actions = {
  loadFileTypeMapping({ commit }) {
    const mappings = yaml.load(fileTypeMappingYaml);
    commit('setFileTypeMapping', mappings);
  },
  loadFileIconTypeMapping({ commit }) {
    const mappings = yaml.load(fileIconTypeMappingYaml);
    commit('setFileIconTypeMapping', mappings);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
