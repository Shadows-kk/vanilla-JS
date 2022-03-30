function throttle(fn, interval) {
  // 1.记录上次的开始时间
  let lastTime = 0
  // 2.事件触发时，真正执行的函数
  function _throttle() {
    // 2.1获取当前事件触发时的时间
    const nowTime = new Date().getTime()
    // 2.2用当前和时间和上一次执行时间间隔，计算还剩多长时间去触发函数
    const remainTime = interval - (nowTime - lastTime)
    if (remainTime <= 0) {
      // 2.3真正触发函数
      fn()
      // 2.4保留上次的触发时间
      lastTime = nowTime
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
  return _throttle
}