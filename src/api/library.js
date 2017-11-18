import { JSONAPI } from './request';

export const getLibraries = () => {
  return JSONAPI.get('/api/library/list');
};

export const addLibrary = ({ name, desc, version }) => {
  return JSONAPI.post('/api/library/add', {
    name, desc, version
  });
};

export const editLibrary = ({ id, name, desc, version }) => {
  return JSONAPI.post('/api/library/edit', {
    id, name, desc, version
  });
};

export const getDetail = ({ id }) => {
  return JSONAPI.get('/api/library/detail', { params: { id }});
};

export const deleteLibrary = ({ id }) => {
  return JSONAPI.get('/api/library/delete', { params: { id }});
};

export const getComponentList = ({ id }) => {
  return JSONAPI.get('/api/library/getComponents', { params: { id }});
};

export const deleteComponent = ({ id }) => {
  return JSONAPI.get('/api/library/deleteComponent', { params: { id }});
};

export const addComponent = ({ name, tag, isLayout, bodyClass, attributes, events, library }) => {
  return JSONAPI.post('/api/library/addComponent', {
    name, tag, isLayout, bodyClass, attributes, events, library
  });
};

export const editComponent = ({ id, name, tag, isLayout, bodyClass, attributes, events, library }) => {
  return JSONAPI.post('/api/library/editComponent', {
    id, name, tag, isLayout, bodyClass, attributes, events, library
  });
};

export const getComponentDetail = ({ id }) => {
  return JSONAPI.get('/api/library/detailComponent', { params: { id }});
};
