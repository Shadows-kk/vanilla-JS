let arr = [
  {
    a: 1,
    b: { aa: "aa", bb: "bb" },
    c: 1111,
  },
  {
    a: 2,
    b: { aa: "cc", bb: "dd" },
    c: 2222,
  },
];

let arr2 = arr.map(({ c, b: { bb } }) => ({ c, bb }));

console.log(arr2);
