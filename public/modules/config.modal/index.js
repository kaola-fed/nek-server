import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./index.html';

const ConfigModal = Modal.extend({
  name: 'config.modal',
  config() {
    this.defaults({
      contentTemplate,
      title: '组件配置',
      cancelButton: true,
      conf: [],
    });
    // 深度复制，只有在确定的时候才真实写回
    this.data.curConf = JSON.parse(JSON.stringify(this.data.conf));
    this.$on('ok', this._ok);
    this.supr();
  },
  _ok() {
    const { conf, curConf } = this.data;
    curConf.forEach(function(d, i) {
      conf[i].value = curConf[i].value;
    });
  }
});

export default ConfigModal;
