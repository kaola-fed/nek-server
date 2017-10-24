<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED" :buttons="toolsBarButtons"></tools-bar>
    <div class="g-workspace">
      <side-bar :tabs="leftBars" @changed="leftSideBarView = $event.name">
        <keep-alive>
          <component :is="leftSideBarView" :libraries="libraries" @dragStart="clearCurrent"></component>
        </keep-alive>
      </side-bar>
      <div class="g-preview-wrapper">
        <div ref="preview" class="g-preview" id="ns-preview" ns-id="0"
             @dragstart="onPreviewDragStart" @dragover.prevent.stop="onComponentDragOver" @drop="onPreviewDrop"
             @click="onPreviewClick"
        ></div>
        <side-bar :tabs="codeBars" placement="bottom" :default-open="false"></side-bar>
      </div>
      <side-bar :tabs="rightBars" placement="right" @changed="rightSideBarView = $event.name">
        <keep-alive>
          <component :is="rightSideBarView" :node-id="currentNodeId"
                     :attributes="currentAttributes" :model="currentComponent"
                     @change="onPropChange"
          ></component>
        </keep-alive>
      </side-bar>
    </div>

    <preview-button></preview-button>
  </div>
</template>

<script>

import ToolsBar from './components/ToolsBar.vue';
import SideBar from './components/SideBar.vue';
import ComponentBar from './components/ComponentsBar.vue';
import DirectoryBar from './components/DirectoryBar.vue';
import PropsBar from './components/PropsBar.vue';
import PreviewButton from './components/PreviewButton.vue';

import VNodeTree from '@/../core/VNodeTree';

import { getLibraries } from '@/api/library';

const NSID = 'ns-id';

export default {
  components: {
    ToolsBar,
    SideBar,
    ComponentBar,
    DirectoryBar,
    PropsBar,
    PreviewButton,
  },
  async mounted() {
    this.$nsVNodes = new VNodeTree();

    const { data } = await getLibraries({ names: 'nekui' });
    this.libraries = data;
    this.$forceUpdate();
  },
  data() {
    return {
      toolsBarButtons: [],

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
      currentComponent: null,

      currentNodeId: null,
      currentNodeDOM: null,

      dragX: null,
      dragY: null,
    };
  },
  computed: {
    currentAttributes() {
      if (!this.currentNodeId) {
        return [];
      }

      const vNode = this.$nsVNodes.getNode(this.currentNodeId);
      const componentConfig = this.getComponentConfig(vNode.libName, vNode.tagName);
      const attributes = {
        ...componentConfig.attributes,
        ...vNode.attributes
      };

      return Object.keys(attributes).sort().map(el => ({ name: el, ...attributes[el] }));
    },
    librarySet() {
      if (!this.libraries) {
        return {};
      }

      const set = {};
      this.libraries.forEach((lib) => {
        set[lib.name] = {};
        lib.components.forEach((c) => {
          set[lib.name][c.tag] = c;
        });
      });

      return set;
    }
  },
  watch: {
    currentNodeId(newValue, oldValue) {
      // 修改顶部栏按钮
      if (oldValue === null && newValue !== null) {
        this.toolsBarButtons.push({
          icon: 'el-icon-delete',
          tip: '删除选中组件',
          onClick: this.deleteHandler
        });
      } else if (oldValue !== null && newValue === null) {
        const index = this.toolsBarButtons.find(el => el.tip === '删除选中组件');
        this.toolsBarButtons.splice(index, 1);
      }
    },
    currentNodeDOM(newValue, oldValue) {
      // 不要用watch来更新currentNodeId

      if (oldValue !== null && oldValue.classList) {
        oldValue.classList.remove('current');
      }
      if (newValue !== null && newValue.classList) {
        newValue.classList.add('current');
      }
    }
  },
  methods: {
    /*====== 业务逻辑 ======*/

    /*====== 事件绑定 ======*/

    onPreviewDragStart(event) {
      event.dataTransfer.dropEffect = 'move';
      const node = this.getFirstNSNode(event.path);
      this.currentNodeId = node.getAttribute(NSID);
      this.currentNodeDOM = node;
      event.dataTransfer.setData('nsId', this.currentNodeId);
    },

    onComponentDragOver(event) {
      const { clientX, clientY } = event;
      if (!this.currentNodeId || (clientX === this.dragX && clientY === this.dragY)) {
        return;
      }

      this.dragX = clientX;
      this.dragY = clientY;
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
        this.currentNodeId = null;
        this.currentNodeDOM = null;
        return;
      }

      this.currentNodeId = target.getAttribute(NSID);
      this.currentNodeDOM = target;
    },

    onPropChange(event) {
      if (!this.currentNodeId) {
        return;
      }

      const vNode = this.$nsVNodes.getNode(this.currentNodeId);
      vNode.setAttribute(event.name, event.value);

      const newNode = this.$nsVNodes.render(vNode.id);
      const oldNode = this.getNodeByNSId(this.currentNodeId);
      oldNode.parentNode.replaceChild(newNode, oldNode);
    },

    /*====== 组件变化处理函数 ======*/

    // 拖拽等操作触发的新增组件处理函数
    createHandler(libName, tagName, parentNode, nextBrother = null) {
      const component = this.getComponentConfig(libName, tagName);
      if (!component) {
        return;
      }

      let parentId = this.$nsVNodes.root.id;
      if (parentNode) {
        parentId = parentNode.getAttribute(NSID);
      } else {
        parentNode = this.$refs.preview;
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

      const newNode = this.$nsVNodes.render(vNode.id);
      parentNode.insertBefore(newNode, nextBrother);
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

    // 删除节点
    deleteHandler() {
      if (!this.currentNodeId) {
        return;
      }

      this.$nsVNodes.removeNode(this.currentNodeId);

      const node = this.getNodeByNSId(this.currentNodeId);
      node.parentNode.removeChild(node);

      this.currentNodeId = null;
      this.currentNodeDOM = null;
    },

    /*====== 工具函数等 ======*/

    getComponentConfig(libName, tagName) {
      const lib = this.librarySet[libName];
      if (!lib) {
        return null;
      }

      return lib[tagName] || null;
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

    getNodeByNSId(id) {
      return document.querySelector(`[ns-id="${id}"]`);
    },

    clearCurrent() {
      this.currentNodeId = null;
      this.currentNodeDOM = null;
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

}

[ns-id].current {
  box-shadow: 0 0 5px rgba(0, 100, 255, 0.6) !important;
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
