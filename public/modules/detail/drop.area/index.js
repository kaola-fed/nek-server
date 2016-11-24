import { Regular, Component } from 'nek-ui';
import template from '!raw!./index.html';
import ConfigModal from '../config.modal';
import Dnd from './mixins/dnd';
import ContainerModal from './modal/containerModal';
import _ from 'lodash';

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
    let ref = `name_${row_index}_${subRow_index}_${module_index}`;
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
      this.$update();
    });
  },
  moveRowUp(row_index) {
    let data = this.data;
    let rows = data.rows;
    data.rows = [
      ...rows.slice(0, row_index - 1),
      rows[row_index],
      rows[row_index - 1],
      ...rows.slice(row_index + 1),
    ];
  },
  moveRowDown(row_index) {
    let data = this.data;
    let rows = data.rows;
    data.rows = [
      ...rows.slice(0, row_index),
      rows[row_index + 1],
      rows[row_index],
      ...rows.slice(row_index + 2),
    ];
  },
  deleteRow(row_index) {
    let data = this.data;
    data.rows.splice(row_index, 1);
  },
  exportJson() {
    let data = this.data;
    let self = this;
    let res = {};
    res.rows = [];

    data.rows.forEach((row, rowIndex) => {
      res.rows.push({
        clazz: '',
        components: [],
      });
      let isContainer = row.isContainer;
      if (!isContainer) {
        row.subRow[0].forEach((module, moduleIndex) => {
          let NEK = module.NEK || self.$$NEK(module.name);
          res.rows[rowIndex].components.push({
            name: NEK.name,
            id: NEK.id,
            clazz: '',
            layout: NEK.layout,
            conf: NEK.conf,
          });
        });
      } else {
        res.rows[rowIndex].components.push({
          name: 'container',
          clazz: '',
          rows: [],
        });
        row.subRow.forEach((subRow, subRowIndex) => {
          res.rows[rowIndex].components[0].rows.push({ clazz: '', components: [] });
          subRow.forEach((module, moduleIndex) => {
            let NEK = module.NEK || self.$$NEK(module.name);
            res.rows[rowIndex].components[0].rows[subRowIndex].components.push({
              name: NEK.name,
              id: NEK.id,
              clazz: '',
              layout: NEK.layout,
              conf: NEK.conf,
            });
          });
        });
      }
    });
    console.log(this.data);
    console.log(res);
    console.log(JSON.stringify(res));
  },
}).filter('uniq', (
  name,
  row_index,
  subRow_index,
  module_index
) => `name_${row_index}_${subRow_index}_${module_index}`).use(Dnd);

export default DropArea;
