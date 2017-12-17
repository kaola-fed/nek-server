import lodash from 'lodash';

import NSNode from './NSNode';

function getElementByNSId(id) {
  return document.querySelector(`[ns-id="${id}"]`);
}

export default class VNodeTree {
  constructor(rootId = '0', options = null) {
    this.__rootId = `${rootId}`;
    // 用于生成最终代码的树
    this.__nodeTree = {
      [rootId]: new NSNode('0', options)
    };
    // 用于更新
    this.__updateTree = lodash.cloneDeep(this.__nodeTree);

    // 组件库配置
    this.__libConfig = {};

    // 基类中的变量和事件名
    this.__excludeVar = null;
    this.__excludeEvent = null;

    this.NekComponent = null;
    // 给Component提供数据
    this.data = {};

    // 用于渲染的根节点
    this.rootView = null;

    // 本模块名称
    this.moduleName = 'index';
    // 子节点名称
    this.subModules = [];
  }

  /* 静态函数 */

  static getAttrStr(key, type, value) {
    switch (type) {
      case 'string':
        return ` ${key}="${value}"`;
      case 'boolean':
      case 'number':
      case 'object':
      case 'var':
        // TODO: 记录var，考虑和utils中的合并
        return ` ${key}={${value}}`;
      default:
        break;
    }
  }

  static getAttributesStr(attributes, debug) {
    let attr = '';
    for (let i in attributes) {
      if (attributes.hasOwnProperty(i)) {
        if (attributes[i] == null) {
          continue;
        }

        const type = attributes[i].type || typeof attributes[i];
        const value = attributes[i].value || attributes[i];
        attr += VNodeTree.getAttrStr(i, type, value, debug);
      }
    }

    return attr;
  }

  static getEventsStr(events) {
    let attr = '';
    for (let i in events) {
      if (events.hasOwnProperty(i)) {
        attr += ` on-${i}={this.${events[i]}($event)`;
      }
    }

    return attr;
  }

  static findNodeBody(node, config) {
    if (!config.isLayout) {
      return null;
    }

    let body;
    const classList = config.bodyClass || [];
    for (let i of classList) {
      body = node.querySelector(`.${i}`);
      if (body) {
        break;
      }
    }
    if (!body) {
      for (let i = 0; i < node.childNodes.length; ++i) {
        const child = node.childNodes[i];
        if (child.nodeName[0] !== '#') {
          body = child;
          break;
        }
      }
    }

    return body;
  }

  /* Getter && Setter */

  get rootId() {
    return this.__rootId;
  }

  get librarySet() {
    return this.__libConfig;
  }

  // 将获取到的数组形式的配置转换为key-value形式
  set librarySet(value) {
    if (!value) {
      this.__libConfig = {};
      return;
    }
    if (!Array.isArray(value)) {
      this.__libConfig = value;
      return;
    }

    const set = {};
    value.forEach((lib) => {
      set[lib.name] = {};
      lib.components.forEach((c) => {
        set[lib.name][c.tag] = c;
      });
    });

    this.__libConfig = set;
  }

  get tree() {
    return this.__nodeTree;
  }

  get excludeVar() {
    if (!this.__excludeVar) {
      this.__excludeVar = new Set();
    }
    return this.__excludeVar;
  }

  get excludeEvent() {
    if (!this.__excludeEvent) {
      this.__excludeEvent = new Set();
    }
    return this.__excludeEvent;
  }

  set excludeVar(value) {
    this.__excludeVar = new Set(value);
  }

  set excludeEvent(value) {
    this.__excludeEvent = new Set(value);
  }

  /* 节点操作 */

  getNode(nodeId) {
    return this.__nodeTree[nodeId];
  }

  getNextBrotherId(nodeId) {
    const node = this.__nodeTree[nodeId];
    const parent = this.__nodeTree[node.parent];
    const index = parent.children.findIndex(el => el === nodeId);
    if (index < 0) {
      return null;
    }
    return parent.children[index + 1] || null;
  }

  // 插入根节点的时候parentId传null或者不传
  addNode(tagName, parentId = null, nextBrotherId = null, options = null) {
    const nodeOptions = {
      ...options,
      tagName,
      parent: parentId || this.__rootId
    };
    const nodeId = NSNode.generateId();
    this.__updateTree[nodeId] = new NSNode(nodeId, nodeOptions);
    this.__updateTree[nodeOptions.parent].insertChild(nodeId, nextBrotherId);

    return this.__updateTree[nodeId];
  }

  // 新增文本节点
  addTextNode(text, parentId, nextBrotherId) {
    const node = NSNode.createTextNode(text, parentId);
    node.tagName = null;
    this.__updateTree[node.id] = node;
    this.__updateTree[parentId].insertChild(node.id, nextBrotherId);

    return node;
  }

