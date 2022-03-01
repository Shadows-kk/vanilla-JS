const iterableobject = {
  arr: [1, 2, 3],
  [Symbol.iterator]: function () {
    let index = 0;
    return {
      next: () => {
        //这里需要是个箭头函数，不然this指向的只是return的对象，找不到arr
        if (index < this.arr.length) {
          return { done: false, value: this.arr[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  },
};
// console.log(iterableobject[Symbol.iterator]());
// const result = iterableobject[Symbol.iterator]();
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());

// 注意：for ... of 遍历的必须是可迭代对象

const obj = { name: "ckk", age: 19 };
for (item of iterableobject) {
  console.log(item);
}
