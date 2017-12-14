let counter = 0;
let counterTimer = null;

function isSameObject(obj1, obj2) {
  const obj1Keys = new Set(Object.keys(obj1));
  const obj2Keys = new Set(Object.keys(obj2));
  if (obj1Keys.size !== obj2Keys.size) {
    return false;
  }
  for (let i of obj1Keys) {
    if (!obj2Keys.has(i) || obj2Keys[i] !== obj1Keys[i]) {
      return false;
    }
  }
  return true;
}

export default class NSNode {
  constructor(id, options) {
    const {
      tagName = 'div',
      libName = 'native',
      condition = null,   // { type: ConditionTypes, exp }
      parent = null,
      children = [],
      attributes = {},
      events = {},
      // 文本节点专用，tagName为null
      text = '',
    } = options || {};

    this.id = id;
    this.tagName = tagName;
    this.libName = libName;
    this.condition = condition;

    this.parent = parent;
    this.children = children;

    this.attributes = attributes;
    this.events = events;

    this.text = text;
  }

  /* 静态函数 */

  static generateId() {
    if (!counter && !counterTimer) {
      counterTimer = setTimeout(() => {
        counter = 0;
        counterTimer = null;
      }, 1000);
    }
    ++counter;
    return new Date().getTime().toString(16) + counter.toString(16).padStart(5, '0');
  }

  static createTextNode(text, parentId) {
    return new NSNode(NSNode.generateId(), {
      tagName: null,
      parent: parentId,
      text
    });
  };

  static createNode(parent, options) {
    return new NSNode(NSNode.generateId(), {
      parent,
      ...options
    });
  }

  static eq(node1, node2) {
    // 对比属性和事件
    if (!isSameObject(node1.attributes, node2.attributes) || !isSameObject(node1.events, node2.events)) {
      return false;
    }

    // TODO： 更改子节点的差异对比，与diff里做配合，尽量减小更新开销
    if (node1.children.length !== node2.children.length) {
      return false;
    }
    for (let i = 0; i < node1.children.length; ++i) {
      if (node1.children[i] !== node2.children[i]) {
        return false;
      }
    }

    return true;
  }

  /* 子元素操作 */

  insertChild(childId, beforeId = null) {
    // 统一id类型为字符串
    childId = `${childId}`;

    if (!beforeId) {
      this.children.push(childId);
      return;
    }

    let beforeIndex = this.children.findIndex(el => el === beforeId);
    beforeIndex = beforeIndex < 0 ? this.children.length : beforeIndex;
    this.children.splice(beforeIndex, 0, childId);
  }

  insertChildren(childIds, beforeId = null) {
    if (!Array.isArray(childIds)) {
      throw new Error('childIds should be an array.');
    }
    if (!beforeId) {
      this.children = this.children.concat(childIds);
      return;
    }

    let beforeIndex = this.children.findIndex(el => el === beforeId);
    beforeIndex = beforeIndex < 0 ? this.children.length : beforeIndex;
    this.children.splice(beforeIndex, 0, ...childIds);
  }

  removeChild(childId) {
    const index = this.children.findIndex(el => el === childId);
    if (index < 0) {
      return;
    }
    this.children.splice(index, 1);
  }

  /* 属性/事件操作 */
  setAttribute(name, value, type) {
    this.attributes[name] = {
      value,
      type: type || typeof value
    };
  }
}
