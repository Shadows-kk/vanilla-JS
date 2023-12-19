function updateChildren(n1, n2, container) {
  // 1.获取新老的虚拟节点
  const oldChildren = n1.children;
  const newChildren = n2.children;
  // 用来存储寻找过程中遇到的最大索引值
  let lastIndex = 0;
  // 遍历新节点
  for (let i = 0; i < newChildren.length; i++) {
    const newVnode = newChildren[i];
    let j = 0;
    // 定义find，代表是否在旧的一组子节点中找到可复用的节点
    let find = false;
    // 遍历旧节点
    for (j; j < oldChildren.length; j++) {
      const oldVnode = oldChildren[j];
      //如果找到具有相同key的两个节点，说明可以复用，仍然需要调用patch函数更新
      if (oldVnode.key === newVnode.key) {
        // 一旦找到可复用的节点，则将变量find的值设置为true
        find = true;
        patch(oldVnode, newVnode, container);
        if (j < lastIndex) {
          // 如果当前找到的节点在旧children中的索引值小于最大索引值lastIndex
          // 说明该节点对应的真实DOM需要移动

          //先获取newNode的前一个vnode，，即preVnode
          const preVnode = newChildren[i - 1];
          // 如果preVnode不存在，则说明当前的节点是第一个子节点，无需移动
          if (preVnode) {
            // 要将newNode对应的真实DOM移动到prevNode所对应的真实DOM后面
            // 获取preVnode的真实DOM的下一个兄弟节点，将其作为锚点
            const anchor = preVnode.el.nextSibling;
            // 调用insert将newNode对应的真实DOM移动到锚点元素前面，即插入到preVnode的后面
            insert(newVnode.el, container, anchor);
          }
        } else {
          //如果当前找到的节点在旧节点children中的索引值不小于最大索引值lastIndex
          // 更新lastIndex
          lastIndex = j;
        }
        break;
      }
    }
    // 如果代码运行到这里，find仍然为false，说明当前newNode没有在旧的一组子节点中找到可复用的节点
    // 即当前的是新增节点，需要挂载
    if (!find) {
      // 正确挂载，需要先获取锚点位置
      const preVnode = newChildren[i - 1];
      let anchor = null;
      if (preVnode) {
        // 如果有，获取下一个兄弟节点作为锚点元素
        anchor = preVnode.el.nextSibling;
      } else {
        // 如果没有，说明即将挂载的新节点是第一个子节点
        anchor = container.fistChild;
      }
      // 挂载vNode
      patch(null, newVNode, container, anchor);
    }
  }

  // 更新操作完成以后，遍历旧的一组子节点，移除新节点中不存在的旧节点
  for (let i = 0; i < oldChildren.length; i++) {
    const oldVnode = oldChildren[i];
    const has = newChildren.find((item) => item.key === oldVnode.key);
    if (!has) {
      // 没有在新节点中找到相同key的旧节点，需要删除该节点
      unmount(oldVnode);
    }
  }
}
