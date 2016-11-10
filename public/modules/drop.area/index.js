import { Regular, Component } from 'nek-ui';
import template from '!raw!./index.html';

const DropArea = Component.extend({
    name: 'drop.area',
    template,
    config() {
        this.defaults({
            col: 12,           // drop区域一行有12格
            colWidth: 80,      // drop区域一列的宽度
            rows: [{}]         // 放组件
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

        let firstCol = this.getDropLattice(dropAreaRect, proxyRect, moudleWidth);
        this.setDropLatticeBorder(firstCol, moudleWidth, dropArea);
    },
    dragLeave(event) {

    },
    drop(event) {

    },
    // 计算drop后，模块左上角所属的格子
    getDropLattice(dropAreaRect, proxyRect, moudleWidth) {
        let data = this.data,
            dropAreaLeft = dropAreaRect.left,
            proxyLeft = proxyRect.left,
            firstCol;

        for(let i = 0; i < data.col; i++) {
            if (proxyLeft == (dropAreaLeft + i * data.colWidth) || (proxyLeft > (dropAreaLeft + i * data.colWidth) && proxyLeft < (dropAreaLeft + (i+1) * data.colWidth))) {
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
        // 清除所有样式
        lines.forEach(function(line) {
            Regular.dom.delClass(line, 'border-left');
        })

        for(let i = 0; i < moduleWidth + 1; i++) {
            if(firstCol + i - 1 > -1 && firstCol + i - 1 < data.col - 1) {
                Regular.dom.addClass(lines[firstCol + i - 1], 'border-left');
            }
        }
    }
});

export default DropArea;
