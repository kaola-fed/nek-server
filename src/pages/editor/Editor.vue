<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED"></tools-bar>
    <div class="g-workspace">
      <side-bar :tabs="leftBars" @changed="leftSideBarView = $event.name">
        <keep-alive>
          <!-- props考虑改成一个store，组件内部进行mapState，下同 -->
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

import ToolsBar from './components/ToolsBar.vue';
import SideBar from './components/SideBar.vue';
import ComponentBar from './components/ComponentsBar.vue';
import DirectoryBar from './components/DirectoryBar.vue';
import PropsBar from './components/PropsBar.vue';

import _ from '@/widget/util';
import NekComponent from '@/widget/NekComponent';
import genRegularTemplate from '@/../core/transfer';

import { getLibraries } from '@/api/library';

const addAttributes = (f, id, lib, tag) => {
  if (Array.isArray(f)) {
    for (let i of f) {
      if (i.setAttribute) {
        i.setAttribute('ns-id', id);
        i.setAttribute('ns-lib', lib);
        i.setAttribute('ns-tag', tag);
      }
    }
  } else {
    f.setAttribute('ns-id', id);
    f.setAttribute('ns-lib', lib);
    f.setAttribute('ns-tag', tag);
  }
  return f;
};

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
    this.$nekVNodes = {
      // 默认根节点
      0: {
        tagName: 'div',
        parent: null,
        attributes: { id: 'ns-app' },
        children: []
      }
    };

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
    /*====== 业务逻辑 ======*/

    quitPreview() {
      _.exitFullScreen();
    },

    /*====== 事件绑定 ======*/

    drop(event) {
      const libName = event.dataTransfer.getData('libName');
      const tagName = event.dataTransfer.getData('tagName');
      // 拖拽已有组件的时候带上
      const nsId = event.dataTransfer.getData('nsId');
      const parent = this.getParentNode(event.path);

      if (nsId) {
        this.updateHandler();
      } else {
        this.createHandler(libName, tagName, parent);
      }
    },

    /*====== 组件变化处理函数 ======*/

    // 拖拽等操作触发的新增组件处理函数
    createHandler(libName, tagName, parentNode/*, nextBrother = null*/) {
      const lib = this.libraries.find(el => el.name === libName);
      if (!lib) {
        throw new Error(`Unknown component library '${libName}'`);
      }

      let parentId = null;
      if (parentNode) {
        parentId = parentNode.getAttribute('ns-id');
      }

      const component = lib.components.find(el => el.tag === tagName);
      if (!component) {
        return;
      }

      const attributes = {};
      for (let i in component.attributes) {
        if (component.attributes.hasOwnProperty(i) && component.attributes[i].default != null) {
          const value = component.attributes[i].default;
          attributes[i] = {
            value,
            type: typeof value
          };
        }
      }

      // TODO: ObjectId gen
      const nodeId = Math.random();
      this.$nekVNodes[nodeId] = {
        tagName,
        parent: parentId,
        attributes,
        children: []
      };

      const tpl = genRegularTemplate(this.$nekVNodes, this.$nekVNodes[nodeId]);
      this.inject(tpl, parentNode, { id: nodeId, lib: libName, tag: tagName });
    },

    // 选中等操作
    selectHandler() {
      //
    },

    // 更新属性等操作
    updateHandler() {
      //
    },

    /*====== 工具函数等 ======*/

    canLayout(libName, tagName) {
      const lib = this.libraries.find(el => el.name === libName);
      if (!lib) {
        return false;
      }

      const res = (lib.components.find(el => el.tag === tagName) || {}).isLayout;
      return !!res;
    },

    getParentNode(path) {
      for (let i of path) {
        if (i.getAttribute) {
          let nsTag = i.getAttribute('ns-tag');
          if (nsTag && this.canLayout(i.getAttribute('ns-lib'), nsTag)) {
            return i;
          }
        }
      }
      return null;
    },


    inject(tpl, parent, { direction, id, lib, tag }) {
      parent = parent || this.$refs.preview;

      const RootComponent = new NekComponent({
        template: tpl
      });
      RootComponent.$inject(parent, {
        direction,
        beforeInsert: f => addAttributes(f, id, lib, tag)
      });
    },
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
