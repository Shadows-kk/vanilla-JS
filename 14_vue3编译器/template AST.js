//模板
<div>
  <h1 v-if="ok">Template</h1>
</div>;

// AST就是一个具有层级结构的对象，用来描述模板的结构
// 通过parse函数对模板进行词法分析和语法分析，得到模板AST
const ast = {
  // 逻辑跟节点
  type: "Root",
  children: [
    // div标签节点
    {
      type: "Element",
      tag: "div",
      children: [
        // h1标签节点
        {
          type: "Element",
          tag: "h1",
          props: [
            // v-if指令
            {
              type: "Directive",
              name: "if", // 指令名称，不带if
              exp: {
                //表达式节点
                type: "Expression",
                content: "ok",
              },
            },
          ],
          children: [
            // 文本节点
            {
              type: "Text",
              content: "Template",
            },
          ],
        },
      ],
    },
  ],
};
