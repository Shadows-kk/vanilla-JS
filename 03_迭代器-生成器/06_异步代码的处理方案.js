function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 500);
  });
}

// 1.第一种方案：多次回调
requestData("kk").then((res) => {
  requestData(res + "aaa").then((res) => {
    requestData(res + "bbb").then((res) => {
      requestData(res + "ccc").then((res) => {
        console.log(res);
      });
    });
  });
});

// 2.第二种方案：Promise的then方法返回值来解决
requestData("kk")
  .then((res) => {
    return requestData(res + "aaa");
  })
  .then((res) => {
    return requestData(res + "bbb");
  })
  .then((res) => {
    return requestData(res + "ccc");
  })
  .then((res) => {
    console.log(res);
  });

// 3.第三种方案：Promise + Generator
function* getData() {
  const res1 = yield requestData("kk");
  const res2 = yield requestData(res1 + "aaa");
  const res3 = yield requestData(res2 + "bbb");
  const res4 = yield requestData(res3 + "ccc");
  console.log(res4);
}
// 3.1手动执行
// const generator = getData();
// generator.next().value.then((res) => {
//   generator.next(res).value.then((res) => {
//     generator.next(res).value.then((res) => {
//       generator.next(res).value.then((res) => {
//         generator.next(res);
//       });
//     });
//   });
// });
// 3.2递归自动化
// function execGenerator(getFn) {
//   const generator = getFn();
//   function exec(res) {
//     const result = generator.next(res);
//     if (result.done) {
//       return result.value;
//     }
//     result.value.then((res) => {
//       exec(res);
//     });
//   }
//   exec();
// }
// execGenerator(getData);

// 3.3也可以npm安装co库
const co = require("co");
co(getData);

// 4.第四种方案 async/await
async function getData() {
  const res1 = await requestData("kk");
  const res2 = await requestData(res1 + "aaa");
  const res3 = await requestData(res2 + "bbb");
  const res4 = await requestData(res3 + "ccc");
  console.log(res4);
}
getData();
// 其实这是 Promise + generator的语法糖 *改成了async，yield改成了await
