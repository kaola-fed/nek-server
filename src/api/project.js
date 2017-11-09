import { JSONAPI } from './request';

export const getListTemplate = ({ id }) => {
  return JSONAPI.get('/api/project/listTemplate', { id });
};
