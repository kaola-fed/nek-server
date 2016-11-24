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
      cname: this.cname,
      ctitle: this.ctitle,
    });
    this.$on('ok', this._ok);
    this.supr();
  },
  _ok() {
    this.$emit('confirm', {cname: this.data.cname, ctitle: this.data.ctitle});
  }
});

export default ContainerModal;
