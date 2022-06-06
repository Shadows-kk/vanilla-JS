const str = "1234abc_asdsa";
function dicFn(value) {
  // 1.拆分字符串
  let tempArr = [];
  function splitNumber(str) {
    for (let j = 0; j < str.length - 1; j++) {
      let s = str.substring(j, j + 2);
      tempArr.push(s);
    }
  }
  splitNumber(value);
  // 2.比较前后两位是否升序
  let check = tempArr.filter(s => {
    var v = 1;
    return [...s].some((c, i, a) => {
      v *= parseInt(c, 36) + 1 === parseInt(a[i + 1], 36);
      return ++v === 2;
    });
  });
  // 3.返回字典序数量
  return check.length;
}
const length = dicFn(str);
console.log(length);