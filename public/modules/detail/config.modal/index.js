import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./index.html';

const ConfigModal = Modal.extend({
  name: 'config.modal',
  config() {
    this.defaults({
      contentTemplate,
      title: '组件配置',
      class: 'm-modal-autoflow',
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
    curConf.forEach((d, i) => {
      conf[i].value = curConf[i].value;
    });
    this.data.modRef.$emit('update_nek', conf);
  },
}).filter('name2id', {
  get(name, selects) {
    const source = selects.map((d) => {
      if (typeof d === 'object') return d.name;
      return d;
    });
    return `${source.indexOf(name)}`;
  },
  set(id, selects) {
    const source = selects.map((d) => {
      if (typeof d === 'object') return d.name;
      return d;
    });
    return source[id / 1];
  },
}).filter('str2bool', {
  get(str = 'false') {
    return str === 'true';
  },
  set(bool = false) {
    return bool.toString();
  },
});

export default ConfigModal;
