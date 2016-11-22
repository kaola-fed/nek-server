import { Component } from 'nek-ui';
import EditModal from './edit.modal';
import template from '!raw!./index.html';
import { Draggable, Droppable, Movable } from 'rgui-ui-drag';


const ModuleList = Component.extend({
  name: 'module.list',
  template,
  config() {
    this.defaults({
      colWidth: 80,
      categoryList: [],
    });
    this.supr();
  },

  edit(component = {}) {
    const categoryList = this.data.categoryList;
    const modal = new EditModal({ data: { component, categoryList } });
    modal.$on('upsertComponentList', (params) => {
      this.$emit('upsertComponentList', params);
    });
  },
});

export default ModuleList;
