const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
const categoryList = require('../../categoryList');

import {  Draggable, Droppable, Movable } from 'rgui-ui-drag'


const ModuleList = RGUI.Component.extend({
    name: 'module.list',
    template: tpl,
    config: function() {
        this.defaults({
            tdWidth: 40,
            categoryList: categoryList,
        });
        this.supr();
    }
});

module.exports = ModuleList;
