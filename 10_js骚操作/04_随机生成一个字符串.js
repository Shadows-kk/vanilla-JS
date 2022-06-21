let str = Math.random().toString(36) //toString方法传递的参数表示进制，最多是36，10数字+26字母
const r = str.substr(2) //截取小数点后面的内容
console.log(r);

// 随机生成颜色
function randomColor() {
  return '#' + Math.random().toString(16).substr(2, 8)
}