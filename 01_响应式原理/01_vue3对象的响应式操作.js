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
function reactive(obj) {
  return new Proxy(obj, {
    get: function (target, key, receiver) {
      //1.根据target,key拿到对应的depend
      const depend = getDepend(target, key);
      //2.给depend中添加响应函数，收集依赖
      // depend.addDepend(activeReactiveFn);//优化，get中不关心activeReactiveFn
      depend.depend(); //收集依赖
      return Reflect.get(target, key, receiver);
    },
    set: function (target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver);
      // depend.notify();
      const depend = getDepend(target, key);
      depend.notify();
    },
  });
}

//封装响应式的函数函数 watchFn
let activeReactiveFn = null;
function watchFn(fn) {
  activeReactiveFn = fn;
  fn();
  activeReactiveFn = null;
}
//执行
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
//执行
watchFn(function () {
  console.log(infoProxy.address);
});
infoProxy.address = "中国";
