import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutation';

Vue.use(Vuex);

const state = {
  userInfo: {
    username: sessionStorage.username || ''
  }
};

const getters = {
  isLogin(state) {
    return !!(state.userInfo && state.userInfo.username);
  }
};

const modules = {};

export default new Vuex.Store({
  state,
  getters,
  modules,
  actions,
  mutations,
  strict: process.env.NODE_ENV === 'production'
});
