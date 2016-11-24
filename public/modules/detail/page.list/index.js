import { Component, Notify } from 'nek-ui';
import EditModal from './edit.modal';
import template from '!raw!./index.html';
import clipboard from 'clipboard-js';

const PageList = Component.extend({
  name: 'page.list',
  template,
  config() {
    this.defaults({
      pageList: [],
      activePage: {},
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

  copyPageId(event, item) {
    event.stopPropagation();
    clipboard.copy(item._id);
    Notify.notify.success('页面id已成功复制到剪贴板');
  },

  changePage(item) {
    let data = this.data;
    data.activePage.active = false;
    data.activePage = item;
    item.active = true;
    this.$emit('changePage', item._id);
  },
});

export default PageList;
