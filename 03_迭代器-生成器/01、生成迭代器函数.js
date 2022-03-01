const array = [1, 2, 3];
function createArrayIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { done: false, value: arr[index++] };
      } else {
        return { done: true, value: undefined };
      }
    },
  };
}
let result = createArrayIterator(array);
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
