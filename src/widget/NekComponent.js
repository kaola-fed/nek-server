import dom from 'regularjs/lib/dom';
import animate from 'regularjs/lib/helper/animate';
import combine from 'regularjs/lib/helper/combine';
import Regular from 'regularjs';
import { install } from 'nek-ui';

install(Regular);

// extend不带配置，保持纯净
const NekComponent = Regular.extend();

// 覆盖原有$inject，加入对fragment的处理等
NekComponent.prototype.$inject = function(node, options) {
  const {
    direction = 'bottom',
    beforeInsert = null
  } = options || {};

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

// 自定$replace，替换原有DOM
NekComponent.prototype.$replace = function(oldNode, options) {
  const {
    beforeReplace = null
  } = options || {};

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

// 添加静态函数，用于直接插入DOM中
NekComponent.inject = (tpl, parent, options) => {
  if (!parent) {
    throw new Error('Must provide a parent node');
  }

  const {
    direction = 'bottom',
    beforeInsert = null
  } = options || {};

  const RootComponent = new NekComponent({
    template: tpl
  });
  RootComponent.$inject(parent, {
    direction,
    beforeInsert
  });

  return RootComponent;
};

// 静态函数，替换目标node为新node
NekComponent.replace = (tpl, oldNode, options) => {
  const { beforeReplace = null } = options || {};

  const RootComponent = new NekComponent({
    template: tpl
  });
  RootComponent.$replace(oldNode, {
    beforeReplace
  });

  return RootComponent;
};

export default NekComponent;
