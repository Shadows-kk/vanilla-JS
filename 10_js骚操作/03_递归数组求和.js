// 递归的精髓在于找到状态转移方程
// 如给波那契数列的状态转移方程 [1,1,2,3,5,8] => f(n) = f(n-1) + f(n-2)
function sum(arr, i = 0) {
  if (i === arr.length - 1) {
    return arr[i]
  } else {
    return arr[i] + sum(arr, i + 1)
  }
}
const a = [3, 3, 4, 5]
console.log(sum(a)); 
