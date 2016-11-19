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
    })
  },

  enter(options) {
    this.update(options);
  },

  update(options) {
    this.data.projectId = options.param.projectId;
    this._getComponentList();
    this._getPageList();
  },

  _getComponentList() {
    const { projectId } = this.data;
    fetch(`/api/component/list?projectId=${projectId}`)
    .then(res => res.json())
    .then(json => {
      this.$update('categoryList', json);
    }).catch(err => {
      console.error(err.message);
    });
  },

  _getPageList() {
    const { projectId } = this.data;
    fetch(`/api/page/list?projectId=${projectId}`)
    .then(res => res.json())
    .then(json => {
      this.$update('pageList', json);
    }).catch(err => {
      console.error(err.message);
    });
  }
});

export default Detail;
