// 需求：判断数字x是否是2的n次方

// 且运算 相同为1不同为0
// 2的n次方的特点，只有一位是1，其他是0
// 1000
// 0111
// 0000

function isPowerOf2(x) {
  return (x & (x - 1)) === 0
}
console.log(isPowerOf2(2));
console.log(isPowerOf2(3));
console.log(isPowerOf2(8));
