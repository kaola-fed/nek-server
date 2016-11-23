import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./containerModal.html';

const ContainerModal = Modal.extend({
  name: 'containerModal',
  config() {
    this.defaults({
      contentTemplate,
      title: '模块名配置',
      class: 'm-modal-autoflow',
      cancelButton: true,
      name: this.name
    });
    this.$on('ok', this._ok);
    this.supr();
  },
  _ok() {
    this.$emit('confirm', this.data.name);
  }
});

export default ContainerModal;
