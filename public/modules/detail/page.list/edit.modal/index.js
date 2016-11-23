import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./index.html';

const EditModal = Modal.extend({
  name: 'edit.modal',
  config() {
    this.defaults({
      contentTemplate,
      title: '页面编辑',
      cancelButton: true,
      params: {},
    });
    this.data.params = JSON.parse(JSON.stringify(this.data.page));
    this.$on('ok', this._ok);
    this.supr();
  },

  _ok() {
    this.$emit('upsertPageList', this.data.params);
  },
});

export default EditModal;
