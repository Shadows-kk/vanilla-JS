var x = 0
//当函数的参数有默认值时，会形成一个新的作用域，这个作用域用于保存参数的值
function fn(x, y = function () { x = 1, console.log(x) }) {
  console.log(x);
  var x = 2
  y()
  console.log(x);
}
fn()
console.log(x);
// undefined
// 1
// 2
// 0