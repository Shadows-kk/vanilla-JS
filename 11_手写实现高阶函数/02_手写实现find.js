Array.prototype.find = function (fn) {
  let item //保存查找到的结果
  for (let i = 0; i < this.length; i++) {
    //标志 为true返回结果
    let flag = fn(this[i], i, this)
    if (flag) {
      item = this[i]
      break;
    }
  }
  return item
}