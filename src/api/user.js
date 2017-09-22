import { JSONAPI } from './request';

export const getDashboard = () => {
  return JSONAPI.get('/api/user/dashboard');
};
