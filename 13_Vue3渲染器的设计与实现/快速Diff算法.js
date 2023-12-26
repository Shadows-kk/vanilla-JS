function patchKeyedChildren(n1, n2, container) {
  // 1. 旧的子节点
  const oldChildren = n1.children;
  // 2. 新的子节点
  const newChildren = n2.children;
  // 预处理相同的前置节点
  // 索引j指向新旧节点的开头
  let j = 0;
  let oldVNode = oldChildren[j];
  let newVNode = newChildren[j];
  // while循环遍历，直到遇到有不同key的节点为止
  while (oldVNode.key === newVNode.key) {
    // 1. 打补丁
    patch(oldVNode, newVNode, container);
    // 2. 更新索引 j递增
    j++;
    oldVNode = oldChildren[j];
    newVNode = newChildren[j];
  }
  // 预处理相同的后置节点
  // 索引oldEnd指向旧节点的末尾
  let oldEnd = oldChildren.length - 1;
  // 索引newEnd指向旧节点的末尾
  let newEnd = newChildren.length - 1;
  oldVNode = oldChildren[oldEnd];
  newVNode = newChildren[newEnd];

  // while循环从后向前遍历，直到遇到拥有不同key值的节点为止
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container);
    oldEnd--;
    newEnd--;
    oldVNode = oldChildren[oldEnd];
    newVNode = newChildren[newEnd];
  }

  // 预处理完毕，如果满足一下条件，则说明j到newEnd之前的节点应该作为新节点插入
  if (j > oldEnd && j <= newEnd) {
    // 锚点的索引
    const anchorIndex = newEnd + 1;
    // 锚点元素
    const anchor =
      anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
    // 逐个挂载元素
    while (j <= newEnd) {
      patch(null, newChildren[j++], container, anchor);
    }
  } else if (j > newEnd && j <= oldEnd) {
    // 逐个卸载元素
    while (j <= oldEnd) {
      unmount(oldChildren[j++]);
    }
  } else {
    // 处理非理想情况
    // 构建source数组，用来存储每个newVNode在oldVNode中的索引位置
    const count = newEnd - j + 1;
    const source = new Array(count).fill(-1);
    // oldStart和newStart为起始索引
    const oldStart = j;
    const newStart = j;
    // 新增两个变量，moved和pos
    let moved = false;
    let pos = 0;
    // 构建索引表，用来快速填充source数组，而非采用双层for循环
    const keyIndex = {};
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i;
    }
    // 新增patched变量，代表更新过节点的数量
    let patched = 0;
    // 遍历旧节点中未被处理的节点
    for (let i = oldStart; i < oldEnd; i++) {
      const oldVNode = oldChildren[i];
      // 如果更新的节点数量小于等于需要更新的节点数量，则执行更新
      if (patched <= count) {
        // 通过索引表,快速找到新的一组子节点中具有与旧节点相同key值的节点索引位置
        const k = keyIndex[oldVNode.key];
        if (typeof k !== "undefined") {
          newVNode = newChildren[k];
          patch(oldVNode, newVNode, container);
          patched++;
          // 更新source数组
          source[k - newStart] = i;
          // 判断节点是否需要移动
          if (k < pos) {
            moved = true;
          } else {
            pos = k;
          }
        } else {
          // 没找到
          unmount(oldVNode);
        }
      } else {
        // 如果更新的节点数量大于需要更新的节点数量，则卸载多余的节点
        unmount(oldVNode);
      }
    }
  }
}
