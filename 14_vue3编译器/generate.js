function generate(node) {
  const context = {
    //存储最终生成的渲染函数代码
    code: "",
    // 生成代码时，通过调用push函数完成代码拼接
    push(code) {
      context.code += code;
    },
    //当前缩进的级别，初始为0，即没有缩进
    currentIndent: 0,
    //函数用来换行，在代码字符串的后面追加\n字符
    //换航时应该保留缩进，所以我们还要追加 currentIndent*2 个空格
    newline() {
      context.code += "\n" + " ".repeat(context.currentIndent * 2);
    },
    // 用来缩进，让currentIndent 自增后，调用换行函数
    indent() {
      context.currentIndent++;
      context.newline();
    },
    // 用来取消缩进，让currentIndent 自减后，调用换行函数
    deindent() {
      context.currentIndent--;
      context.newline();
    },
  };
  //调用genNode函数完成代码的生成工作
  genNode(node, context);
  // 返回最终生成的代码
  return context.code;
}

function genNode(node, context) {
  switch (node.type) {
    case "FunctionDecl":
      genFunctionDecl(node, context);
      break;
    case "CallExpression":
      genCallExpression(node, context);
      break;
    case "ReturnStatement":
      genReturnStatement(node, context);
      break;
    case "StringLiteral":
      genStringLiteral(node, context);
      break;
    case "ArrayExpression":
      genArrayExpression(node, context);
      break;
  }
}
// 为函数声明类型节点生成对应的js代码
function genFunctionDecl(node, context) {
  // 从context中解构出工具函数
  const { push, indent, deindent } = context;
  push("function ${node.id.name}");
  push("(");
  genNodeList(node.params, context);
  push(")");
  push("{");
  indent();
  node.body.forEach((n) => genNode(n, context));
  deindent();
  push("}");
}
//为函数参数生成对应的代码
function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (i > 0) {
      push(",");
    }
    genNode(node, context);
  }
}
// 生成数组表达式代码
function genArrayExpression(node, context) {
  const { push } = context;
  push("[");
  genNodeList(node.elements, context);
  push("]");
}
//为return语句生成对应的代码
function genReturnStatement(node, context) {
  const { push } = context;
  push("return ");
  genNode(node.return, context);
}
//为字符串字面量生成对应的代码
function genStringLiteral(node, context) {
  const { push } = context;
  push(`"${node.value}"`);
}
//为函数调用表达式生成对应的代码
function genCallExpression(node, context) {
  const { push } = context;
  //取得被调函数名称和参数列表
  const { callee, arguments: args } = node;
  //生成被调函数的名称
  push(`${callee.name}(`);
  //生成参数列表
  genNodeList(args, context);
  push(`)`);
}

// const ast = parse(`<div><p>Vue</p><p>Template</p></div>`)
// transform(ast)
// const code = generate(ast.jsNode)
// //最终得到的代码是：
// function render() {
//   return h("div", [h("p", "Vue"), h("p", "Template")]);
// }
