import lodash from 'lodash';

import NSNode from './NSNode';
import _ from '@/widget/util';
import NekComponent from '@/widget/NekComponent';

export default class VNodeTree {
  constructor(rootId = '0', options = null) {
    this.__rootId = `${rootId}`;
    this.__nodeTree = {
      [rootId]: new NSNode('0', options)
    };
    this.__updateTree = lodash.cloneDeep(this.__nodeTree);
    this.__libConfig = {};
  }

  /* 静态函数 */

  static getAttributesStr(attributes) {
    let attr = '';
    for (let i in attributes) {
      if (attributes.hasOwnProperty(i)) {
        if (attributes[i] == null) {
          continue;
        }

        if (typeof attributes[i] === 'string') {
          attr += ` ${i}="${attributes[i]}"`;
          continue;
        }
        if (typeof attributes[i] === 'number') {
          attr += ` ${i}={${attributes[i]}}`;
          continue;
        }

        const { type, value } = attributes[i];
        if (type === 'string') {
          attr += ` ${i}="${value}"`;
        } else {
          attr += ` ${i}={${value}}`;
        }
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

  addTextNode(text, parentId, nextBrotherId) {
    const node = NSNode.createTextNode(text, parentId);
    this.__updateTree[node.id] = node;
    this.__updateTree[parentId].insertChild(node.id, nextBrotherId);

    return node;
  }

  removeNode(nodeId) {
    const node = this.__updateTree[nodeId];
    const parentNode = this.__updateTree[node.parent];
    parentNode.removeChild(nodeId);
    node.children.forEach(el => this.removeNode(el));
    delete this.__updateTree[nodeId];

    return node;
  }

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

  updateNode(nodeId, data) {
    Object.assign(this.__updateTree[nodeId].attributes, data.attributes || {});
    Object.assign(this.__updateTree[nodeId].events, data.events || {});
  }

  $update(setAttrs) {
    let queue = [this.__rootId];
    let updateNodeIds = [];
    while (queue.length > 0) {
      const nodeId = queue.shift();
      const oldTreeNode = this.__nodeTree[nodeId];
      const newTreeNode = this.__updateTree[nodeId];

      // 当前节点不同，重新渲染
      if (!(lodash.eq(oldTreeNode.attributes, newTreeNode.attributes) &&
          lodash.eq(oldTreeNode.events, newTreeNode.events) &&
          lodash.eq(oldTreeNode.children, newTreeNode.children))) {
        updateNodeIds.push(nodeId);
      } else {
        queue = queue.concat(oldTreeNode.children);
      }
    }

    this.__nodeTree = lodash.cloneDeep(this.__updateTree);

    for (let id of updateNodeIds) {
      const tpl = this.getTemplate(id);
      const node = document.createDocumentFragment();
      NekComponent.inject(tpl, node, { beforeInsert: (fragment) => {
        if (Array.isArray(fragment)) {
          for (let i of fragment) {
            if (i.setAttribute) {
              setAttrs(i, id);
            }
          }
        } else {
          setAttrs(fragment, id)
        }
        return fragment;
      }});

      const oldNode = _.getElementByNSId(id);
      if (oldNode) {
        oldNode.parentNode.replaceChild(node, oldNode);
      } else {
        const vNode = this.__nodeTree[id];
        const parentNode = _.getElementByNSId(vNode.parent);
        const parentVNode = this.__nodeTree[vNode.parent];
        const nextBrotherId = parentVNode.children.findIndex(el => el === id) + 1;

        parentNode.insertChild(node, nextBrotherId);
      }
    }
  }

  /* 生成 */

  getTemplate(nodeId) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, attributes, children, text } = vNode;

    if (!tagName) {
      return text || '';
    }

    return `<${tagName}${VNodeTree.getAttributesStr(attributes)}>${children.map(el => this.getTemplate(el)).join('')}</${tagName}>`;
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

