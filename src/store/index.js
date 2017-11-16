import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutation';

Vue.use(Vuex);

const state = {
  userInfo: {}
};

const getters = {};

const modules = {};

export default new Vuex.Store({
  state,
  getters,
  modules,
  actions,
  mutations,
  strict: process.env.NODE_ENV === 'production'
});
