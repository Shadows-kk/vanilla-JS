//需要被建立响应式的对象
const obj = {
  name: "kk",
  age: 18,
};

//封装依赖收集类Depend
class Depend {
  constructor() {
    this.reactiveFns = new Set(); //使用Set保存依赖函数，而不是数组，避免重复添加函数进来
  }
  // addDepend(fn) {
  //   this.reactiveFns.add(fn);
  // }
  depend() {
    if (activeReactiveFn) {
      this.reactiveFns.add(activeReactiveFn);
    }
  }
  notify() {
    this.reactiveFns.forEach((fn) => fn());
  }
}
//监听对象的响应式变化
const objProxy = reactive(obj);

// 封装一个获取depend的函数
let targetMap = new WeakMap();
function getDepend(target, key) {
  //1.根据target对象获取map
  let map = targetMap.get(target);
  if (!map) {
    map = new Map();
    targetMap.set(target, map);
  }
  //2.根据key获取depend
  let depend = map.get(key);
  if (!depend) {
    depend = new Depend();
    map.set(key, depend);
  }
  //3.返回depend
  return depend;
}
// Object.defineProperty建立响应式
function reactive(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get: function () {
        const depend = getDepend(obj, key);
        depend.depend();
        return value;
      },
      set: function (newValue) {
        value = newValue;
        const depend = getDepend(obj, key);
        depend.notify();
      },
    });
  });
  return obj;
}

//封装响应式的函数函数 watchFn
let activeReactiveFn = null;
function watchFn(fn) {
  activeReactiveFn = fn;
  fn();
  activeReactiveFn = null;
}
watchFn(function () {
  console.log(objProxy.name, "name的第一处使用");
});
watchFn(function () {
  console.log(objProxy.name, "name的第二处使用");
});
watchFn(function () {
  console.log(objProxy.age, "age的使用");
});

//属性发生改变
// objProxy.name = "cjk1";
// objProxy.name = "cjk2";
// objProxy.name = "cjk3";
// objProxy.age = 20;
const info = {
  address: "China",
};
const infoProxy = reactive(info);
watchFn(function () {
  console.log(infoProxy.address);
});
infoProxy.address = "中国";
