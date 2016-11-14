import { Regular, Component } from 'nek-ui';
import template from '!raw!./index.html';
import ConfigModal from '../config.modal';

const DropArea = Component.extend({
    name: 'drop.area',
    template,
    config() {
        this.defaults({
            col: 12,           // drop区域一行有12格
            colWidth: 80,      // drop区域一列的宽度
            rows: [[]]         // 放组件
        });
        this.supr();
    },
    dragOver(event) {
        let data = this.data,
            moduleId = event.origin.data.moduleId,
            moudleWidth = event.origin.data.width,
            dropArea = event.target,
            dropAreaRect = event.target.getBoundingClientRect(),
            proxy = event.proxy,
            proxyRect = event.proxy.getBoundingClientRect();

        data.firstCol = this.getDropLattice(dropAreaRect, proxyRect, moudleWidth);
        this.setDropLatticeBorder(data.firstCol, moudleWidth, dropArea);
    },
    dragLeave(event) {
        let dropArea = event.target;
        this.clearBorder(dropArea);
    },
    // index 表示是哪一行
    drop(event, index) {
        let data = this.data,
            moduleName = event.origin.data.name,
            moudleWidth = event.origin.data.width,
            dropArea = event.target,
            row = data.rows[index];

        let res = this.getIndexAndOffset(row, data.firstCol, moudleWidth);
        if(res) {
            data.rows[index] = [
                ...row.slice(0, res.moduleIndex),
                {name: moduleName, moduleWidth: moudleWidth, offset: res.offset, firstCol: res.firstCol},
                ...row.slice(res.moduleIndex)
            ]
        }
        this.clearBorder(dropArea);

    },
    // 计算move过程中，模块左上角所属的格子
    getDropLattice(dropAreaRect, proxyRect, moudleWidth) {
        let data = this.data,
            dropAreaLeft = dropAreaRect.left,
            proxyLeft = proxyRect.left,
            firstCol;

        for(let i = 0; i < data.col; i++) {
            if (proxyLeft > (dropAreaLeft -1 + i * data.colWidth) && proxyLeft < (dropAreaLeft + (i+1) * data.colWidth)) {
                firstCol = i;
                break;
            }
        }
        
        // 处理边界情况
        firstCol ? '': firstCol = 0;
        firstCol + moudleWidth > data.col ? firstCol = data.col - moudleWidth : '';

        return firstCol;
    },
    // 设置模块所属dropArea的格子边框
    setDropLatticeBorder(firstCol, moduleWidth, dropArea) {
        let data = this.data;
        let lines = Array.prototype.slice.call(dropArea.getElementsByClassName('line'));
        this.clearBorder(dropArea);

        for(let i = 0; i < moduleWidth + 1; i++) {
            if(firstCol + i - 1 == -1) {
                Regular.dom.addClass(dropArea, 'border-left');
            }
            if(firstCol + i - 1 == data.col - 1) {
                Regular.dom.addClass(dropArea, 'border-right');
            }
            if(firstCol + i - 1 > -1 && firstCol + i - 1 < data.col - 1) {
                Regular.dom.addClass(lines[firstCol + i - 1], 'border-left');
            }
        }
    },
    // 清除所有border
    clearBorder(row) {
        let lines = Array.prototype.slice.call(row.getElementsByClassName('line'));
        Regular.dom.delClass(row, 'border-left');
        Regular.dom.delClass(row, 'border-right');
        lines.forEach(function(line) {
            Regular.dom.delClass(line, 'border-left');
        })
    },
    // 添加一行
    addRow() {
        let data = this.data;
        data.rows.push([]);
    },
    // 计算放下的组件在一行中的位置和offset
    getIndexAndOffset(row, firstCol, moduleWidth) {
        let data = this.data;
        // 为空行的情况下
        if (row.length == 0) {
            return {moduleIndex: 0, offset: firstCol, firstCol: firstCol}
        }

        // 非空行，放在第一个的情况下
        if (firstCol + moduleWidth < row[0].firstCol + 1) {
            row[0].offset = row[0].firstCol - firstCol - moduleWidth;
            return {moduleIndex: 0, offset: firstCol, firstCol: firstCol}
        }

        // 非空行，非第一个的情况下
        for(let i = 0; i < row.length; i++) {
            let module = row[i];
            // 没有下一个组件，就算到行尾
            let moduleNext = row[i+1] || {firstCol: data.col};
            if(module.firstCol + module.moduleWidth -1 < firstCol && firstCol + moduleWidth < moduleNext.firstCol + 1) {
                row[i+1] ? moduleNext.offset = moduleNext.firstCol - firstCol - moduleWidth : '';
                return {moduleIndex: i+1, offset: firstCol-module.firstCol-module.moduleWidth, firstCol: firstCol}
            }
        }
        return false;
    },
    deleteModule(row_index, module_index) {
        let data = this.data,
            module = data.rows[row_index][module_index],
            moduleNext = data.rows[row_index][module_index+1];
        data.rows[row_index].splice(module_index, 1);

        if(moduleNext) {
            moduleNext.offset += module.offset + module.moduleWidth;
        }
    },
    configModule(name, row_index, module_index) {
        let ref = name + '_' + row_index + '_' + module_index,
            mod = this.$refs[ref];
        new ConfigModal({
            data: {
                conf: (mod.$$NEK && mod.$$NEK().conf) || []
            }
        });
    },
    moveRowUp(row_index) {
        let data = this.data,
            rows = data.rows;
        data.rows = [
            ...rows.slice(0, row_index - 1),
            rows[row_index],
            rows[row_index - 1],
            ...rows.slice(row_index + 1)
        ]
    },
    moveRowDown(row_index) {
        let data = this.data,
            rows = data.rows;
        data.rows = [
            ...rows.slice(0, row_index),
            rows[row_index + 1],
            rows[row_index],
            ...rows.slice(row_index + 2)
        ]
    },
    deleteRow(row_index) {
        let data = this.data;
        data.rows.splice(row_index, 1);
    }
}).filter('uniq', function(name, row_index, module_index) {
    return name + '_' + row_index + '_' + module_index;
});

export default DropArea;
