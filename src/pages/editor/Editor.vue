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
        <div ref="preview" class="g-preview"
             @dragover.prevent="" @drop="onPreviewDrop"
             @click="onPreviewClick"
        ></div>
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
import genRegularTemplate from '@/../core/transfer';

import { getLibraries } from '@/api/library';

const addAttributes = (fragment, id, lib, tag) => {
  if (Array.isArray(fragment)) {
    for (let i of fragment) {
      if (i.setAttribute) {
        i.setAttribute('ns-id', id);
        i.setAttribute('ns-lib', lib);
        i.setAttribute('ns-tag', tag);
        i.setAttribute('tabIndex', 0);
      }
    }
  } else {
    fragment.setAttribute('ns-id', id);
    fragment.setAttribute('ns-lib', lib);
    fragment.setAttribute('ns-tag', tag);
    fragment.setAttribute('tabIndex', 0);
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
      leftBars: [
        { label: '组件', name: 'ComponentBar' },
        { label: '目录', name: 'DirectoryBar' },
      ],
      leftSideBarView: 'ComponentBar',

      rightBars: [
        {label: '属性', name: 'PropsBar'}
      ],
      rightSideBarView: 'PropsBar',

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

    onPreviewDrop(event) {
      const libName = event.dataTransfer.getData('libName');
      const tagName = event.dataTransfer.getData('tagName');
      // 拖拽已有组件的时候带上
      const nsId = event.dataTransfer.getData('nsId');
      const parent = this.getFirstNSNode(event.path, true);

      if (nsId) {
        this.updateHandler(nsId, parent);
      } else {
        this.createHandler(libName, tagName, parent);
      }
    },

    onPreviewClick(event) {
      const target = this.getFirstNSNode(event.path);

      if (!target) {
        this.currentAttributes = [];
        return;
      }

      const { nodeId, libName, tagName } = this.getNSInfo(target);

      const vNode = this.$nekVNodes[nodeId];
      const componentConfig = this.getComponentConfig(libName, tagName);
      const attributes = {
        ...componentConfig.attributes,
        ...vNode.attributes
      };

      this.currentAttributes = Object.keys(attributes).sort().map(el => ({ name: el, ...attributes[el] }));
      this.currentNodeId = nodeId;
    },

    onPropChange(event) {
      const vNode = this.$nekVNodes[this.currentNodeId];
      vNode.attributes[event.name] = { type: typeof event.value, value: event.value };

      const tpl = genRegularTemplate(this.$nekVNodes, vNode);
      const oldNode = this.getNodeByNSId(this.currentNodeId);
      const { libName, tagName } = this.getNSInfo(oldNode);

      vNode.instant = this.replace(tpl, oldNode, { id: this.currentNodeId, lib: libName, tag: tagName });
    },

    /*====== 组件变化处理函数 ======*/

    // 拖拽等操作触发的新增组件处理函数
    createHandler(libName, tagName, parentNode/*, nextBrother = null*/) {
      const component = this.getComponentConfig(libName, tagName);
      if (!component) {
        return;
      }

      let parentId = 0;
      if (parentNode) {
        parentId = parentNode.getAttribute('ns-id');
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
      this.$nekVNodes[nodeId].instant = this.inject(tpl, parentNode, { id: nodeId, lib: libName, tag: tagName });
      // TODO: push换成插入
      this.$nekVNodes[parentId].children.push(nodeId);
    },

    // 更新属性等操作
    updateHandler(nodeId, newParentNode) {
      const node = this.getNodeByNSId(nodeId);
      const vNode = this.$nekVNodes[nodeId];
      const oldParentNode = this.getNodeByNSId(vNode.parent);

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
        let nsTag = i.getAttribute('ns-tag');
        if (!nsTag) {
          continue;
        }
        if (!needLayout) {
          return i;
        } else if (this.canLayout(i.getAttribute('ns-lib'), nsTag)) {
          return i;
        }
      }
      return null;
    },

    getNSInfo(node) {
      if (!node || !node.getAttribute) {
        return null;
      }

      const nodeId = node.getAttribute('ns-id');
      const libName = node.getAttribute('ns-lib');
      const tagName = node.getAttribute('ns-tag');

      return { nodeId, libName, tagName };
    },

    getNodeByNSId(id) {
      return document.querySelector(`[ns-id="${id}"]`);
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

      return RootComponent;
    },

    replace(tpl, oldNode, { id, lib, tag }) {
      const RootComponent = new NekComponent({
        template: tpl
      });
      RootComponent.$replace(oldNode, {
        beforeReplace: f => addAttributes(f, id, lib, tag)
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

*[ns-tag]:target {
  box-shadow: 0 0 5px rgba(0, 0, 255, 0.6);
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
