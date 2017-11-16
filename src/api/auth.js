import { JSONAPI } from './request';

export const login = async () => {
  return {
    userId: 'test',
    username: 'Test'
  };
};

export const isLogin = async () => {
  return await JSONAPI.post('/api/isLogin');
};

export const logout = async () => {
  return await JSONAPI.post('/api/auth/logout');
};
