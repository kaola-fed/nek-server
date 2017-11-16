import * as TYPES from './mutation-types';

export default {
  [TYPES.LOGIN_SUCCESS](state, result) {
    state.userInfo = result;
  },
  [TYPES.LOGOUT_SUCCESS](state) {
    state.userInfo = {};
  }
};
