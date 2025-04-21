//与模板 <div><p>Vue</p><p>Template</p></div> 等价的渲染函数是：
function render() {
  return h("div", [h("p", "Vue"), h("p", "Template")]);
}
//与渲染函数对应的 js AST:
const FunctionDeclNode = {
  type: "FunctionDecl", //代表该节点是函数声明
  id: {
    type: "Identifier", //代表该节点是标识符
    name: "render", //标识符的名字, 即函数名
  },
  params: [], //函数参数
  //渲染函数只有一个函数体，即 return 语句
  body: {
    type: "ReturnStatement", //代表该节点是 return 语句
    //最外层的h函数调用
    return: {
      type: "CallExpression",
      //被调用函数的名称，是一个标识符
      callee: {
        type: "Identifier",
        name: "h",
      },
      arguments: [
        //第一个参数是字符串字面量 "div"
        {
          type: "StringLiteral",
          value: "div",
        },
        //第二个参数是数组表达式
        {
          type: "ArrayExpression",
          elements: [
            //数组元素是两个h函数调用
            {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "h",
              },
              arguments: [
                //该h函数第一个参数也是字符串字面量
                {
                  type: "StringLiteral",
                  value: "p",
                },
                //该h函数第二个参数也是字符串字面量
                {
                  type: "StringLiteral",
                  value: "Vue",
                },
              ],
            },
            {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "h",
              },
              arguments: [
                {
                  type: "StringLiteral",
                  value: "p",
                },
                {
                  type: "StringLiteral",
                  value: "Template",
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
