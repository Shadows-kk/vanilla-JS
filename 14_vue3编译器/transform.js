function transform(ast) {
  const context = {
    //currentNode用来存储正在转换的节点
    currentNode: null,
    //childIndex用来存储当前节点在父节点的children中的位置索引
    childIndex: 0,
    //parent用来存储当前节点的父节点
    parent: null,
    //用于替换节点的函数，接受新节点作为参数
    replaceNode: (node) => {
      //替换节点需要修改AST
      //找到当前节点在父节点的children中的位置，然后用新节点替换
      context.parent.children[context.childIndex] = node;
      //当前的节点已被新节点替换，需要将currentNode设置为新节点
      context.currentNode = node;
    },
    //用于删除当前节点
    removeNode: () => {
      if (context.parent) {
        //找到当前节点在父节点的children中的位置，然后删除
        context.parent.children.splice(context.childIndex, 1);
        //当前节点已被删除,需要将context.currentNode置空
        context.currentNode = null;
      }
    },
    //注册nodeTransforms数组，用来存储所有的节点转换函数
    nodeTransforms: [transformElement, transformText],
  };
  traverseNode(ast, context);
}

// 使用回调函数对节点的操作和访问进行解藕
function traverseNode(ast, context) {
  //设置当前转换节点信息
  context.currentNode = ast;
  //退出阶段的回调函数组
  const exitFns = [];
  //context.nodeTransforms是一个数组，其中每一个元素都是一个函数
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    //转换函数可以返回另一个函数，该函数作为退出阶段的回调函数
    const onExit = transforms[i](context.currentNode, context);
    if (onExit) {
      //将退出阶段的回调函数添加到exitFns数组中
      exitFns.push(onExit);
    }
    //任何转换函数都有可能移除当前节点，所以需要检查当前节点是否为空
    if (!context.currentNode) {
      return;
    }
  }

  const children = context.currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      //设置当前节点为父节点
      context.parent = context.currentNode;
      //设置当前节点在父节点的children中的位置索引
      context.childIndex = i;
      //递归调用traverseNode遍历子节点
      traverseNode(children[i], context);
    }
  }
  //在节点处理的最后阶段执行缓存到exitFns数组中的回调函数
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function transformElement(node) {
  //进入节点
  //返回退出节点的回调函数
  return () => {
    //退出节点
  };
}
function transformText(node, context) {
  if (node.type === "Text") {
    //  调用context.replaceNode函数替换当前节点
    // context.replaceNode({
    //   type: "Element",
    //   tag: "span",
    // });
    // 调用context.removeNode函数删除当前节点
    context.removeNode();
  }
}
