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
  return _debounce
}