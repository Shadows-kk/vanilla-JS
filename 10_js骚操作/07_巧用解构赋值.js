let arr = [
  // {
  //   a: 1,
  //   b: { aa: "aa", bb: "bb" },
  //   c: 1111,
  // },
  {
    a: 2,
    b: { aa: "cc", bb: "dd", dd: { ee: "ee", ff: "ff" } },
    c: 2222,
  },
];

let arr2 = arr.map(
  ({
    c,
    b: {
      bb,
      dd: { ff },
    },
  }) => ({ c, bb, ff })
);

console.log(arr2);