  addConditionNode(condition, parentId, nextBrotherId) {
    const node = NSNode.createNode(parentId, { condition });
    node.tagName = null;
    this.__updateTree[node.id] = node;
    this.__updateTree[parentId].insertChild(node.id, nextBrotherId);

    return node;
  }

  // 从一个嵌套结构中转换到当前树里
  addFromObject(treeObj, parentId) {
    const {
      tagName,
      text,
      children,
      condition,
      ...others
    } = treeObj;
    parentId = parentId || this.__rootId;
    let node;
    if (tagName) {
      node = this.addNode(tagName, parentId, null, others);
    } else if (condition) {
      node = this.addConditionNode(condition, parentId);
    } else {
      node = this.addTextNode(text, parentId);
    }
    if (children && children.length > 0) {
      children.forEach(el => this.addFromObject(el, node.id));
    }

    return node;
  }

  // 删除节点及其子节点
  removeNode(nodeId) {
    const node = this.__updateTree[nodeId];
    if (!node) {
      return;
    }
    node.children.forEach(el => this.removeNode(el));

    if (nodeId !== this.__rootId) {
      const parentNode = this.__updateTree[node.parent];
      parentNode.removeChild(nodeId);
      delete this.__updateTree[nodeId];
    }

    return node;
  }

  // 移动节点
  moveNode(nodeId, newParentId, nextBrotherId) {
    const node = this.__updateTree[nodeId];
    const oldParentId = node.parent;
    if (oldParentId === newParentId) {
      return oldParentId;
    }

    this.__updateTree[oldParentId].removeChild(nodeId);
    this.__updateTree[newParentId].insertChild(nodeId, nextBrotherId);
    node.parent = newParentId;

    return oldParentId;
  }

  // 更新节点属性/事件等属性，不涉及结构的变化
  updateNode(nodeId, data) {
    Object.assign(this.__updateTree[nodeId].attributes, data.attributes || {});
    Object.assign(this.__updateTree[nodeId].events, data.events || {});
  }

  // virtual DOM diff 并更新 DOM
  $update(options) {
    const {
      rerender = false,
      outter = true
    } = options;

    let updateNodeIds = [];
    let injectOption = null;

    if (rerender) {
      // 从根节点重新渲染
      updateNodeIds = [this.__rootId];
      injectOption = { data: this.data };
    } else {
      // 广度优先遍历，从最高层开始逐层检查
      let queue = [this.__rootId];
      while (queue.length > 0) {
        const nodeId = queue.shift();

        // TODO: 解决HTML上的标记问题后取消注释，删掉下面没注释的那行
        // const oldTreeNode = this.__nodeTree[nodeId];
        // const newTreeNode = this.__updateTree[nodeId];
        // 当前节点不同，重新渲染
        // if (!NSNode.eq(oldTreeNode, newTreeNode)) {
        //   updateNodeIds.push(nodeId);
        // } else {
        //   queue = queue.concat(oldTreeNode.children);
        // }

        updateNodeIds.push(nodeId);
      }
    }

    // 更新数据到真正用于渲染的树
    this.__nodeTree = lodash.cloneDeep(this.__updateTree);

    // 更新DOM
    for (let id of updateNodeIds) {
      // 生成fragment
      const tpl = this.getTemplate(id, outter);
      const node = document.createDocumentFragment();
      this.NekComponent.inject(tpl, node, injectOption);

      // 判断是插入还是替换
      const oldNode = getElementByNSId(id);
      if (oldNode) {
        oldNode.parentNode.replaceChild(node, oldNode);
      } else {
        const vNode = this.__nodeTree[id];
        if (vNode.parent) {
          const parentNode = getElementByNSId(vNode.parent);
          const parentVNode = this.__nodeTree[vNode.parent];
          const nextBrotherIndex = parentVNode.children.findIndex(el => el === id) + 1;

          let nextBrotherNode = null;
          if (nextBrotherIndex < parentVNode.children.length) {
            nextBrotherNode = getElementByNSId(parentVNode.children[nextBrotherIndex]);
          }

          parentNode.insertBefore(node, nextBrotherNode);
        } else {
          // 根节点单独修改
          this.rootView.appendChild(node);
        }
      }
    }
  }

  // 更新__nodeTree，在后端生成代码的时候用
  $apply() {
    this.__nodeTree = this.__updateTree;
  }

  /* 生成 */

  // 生成附带ns-id的模板
  getTemplate(nodeId, outter = true) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, attributes, children, text } = vNode;

    if (!tagName) {
      return text || '';
    }

    const raw = `<${tagName}${VNodeTree.getAttributesStr(attributes, true)} ns-id="${nodeId}">` +
      `${children.map(el => this.getTemplate(el, outter)).join('')}</${tagName}>`;
    return outter ? `<div r-nsid="${nodeId}" id="${nodeId}">${raw}</div>` : raw;
  }
}
