import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./index.html';

const EditModal = Modal.extend({
  name: 'edit.modal',
  config() {
    this.defaults({
      contentTemplate,
      title: '组件编辑',
      class: 'm-modal-autoflow',
      cancelButton: true,
      typeList: ['none', 'string', 'number', 'boolean', 'array', 'select', 'expression'],
      params: {},
    });
    this.data.params = JSON.parse(JSON.stringify(this.data.component));
    this.data.params.conf = this.data.params.conf || [];
    this.$on('ok', this._ok);
    this.supr();
  },

  _ok() {
    this.$emit('upsertComponentList', this.data.params);
  },

  remove(idx) {
    this.data.params.conf.splice(idx, 1);
  },

  add() {
    this.data.params.conf.push({});
  },
}).filter('arr2str', {
  get(arr = [], split = ' ') {
    return arr.join(' ');
  },
  set(str = '', split = ' ') {
    return str.split(split);
  },
});

export default EditModal;
