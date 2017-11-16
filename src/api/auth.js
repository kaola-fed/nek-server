import { JSONAPI } from './request';

export const login = async () => {
  return {
    userId: 'test',
    username: 'Test'
  };
};

export const isLogin = async () => {
  return await JSONAPI.post('/api/login/isLogin');
};

export const logout = async () => {
  return await JSONAPI.post('/api/login/logout');
};
