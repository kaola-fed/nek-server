<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED"></tools-bar>
    <div class="g-workspace">
      <component-bar :libraries="libraries"></component-bar>
      <div class="g-preview" @dragover.prevent="" @drop="drop" ref="preview"></div>
      <div class="g-rsb">

      </div>
    </div>
  </div>
</template>

<script>
import {install} from 'nek-ui';
import Regular from 'regularjs';

import ToolsBar from './components/ToolsBar.vue';
import ComponentBar from './components/ComponentsBar.vue';


const BaseComponent = Regular.extend({}).directive('r-tag', (elem, value) => {
  elem.attributes.setNamedItem('r-tag', value);
});
install(Regular);
let preview = '';

export default {
  components: {
    ToolsBar,
    ComponentBar
  },
  mounted() {
    preview = this.$refs.preview;
  },
  data() {
    return {
      libraries: [
        {
          name: 'NEK-UI',
          version: '0.6.1',
          components: [
            {name: 'kl-input'},
            {name: 'kl-card'},
            {name: 'kl-button'},
            {name: 'kl-row'},
            {name: 'kl-col-1'},
            {name: 'kl-col-2'},
            {name: 'kl-col-3'},
            {name: 'kl-col-4'},
          ]
        }
      ]
    };
  },
  methods: {
    drop(event) {
      const path = event.path;
      let componentsName = event.dataTransfer.getData('text');
      let slot = '';
      if (componentsName.indexOf('kl-col') > -1) {
        slot = componentsName.split('-').pop();
        componentsName = 'kl-col';
      }
      let flag = false;
      for (let i = 0; i < path.length; i++) {
        if (path[i].className && path[i].className.indexOf('r-tag') > -1) {
          this.refresh(componentsName, path[i], slot);
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.refresh(componentsName);
      }
    },
    render(tpl, node = preview) {
      // while(node.firstChild) {
      //   node.removeChild(node.firstChild);
      // }
      const RootComponent = new BaseComponent({
        template: tpl
      });
      RootComponent.$inject(node);
    },
    refresh(flag, node, slot) {
      let tpl = '';
      switch (flag) {
        case 'kl-input':
          tpl = '<kl-input placeholder="请输入" ref="root-input" class="root-input r-tag" r-tag="root-input" />';
          break;
        case 'kl-button':
          tpl = '<kl-button title="哈哈" ref="root-button" class="root-button r-tag" r-tag="root-button" />';
          break;
        case 'kl-card':
          tpl = '<kl-card title="用户信息" ref="root-card" class="root-card r-tag" r-tag="root-card"></kl-card>';
          break;
        case 'kl-row':
          tpl = '<kl-row type="flex" gutter="0" class="root-row r-tag"></kl-row>';
          break;
        case 'kl-col':
          tpl = `<kl-col span="${slot}" class="root-col r-tag"></kl-col>`;
          break;
        default:
          tpl = '<kl-row type="flex" gutter="0" class="root-row r-tag"></kl-row>';
          break;
      }
      this.render(tpl, node);
    }
  }
};
</script>

<style>
.g-editor {
  position: relative;
  height: 100%;
  background-color: #EAEDF3;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .g-workspace {
    display: flex;
    flex: 1;

    .g-preview {
      flex: 1;
      height: 100%;
      margin: 10px;
      background-color: white;
    }
  }
}

.g-lsb {
  position: absolute;
  left: 0;
  display: inline-block;
  width: 120px;
  height: calc(100vh - 60px);
  border-right: 1px solid #ccc;
  overflow: auto;
}

.g-main {
  position: absolute;
  display: inline-block;
  left: 120px;
  right: 120px;
  width: calc(100vw - 260px);
  height: calc(100vh - 80px);
  margin: 10px;
  overflow: auto;
}

.g-rsb {
  width: 120px;
  height: 100%;
  border-left: 1px solid #ccc;
  overflow: auto;
}

.g-row {
  min-height: 50px;
  border: 1px dashed #ddd;
}

.g-col {
  min-height: 45px;
  border: 1px dashed #ddd;
}
</style>
