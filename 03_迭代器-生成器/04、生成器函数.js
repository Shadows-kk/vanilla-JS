function* foo() {
  const a = 100;
  console.log("第一段代码执行", a);
  yield;

  const b = 200;
  console.log("第二段代码执行", b);
  yield;

  const c = 300;
  console.log("第三段代码执行", c);
  yield;

  console.log("第四段代码执行");
}

const generator = foo();
generator.next(); //第一段代码执行 100
generator.next(); //第二段代码执行 200
generator.next(); //第三段代码执行 300
generator.next(); //第四段代码执行
