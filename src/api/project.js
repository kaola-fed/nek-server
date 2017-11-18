import { JSONAPI } from './request';

export const getListTemplate = ({ id }) => {
  return JSONAPI.get('/api/project/listTemplate', { params: {id} });
};

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

export const createPage = ({ projectId, url, name, type }) => {
  return JSONAPI.post('/api/project/createPage', {
    projectId, url, name, type
  });
};

export const getPageList = ({ id }) => {
  return JSONAPI.get('/api/project/pageList', { params: {id} });
};

export const deletePage = ({ id, pageId }) => {
  return JSONAPI.get('/api/project/deletePage', { params: {id, pageId} });
};
