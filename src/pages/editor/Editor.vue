<template>
  <div class="g-editor">
    <tools-bar projectName="Project RED" :buttons="toolsBarButtons"></tools-bar>
    <div class="g-workspace">
      <side-bar :tabs="leftBars" @changed="leftSideBarView = $event.name">
        <keep-alive>
          <component :is="leftSideBarView" :library="library" @dragStart="clearCurrent"></component>
        </keep-alive>
      </side-bar>
      <div class="g-preview-wrapper">
        <highlight-current :nodeId="currentNodeId" ></highlight-current>
        <div class="g-preview" id="ns-preview"
             @dragstart="onPreviewDragStart" @dragover.prevent.stop="onComponentDragOver" @drop="onPreviewDrop"
             @click="onPreviewClick" @insertNsid="onInsertNsid"
        >
          <div ref="preview"></div>
        </div>
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
import { VNodeTree } from 'nek-server-core';

import ToolsBar from './components/ToolsBar.vue';
import SideBar from './components/SideBar.vue';
import ComponentBar from './components/ComponentsBar.vue';
import DirectoryBar from './components/DirectoryBar.vue';
import PropsBar from './components/PropsBar.vue';
import HighlightCurrent from './components/HighlightCurrent.vue';
import PreviewButton from './components/PreviewButton.vue';

import _ from '@/widget/util';
import NekComponent from '@/widget/NekComponent';

import { getComponentList } from '@/api/library';

const NSID = 'ns-id';

export default {
  components: {
    ToolsBar,
    SideBar,
    ComponentBar,
    DirectoryBar,
    PropsBar,
    HighlightCurrent,
    PreviewButton,
  },
  async mounted() {
    this.$nsVNodes = new VNodeTree();
    this.$nsVNodes.NekComponent = NekComponent;
    this.$refs.preview.setAttribute('ns-id', this.$nsVNodes.rootId);

    const { data } = await getComponentList({ id: this.$route.query.library });
    //转化组件库的格式
    data.components.forEach((item) => {
      const attributes = {};
      item.attributes.forEach((attr) => {
        attributes[attr.name] = attr;
      });
      item.attributes = attributes;
    });
    this.library = data;
    this.$nsVNodes.librarySet = [data];
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

      library: {},
      currentComponent: null,

      currentNodeId: null,

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
      const componentConfig = this.getComponentConfig(vNode.libName, vNode.tagName) || {};
      const attributes = {
        ...componentConfig.attributes,
        ...vNode.attributes
      };

      return Object.keys(attributes).sort().map(el => ({ name: el, ...attributes[el] }));
    },
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
    }
  },
  methods: {
    /*====== 事件绑定 ======*/
    onInsertNsid(event) {
      const { elem, nsid } = event.detail;
      for(let i=0, len=elem.childNodes.length; i<len; i++) {
        if(elem.childNodes[i].nodeType == Node.ELEMENT_NODE) {
          elem.childNodes[i].setAttribute('ns-id', nsid);
          elem.childNodes[i].setAttribute('draggable', true);
          //删除外层空div
          setTimeout(() => {
            const emptyDiv = document.getElementById(nsid);
            emptyDiv.parentNode.replaceChild(emptyDiv.childNodes[i], emptyDiv);
          }, 0);
        }
      }
    },
    onPreviewDragStart(event) {
      event.dataTransfer.dropEffect = 'move';
      const node = this.getFirstNSNode(event.path);
      this.currentNodeId = node.getAttribute(NSID);
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
        return;
      }

      this.currentNodeId = target.getAttribute(NSID);
    },

    onPropChange(event) {
      if (!this.currentNodeId) {
        return;
      }

      this.$nsVNodes.updateNode(this.currentNodeId, {
        attributes: { [event.name]: event.value }
      });

      this.updatePreview();
    },

    /*====== 组件变化处理函数 ======*/

    // 拖拽等操作触发的新增组件处理函数
    createHandler(libName, tagName, parentNode, nextBrother = null) {
      const component = this.getComponentConfig(libName, tagName);
      if (!component) {
        return;
      }

      let parentId = null;
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

      this.$nsVNodes.addNode(tagName, parentId, nextBrother, {
        libName,
        attributes
      });

      this.updatePreview();
    },

    // 修改父节点
    updateHandler(nodeId, newParentNode) {
      const node = _.getElementByNSId(nodeId);
      if (node.contains(newParentNode)) {
        return;
      }

      const newParentId = newParentNode.getAttribute(NSID);
      // TODO: nextBrotherId
      this.$nsVNodes.moveNode(nodeId, newParentId);

      this.updatePreview();
    },

    // 删除节点
    deleteHandler() {
      if (!this.currentNodeId) {
        return;
      }

      this.$nsVNodes.removeNode(this.currentNodeId);
      this.updatePreview();

      this.currentNodeId = null;
    },

    /*====== 工具函数等 ======*/

    getComponentConfig(libName, tagName) {
      const lib = this.$nsVNodes.librarySet[libName];
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

    clearCurrent() {
      this.currentNodeId = null;
    },

    updatePreview() {
      this.$nsVNodes.$update((item, nodeId) => {
        item.setAttribute('ns-id', nodeId);
        item.setAttribute('draggable', true);
      });
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
        box-shadow: 0 0 3px 3px rgba(43, 43, 43, 0.1);
        border-radius: 3px;

        [ns-id="0"] {
          border: 1px dashed #ddd;
          padding: 10px;
        }

        .g-row {
          min-height: 50px;
          border: 1px dashed #ddd;
        }

        .g-col {
          min-height: 45px;
          border: 1px dashed #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .m-form {
          min-height: 60px;
          border: 1px dashed #ddd;
          display: flex;
        }
      }
    }
  }
}


</style>
