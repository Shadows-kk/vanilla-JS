function* foo(num) {
  const a = 100 * num;
  console.log("第一段代码执行", a);
  const n = yield a; //通过yield来返回第一段代码的值，同时yield表达式的返回值接受下一段代码next传入的参数

  const b = 200 * n;
  console.log("第二段代码执行", b);
  const m = yield b;

  const c = 300 * m;
  console.log("第三段代码执行", c);
  yield c;

  console.log("第四段代码执行");
}
const generator = foo(5); //这里传参是给第一段代码穿入
console.log(generator.next());
console.log(generator.next(10)); //next传进去的参数，是作为上一段代码yield的返回值
console.log(generator.next(20));
