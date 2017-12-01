import { JSONAPI } from './request';

export const getPageNei = ({ id, url }) => {
  return JSONAPI.get('/api/page/nei', { params: { id, url } });
};

export const getListTemplate = ({ id }) => {
  return JSONAPI.get('/api/page/listTemplate', { params: { id } });
};

export const createPage = ({ projectId, url, name, type, key }) => {
  return JSONAPI.post('/api/page/create', {
    projectId, url, name, type, key
  });
};

export const getPageList = ({ id }) => {
  return JSONAPI.get('/api/page/list', { params: {id} });
};

export const deletePage = ({ id, pageId }) => {
  return JSONAPI.get('/api/page/delete', { params: {id, pageId} });
};

export const updatePageDom = ({ id, dom }) => {
  return JSONAPI.post('/api/page/updateDom', { id, dom });
};

export const getPageDetail = ({ id }) => {
  return JSONAPI.get('/api/page/detail', { params: { id }});
};

export const updatePageSetting = ({ id, url, name, type, key }) => {
  return JSONAPI.post('/api/page/updateSetting', {
    id, url, name, type, key
  });
};
