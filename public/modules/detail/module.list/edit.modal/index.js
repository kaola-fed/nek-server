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
      typeList: ['string', 'number', 'none', 'boolean', 'array', 'select', 'expression'],
      extraTypeList: ['string', 'number', 'boolean','tbObj'],
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
  removeChildAttr(crtItem, index) {
    crtItem.selects.splice(index, 1);
  },

  add() {
    this.data.params.conf.push({selects: []});
  },
  addAttr(list) {
    list = list || [];
    list.push({key: '', desc: '', value: ''});
  },
  move(idx, step) {
    const conf = this.data.params.conf;
    [conf[idx], conf[idx + step]] = [conf[idx + step], conf[idx]];
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
