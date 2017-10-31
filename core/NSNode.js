let counter = 0;
let counterTimer = null;

export default class NSNode {
  constructor(id, options) {
    const {
      tagName = 'div',
      libName = 'native',
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

  /* 子元素操作 */

  insertChild(childId, beforeId = null) {
    // 统一id类型为字符串
    childId = `${childId}`;

    if (!beforeId) {
      this.children.push(childId);
      return;
    }

    let beforeIndex = this.children.findIndex(el => el.id === beforeId);
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

    let beforeIndex = this.children.findIndex(el => el.id === beforeId);
    beforeIndex = beforeIndex < 0 ? this.children.length : beforeIndex;
    this.children.splice(beforeIndex, 0, ...childIds);
  }

  removeChild(childId) {
    const index = this.children.findIndex(el => el.id === childId);
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
