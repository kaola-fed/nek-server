import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./addModal.html';

const AddModal = Modal.extend({
  name: 'addModal',
  config() {
    this.defaults({
      contentTemplate,
      title: '新建modal',
      class: 'm-modal-autoflow',
      cancelButton: true,
      modalName: this.modalName,
    });
    this.$on('ok', this._ok);
    this.supr();
  },
  _ok() {
    this.$emit('confirm', { modalName: this.data.modalName });
  },
});

export default AddModal;
