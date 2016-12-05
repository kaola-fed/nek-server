import { Regular } from 'nek-ui';
import _ from 'lodash';

const Dnd = (Comp) => {
  Comp.implement({
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
          // 弹窗填写模块名字
          this.prompContainerModal(row_index, '');
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
            { name: moduleName, moduleWidth, offset: res.offset, firstCol: res.firstCol },
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
      for (let i = 0; i < data.col; i += 1) {
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

      for (let i = 0; i < moduleWidth; i += 1) {
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
      for (let i = 0; i < subRowClone.length; i += 1) {
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
  });
};
export default Dnd;
