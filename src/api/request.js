import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import _ from '@/widget/util';
import router from '@/router';

const JSONAXIOS = axios.create({
  timeout: 50000,
  headers: {'Content-Type': 'application/json;charset=utf-8'},
  transformRequest: [function(data) {
    return JSON.stringify(_.filterEmpty(data));
  }]
});

const FORMAXIOS = axios.create({
  timeout: 50000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
  transformRequest: [function(data) {
    return qs.stringify(_.filterEmpty(data));
  }]
});

function __responseSuccessInterceptor(response) {
  const data = response.data;
  if (data && data.code === 200) {
    data.message && Message.success(data.message);
    return Promise.resolve(data);
  } else if (data && data.code !== 200) {
    if (data.code === 401) {
      return router.push({ name: 'login' });
    }
    data.message && Message.error(data.message);
    return Promise.reject(data);
  }
}

function __responseErrorInterceptor(error) {
  if (error.response) {
    let status = error.response.status;
    if (status === 401 && window.location.pathname !== '/login') {
      if(error.response.data && error.response.data.message) {
        window.location = error.response.data.message;
      }
    }
    if (status !== 401) {
      Message.error('请求失败');
    }
  }
  return Promise.reject(error);
}

FORMAXIOS.interceptors.response.use(__responseSuccessInterceptor, __responseErrorInterceptor);
JSONAXIOS.interceptors.response.use(__responseSuccessInterceptor, __responseErrorInterceptor);

export const FORMAPI = FORMAXIOS;
export const JSONAPI = JSONAXIOS;
