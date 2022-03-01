const PROMISE_STATUS_PEDNING = "pending";
const PROMISE_STATUS_RESOLVE = "fulfilled";
const PROMISE_STATUS_REJECT = "rejected";
class kkPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PEDNING;
    this.value = undefined;
    this.reason = undefined;
    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        this.status = PROMISE_STATUS_RESOLVE;

        queueMicrotask(() => {
          this.value = value;
          this.onFulfilled(this.value);
        });
      }
    };
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        this.status = PROMISE_STATUS_REJECT;

        queueMicrotask(() => {
          this.reason = reason;
          this.onRejected(this.reason);
        });
      }
    };
    executor(resolve, reject);
  }
  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }
}
const promise = new kkPromise((resolve, reject) => {
  resolve(111);
  reject(222);
});
promise.then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);
