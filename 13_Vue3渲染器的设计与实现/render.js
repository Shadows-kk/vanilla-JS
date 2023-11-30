function createRenderer(options) {
  const { createElement, setElementText, insert } = options;
  // patch函数
  function patch(n1, n2, container) {
    // 如果n1不存在，意味着挂载，调用mountElement函数完成挂载
    if (!n1) {
      mountElement(n2, container);
    } else {
      // n1存在，意味着打补丁，即更新
    }
  }
  function mountElement(vnode, container) {
    // 调用createElement创建DOM元素
    const el = createElement(vnode.type);
    // 处理子节点，子节点是字符串类型，代表元素具有文本节点
    if (typeof vnode.children === "string") {
      // 调用setElementText设置元素的文本节点
      setElementText(el, vnode.children);
    }
    // 调用insert将元素添加到容器中
    insert(el, container);
  }
  // 挂载函数
  // 渲染函数
  function render(vnode, container) {
    if (vnode) {
      // 如果vnode存在，将其与旧node一起传递给patch函数，进行打补丁
      patch(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        //旧的vnode存在，且新的vnode不存在，说明是卸载（unmount）操作
      }
    }
    // 将vnode存在container._vnode下，即后续渲染中的旧的vnode
    container._vnode = vnode;
  }

  // 渲染器不进能够渲染，还能用来激活已有的DOM元素
  function hydrate(vnode, container) {}
  return {
    render,
    hydrate,
  };
}
// 虚拟节点
const vnode = {
  type: "div",
  children: "hello",
};
// 创建渲染器
// mountElement函数调用了大量依赖浏览器的API，要设计通用渲染器，就需要将他们抽离，将这些
// DOM操作的API作为配置项，作为createRenderer函数的参数传入
const renderer = createRenderer({
  // 用于创建元素
  createElement(tag) {
    return document.createElement(tag);
  },
  // 用于设置元素的文本节点
  setElementText(el, text) {
    el.textContent = text;
  },
  // 用于给定的parent下指定元素
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
});
// 渲染器调用render函数渲染vnode
renderer.render(vnode, document.querySelector("#app"));
