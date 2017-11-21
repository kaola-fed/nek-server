import { JSONAPI } from './request';

export const create = ({ name, desc, git, neiKey, type, library }) => {
  return JSONAPI.post('/api/project/create', {
    name, desc, git, neiKey, type, library
  });
};

export const update = ({ id, name, desc, git, neiKey, type, library }) => {
  return JSONAPI.post('/api/project/update', {
    id, name, desc, git, neiKey, type, library
  });
};

export const getDetail = ({ id }) => {
  return JSONAPI.get('/api/project/detail', { params: {id} });
};

export const deleteProject = ({ id }) => {
  return JSONAPI.get('/api/project/delete', { params: {id} });
};

export const updateTpl = ({ id, type, tpl }) => {
  return JSONAPI.post('/api/project/updateTpl', {
    id, type, tpl
  });
};
