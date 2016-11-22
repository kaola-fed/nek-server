/* global fetch: false */
import { Component } from 'nek-ui';
import ModuleList from './module.list';
import PageList from './page.list';
import DropArea from './drop.area';
import template from '!raw!./index.html';

const Detail = Component.extend({
  name: 'detail',
  template,
  config() {
    this.defaults({
      projectId: '',
      categoryList: [],
      pageList: [],
    });
    this.supr();
  },

  init() {
    this.$refs.moduleList.$on('upsertComponentList', (params) => {
      this._upsertComponent(params);
    });
    this.$on('deleteModule', (param) => {
      this.$refs.dropArea.trash(param);
    });
    this.supr();
  },
  enter(options) {
    const { projects = [], param } = this.$state;
    this.$state.curProj = projects.find(d => d._id === param.projectId);
    this.data.projectId = param.projectId;
    this._getComponentList();
    this._getPageList();
  },

  _getComponentList() {
    const { projectId } = this.data;
    fetch(`/api/component/list?project=${projectId}`)
    .then(res => res.json())
    .then((json) => {
      this.$update('categoryList', json);
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _getPageList() {
    const { projectId } = this.data;
    fetch(`/api/page/list?project=${projectId}`)
    .then(res => res.json())
    .then((json) => {
      this.$update('pageList', json);
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _upsertComponent(params) {
    const { projectId } = this.data;
    fetch('/api/component/upsert', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(Object.assign(params, {
        project: projectId,
        component: params._id,
      })),
    })
    .then(res => res.json())
    .then((json) => {
      this._getComponentList();
    }).catch((err) => {
      console.error(err.message);
    });
  },
});

export default Detail;
