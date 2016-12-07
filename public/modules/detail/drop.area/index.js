import { Regular, Component } from 'nek-ui';
import template from '!raw!./index.html';
import ConfigModal from '../config.modal';
import Dnd from './mixins/dnd';
import ContainerModal from './modal/containerModal';

const DropArea = Component.extend({
  name: 'drop.area',
  template,
  config() {
    this.defaults({
      categoryList: [],                               // 组件列表
      col: 12,                                        // drop区域一行有12格
      rows: [{ subRow: [[]], isContainer: false }],   // 放组件
    });
    this.supr();
  },
  init() {
    // FIXME: 暂时无法拿到 r-component 的 ref, 只能先这样了, orz...
    setTimeout(() => {
      this._writeBackNEK();
    }, 1000);
    this.supr();
  },
  // 回写数据到组件
  _writeBackNEK() {
    this.data.rows.forEach((row, row_index) => {
      row.subRow.forEach((subRow, subRow_index) => {
        subRow.forEach((module, module_index) => {
          const ref = `${module.name}_${row_index}_${subRow_index}_${module_index}`;
          const modRef = this.$refs[ref];
          const conf = module.NEK ? module.NEK.conf : [];
          modRef.$emit('update_nek', conf);
        });
      });
    });
  },
  // 添加一行
  addRow() {
    let data = this.data;
    data.rows.push({ subRow: [[]], isContainer: false });
  },
  // 添加子行
  addSubRow(row) {
    row.subRow.push([]);
  },
  deleteModule(subRow, module_index) {
    let module = subRow[module_index];
    let moduleNext = subRow[module_index + 1];
    subRow.splice(module_index, 1);
    if (moduleNext) {
      moduleNext.offset += module.offset + module.moduleWidth;
    }
    return subRow;
  },
  trash(param) {
    let data = this.data;
    let subRow = data.rows[param.rowIndex].subRow[param.subRowIndex];
    this.deleteModule(subRow, param.moduleIndex);
  },
  prompContainerModal(row_index, cname, ctitle) {
    let containerModal = new ContainerModal({
      cname,
      ctitle,
    });
    containerModal.$on('confirm', (param) => {
      this.data.rows[row_index].containerName = param.cname;
      this.data.rows[row_index].containerTitle = param.ctitle;
      this.$update();
    });
  },
  $$NEK(name) {
    let NEK = {};
    this.data.categoryList.forEach((category) => {
      category.componentList.forEach((component) => {
        if (component.name === name) {
          NEK = JSON.parse(JSON.stringify(component));
        }
      });
    });
    // 增加 default 字段，用于后面过滤
    NEK.conf.forEach((d) => {
      d.default = d.value;
    });
    return NEK;
  },
  getAvailableCols(row_index, subRow_index, module_index) {
    let subRow = this.data.rows[row_index].subRow[subRow_index];
    let module = subRow[module_index];
    let cols = 0;
    subRow.forEach((item) => {
      cols += item.moduleWidth + item.offset;
    });
    return (module.moduleWidth + 12) - cols;
  },
  configModule(name, row_index, subRow_index, module_index) {
    let maxCols = this.getAvailableCols(row_index, subRow_index, module_index);
    let ref = `${name}_${row_index}_${subRow_index}_${module_index}`;
    let modRef = this.$refs[ref];
    let module = this.data.rows[row_index].subRow[subRow_index][module_index];
    // 首次会把 NEK 数据放到 module 里作持久化，故需先调用组件的 $$NEK() 方法
    module.NEK = module.NEK || this.$$NEK(name);
    let modal = new ConfigModal({
      data: {
        modRef,
        maxCols,
        NEK: module.NEK,
      },
    });
    modal.$on('update_page', () => {
      module.moduleWidth = module.NEK.cols;
      module.labelTitle = module.NEK.labelTitle;
      module.labelHint = module.NEK.labelHint;
      module.required = module.NEK.required;
      this.$update();
    });
  },
  // type: 1 行操作， 0 子行操作
  moveRowUp(type, param) {
    let data = this.data;
    let rows = data.rows;
    let row = rows[param.row_index].subRow;
    let row_index = param.row_index;
    let subRow_index = param.subRow_index;

    if (type) {
      data.rows = [
        ...rows.slice(0, row_index - 1),
        rows[row_index],
        rows[row_index - 1],
        ...rows.slice(row_index + 1),
      ];
    } else {
      data.rows[row_index].subRow = [
        ...row.slice(0, subRow_index - 1),
        row[subRow_index],
        row[subRow_index - 1],
        ...row.slice(subRow_index + 1),
      ];
    }
  },
  // type: 1 行操作， 0 子行操作
  moveRowDown(type, param) {
    let data = this.data;
    let rows = data.rows;
    let row = rows[param.row_index].subRow;
    let row_index = param.row_index;
    let subRow_index = param.subRow_index;
    if (type) {
      data.rows = [
        ...rows.slice(0, row_index),
        rows[row_index + 1],
        rows[row_index],
        ...rows.slice(row_index + 2),
      ];
    } else {
      data.rows[row_index].subRow = [
        ...row.slice(0, subRow_index),
        row[subRow_index + 1],
        row[subRow_index],
        ...row.slice(subRow_index + 2),
      ];
    }
  },
  // type: 1 行操作， 0 子行操作
  deleteRow(type, param) {
    let data = this.data;
    let row_index = param.row_index;
    let subRow_index = param.subRow_index;
    if (type) {
      data.rows.splice(row_index, 1);
    } else {
      data.rows[row_index].subRow.splice(subRow_index, 1);
    }
  },
  exportJson(rows) {
    let data = this.data;
    let self = this;
    let res = [];
    rows.forEach((row, rowIndex) => {
      res.push({
        components: [],
      });
      let isContainer = row.isContainer;
      if (!isContainer) {
        row.subRow[0].forEach((module, moduleIndex) => {
          let NEK = module.NEK || self.$$NEK(module.name);
          res[rowIndex].components.push(Object.assign({}, NEK, {
            offset: module.offset,
            conf: NEK.conf.filter(d => d.value.toString() !== d.default),
          }));
        });
      } else {
        res[rowIndex].components.push({
          name: row.containerName,
          title: row.containerTitle,
          id: 0,
          offset: 0,
          rows: [],
        });
        row.subRow.forEach((subRow, subRowIndex) => {
          res[rowIndex].components[0].rows.push({ components: [] });
          subRow.forEach((module, moduleIndex) => {
            let NEK = module.NEK || self.$$NEK(module.name);
            res[rowIndex].components[0].rows[subRowIndex].components.push(
              Object.assign({}, NEK, {
                offset: module.offset,
                conf: NEK.conf.filter(d => d.value.toString() !== d.default),
              }
            ));
          });
        });
      }
    });
    return res;
  },
}).filter('uniq', (
  name,
  row_index,
  subRow_index,
  module_index
) => `${name}_${row_index}_${subRow_index}_${module_index}`).use(Dnd);

export default DropArea;
