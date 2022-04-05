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
    // catch方法重调了then方法，then的第二个回调是undefined，需要抛出异常
    const defaultOnRejected = err => { throw err }
    onRejected = onRejected || defaultOnRejected
    const defaultOnFulfield = value => { return value }
    onFulfilled = onFulfilled || defaultOnFulfield

    return new kkPromise((resolve, reject) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        if (onFulfilled) {
          this.onFulfilledCallbacks.push(() => {
            execFunctionWithCatchError(
              onFulfilled,
              this.value,
              resolve,
              reject
            );
          });
        }
        if (onRejected) {
          this.onRejectedCallbacks.push(() => {
            execFunctionWithCatchError(
              onRejected,
              this.reason,
              resolve,
              reject
            );
          });
        }
      }
      if (this.status === PROMISE_STATUS_RESOLVE && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_STATUS_REJECT && onRejected) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject);
      }
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(onFinally) {
    this.then(() => { onFinally() }, () => { onFinally() })
  }
}
const promise = new kkPromise((resolve, reject) => {
  resolve(111);
  // reject(222);
});
// 优化：then方法的链式调用
promise
  .then((res) => { console.log("res1:", res); return 'aaa' })
  .then((res) => { console.log("res2:", res) })
  .catch((err) => { console.log("err2:", err) })
  .finally(() => { console.log('finally'); });

