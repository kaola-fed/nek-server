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
      tab: -1
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
  },

  _changeTab(tab) {
    this.data.tab = tab;
    this.$update();
  },

  _getJson() {
    const dropArea = this.$refs.dropArea;
    let data = this.data;
    let res = {};
    res.pageId = this.$parent.$refs.pageList.data.activePage._id;
    res.rows = dropArea.exportJson(data.sync.rows);
    if(data.sync.modals.length > 0) {
      res.modals = [];
      data.sync.modals.forEach((modal) => {
        res.modals.push({name: modal.name, rows: dropArea.exportJson(modal.rows)});
      })
    }
    console.log(res);
    return res;
  }
});

export default MainArea;
