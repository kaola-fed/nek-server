<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED"></tools-bar>
    <div class="g-workspace">
      <side-bar :tabs="leftBars" @changed="leftSideBarView = $event.name">
        <keep-alive>
          <component :is="leftSideBarView" :libraries="libraries"></component>
        </keep-alive>
      </side-bar>
      <div class="g-preview-wrapper">
        <div ref="preview" class="g-preview" id="ns-preview" ns-id="0"
             @dragover.prevent="" @dragstart="onPreviewDrag" @drop="onPreviewDrop"
             @click="onPreviewClick"
             @keydown.delete="onDeletePress"
        ></div>
        <side-bar :tabs="codeBars" placement="bottom"></side-bar>
      </div>
      <side-bar :tabs="rightBars" placement="right" @changed="rightSideBarView = $event.name">
        <keep-alive>
          <component :is="rightSideBarView"
                     :attributes="currentAttributes" :model="currentComponent"
                     @change="onPropChange"
          ></component>
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
import VNodeTree from '@/../core/VNodeTree';

import { getLibraries } from '@/api/library';

const NSID = 'ns-id';

const addAttributes = (fragment, id) => {
  if (Array.isArray(fragment)) {
    for (let i of fragment) {
      if (i.setAttribute) {
        i.setAttribute(NSID, id);
        i.setAttribute('tabIndex', 0);
        i.setAttribute('draggable', true);
      }
    }
  } else {
    fragment.setAttribute(NSID, id);
    fragment.setAttribute('tabIndex', 0);
    fragment.setAttribute('draggable', true);
  }
  return fragment;
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
    this.$nsVNodes = new VNodeTree();

    const { data } = await getLibraries({ names: 'nekui' });
    this.libraries = data;
    this.$forceUpdate();
  },
  data() {
    return {
      leftBars: [
        { label: '组件', name: 'ComponentBar' },
        { label: '目录', name: 'DirectoryBar' },
      ],
      leftSideBarView: 'ComponentBar',

      rightBars: [
        { label: '属性', name: 'PropsBar' }
      ],
      rightSideBarView: 'PropsBar',

      codeBars: [
        { label: 'HTML' },
        { label: 'JavaScript' },
      ],

      libraries: [],
      currentAttributes: [],
      currentComponent: null
    };
  },
  methods: {
    /*====== 业务逻辑 ======*/

    quitPreview() {
      _.exitFullScreen();
    },

    /*====== 事件绑定 ======*/

    onPreviewDrag(event) {
      event.dataTransfer.dropEffect = 'move';
      const node = this.getFirstNSNode(event.path);
      event.dataTransfer.setData('nsId', node.getAttribute(NSID));
    },

    onPreviewDrop(event) {
      const libName = event.dataTransfer.getData('libName');
      const tagName = event.dataTransfer.getData('tagName');
      // 拖拽已有组件的时候带上
      const nsId = event.dataTransfer.getData('nsId');
      const parent = this.getFirstNSNode(event.path, true) || this.$refs.preview;

      if (nsId) {
        this.updateHandler(nsId, parent);
      } else {
        this.createHandler(libName, tagName, parent);
      }
    },

    onPreviewClick(event) {
      const target = this.getFirstNSNode(event.path);

      if (!target || target.id === 'ns-preview') {
        this.currentAttributes = [];
        this.currentNodeId = null;
        return;
      }

      const vNode = this.getNSInfo(target);
      if (!vNode) {
        return;
      }

      const componentConfig = this.getComponentConfig(vNode.libName, vNode.tagName);
      const attributes = {
        ...componentConfig.attributes,
        ...vNode.attributes
      };

      this.currentAttributes = Object.keys(attributes).sort().map(el => ({ name: el, ...attributes[el] }));
      this.currentNodeId = vNode.id;
    },

    onPropChange(event) {
      if (!this.currentNodeId) {
        return;
      }

      const vNode = this.$nsVNodes.getNode(this.currentNodeId);
      vNode.setAttribute(event.name, event.value);

      const tpl = this.$nsVNodes.getTemplate(vNode.id);
      const oldNode = this.getNodeByNSId(this.currentNodeId);

      this.replace(tpl, oldNode, { id: this.currentNodeId });
    },

    // 键盘删除键
    onDeletePress() {
      if (!this.currentNodeId) {
        return;
      }

      this.$nsVNodes.removeNode(this.currentNodeId);

      const node = this.getNodeByNSId(this.currentNodeId);
      node.parentNode.removeChild(node);
      this.currentNodeId = null;
    },

    /*====== 组件变化处理函数 ======*/

    // 拖拽等操作触发的新增组件处理函数
    createHandler(libName, tagName, parentNode, nextBrother = null) {
      const component = this.getComponentConfig(libName, tagName);
      if (!component) {
        return;
      }

      let parentId = 0;
      if (parentNode) {
        parentId = parentNode.getAttribute(NSID);
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

      const vNode = this.$nsVNodes.addNode(tagName, parentId, nextBrother, {
        libName,
        attributes
      });

      const tpl = this.$nsVNodes.getTemplate(vNode.id);
      this.inject(tpl, parentNode, { id: vNode.id });
    },

    // 修改父节点
    updateHandler(nodeId, newParentNode) {
      const node = this.getNodeByNSId(nodeId);
      if (node.contains(newParentNode)) {
        return;
      }

      const newParentId = newParentNode.getAttribute(NSID);
      // TODO: nextBrotherId
      const oldParentId = this.$nsVNodes.moveNode(nodeId, newParentId);

      const oldParentNode = this.getNodeByNSId(oldParentId);
      if (oldParentId === newParentId) {
        return;
      }

      oldParentNode.removeChild(node);
      // TODO: 换成insertBefore，参数加上兄弟节点
      newParentNode.appendChild(node);
    },

    /*====== 工具函数等 ======*/

    getComponentConfig(libName, tagName) {
      const lib = this.libraries.find(el => el.name === libName);
      if (!lib) {
        return null;
      }

      return lib.components.find(el => el.tag === tagName);
    },

    canLayout(libName, tagName) {
      const component = this.getComponentConfig(libName, tagName) || {};
      return !!component.isLayout;
    },

    getFirstNSNode(path, needLayout) {
      for (let i of path) {
        if (!i.getAttribute) {
          continue;
        }
        const nsId = i.getAttribute(NSID);
        if (!nsId) {
          continue;
        }

        const vNode = this.$nsVNodes.getNode(nsId);
        if (!needLayout || this.canLayout(vNode.libName, vNode.tagName)) {
          return i;
        }
      }
      return null;
    },

    getNSInfo(node) {
      if (!node || !node.getAttribute) {
        return null;
      }

      const nodeId = node.getAttribute(NSID);
      return this.$nsVNodes.getNode(nodeId) || null;
    },

    getNodeByNSId(id) {
      return document.querySelector(`[ns-id="${id}"]`);
    },


    inject(tpl, parent, { direction, id }) {
      parent = parent || this.$refs.preview;

      const RootComponent = new NekComponent({
        template: tpl
      });
      RootComponent.$inject(parent, {
        direction,
        beforeInsert: f => addAttributes(f, id)
      });

      return RootComponent;
    },

    replace(tpl, oldNode, { id }) {
      const RootComponent = new NekComponent({
        template: tpl
      });
      RootComponent.$replace(oldNode, {
        beforeReplace: f => addAttributes(f, id)
      });

      return RootComponent;
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
      display: flex;
      flex-direction: column;

      .g-preview {
        flex: 1;
        margin: 10px;
        background-color: white;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        box-shadow: 0 0 3px 3px rgba(43, 43, 43, 0.1);
        border-radius: 3px;
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

[ns-id]:target {
  box-shadow: 0 0 5px rgba(0, 0, 255, 0.6) !important;
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
