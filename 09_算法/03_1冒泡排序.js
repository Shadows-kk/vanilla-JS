const array = [0, 9, 6, 5, 2];

function bubbleSort(arr) {
  let len = arr.length - 1;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
      }
    }
  }
  return arr;
}
console.log(bubbleSort(array));
// 时间复杂度 O（N^2）
