import { Modal } from 'nek-ui';
import contentTemplate from '!raw!./index.html';

// return: [1...num]
const genSeqArr = num => [...Array(num)].map((_, i) => i + 1);

const ConfigModal = Modal.extend({
  name: 'config.modal',
  config() {
    this.defaults({
      contentTemplate,
      title: '组件配置',
      maxCols: 1,
      colArr: [],
      labelColArr: genSeqArr(12),
      class: 'm-modal-autoflow',
      cancelButton: true,
      NEK: {},
    });
    // 深度复制，只有在确定的时候才真实写回
    this.data.curConf = JSON.parse(JSON.stringify(this.data.NEK.conf));
    this.data.colArr = genSeqArr(this.data.maxCols);
    this.data.curConf.forEach(function(d) {
      if (d.type == 'array' && d.extraType == 'tbObj') {
        d.value = d.value ? ( d.value instanceof Array ? d.value : []) : [];
      }
    });
    this.$on('ok', this._ok);
    this.supr();
  },
  _ok() {
    const { NEK, curConf } = this.data;
    curConf.forEach((d, i) => {
      NEK.conf[i].value = curConf[i].value;
    });
    this.$emit('update_page');
    this.data.modRef.$emit('update_nek', NEK.conf);
  },
  addItm(crtItem) {
    var newItem = {};
    crtItem.selects.forEach((d) => {
      newItem[d.key] = d.value;
    });
    crtItem.value.push(newItem);
  },
  removeTbItem(crtItem, index) {
    crtItem.value.splice(index, 1);
  }
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
