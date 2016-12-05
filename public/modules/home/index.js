/* global fetch: false */
import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import EditModal from './edit.modal';

const Home = Component.extend({
  name: 'home',
  template,
  config() {
    this.defaults({
      projects: [],
    });

    this.supr();
  },

  init() {
    this._getProjects();
    this.supr();
  },

  edit(event, project = {}) {
    event.stopPropagation();
    const modal = new EditModal({ data: { project } });
    modal.$on('upsertProject', (params) => {
      this._upsertProject(params);
    });
  },

  _upsertProject(params) {
    fetch('/api/project/upsert', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(Object.assign(params, {
        project: params._id,
      })),
    })
    .then(res => res.json())
    .then((json) => {
      this._getProjects();
    }).catch((err) => {
      console.error(err.message);
    });
  },

  _getProjects() {
    fetch('/api/project/list').then(res => res.json()).then((json) => {
      this.$update('projects', json);
    }).catch((err) => {
      console.error(err.message);
    });
  },
});

export default Home;
