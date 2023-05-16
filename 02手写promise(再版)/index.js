const PENDING = "pending";
const FULLFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  #state = PENDING;
  #result = undefined;
  #handlers = [];
  constructor(executor) {
    const resolve = (data) => {
      this.#changeState(FULLFILLED, data);
    };
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      // promise只能捕获同步错误，无法捕获异步错误
      reject(err);
    }
  }
  // 改变状态
  #changeState(state, result) {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = result;
    // console.log(this.#state, this.#result);
    this.#run();
  }
  // 判断是否是promise对象
  #isPromiseLike(value) {
    // 满足promise A+规范即是promise对象
    // 即对象或者函数中存在一个then属性，并且这个then是一个函数
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function")
    ) {
      return typeof value.then === "function";
    }
    return false;
  }
  // then中的回调放在微队列执行
  #runMicroTask(func) {
    // node环境中
    if (typeof process === "object" && typeof process.nextTick === "function") {
      process.nextTick(func);
    }

    // 浏览器环境中
    else if (typeof MutationObserver === "function") {
      // MutationObserver的回调会放在微队列中执行
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("1");
      ob.observe(textNode, { characterData: true });
      textNode.data = "2";
    } else {
      setTimeout(func, 0);
    }
  }
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      // 1.回调不是一个函数，则状态穿透保持之前promise状态
      if (typeof callback !== "function") {
        const settled = this.#state === FULLFILLED ? resolve : reject;
        settled(this.#result);
      } else {
        //回调是一个函数
        try {
          const data = callback(this.#result);
          // 2.回调返回的是一个promise
          if (this.#isPromiseLike(data)) {
            data.then(resolve, reject);
          } else {
            // 3.回调不是一个普通值
            resolve(data);
          }
        } catch (err) {
          reject(err);
        }
      }
    });
  }
  #run() {
    if (this.#state === PENDING) return;
    while (this.#handlers.length) {
      const { onFulfilled, onRejected, resolve, reject } =
        this.#handlers.shift();
      if (this.#state === FULLFILLED) {
        //完成状态
        this.#runOne(onFulfilled, resolve, reject);
      } else {
        // 拒绝状态
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      // 记录onFulfilled, onRejected，resolve, reject
      this.#handlers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (data) => {
        onFinally();
        return data;
      },
      (err) => {
        onFinally();
        throw err;
      }
    );
  }
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    let _resolve, _reject;
    const p = new MyPromise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    if (p.#isPromiseLike(value)) {
      value.then(_resolve, _reject);
    } else {
      _resolve(value);
    }
    return p;
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

// const p = new MyPromise((resolve, reject) => {
//   resolve(2);
// })
//   .then(
//     (res) => {
//       console.log(res);
//     },
//     (err) => {
//       console.log(err);
//     }
//   )
//   .finally(() => {
//     console.log("finally");
//   });

MyPromise.reject(11111).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log("err", err);
  }
);
