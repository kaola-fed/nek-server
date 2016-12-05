import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import DropArea from '../drop.area';
import AddModal from './modal/addModal';

const MainArea = Component.extend({
  name: 'main.area',
  template,
  config(data) {
    this.defaults({
      sync: {rows: [{ subRow: [[]], isContainer: false }], modals: []},
      tab: 0
    });
    this.supr();
  },

  _addModal() {
    let data = this.data;
    let addModal = new AddModal({
      modalName: '',
    });
    addModal.$on('confirm', (res) => {
      data.sync.modals.push({name: res.modalName, rows: [{ subRow: [[]], isContainer: false }]});
      this.$update();
    });
  }
});

export default MainArea;
