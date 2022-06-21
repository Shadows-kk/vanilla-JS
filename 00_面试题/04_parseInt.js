var nums = ['1', '2', '3'];
var newNums = nums.map(parseInt)
console.log(newNums); //[ 1, NaN, NaN ]

// 原因：parseInt的第二个参数表示进制，合法值 2～36，0默认十进制；非法值为NaN
// parseInt会执行三次
// parseInt('1', 0) -> 1
// parseInt('2', 1) -> NaN
// parseInt('3', 2) -> NaN