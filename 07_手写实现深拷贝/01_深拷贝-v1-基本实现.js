// 封装判断是否是对象的函数
function isObject(value) {
  // 对象和数组使用 typeof 返回的都是object
  const valueType = typeof value
  return (value !== null) && (valueType === 'object' || valueType === 'function')
}

function deepClone(originValue) {
  // 如果是函数类型，直接使用同一个函数(函数复用)
  if (typeof originValue === "function") {
    return originValue
  }
  // 判断如果是Symbol的value，那么创建一个新的Symbol
  if (typeof originValue === "symbol") {
    return Symbol(originValue.description)
  }
  // 判断是否是Set类型
  if (originValue instanceof Set) {
    return new Set([...originValue])
  }
  // 判断是否是Map类型
  if (originValue instanceof Map) {
    return new Map([...originValue])
  }
  // 如果拷贝的类型不是对象，直接返回值
  if (!isObject(originValue)) {
    return originValue
  }
  // 判断传入的对象是数组还是对象
  let newObject = Array.isArray(originValue) ? [] : {}
  for (let key in originValue) {
    newobject[key] = deepClone(originValue[key])
  }
  // 对Symbol的值进行特殊处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (let sKey of symbolKeys) {
    newObject[sKey] = deepClone(originValue[sKey])
  }
  return newObject
} 