// 手写call
Function.prototype.myCall = function (ctx, ...args) {
  ctx = (ctx === null || ctx === undefined) ? globalThis : Object(ctx)

  // Symbol是为了确保不与绑定对象中的key重复
  let key = Symbol('temp')
  // ctx[key]用于保存调用的函数，放在被绑定的对象属性里
  //this指向的是调用myCall的函数
  Object.defineProperty(ctx, key, {//Object.defineProperty是为了在打印的时候不展示这个key
    enumerable: false,
    value: this
  })
  const result = ctx[key](...args)
  delete ctx[key]
  return result
}

function method(a, b) {
  console.log(this, a, b);
  return a + b
}
// 这里的被绑定对象可能是null、undefined或者是空对象和其他基本数据类型
console.log(method.myCall({}, 1, 2))
console.log(method.myCall(null, 1, 2))