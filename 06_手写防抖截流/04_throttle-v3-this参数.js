function throttle(fn, interval, options = { leading: true, trailing: false }) {
  // leading: 首次是否执行, trailing: 是否执行最后一次
  // 1.记录上次的开始时间
  let lastTime = 0
  let timer = null
  // 2.事件触发时，真正执行的函数
  const _throttle = function (...args) {
    // 2.1获取当前事件触发时的时间
    const nowTime = new Date().getTime()
    if (!leading && !lastTime) lastTime = nowTime
    // 2.2用当前和时间和上一次执行时间间隔，计算还剩多长时间去触发函数
    const remainTime = interval - (nowTime - lastTime)
    if (remainTime <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      // 2.3真正触发函数
      fn.apply(this, args)
      // 2.4保留上次的触发时间
      lastTime = nowTime
    }
    if (trailing && !timer) {
      timer = setTimeout(() => {
        timer = null
        lastTime = !leading ? 0 : new Date().getTime()
        fn().apply(this, args)
      }, remainTime)
    }
  }
  // let flag = true
  // function _throttle() {
  //   if(flag){
  //     setTimeout(()=>{
  //       fn.apply(this)
  //       flag = true
  //     },delay)
  //   }
  //   flag = false
  // }
  _throttle.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
  }
  return _throttle
}