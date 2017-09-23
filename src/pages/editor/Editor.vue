<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED"></tools-bar>
    <div class="g-workspace">
      <side-bar :tabs="leftBars" @changed="leftSideBarView = $event.name">
        <keep-alive>
          <!-- 参数考虑改成一个store，组件内部进行mapState，下同 -->
          <component :is="leftSideBarView" :libraries="libraries"></component>
        </keep-alive>
      </side-bar>
      <div class="g-preview-wrapper">
        <div class="g-preview" @dragover.prevent="" @drop="drop" ref="preview"></div>
      </div>
      <side-bar :tabs="rightBars" placement="right" @changed="rightSideBarView = $event.name">
        <keep-alive>
          <component :is="rightSideBarView" :libraries="libraries"></component>
        </keep-alive>
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
import DirectoryBar from './components/DirectoryBar.vue';
import PropsBar from './components/PropsBar.vue';

import _ from '@/widget/util';

import { getLibraries } from '@/api/library';

install(Regular);

const BaseComponent = Regular.extend().directive('r-tag', (elem, value) => {
  console.log('???');
  elem.setAttribute('r-tag', value);
});

export default {
  components: {
    ToolsBar,
    SideBar,
    ComponentBar,
    DirectoryBar,
    PropsBar,
  },
  async mounted() {
    this.preview = this.$refs.preview;
    const { data } = await getLibraries({ names: 'nekui' });
    this.libraries = data;
    this.$forceUpdate();
  },
  data() {
    return {
      libraries: [],

      leftBars: [
        { label: '组件', name: 'ComponentBar' },
        { label: '目录', name: 'DirectoryBar' },
      ],
      leftSideBarView: 'ComponentBar',

      rightBars: [
        {label: '属性', name: 'PropsBar'}
      ],
      rightSideBarView: 'PropsBar'
    };
  },
  methods: {
    drop(event) {
      const path = event.path;
      let componentsName = event.dataTransfer.getData('text');
      let flag = false;
      for (let i = 0; i < path.length; i++) {
        if (path[i].className && path[i].className.indexOf('r-tag') > -1) {
          this.refresh(componentsName, path[i]);
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.refresh(componentsName);
      }
    },
    render(tpl, node) {
      node = node || this.$refs.preview;

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
          tpl = '<some-custom title="用户信息" ref="root-card" class="root-card r-tag" r-tag="test" >test</some-custom>';
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
    },

    /* 组件变化处理函数 */

    // 拖拽等操作触发的新增组件处理函数
    createHandler() {
      //
    },

    // 选中等操作
    selectHandler() {
      //
    },

    // 更新属性等操作
    updateHandler() {
      //
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

.r-tag:hover {
  box-shadow: 0 0 10px rgba(35, 151, 121, 0.5);
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
