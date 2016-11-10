import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import categoryList from '../../categoryList';
import { Draggable, Droppable, Movable } from 'rgui-ui-drag'


const ModuleList = Component.extend({
    name: 'module.list',
    template,
    config() {
        this.defaults({
            tdWidth: 40,
            categoryList: categoryList,
        });
        this.supr();
    }
});

export default ModuleList;
