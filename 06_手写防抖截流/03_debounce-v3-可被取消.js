function debounce(fn, delay, immediate = false) {
  let timer = null
  let isInvoke = false //标志用来记录是否执行过一次

  function _debounce(...args) {
    if (timer) clearTimeout(timer)
    // 新增立即是否立即执行的判断
    if (immediate && !isInvoke) {
      fn.apply(this, args)
      isInvoke = true
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
        isInvoke = false
      }, delay)
    }
  }
  // 封装取消功能
  // 使用的时候用一个变量接受debounce返回值，取消时通过变量拿到cancel
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
    isInvoke = false
  }
  return _debounce
}