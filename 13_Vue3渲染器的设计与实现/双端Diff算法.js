function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children;
  const newChildren = n2.children;
  // 四个索引值
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;
  // 四个索引值指向的vNode节点
  let oldStartVNode = oldChildren[oldStartIdx];
  let oldEndVNode = oldChildren[oldEndIdx];
  let newStartVNode = newChildren[newStartIdx];
  let newEndVNode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    //如果头尾两个节点是undefined，则说明该节点已经被处理过了，直接跳到下一个位置
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIdx];
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx];
    } else if (oldStartVNode.key === newStartVNode.key) {
      // 打补丁，更新索引
      patch(oldStartVNode, newStartVNode, container);
      // 更新索引
      oldStartVNode = oldChildren[++oldStartIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else if (oldEndVNode.key === newEndVNode.key) {
      patch(oldEndVNode, newEndVNode, container);
      // 更新索引
      oldEndVNode = oldChildren[--oldEndIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldStartVNode.key === newEndVNode.key) {
      patch(oldStartVNode, newEndVNode, container);
      // 将旧的一组子节点的头部节点对应的真实DOM节点移动到旧的一组子节点的尾部节点对应的真实DOM节点的后面
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling);
      // 更新索引
      oldStartVNode = oldChildren[++oldStartIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 调用patch进行新旧节点打补丁
      patch(oldEndVNode, newStartVNode, container);
      // 移动DOM，oldEndVNode.el移动到oldStartVNode.el之前
      insert(oldEndVNode.el, container, oldStartVNode.el);
      // 移动之后，更新索引值
      oldEndVNode = oldChildren[--oldEndIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else {
      // 遍历旧的一组子节点，试图寻找与newStartVNode拥有相同key值的节点
      const idxInOld = oldChildren.findIndex(
        (v) => v.key === newStartVNode.key
      );
      if (idxInOld > 0) {
        // idxInOld大于0,说明找到了可复用的节点，并且需要将其移动到头部
        const vnodeToMove = oldChildren[idxInOld];
        //打补丁
        path(vnodeToMove, newStartVNode, container);
        // 插入oldStartVNode之前
        insert(vnodeToMove.el, container, oldStartVNode.el);
        // 位于idxInOld的节点对应的真实DOM已经被移动到了别处，因此将其设置为undefied
        oldChildren[idxInOld] = undefined;
        // 更新newStartIdx
        newStartVNode = newChildren[++newStartIdx];
      } else {
        // 将newStartVNode作为新节点挂载到头部，使用当前头部节点oldStartVNode.el作为锚点
        patch(null, newStartVNode, container, oldStartVNode.el);
      }
      newStartVNode = newChildren[++newStartIdx];
    }
  }
  //循环结束检查索引值的情况
  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    // 如果满足条件，则说明有新的节点遗留，需要挂载
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVNode.el);
    }
  } else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
    // 移除操作
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      unmount(oldChildren[i]);
    }
  }
}
