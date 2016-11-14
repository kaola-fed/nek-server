import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./index.html';

const ConfigModal = Modal.extend({
  name: 'config.modal',
  config() {
    this.defaults({
      contentTemplate,
      conf: [],
    });
    this.$on('ok', this._ok);
    this.supr();
  },
  _ok() {
    // 这里保存对应组件的配置
  }
});

export default ConfigModal;
