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
  }
}
