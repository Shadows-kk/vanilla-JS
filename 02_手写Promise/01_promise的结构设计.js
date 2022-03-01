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
        this.value = value;
        console.log("执行了resolve方法");
      }
    };
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PEDNING) {
        this.status = PROMISE_STATUS_REJECT;
        this.reason = reason;
        console.log("执行了reject方法");
      }
    };
    executor(resolve, reject);
  }
}
const promise = new kkPromise((resolve, reject) => {
  reject();
  resolve();
});
