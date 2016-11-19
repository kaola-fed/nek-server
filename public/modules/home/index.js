import { Component } from 'nek-ui';
import template from '!raw!./index.html';

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

  _getProjects() {
    fetch('/api/project/list').then(res => res.json()).then(json => {
      this.$update('projects', json);
    }).catch(err => {
      console.error(err.message);
    });
  }
});

export default Home;
