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
      fixedCategory: {
        name: '模块',
        componentList: [
          {
            desc: '模块',
            name: 'container',
            cols: 12,
          },
        ],
      },
      categoryList: [],
      pageList: [],
    });
    this.supr();
  },

  init() {
    this.$refs.moduleList.$on('upsertComponentList', (params) => {
      this._upsertComponent(params);
    });
    this.$refs.pageList.$on('upsertPageList', (params) => {
      this._upsertPage(params);
    });
    this.$on('deleteModule', (param) => {
      this.$refs.dropArea.trash(param);
    });
    this._ctrlS();
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
      const list = json;
      list.unshift(this.data.fixedCategory);
      this.$update('categoryList', list);
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _getPageList() {
    const { projectId } = this.data;
    const pageList = this.$refs.pageList
    fetch(`/api/page/list?project=${projectId}`)
    .then(res => res.json())
    .then((json) => {
      pageList.data.activePage = json[0];
      pageList.data.activePage.active = true;
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

  _upsertPage(params) {
    const { projectId } = this.data;
    fetch('/api/page/upsert', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(Object.assign(params, {
        project: projectId,
        page: params._id,
      })),
    })
    .then(res => res.json())
    .then((json) => {
      this._getPageList();
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _ctrlS() {
    let isCtrl = false;
    document.onkeyup = (e) => {
      if(e.keyCode == 17) isCtrl = false;
    }
    document.onkeydown = (e) => {
      if(e.keyCode == 17) isCtrl = true;
      if(e.keyCode == 83 && isCtrl == true) {
        this._savePage();
        return false;
      }
    }
  },

  _savePage() {
    const { projectId } = this.data;
    const { pageId } = this.data;
    const pageList = this.$refs.pageList;
    const dropArea = this.$refs.dropArea;

    fetch('/api/page/upsert', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        project: projectId,
        page: pageList.data.activePage._id,
        sync: dropArea.data.rows
      }),
    })
    .then(res => res.json())
    .then((json) => {
      // this._getPageList();
    }).catch((err) => {
      console.error(err.message);
    });
    console.log(dropArea.data)
  }
});

export default Detail;
