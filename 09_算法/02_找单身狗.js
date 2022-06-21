//  需求：找出数组中只出现一次的数字

// a^a === 0 两个相同数字异或为0
// 0^a === a 0异或任何数，等于原数
// a^b^c === c^b^a 满足交换律

const arr = [1, 3, 1, 2, 2, 7, 3, 6, 7]

function uniquenumber(nums) {
  // var result = 0;
  // for (var i = 0; i < nums.length; i++) {
  //   result = result ^ nums[i]
  // }
  // return result
  return nums.reduce((a, b) => a ^ b, 0)
}
console.log(uniquenumber(arr));

