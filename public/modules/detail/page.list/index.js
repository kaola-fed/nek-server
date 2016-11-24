import { Component } from 'nek-ui';
import EditModal from './edit.modal';
import template from '!raw!./index.html';

const PageList = Component.extend({
  name: 'page.list',
  template,
  config() {
    this.defaults({
      pageList: [],
      activePage: {}
    });
    this.supr();
  },

  edit(event, page = {}) {
    event.stopPropagation();
    const modal = new EditModal({ data: { page } });
    modal.$on('upsertPageList', (params) => {
      this.$emit('upsertPageList', params);
    });
  },
  
  changePage(item) {
    let data = this.data;
    data.activePage.active = false;
    data.activePage = item;
    item.active = true;
  }
});

export default PageList;
