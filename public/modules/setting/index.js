/* global fetch, Blob, FormData: false */
import { Component, Notify } from 'nek-ui';
import template from '!raw!./index.html';

const Setting = Component.extend({
  name: 'setting',
  template,
  config() {
    this.defaults({
      tabList: [
        { type: 'html', name: 'html.tpl' },
        { type: 'javascript', name: 'javascript.tpl' },
        { type: 'entry', name: 'entry.tpl' },
        { type: 'freemarker', name: 'freemarker.tpl' },
      ],
      loding: true,
    });
    this.supr();
  },

  enter() {
    this._getTplList();
  },

  // 先上传文件到数据库，拿到 fileId 然后更新项目模板
  save(tab) {
    const { projectId } = this.data.$param;
    const blob = new Blob([tab.text], { type: 'text/plain' });
    const fd = new FormData();
    fd.append('file', blob);
    fetch('/api/template/upload', {
      method: 'POST',
      body: fd,
    })
    .then(res => res.json())
    .then(file => fetch('/api/project/tpl/upsert', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        file: file[0].id,
        project: projectId,
        name: tab.name,
        type: tab.type,
      }),
    }))
    .then(res => res.json())
    .then((json) => {
      Notify.notify.success('保存成功');
      this._getTplList();
      tab.originText = tab.text;
      this.$update();
    })
    .catch((err) => {
      console.error(err.message);
    });
  },

  reset(tab) {
    tab.text = tab.originText;
  },

  onChange(event) {
    const { file, title } = event.selected.data;
    const tab = this.data.tabList.find(d => d.type === title);
    this._getTpl(file, (text) => {
      tab.originText = text;
      tab.text = text;
      this.$update();
    });
  },

  _getTpl(file, callback) {
    if (!file) return callback('');
    fetch(`/api/template?file=${file}`).then(res => res.text()).then((text) => {
      callback(text);
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _getTplList() {
    this.$update('loading', true);
    const { projectId } = this.data.$param;
    fetch(`/api/project?project=${projectId}`).then(res => res.json()).then((json) => {
      const templates = json.templates || [];
      this.data.tabList.forEach((tab) => {
        delete tab.file;
        templates.forEach((tpl) => {
          if (tpl.type === tab.type) {
            tab.file = tpl.file;
          }
        });
      });
      this.$update('loading', false);
    }).catch((err) => {
      console.error(err.message);
    });
  },
});

export default Setting;
