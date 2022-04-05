const PROMISE_STATUS_PEDNING = "pending";
const PROMISE_STATUS_RESOLVE = "fulfilled";
const PROMISE_STATUS_REJECT = "rejected";
class kkPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PEDNING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PEDNING) return;
          this.status = PROMISE_STATUS_RESOLVE;
          this.value = value;
          // 遍历数组是为了执行then的多次调用
          this.onFulfilledCallbacks.forEach((fn) => {
            fn(this.value);
          });
        });
      }
    };
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PEDNING) return;
          this.status = PROMISE_STATUS_REJECT;
          this.reason = reason;
          this.onRejectedCallbacks.forEach((fn) => {
            fn(this.reason);
          });
        });
      }
    };
    executor(resolve, reject);
  }
  then(onFulfilled, onRejected) {
    if (this.status === PROMISE_STATUS_PEDNING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
    // 在有状态的情况下，再次调用then
    if (this.status === PROMISE_STATUS_RESOLVE && onFulfilled) {
      onFulfilled(this.value);
    }
    if (this.status === PROMISE_STATUS_REJECT && onRejected) {
      onRejected(this.reason);
    }
  }
}
const promise = new kkPromise((resolve, reject) => {
  resolve(111);
  reject(222);
});
//优化一、多次调用then方法，都可以执行
promise.then(
  (res) => {
    console.log("res1", res);
  },
  (err) => {
    console.log("err1:", err);
  }
);
promise.then(
  (res) => {
    console.log("res2:", res);
  },
  (err) => {
    console.log("err2:", err);
  }
);
//优化二、确定promise状态后，再次调用resolve
setTimeout(() => {
  promise.then(
    (res) => {
      console.log("res3:", res);
    },
    (err) => {
      console.log("err3:", err);
    }
  );
}, 1000);
