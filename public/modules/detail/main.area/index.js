import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import DropArea from '../drop.area';
import AddModal from './modal/addModal';

const MainArea = Component.extend({
  name: 'main.area',
  template,
  config(data) {
    this.defaults({
      sync: { rows: [{ subRow: [[]], isContainer: false }], modals: [] },
      tab: -1,
    });
    this.supr();
  },

  _addModal() {
    let data = this.data;
    let sync = data.sync;
    let addModal = new AddModal({
      data: { title: '新建modal' },
      modalName: '',
    });
    addModal.$on('confirm', (res) => {
      if (!sync.modals) sync.modals = [];
      sync.modals.push({ name: res.modalName, rows: [{ subRow: [[]], isContainer: false }] });
      this.$update();
    });
  },

  _editModalInfo(event, modal) {
    event.stopPropagation();
    let addModal = new AddModal({
      modalName: modal.name,
    });
    addModal.$on('confirm', (res) => {
      modal.name = res.modalName;
      this.$update();
    });
  },

  _changeTab(tab) {
    this.data.tab = tab;
  },

  _getJson() {
    const dropArea = this.$refs['dropArea_-1'];
    let data = this.data;
    let res = {};
    res.pageId = this.$parent.$refs.pageList.data.activePage._id;
    res.rows = dropArea.exportJson(data.sync.rows);
    if (data.sync.modals && data.sync.modals.length > 0) {
      res.modals = [];
      data.sync.modals.forEach((modal) => {
        res.modals.push({ name: modal.name, rows: dropArea.exportJson(modal.rows) });
      });
    }
    console.log(res);
    return res;
  },
});

export default MainArea;
