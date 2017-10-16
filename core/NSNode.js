export default class NSNode {
  constructor(id, { tagName, libName = 'native', parent = null, children = [], attributes = {}, events = {} }) {
    this.id = id;
    this.tagName = tagName;
    this.libName = libName;

    this.parent = parent;
    this.children = children;

    this.attributes = attributes;
    this.events = events;
  }

  static generateId() {
    // TODO: id gen
    return `${Math.random()}`;
  }

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
}
