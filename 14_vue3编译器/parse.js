//状态自动机对模板完成标记化（tokenized），得到一些列tokens
const tokens = tokenize(`<p>Vue<p/>`);
//返回的是一个tokens数组
tokens = [
  { type: "tag", name: "p" }, // 开始标签
  { type: "text", content: "Vue" }, // 文本节点
  { type: "tagEnd", name: "p" }, // 结束标签
];

// 解析tokens为AST
const ast = parse(`<div><p>Vue</p><p>Template</p></div>`);

function parse(str) {
  // 标记化, 得到tokens
  const tokens = tokenize(str);
  // 创建Root根节点
  const root = {
    type: "Root",
    children: [],
  };
  // 创建一个栈，初始只有根节点
  const stack = [root];
  //开启while循环，扫描tokens，直到所有token都被扫描完毕
  while (tokens.length) {
    //获取当前栈顶节点作为父节点
    const parent = stack[stack.length - 1];
    //扫描当前token
    const token = tokens[0];
    switch (token.type) {
      case "tag":
        //如果是开始标签，创建一个Element节点
        const elementNode = {
          type: "Element",
          tag: token.name,
          children: [],
        };
        //将Element节点作为子节点添加到父节点的children中
        parent.children.push(elementNode);
        //将Element节点入栈
        stack.push(elementNode);
        break;
      case "text":
        //如果是文本节点，创建一个Text节点
        const textNode = {
          type: "Text",
          content: token.content,
        };
        //将Text节点作为子节点添加到父节点的children中
        parent.children.push(textNode);
        break;
      case "tagEnd":
        //如果是结束标签，将当前节点出栈
        stack.pop();
        break;
    }
    //删除已经扫描的token
    tokens.shift();
  }
  //返回根节点
  return root;
}
