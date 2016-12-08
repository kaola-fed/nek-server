/* global fetch,document,localStorage: false */
import { Component, Notify } from 'nek-ui';
import ModuleList from './module.list';
import PageList from './page.list';
import MainArea from './main.area';
import template from '!raw!./index.html';

const Detail = Component.extend({
  name: 'detail',
  template,
  config() {
    this.defaults({
      projectId: '',
      fixedCategory: [{
        name: '模块',
        componentList: [
          {
            desc: '模块',
            name: 'container',
            cols: 12,
          },
        ],
      }],
      categoryList: [],
      pageList: [],
      sync: {},
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
    this.$refs.pageList.$on('changePage', (pageId) => {
      localStorage.setItem(this.data.projectId, pageId);
      this._getPageData(pageId);
    });
    this.$on('deleteModule', (param) => {
      let mainArea = this.$refs.mainArea;
      let tab = mainArea.data.tab;
      let modalTab = mainArea.data.modalTab;
      let ref;
      ref = tab === 1 ? 'dropArea_-1' : `dropArea_${modalTab - 1}`;
      mainArea.$refs[ref].trash(param);
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
      let list = json;
      list = this.data.fixedCategory.concat(list);
      this.$update('categoryList', list);
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _getPageList() {
    const { projectId } = this.data;
    const pageList = this.$refs.pageList;
    fetch(`/api/page/list?project=${projectId}`)
    .then(res => res.json())
    .then((json) => {
      const pageId = localStorage.getItem(projectId) || json[0]._id;
      const curPage = json.find(d => d._id === pageId);
      pageList.data.activePage = curPage;
      pageList.data.activePage.active = true;
      this._getPageData(pageId);
      this.$update('pageList', json);
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _getPageData(pageId) {
    let data = this.data;
    const { projectId } = this.data;
    fetch(`/api/page?project=${projectId}&page=${pageId}`)
    .then(res => res.json())
    .then((json) => {
      let sync = json.sync || { rows: [{ subRow: [[]], isContainer: false }], modals: [] };
      this.$update('sync', sync);
      // 同时置选项卡的tab为-1
      this.$refs.mainArea._changeTab(1);
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
      if (e.keyCode === 17) isCtrl = false;
    };
    document.onkeydown = (e) => {
      if (e.keyCode === 17) isCtrl = true;
      if (e.keyCode === 83 && isCtrl === true) {
        this._savePage();
        return false;
      }
      if (e.keyCode === 90 && isCtrl === true) {
        this._flushPage();
        return false;
      }
    };
  },

  _getComponentByName(name) {
    const { categoryList } = this.data;
    for (let i = 0; i < categoryList.length; i += 1) {
      let componentList = categoryList[i].componentList;
      for (let j = 0; j < componentList.length; j += 1) {
        if (componentList[j].name === name) return componentList[j];
      }
    }
    return null;
  },

  _flushRow(row) {
    row.subRow.forEach((components) => {
      components.forEach((component) => {
        // 找到组件原型，深度复制一份 conf，用已有组件的值填充（如果有对应属性的话）
        let _component = this._getComponentByName(component.name);
        if (!_component || !component.NEK) return;
        let _conf = JSON.parse(JSON.stringify(_component.conf));
        _conf.forEach((conf) => {
          // 存在对应属性
          let t = component.NEK.conf.find(d => d.key === conf.key);
          // 填充旧值，用于兼容
          if (t) {
            conf.default = conf.value;
            conf.value = t.value;
          }
        });
        component.NEK.conf = _conf;
      });
    });
  },

  _flushPage() {
    const { modals = [], rows = [] } = this.data.sync;
    modals.forEach((modal) => {
      modal.rows.forEach((row) => {
        this._flushRow(row);
      });
    });
    rows.forEach((row) => {
      this._flushRow(row);
    });
    Notify.notify.success('刷新完成');
    this.$update();
    this._savePage();
  },

  _savePage() {
    let data = this.data;
    const { projectId } = this.data;
    const { pageId } = this.data;
    const pageList = this.$refs.pageList;
    const mainArea = this.$refs.mainArea;

    fetch('/api/page/upsert', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        project: projectId,
        page: pageList.data.activePage._id,
        data: mainArea._getJson(),
        sync: data.sync,
      }),
    })
    .then(res => res.json())
    .then((json) => {
      Notify.notify.success('保存成功');
    }).catch((err) => {
      console.error(err.message);
      Notify.notify.success(`保存失败：${err.message || '未知'}`);
    });
  },
});

export default Detail;
