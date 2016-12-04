import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import DropArea from '../drop.area';

const Main = Component.extend({
  name: 'main',
  template,
  config(data) {
    this.defaults({
      sync: {rows: [{ subRow: [[]], isContainer: false }], modals: []},
      tab: 0
    });
    this.supr();
  },

  init() {
    let data = this.data;
    this.$on('updateRow', (rows) => {
      data.rows = rows;
      this.$update();
    })
  },

  _changeTab(tab) {
    let data = this.data;
    data.tab = tab;
    let rows;

    data.sync.modals = [{rows: [{ subRow: [[]], isContainer: false }]}];
    if (tab == 0) {
      rows = data.sync.rows;
    } else {
      rows = data.sync.modals[tab - 1].rows;
    }
    this.$update('rows', rows);
  }
});

export default Main;
