//用来创建 JS AST 的辅助函数

//1.用来创建StringLiteral类型的节点
function createStringLiteral(value) {
  return {
    type: "StringLiteral",
    value,
  };
}
//2.用来创建Identifier类型的节点
function createIdentifier(name) {
  return {
    type: "Identifier",
    name,
  };
}
//3.用来创建CallExpression类型的节点
function createCallExpression(callee, arguments) {
  return {
    type: "CallExpression",
    callee: createIdentifier(callee),
    arguments,
  };
}
//4.用来创建ArrayExpression类型的节点
function createArrayExpression(elements) {
  return {
    type: "ArrayExpression",
    elements,
  };
}

//转换文本节点
function transformText(node) {
  //如果不是文本节点，什么都不做
  if (node.type !== "Text") {
    return;
  }
  //文本节点对应的js ast其实就是一个StringLiteral类型的节点，所以直接调用createStringLiteral函数创建即可，再将其添加到node.jsNOde属性中
  node.jsNode = createStringLiteral(node.content);
}
//转换标签节点
function transformElement(node) {
  //将转换代码写在退出阶段的回调函数中
  //这样可以保证在子节点全部转换完毕之后再进行转换
  return () => {
    //如果不是标签节点，什么都不做
    if (node.type !== "Element") {
      return;
    }

    //1.创建h函数调用语句
    //h函数的第一个参数是标签名，以node.tag来创建一个字符串字面量节点作为第一个参数
    const callExp = createCallExpression("h", [createStringLiteral(node.tag)]);
    //2.处理h函数调用的参数
    node.children.length === 1
      ? //如果只有一个子节点，直接将子节点的jsNode属性添加到h函数调用的参数中 如：h("div", "Template");
        callExp.arguments.push(node.children[0].jsNode)
      : //如果有多个子节点，则创建一个createArrayExpression数组表达式节点作为参数 如： h("div", [h("p", "Vue"), h("p", "Template")]);
        callExp.arguments.push(
          createArrayExpression(node.children.map((child) => child.jsNode))
        );

    //3.将当前标签节点对应的 js ast 添加到 node.jsNode 属性下
    node.jsNode = callExp;
  };
}
//转换根节点
function transformRoot(node) {
  //将逻辑写在退出的回调函数中
  return () => {
    // 如果不是根节点，什么都不做
    if (node.type !== "Root") {
      return;
    }
    // node是跟节点，根节点的第一个子节点就是模板的根节点
    const vnodeJSAST = node.children[0].jsNode;
    //创建render函数的声明节点，将vnodeJSAST作为render函数体的返回语句
    node.jsNode = {
      type: "FunctionDecl",
      id: createIdentifier("render"),
      params: [],
      body: [
        {
          type: "ReturnStatement",
          return: vnodeJSAST,
        },
      ],
    };
  };
}
