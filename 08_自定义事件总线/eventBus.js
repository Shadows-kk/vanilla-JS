class kkEventBus {
  constructor() {
    this.eventBus = {}
  }
  on(eventName, eventCallback, thisArg) {
    // 事件名称 事件参数 事件绑定的this
    let handlers = this.eventBus[eventName]
    // 第一次进来的时候handlers为空，创建一个数组
    if (!handlers) {
      handlers = []
      // 一个事件可能被多次触发，一个事件名对应一个包含回调的数组
      this.eventBus[eventName] = handlers
    }
    handlers.push({
      eventCallback,
      thisArg
    })
  }
  off(eventName, eventCallback) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    // 拷贝一份新对象，方式遍历的时候删除出现问题
    const newhandlers = [...handlers]
    for (let i = 0; i < newhandlers.length; i++) {
      const handler = newhandlers[i]
      if (handler.eventCallback === eventCallback) {
        const index = handlers.indexOf(handler)
        handlers.splice(index, 1)
      }
    }
  }
  emit(eventName, ...payload) {
    // 先取到事件对应的回调函数
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    handlers.forEach(handler => {
      handler.eventCallback.apply(handler.thisArg, payload)
    });
  }
}

// 使用
const eventBus = new kkEventBus()
// 添加监听事件
eventBus.on("abc", function () {
  console.log('监听abc1', this);
}, { name: "cjk" })
const callbackFn = function () {
  console.log('监听abc2', this);
}
eventBus.on("abc", callbackFn, { name: "cjk" })

// eventBus.emit('abc', 123)

// 移除事件
eventBus.off("abc", callbackFn)
eventBus.emit('abc', 123)