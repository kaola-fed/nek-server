let counter = 0;
let counterTimer = null;

export default class NSNode {
  constructor(id, options) {
    const opts = {
      tagName: 'div',
      libName: 'native',
      parent: null,
      children: [],
      attributes: {},
      events: {},
      ...options
    };
    const { tagName, libName, parent, children, attributes, events } = opts;

    this.id = id;
    this.tagName = tagName;
    this.libName = libName;

    this.parent = parent;
    this.children = children;

    this.attributes = attributes;
    this.events = events;
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

  /* 子元素操作 */

  insertChild(childId, beforeId = null) {
    // 统一id类型为字符串
    childId = `${childId}`;

    if (!beforeId) {
      this.children.push(childId);
      return;
    }

    const beforeIndex = this.children.findIndex(el => el.id === beforeId);
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

    const beforeIndex = this.children.findIndex(el => el.id === beforeId);
    this.children.splice(beforeIndex, 0, ...childIds);
  }

  removeChild(childId) {
    const index = this.children.findIndex(el => el.id === childId);
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
