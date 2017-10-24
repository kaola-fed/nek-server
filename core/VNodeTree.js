import NSNode from './NSNode';
import NekComponent from '@/widget/NekComponent';

export default class VNodeTree {
  constructor(rootId = '0', options = null) {
    this.__rootId = `${rootId}`;
    this.__nodeTree = {
      [rootId]: new NSNode('0', options)
    };
  }

  /* Getter && Setter */

  get tree() {
    return this.__nodeTree;
  }

  get root() {
    return this.__nodeTree[this.__rootId];
  }

  /* 节点操作 */

  getNode(nodeId) {
    return this.__nodeTree[nodeId];
  }

  addNode(tagName, parentId, nextBrotherId, options) {
    const nodeOptions = {
      ...options,
      tagName,
      parent: parentId || this.__rootId
    };
    const nodeId = NSNode.generateId();
    this.__nodeTree[nodeId] = new NSNode(nodeId, nodeOptions);
    this.__nodeTree[parentId].insertChild(nodeId, nextBrotherId);

    return this.__nodeTree[nodeId];
  }

  addTextNode(text, parentId, nextBrotherId) {
    const node = NSNode.createTextNode(text, parentId);
    this.__nodeTree[node.id] = node;
    this.__nodeTree[parentId].insertChild(node.id, nextBrotherId);

    return node;
  }

  removeNode(nodeId) {
    const node = this.__nodeTree[nodeId];
    const parentNode = this.__nodeTree[node.parent];
    parentNode.removeChild(nodeId);
    node.children.forEach(el => this.removeNode(el));
    delete this.__nodeTree[nodeId];

    return node;
  }

  moveNode(nodeId, newParentId, nextBrotherId) {
    const node = this.__nodeTree[nodeId];
    const oldParentId = node.parent;
    if (oldParentId === newParentId) {
      return oldParentId;
    }

    this.__nodeTree[oldParentId].removeChild(nodeId);
    this.__nodeTree[newParentId].insertChild(nodeId, nextBrotherId);
    node.parent = newParentId;

    return oldParentId;
  }

  getTemplate(nodeId) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, attributes, children, text } = vNode;

    if (!tagName) {
      return text || '';
    }

    let attr = '';
    for (let i in attributes) {
      if (attributes.hasOwnProperty(i)) {
        if (typeof attributes[i] === 'string') {
          attr += ` ${i}="${attributes[i]}"`;
          continue;
        }
        if (typeof attributes[i] === 'number') {
          attr += ` ${i}={${attributes[i]}`;
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
    return `<${tagName}${attr}>${children.map(el => this.getTemplate(el)).join('')}</${tagName}>`;
  }

  render(nodeId, parentNode) {
    nodeId = nodeId || this.__rootId;
    const vNode = this.__nodeTree[nodeId];

    const { tagName, attributes, children, text } = vNode;

    if (!tagName) {
      return text || '';
    }

    let attr = '';
    for (let i in attributes) {
      if (attributes.hasOwnProperty(i)) {
        if (typeof attributes[i] === 'string') {
          attr += ` ${i}="${attributes[i]}"`;
          continue;
        }
        if (typeof attributes[i] === 'number') {
          attr += ` ${i}={${attributes[i]}`;
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

    parentNode = parentNode || document.createDocumentFragment();

    const containerTemplate = `<${tagName}${attr}></${tagName}>`;
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

    // TODO: 根据配置获取body
    // const body = parentNode.getElementsByClassName('');
    let body = null;
    for (let i = 0; i < parentNode.childNodes.length; ++i) {
      const child = parentNode.childNodes[i];
      if (child.nodeName[0] !== '#') {
        body = child;
        break;
      }
    }
    console.log(body);
    if (!body) {
      throw new Error(`Wrong body config of tag ${tagName}`);
    }

    for (let i of children) {
      this.render(i, body);
    }

    return parentNode;
  }
}

