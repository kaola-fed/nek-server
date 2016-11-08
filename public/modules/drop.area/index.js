const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
const Regular = require('regularjs');

const DropArea = RGUI.Component.extend({
    name: 'dropArea',
    template: tpl,
    config() {
        this.defaults({
            col: 24,           // drop区域有多少列
            row: 24,           // drop区域有多少行, 初始一行
            tdWidth: 40        // drop区域一个格子的宽度，也即高度
        });
        this.supr();
    },
    dragOver(event) {
        let data = this.data,
            moduleId = event.origin.data.moduleId,
            width = event.origin.data.width,
            height= event.origin.data.height,
            dropArea = event.target,
            dropAreaRect = event.target.getBoundingClientRect(),
            proxy = event.proxy,
            proxyRect = event.proxy.getBoundingClientRect(),
            rows = Array.prototype.slice.call(dropArea.getElementsByClassName('row'));
        // console.log(moduleId, width, height, dropArea, dropAreaRect, proxy, proxyRect);

        let firstTd = this.getDropLattice(dropAreaRect, proxyRect, width, height);
        this.setDropLatticeBorder(firstTd.firstCol, firstTd.firstRow, width, height, rows)
    },
    dragLeave(event) {

    },
    drop(event) {

    },
    // 计算drop后，模块左上角所属的格子
    getDropLattice(dropAreaRect, proxyRect, width, height) {
        let data = this.data,
            dropAreaTop = dropAreaRect.top,
            dropAreaLeft = dropAreaRect.left,
            proxyLeft = proxyRect.left,
            proxyTop = proxyRect.top,
            firstCol,firstRow;

        for(let i = 0; i < data.col; i++) {
            if (proxyLeft == (dropAreaLeft + i * data.tdWidth) || (proxyLeft > (dropAreaLeft + i * data.tdWidth) && proxyLeft < (dropAreaLeft + (i+1) * data.tdWidth))) {
                firstCol = i;
                break;
            }
        }

        for(let i = 0; i < data.row; i++) {
            if (proxyTop == (dropAreaTop + i * data.tdWidth) || (proxyTop > (dropAreaTop + i * data.tdWidth) && proxyTop < (dropAreaTop + (i+1) * data.tdWidth))) {
                firstRow = i;
                break;
            }
        }
        
        // 处理边界情况
        firstCol ? '': firstCol = 0;
        firstCol + width > data.col-1 ? firstCol = data.col - width : '';
        firstRow ? '': firstRow = 0;
        firstRow + height > data.row -1 ? firstRow = data.row  - height : '';

        return {firstCol: firstCol, firstRow: firstRow}
    },
    // 设置模块所属dropArea的格子边框
    setDropLatticeBorder(firstCol, firstRow, moduleWidth, moduleHeight, rows) {
        let tdRow,tdCol,tdRowUp,tdColUp;
        // 清除所有样式
        rows.forEach(function(row) {
            row = Array.prototype.slice.call(row.getElementsByClassName('col'));
            row.forEach(function(col) {
                Regular.dom.delClass(col, 'border-bottom');
                Regular.dom.delClass(col, 'border-right');
                Regular.dom.delClass(col, 'border-top');
                Regular.dom.delClass(col, 'border-left');
            })
        })
        for(let i = 0; i < moduleHeight; i++) {
            tdRow = rows[firstRow+i];
            tdCol = Array.prototype.slice.call(tdRow.getElementsByClassName('col'));
            for(let j = 0; j < moduleWidth; j++) {
                if(i == 0) {
                    Regular.dom.addClass(tdCol[firstCol+j], 'border-top');
                }
                if(i == moduleHeight -1) {
                    Regular.dom.addClass(tdCol[firstCol+j], 'border-bottom');
                }
                if(j == 0) {
                    Regular.dom.addClass(tdCol[firstCol+j], 'border-left');
                }
                if(j == moduleWidth - 1) {
                    Regular.dom.addClass(tdCol[firstCol+j], 'border-right');
                }
            }
        }
    }
});

module.exports = DropArea;
