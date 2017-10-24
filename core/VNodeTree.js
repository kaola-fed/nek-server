import NSNode from './NSNode';

export default class VNodeTree {
  constructor(rootId = '0', options = null) {
    this.__rootId = rootId;
    this.__nodeTree = {
      [rootId]: new NSNode('0', options)
    };
  }

  get tree() {
    return this.__nodeTree;
  }

  get root() {
    return this.__nodeTree[this.__rootId];
  }

  getNode(nodeId) {
    return this.__nodeTree[nodeId];
  }

  addNode(tagName, parentId, nextBrotherId, options) {
    const nodeOptions = {
      ...options,
      tagName,
      parent: parentId
    };
    const nodeId = NSNode.generateId();
    this.__nodeTree[nodeId] = new NSNode(nodeId, nodeOptions);
    this.__nodeTree[parentId].insertChild(nodeId, nextBrotherId);

    return this.__nodeTree[nodeId];
  }

  removeNode(nodeId) {
    const node = this.__nodeTree[nodeId];
    const parentNode = this.__nodeTree[node.parent];
    parentNode.removeChild(nodeId);
    node.forEach(el => this.removeNode(el));
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

    const { tagName, attributes, children } = vNode;
    let attr = '';
    for (let i in attributes) {
      if (attributes.hasOwnProperty(i)) {
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
}

