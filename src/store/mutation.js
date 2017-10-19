import * as TYPES from './mutation-types';

export default {
  [TYPES.LOGIN_SUCCESS](state, result) {
    if (result && result.username) {
      sessionStorage.setItem('username', result.username);
      state.userInfo = result;
    }
  },
  [TYPES.LOGOUT_SUCCESS](state) {
    state.userInfo = {};
  }
};
