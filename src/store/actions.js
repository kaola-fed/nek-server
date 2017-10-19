import * as LoginAPI from '../api/auth';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './mutation-types';
import router from '@/router';

export default {
  async login({ commit }, payload) {
    try {
      const res = await LoginAPI.login(payload);
      commit(LOGIN_SUCCESS, res);
      router.push(payload.returnUrl);
      return res;
    } catch (err) {
      return err;
    }
  },

  async logout({ commit }) {
    await LoginAPI.logout();
    sessionStorage.removeItem('username');
    commit(LOGOUT_SUCCESS);
    router.go();
  }
};
