const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
import {  Draggable, Droppable, Movable } from 'rgui-ui-drag'


const ModuleList = RGUI.Component.extend({
    name: 'moduleList',
    template: tpl,
    config: function() {
        this.defaults({
            tdWidth: 40,
            list: [
                {
                    category: {
                        name: '基础组件',
                        modules: [{
                            name: 'form.input',
                            moduleId: 1,
                            width: 5,
                            height: 1
                        }, {
                            name: 'form.number',
                            moduleId: 1,
                            width: 4,
                            height: 2
                        },
                        {
                            name: 'form.number',
                            moduleId: 1,
                            width: 5,
                            height: 3
                        }]
                    }
                },
                {
                    category: {
                        name: '业务组件',
                        modules: [{
                            name: 'form.input',
                            moduleId: 1,
                            width: 5,
                            height: 1
                        }, {
                            name: 'form.input',
                            moduleId: 1,
                            width: 5,
                            height: 1
                        }, {
                            name: 'form.number',
                            moduleId: 1,
                            width: 4,
                            height: 1
                        }]
                    }
                }
            ]
        });
        this.supr();
    }
});

module.exports = ModuleList;
