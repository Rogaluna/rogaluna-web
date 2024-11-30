// store/modules/globalAttributes.js
import Vue from 'vue';

import yaml from 'js-yaml';
import fileTypeMappingYaml from 'raw-loader!@/configs/fileTypeMapping.yaml';
import fileIconTypeMappingYaml from 'raw-loader!@/configs/fileIconTypeMapping.yaml';

import playModeTypeMappingYaml from 'raw-loader!@/configs/playModeTypeMapping.yaml';
import playModeIconTypeMappingYaml from 'raw-loader!@/configs/playModeIconTypeMapping.yaml';

const state = {
  fileTypeMapping: {},
  fileIconTypeMapping: {},

  playModeTypeMapping: {},
  playModeIconTypeMapping: {},

};

const mutations = {
  setFileTypeMapping(state, mappings) {
    state.fileTypeMapping = mappings;
  },
  setFileIconTypeMapping(state, mappings) {
    state.fileIconTypeMapping = mappings;
  },

  setPlayModeTypeMapping(state, mappings) {
    state.playModeTypeMapping = mappings;
  },
  setPlayModeIconTypeMapping(state, mappings) {
    state.playModeIconTypeMapping = mappings;
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

  loadPlayModeTypeMapping({ commit }) {
    const mappings = yaml.load(playModeTypeMappingYaml);
    commit('setPlayModeTypeMapping', mappings);
  },
  loadPlayModeIconTypeMapping({ commit }) {
    const mappings = yaml.load(playModeIconTypeMappingYaml);
    commit('setPlayModeIconTypeMapping', mappings);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
