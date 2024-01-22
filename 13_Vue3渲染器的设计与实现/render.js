function createRenderer(options) {
  const { createElement, setElementText, insert } = options;
  // patch函数
  function patch(n1, n2, container, anchor = null) {
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
      n1 = null;
    }
    //代码运行到这里，证明n1与n2所描述的内容相同
    const { type } = n2;
    // 如果n2.type是字符串类型，说明是普通标签元素
    if (typeof type === "string") {
      // 如果n1不存在，意味着挂载，调用mountElement函数完成挂载
      if (!n1) {
        mountElement(n2, container, anchor);
      } else {
        // n1存在，意味着新旧节点类型相同，打补丁，即更新
        patchElement(n1, n2);
      }
    } else if (type === Text) {
      // type为Text，说明是文本节点
      // 如果没有旧节点，直接挂载
      if (!n1) {
        const el = createText(n2.children);
        // 将文本节点插入到容器中
        insert(el, container);
      } else {
        // 旧的vnode存在 直接替换文本内容
        const el = (n2.el = n1.el);
        if (n2.children !== n1.children) {
          setText(el, n2.children);
        }
      }
    } else if (type === Comment) {
      // 处理方式与Text类似，差别在于使用document.createComment创建节点
    } else if (type === Fragment) {
      if (!n1) {
        // 如果旧节点不存在，直接把Fragment的children逐个挂载即可
        n2.children.forEach((c) => patch(null, c, container));
      } else {
        // 如果旧节点存在，把Fragment的children更新即可
        patchChildren(n1, n2, container);
      }
    } else if (typeof type === "object") {
      // 如果是对象类型，描述的是组件
      if (!n1) {
        mountComponent(n2, container, anchor);
      } else {
        patchComponent(n1, n2, anchor);
      }
    } else {
      // 处理其他类型的vnode
    }
  }
  // 某些 DOM properties 是只读的，不能被直接赋值
  function shouldSetAsProps(el, key, value) {
    // 特殊处理 form只存在于input上
    if (key === "form" && el.tagName === "INPUT") return false;
    // 其他特殊处理

    // 兜底
    return key in el;
  }
  // 挂载函数
  function mountElement(vnode, container, anchor) {
    // 调用createElement创建DOM元素
    // 让vnode.el引用真实的DOM元素
    const el = (vnode.el = createElement(vnode.type));
    // 处理子节点，子节点是字符串类型，代表元素具有文本节点
    if (typeof vnode.children === "string") {
      // 调用setElementText设置元素的文本节点
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      // 子节点是数组类型，代表元素具有多个子节点，遍历子节点并调用patch挂载它们
      vnode.children.forEach((child) => {
        patch(null, child, el);
      });
    }

    // 处理props
    if (vnode.props) {
      for (const key in vnode.props) {
        // 调用patchProps处理props
        patchProps(el, key, null, vnode.props[key]);
      }
    }

    // 调用insert将元素添加到容器中
    insert(el, container, anchor);
  }
  // 卸载函数封装道unmount中，一是能调用绑定在dom元素上的指令钩子函数，
  // 二是能检测vnode的类型，是组件的话可以调用相关的生命周期
  function unmount(vnode) {
    // 如果卸载的vnode类型为Fragment,需要卸载其子节点
    if (vnode.type === Fragment) {
      vnode.children.forEach((c) => {
        unmount(c);
      });
      return;
    }
    const parent = vnode.el.parentNode;
    if (parent) {
      parent.removeChild(vnode.el);
    }
  }
  // 对比新旧节点 打补丁
  function patchElement(n1, n2) {
    // 新的vnode也引用了真实的DOM元素 意义是dom元素的复用
    const el = (n1.el = n2.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 第一步，更新props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }
    // 第二步 更新children
    patchChildren(n1, n2, el);
  }
  // 更新子节点
  function patchChildren(n1, n2, container) {
    // 判断新子节点的类型是否是文本节点
    if (typeof n2.children === "string") {
      // 旧节点只有三种可能：没有子节点，文本子节点，一组子节点
      // 只有当旧子节点是一组子节点时，才需要清空容器，其他情况什么都不需要做
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c));
      }
      // 将新的文本节点内容设置给容器元素
      setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
      // 新子节点是一组子节点时
      // 判断旧的子节点是否也是数组
      if (Array.isArray(n1.children)) {
        // 傻瓜式的方法，极其消耗性能
        // 旧的一组子节点全部卸载
        n1.children.forEach((c) => unmount(c));
        // 新的一组子节点全部挂载
        n2.children.forEach((c) => patch(null, c, container));

        // 优化性能，需要diff算法
        // updateChildren(n1,n2,container);
      } else {
        //旧的子节点不是数组，不管是文本子节点还是不存在
        // 都需要先清空容器，然后逐一挂载新的子节点
        setElementText(container, "");
        n2.children.forEach((c) => patch(null, c, container));
      }
    } else {
      // 新子节点不存在
      if (Array.isArray(n1.children)) {
        // 旧子节点存在，逐个卸载
        n1.children.forEach((c) => unmount(c));
      } else if (typeof n1.children === "string") {
        //旧节点是文本子节点，清空内容即可
        setElementText(container, "");
      }
      //如果旧的子节点也不存在，那么什么都不需要做
    }
  }
  function updateChildren() {}
  // 挂载组件
  function mountComponent(vnode, container, anchor){
    
  }
  // 更新组件
  function patchComponent(n1, n2, container){}
  // 渲染函数
  function render(vnode, container) {
    if (vnode) {
      // 如果vnode存在，将其与旧node一起传递给patch函数，进行打补丁
      patch(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        //旧的vnode存在，且新的vnode不存在，说明是卸载（unmount）操作
        unmount(container._vnode);
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
  props: {
    id: "foo",
    class: "bar",
    onClick: [
      () => {
        alert("click 1");
      },
      () => {
        alert("click 2");
      },
    ],
    onContextmenu: () => {
      alert("contextmenu");
    },
  },
  children: [
    {
      type: "p",
      children: "hello",
    },
    "some text",
  ],
};
// 文本节点
const Text = Symbol();
const newVnode1 = {
  // 描述文本节点
  type: Text,
  children: "我是文本内容",
};
// 注释节点
const Comment = Symbol();
const newVnode2 = {
  // 描述注释节点
  type: Comment,
  children: "我是注释内容",
};
const Fragment = Symbol();
const newVnode3 = {
  type: Fragment,
  children: [
    { type: "li", children: "text 1" },
    { type: "li", children: "text 2" },
    { type: "li", children: "text 3" },
  ],
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
  // 创建本文节点
  createText(text) {
    return document.createTextNode(text);
  },
  // 设置文本内容
  setText(el, text) {
    el.nodeValue = text;
  },
  // 设置属性
  patchProps(el, key, preValue, nextValue) {
    // 事件绑定
    if (/^on/.test(key)) {
      // 绑定一个伪造的事件处理函数，完成事件更新，性能更优
      let invokers = el._vei || (el._vei = {}); //定义一个对象，存在事件名到事件处理函数之间的映射
      // 根据事件名称获取对应的事件处理函数
      let invoker = invokers[name];
      const name = key.slice(2).toLowerCase();

      if (nextValue) {
        if (!invoker) {
          // 如果不存在invoker，将事件处理函数缓存到el.vei[key]下，避免覆盖
          invoker = el._vei[key] = (e) => {
            // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
            // 如果事件发生的时间早于事件处理函数绑定的时间，则不执行事件处理函数
            if (e.timestamp < invoker.attached) return;
            // 如果invoker.value是数组，则遍历并逐个调用每个处理函数
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => {
                fn(e);
              });
            } else {
              // 不是数组，则直接调用
              invoker.value(e);
            }
          };
          // 将真正的事件处理函数赋值给invoker.value
          invoker.value = nextValue;
          // 添加invoker.attached属性，用于存储事件处理函数绑定的时间
          invoker.attached = performance.now();
          // 绑定invoker作为事件处理函数
          el.addEventListener(name, invoker);
        } else {
          // 如果存在invoker，意味着更新，只需要更新invoker.value
          invoker.value = nextValue;
        }
      } else if (invoker) {
        // 如果新的事件绑定函数不存在，且之前绑定的invoker存在，则移除绑定
        el.removeEventListener(name, invoker);
      }
    }
    //对class进行特殊处理
    else if (key === "class") {
      el.className = nextValue;
    }
    // 用shouldSetAsProps判断是否应该作为 Dom properties设置
    else if (shouldSetAsProps(el, key, nextValue)) {
      // 获取该 DOM properties 的类型
      const type = typeof el[key];
      // 如过是布尔类型 并且value是空字符串，则矫正为true
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      // 如果key不存在于el上，说明没有对应的 Dom properties,调用setAttribute设置元素的属性
      el.setAttribute(key, nextValue);
    }
  },
});
// 渲染器调用render函数渲染vnode
renderer.render(vnode, document.querySelector("#app"));
