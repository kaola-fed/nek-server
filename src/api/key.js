import { JSONAPI } from './request';

export const getKeyList = ({ projectId }) => JSONAPI.get('/api/key/list', { params: { projectId } });

export const createKey = ({ name, key, projectId }) => JSONAPI.post('/api/key/add', {
  name, key, projectId
});

export const updateKey = ({ id, name, key, projectId }) => JSONAPI.post('/api/key/edit', {
  id, name, key, projectId
});

export const deleteKey = ({ id }) => JSONAPI.get('/api/key/delete', { params: { id } });

export const getKeyDetail = ({ id }) => JSONAPI.get('/api/key/detail', { params: { id } });
