import dom from 'regularjs/lib/dom';
import animate from 'regularjs/lib/helper/animate';
import combine from 'regularjs/lib/helper/combine';
import Regular from 'regularjs';
import { install } from 'nek-ui';

install(Regular);

// extend不带配置，保持纯净
const NekComponent = Regular.extend();

// 覆盖原有$inject，加入对fragment的处理等
NekComponent.prototype.$inject = function(node, { direction = 'bottom', beforeInsert }) {
  let group = this;
  let fragment = combine.node(group.group || group);
  if (node === false) {
    animate.remove(fragment);
    return group;
  }
  if (!fragment) {
    return group;
  }
  if (typeof node === 'string') {
    node = dom.find(node);
  }
  if(!node) {
    throw Error('injected node is not found');
  }

  if (beforeInsert) {
    fragment = beforeInsert(fragment);
  }
  // use animate to animate first children
  animate.inject(fragment, node, direction);

  // if it is a component
  if (group.$emit) {
    let preParent = group.parentNode;
    group.parentNode = (direction === 'after' || direction === 'before') ? node.parentNode : node;
    group.$emit('$inject', node, direction, preParent);
  }
  return group;
};

NekComponent.prototype.$replace = function(oldNode, { beforeReplace }) {
  if (!oldNode) {
    throw Error('Need to provide an old node');
  }

  let group = this;
  let fragment = combine.node(group.group || group);

  if (!fragment) {
    return group;
  }

  if (beforeReplace) {
    fragment = beforeReplace(fragment);
  }

  // replace
  if (Array.isArray(fragment)) {
    const newNode = dom.fragment();
    for (let i of fragment) {
      newNode.append(i);
    }
    oldNode.parentNode.replaceChild(newNode, oldNode);
  } else {
    oldNode.parentNode.replaceChild(fragment, oldNode);
  }

  return group;

};

export default NekComponent;
