function debounce(fn, delay) {
  // 1.定义一个定时器，保存上一次的timer
  let timer = null
  // 2.真正执行的函数，考虑传入参数
  function _debounce(...args) {
    // 3.取消上一次的定时器
    if (timer) clearTimeout(timer)
    // 4.延迟执行
    timer = setTimeout(() => {
      // 5.外部传入的真正执行函数
      fn.apply(this, args)
    }, delay)
  }
  return _debounce
}