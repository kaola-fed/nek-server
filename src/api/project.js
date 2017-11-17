import { JSONAPI } from './request';

export const getListTemplate = ({ id }) => {
  return JSONAPI.get('/api/project/listTemplate', { params: {id} });
};

export const create = ({ name, desc, git, neiKey, type }) => {
  return JSONAPI.post('/api/project/create', {
    name, desc, git, neiKey, type
  });
};

export const update = ({ id, name, desc, git, neiKey, type }) => {
  return JSONAPI.post('/api/project/update', {
    id, name, desc, git, neiKey, type
  });
};

export const getDetail = ({ id }) => {
  return JSONAPI.get('/api/project/detail', { params: {id} });
};

export const deleteProject = ({ id }) => {
  return JSONAPI.get('/api/project/delete', { params: {id} });
};
