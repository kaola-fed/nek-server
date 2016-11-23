import { Regular, Component } from 'nek-ui';
import template from '!raw!./index.html';
import ConfigModal from '../config.modal';
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
  dragOver(event) {
    let data = this.data;
    let moduleId = event.origin.data.moduleId;
    let moduleWidth = event.origin.data.width;
    let dropArea = event.target;
    let dropAreaRect = event.target.getBoundingClientRect();
    let proxy = event.proxy;
    let proxyRect = event.proxy.getBoundingClientRect();
    data.firstCol = this.getDropLattice(dropAreaRect, proxyRect, moduleWidth);
    this.setDropLatticeBorder(data.firstCol, moduleWidth, dropArea);
  },
  dragLeave(event) {
    const dropArea = event.target;
    this.clearBorder(dropArea);
  },
    // row_index 表示放入的行， subRow_index 表示放入的子行
  drop(event, row_index, subRow_index) {
    let data = this.data;
    let moduleName = event.origin.data.name;
    let moduleWidth = event.origin.data.width;
    let dropArea = event.target;
    let subRow = data.rows[row_index].subRow[subRow_index];
    // 移动组件时才有的参数
    let isMoveModule = event.origin.data.isMoveModule;   // 是否为移动组件
    let rowIndex = event.origin.data.rowIndex;           // 组件原先所在行的index
    let subRowIndex = event.origin.data.subRowIndex;     // 组件原先所在子行的index
    let moduleIndex = event.origin.data.moduleIndex;     // 组件原先所在的moduleIndex

    let res = this.getIndexAndOffset(subRow, data.firstCol, moduleWidth, row_index, subRow_index, isMoveModule, rowIndex, subRowIndex, moduleIndex);
    if (moduleName === 'container') {
      // 只有drop行不是container，且为空行才能放置container
      if (!data.rows[row_index].isContainer && data.rows[row_index].subRow.length === 1 && data.rows[row_index].subRow[0].length === 0) {
        data.rows[row_index].isContainer = true;
      }
    } else if (res) {
      // 移动组件
      if (isMoveModule) {
        let module = _.cloneDeep(data.rows[rowIndex].subRow[subRowIndex][moduleIndex]);
        module.firstCol = res.firstCol;
        module.offset = res.offset;
        this.deleteModule(data.rows[rowIndex].subRow[subRowIndex], moduleIndex);
        data.rows[row_index].subRow[subRow_index] = [
          ...subRow.slice(0, res.moduleIndex),
          module,
          ...subRow.slice(res.moduleIndex),
        ];
      } else {
        data.rows[row_index].subRow[subRow_index] = [
          ...subRow.slice(0, res.moduleIndex),
          { name: moduleName, moduleWidth: moduleWidth, offset: res.offset, firstCol: res.firstCol },
          ...subRow.slice(res.moduleIndex),
        ];
      }
    }
    this.clearBorder(dropArea);
  },
  // 计算move过程中，模块左侧所属的格子
  getDropLattice(dropAreaRect, proxyRect, moduleWidth) {
    let data = this.data;
    let dropAreaLeft = dropAreaRect.left;
    let dropAreaWidth = dropAreaRect.width;
    let colWidth = (dropAreaWidth - 2) / 12;
    let proxyLeft = proxyRect.left;
    let firstCol;
    for (let i = 0; i < data.col; i++) {
      if (proxyLeft > ((dropAreaLeft - 1) + (i * colWidth)) && proxyLeft < (dropAreaLeft + ((i + 1) * colWidth))) {
        firstCol = i;
        break;
      }
    }

    // 处理边界情况
    firstCol ? '' : firstCol = 0;
    firstCol + moduleWidth > data.col ? firstCol = data.col - moduleWidth : '';
    return firstCol;
  },
  // 设置模块所属dropArea的格子边框
  setDropLatticeBorder(firstCol, moduleWidth, dropArea) {
    let data = this.data;
    let lines = Array.prototype.slice.call(dropArea.getElementsByClassName('line'));
    this.clearBorder(dropArea);

    for (let i = 0; i < moduleWidth; i++) {
      if (firstCol + i > -1 && firstCol + i < data.col) {
        Regular.dom.addClass(lines[firstCol + i], 'linecolor');
      }
    }
  },
  // 清除所有border
  clearBorder(row) {
    let lines = Array.prototype.slice.call(row.getElementsByClassName('line'));
    lines.forEach((line) => {
      Regular.dom.delClass(line, 'linecolor');
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
  // 计算放下的组件在一行中的位置和offset
  getIndexAndOffset(subRow, firstCol, moduleWidth, dropRowIndex, dropSubRowIndex, isMoveModule, rowIndex, subRowIndex, moduleIndex) {
    let data = this.data;
    let subRowClone = _.cloneDeep(subRow);
    // 是移动组件且是同行内移动
    if (isMoveModule && dropRowIndex === rowIndex && dropSubRowIndex === subRowIndex) {
      subRowClone = this.deleteModule(subRowClone, moduleIndex);
    }

    // 为空行的情况下
    if (subRowClone.length === 0) {
      return { moduleIndex: 0, offset: firstCol, firstCol };
    }

    // 非空行，放在第一个的情况下
    if (firstCol + moduleWidth < subRowClone[0].firstCol + 1) {
      subRow[0].offset = subRow[0].firstCol - firstCol - moduleWidth;
      return { moduleIndex: 0, offset: firstCol, firstCol };
    }

    // 非空行，非第一个的情况下
    for (let i = 0; i < subRowClone.length; i++) {
      let module = subRowClone[i];
      // 没有下一个组件，就算到行尾
      let moduleNext = subRow[i + 1] || { firstCol: data.col };
      let moduleNextClone = subRowClone[i + 1] || { firstCol: data.col };
      if ((module.firstCol + module.moduleWidth) - 1 < firstCol && firstCol + moduleWidth < moduleNextClone.firstCol + 1) {
        subRowClone[i + 1] ? moduleNext.offset = moduleNext.firstCol - firstCol - moduleWidth : '';
        return { moduleIndex: i + 1, offset: firstCol - module.firstCol - module.moduleWidth, firstCol };
      }
    }
    return false;
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
  $$NEK(name) {
    let NEK = {};
    this.data.categoryList.forEach((category) => {
      category.componentList.forEach((component) => {
        if (component.name === name) NEK = component;
      });
    });
    return NEK;
  },
  configModule(name, row_index, subRow_index, module_index) {
    let ref = `name_${row_index}_${subRow_index}_${module_index}`;
    let modRef = this.$refs[ref];
    let module = this.data.rows[row_index].subRow[subRow_index][module_index];
    // 首次会把 NEK 数据放到 module 里作持久化，故需先调用组件的 $$NEK() 方法
    module.NEK = module.NEK || this.$$NEK(name);
    // TODO: 用文天给的数据
    let maxCols = module.NEK.cols;
    let modal = new ConfigModal({
      data: {
        modRef,
        maxCols,
        NEK: module.NEK,
      },
    });
    modal.$on('update_cols', (cols) => {
      // TODO: 文天更新逻辑
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
}).filter('uniq', (name, row_index, subRow_index, module_index) => {
  return `name_${row_index}_${subRow_index}_${module_index}`;
});

export default DropArea;
