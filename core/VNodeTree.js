import lodash from 'lodash';

import NSNode from './NSNode';
import _ from '@/widget/util';
import NekComponent from '@/widget/NekComponent';

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
  }

  /* 静态函数 */

  static getAttrStr(key, type, value, debug) {
    switch (typeof type) {
      case 'string':
        return ` ${key}="${value}"`;
      case 'boolean':
      case 'number':
      case 'object':
        return ` ${key}={${value}}`;
      case 'var':
        if (debug) {
          return '';
        }
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
      ...others
    } = treeObj;
    parentId = parentId || this.__rootId;
    const node = tagName ? this.addNode(tagName, parentId, null, others) : this.addTextNode(text, parentId);
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
  $update(setAttrs) {
    // 广度优先遍历，从最高层开始逐层检查
    let queue = [this.__rootId];
    let updateNodeIds = [];
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

    // 更新数据到真正用于渲染的树
    this.__nodeTree = lodash.cloneDeep(this.__updateTree);

    // 更新DOM
    for (let id of updateNodeIds) {
      // 生成fragment
      const tpl = this.getTemplate(id);
      const node = document.createDocumentFragment();
      NekComponent.inject(tpl, node);

      // 判断是插入还是替换
      const oldNode = _.getElementByNSId(id);
      if (oldNode) {
        oldNode.parentNode.replaceChild(node, oldNode);
      } else {
        const vNode = this.__nodeTree[id];
        const parentNode = _.getElementByNSId(vNode.parent);
        const parentVNode = this.__nodeTree[vNode.parent];
        const nextBrotherIndex = parentVNode.children.findIndex(el => el === id) + 1;

        let nextBrotherNode = null;
        if (nextBrotherIndex < parentVNode.children.length) {
          nextBrotherNode = _.getElementByNSId(parentVNode.children[nextBrotherIndex]);
        }

        parentNode.insertBefore(node, nextBrotherNode);
      }
    }
  }

  /* 生成 */

  // 生成附带ns-id的模板
  getTemplate(nodeId) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, attributes, children, text } = vNode;

    if (!tagName) {
      return text || '';
    }
    return `<div r-nsid="${nodeId}"><${tagName}${VNodeTree.getAttributesStr(attributes, true)} ns-id="${nodeId}">${children.map(el => this.getTemplate(el)).join('')}</${tagName}></div>`;
  }

  build() {
    return {
      js: this.__genJS(),
      html: this.__genHTML()
    };
  }

  __genJS() {
    let eventStr = '';
    for (let i in this.__nodeTree) {
      if (this.__nodeTree.hasOwnProperty(i)) {
        const events = this.__nodeTree[i].events;
        const keys = Object.keys(events);

        if (!keys.length) {
          continue;
        }

        for (let e of keys) {
          eventStr += `

        ${events[e]}: function(event) {
            console.log(event);
        }`;
        }
      }
    }

    // TODO: 从配置文件读取模板
    return `NEJ.define([
    'pro/base/util',
    'pro/widget/BaseComponent',
    'text!./page.html',
], function(_, BaseComponent, tpl){
    return BaseComponent.extend({
        template: tpl,
        config: function(data) {
            this.supr(data);
            _.extend(data, {});
        },

        // 监听事件${eventStr}

        // 网络请求
    });
});
    `;
  }

  // 生成格式化的HTML
  __genHTML(nodeId, level = 0) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, attributes, events, children, text } = vNode;

    const intend = new Array(level).fill('    ').join('');

    if (!tagName) {
      return `${intend}${text || ''}`;
    }

    return `${intend}<${tagName}${VNodeTree.getAttributesStr(attributes)}${VNodeTree.getEventsStr(events)}>` +
      `${children.length ? `\n${children.map(el => this.__genHTML(el, level + 1)).join('\n')}\n${intend}` : ''}</${tagName}>`;
  }

  // 弃用
  render(nodeId, parentNode) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, libName, attributes, children, text } = vNode;

    parentNode = parentNode || document.createDocumentFragment();
    // 文本节点，直接插入
    if (!tagName) {
      const textNode = document.createTextNode(text);
      parentNode.appendChild(textNode);
      return textNode;
    }

    // 编译后加上ns-id插入
    const containerTemplate = `<${tagName}${VNodeTree.getAttributesStr(attributes)}></${tagName}>`;
    NekComponent.inject(containerTemplate, parentNode, {
      beforeInsert: (fragment) => {
        if (Array.isArray(fragment)) {
          for (let i of fragment) {
            if (i.setAttribute) {
              i.setAttribute('ns-id', nodeId);
              i.setAttribute('draggable', true);
            }
          }
        } else {
          fragment.setAttribute('ns-id', nodeId);
          fragment.setAttribute('draggable', true);
        }
        return fragment;
      }
    });

    // 插入子节点
    if (children.length === 0) {
      return parentNode;
    }

    // 找出body
    const config = this.__libConfig[libName][tagName];
    const body = VNodeTree.findNodeBody(parentNode, config);
    if (!body) {
      throw new Error(`The body configuration of tag ${tagName} is incorrect.`);
    }

    for (let i of children) {
      this.render(i, body);
    }

    return parentNode;
  }
}
