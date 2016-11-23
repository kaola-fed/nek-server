import { Component } from 'nek-ui';
import EditModal from './edit.modal';
import template from '!raw!./index.html';

const PageList = Component.extend({
  name: 'page.list',
  template,
  config() {
    this.defaults({
      pageList: [],
    });
    this.supr();
  },

  edit(page = {}) {
    const modal = new EditModal({ data: { page } });
    modal.$on('upsertPageList', (params) => {
      this.$emit('upsertPageList', params);
    });
  },
});

export default PageList;
