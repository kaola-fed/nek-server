import { JSONAPI } from './request';

export const getLibraries = ({ names }) => {
  return JSONAPI.get('/api/library/list', { params: { names } });
};
