const array = [0, 9, 6, 5, 2];

function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  let flag = arr[0];
  let left = [];
  let right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < flag) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(flag, quickSort(right));
}
// console.log(quickSort(array));
// 时间复杂度 O( N*logN )

/**
 * 原地快排
 * 给定一个值，利用两个指针i，j。i找到一个比他大的，j找到一个比他小的，
 * 交换位置
 * 最后再交换这个值与i的位置
 */
function quickSort1(arr, start, end) {
  if (start < end) {
    let index = quickFn(arr, start, end); //标志位的值
    quickSort1(arr, start, index - 1);
    quickSort1(arr, index, end);
  }
  return arr;
}
function quickFn(arr, start, end) {
  // 双指针
  let init = start; //初始位置
  let flag = arr[init];
  start++;
  while (start <= end) {
    while (arr[end] > flag) {
      end--; //如果大于flag什么都不用做，直到找到一个不大于flag的数
    }
    while (arr[start] < flag) {
      start++; //如果小于flag什么都不用做，直到找到一个不小于flag的数
    }
    // 交换两个数
    if (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }
  // 跳出循环后，初始位置与相遇位置交换
  [arr[init], arr[start - 1]] = [arr[start - 1], arr[init]];
  return start;
}
console.log(quickSort1(array, 0, array.length - 1));
// 时间复杂度
// 空间复杂度成了O（1）
