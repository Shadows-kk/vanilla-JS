const PROMISE_STATUS_PEDNING = "pending";
const PROMISE_STATUS_RESOLVE = "fulfilled";
const PROMISE_STATUS_REJECT = "rejected";
// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value);
    resolve(result);
  } catch (err) {
    reject(err);
  }
}
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
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    return new kkPromise((resolve, reject) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        this.onFulfilledCallbacks.push(() => {
          // try {
          //   const value = onFulfilled(this.value);
          //   resolve(value);
          // } catch (err) {
          //   reject(err);
          // }
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
        });
        this.onRejectedCallbacks.push(() => {
          // try {
          //   const reason = onRejected(this.reason);
          //   resolve(reason);
          // } catch (err) {
          //   reject(err);
          // }
          execFunctionWithCatchError(onFulfilled, this.reason, resolve, reject);
        });
      }
      if (this.status === PROMISE_STATUS_RESOLVE && onFulfilled) {
        // try {
        //   const value = onFulfilled(this.value);
        //   resolve(value);
        // } catch (err) {
        //   reject(err);
        // }
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_STATUS_REJECT && onRejected) {
        // try {
        //   const reason = onRejected(this.reason);
        //   resolve(reason);
        // } catch (err) {
        //   reject(err);
        // }
        execFunctionWithCatchError(onFulfilled, this.reason, resolve, reject);
      }
    });
  }
}
const promise = new kkPromise((resolve, reject) => {
  // resolve(111);
  reject(222);
  // throw new Error("executor error");
});
// 优化：then方法的链式调用
promise
  .then(
    (res) => {
      console.log("res1:", res);
      return "aaa";
      // throw new Error("error message");
    },
    (err) => {
      console.log("err1:", err);
      // return "bbb";
      throw new Error("error message");
    }
  )
  .then(
    (res) => {
      console.log("res2:", res);
    },
    (err) => {
      console.log("err2:", err);
    }
  );
