<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED"></tools-bar>
    <div class="g-workspace">
      <side-bar>
        <component-bar tag="组件" :libraries="libraries"></component-bar>
      </side-bar>
      <div class="g-preview-wrapper">
        <div class="g-preview" @dragover.prevent="" @drop="drop" ref="preview"></div>
      </div>
      <side-bar placement="right">
        <props-bar tag="属性"></props-bar>
      </side-bar>
    </div>

    <div class="u-fs-hint" @click="quitPreview"></div>
  </div>
</template>

<script>
import { install } from 'nek-ui';
import Regular from 'regularjs';

import ToolsBar from './components/ToolsBar.vue';
import SideBar from './components/SideBar.vue';
import ComponentBar from './components/ComponentsBar.vue';
import PropsBar from './components/PropsBar.vue';

import _ from '@/widget/util';

const BaseComponent = Regular.extend({}).directive('r-tag', (elem, value) => {
  elem.attributes.setNamedItem('r-tag', value);
});
install(Regular);
let preview = '';

export default {
  components: {
    ToolsBar,
    SideBar,
    ComponentBar,
    PropsBar,
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
    },
    quitPreview() {
      _.exitFullScreen();
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

    .g-preview-wrapper {
      flex: 1;
      height: 100%;
      padding: 10px;

      .g-preview {
        background-color: white;
        height: 100%;
      }
    }
  }

  .u-fs-hint {
    display: none;
  }
}

:fullscreen {
  .u-fs-hint {
    display: block;
    position: fixed;
    right: 0;
    bottom: 20px;
    width: 145px;
    text-align: center;

    background-color: rgba(43, 43, 43, 0.6);
    color: white;
    padding: 10px 20px;
    cursor: pointer;
  }

  .u-fs-hint:before {
    content: '按下 ESC 退出预览'
  }
  .u-fs-hint:hover:before {
    content: '退出预览'
  }
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
