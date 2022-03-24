arr = [
  { type: 'inter', value: { name: 'interface1' } },
  { type: 'inter', value: { name: 'interface2' } },
  { type: 'meteric', value: { name: 'meteric1' } },
  { type: 'meteric', value: { name: 'interface2' } },
  { type: 'meteric', value: { name: 'interface3' } },
  { type: 'event', value: { name: 'event1' } },
  { type: 'servive', value: { name: 'servive' } },
]
// 把数组转化成
/*[
  { type: 'inter', value: { name: 'interface1,interface2' }, count: 2 },
  {
    type: 'meteric',
    value: { name: 'meteric1,interface2,interface3' },
    count: 3
  },
  { type: 'event', value: { name: 'event1' }, count: 1 },
  { type: 'servive', value: { name: 'servive' }, count: 1 }
]*/

const formate = arr => {
  const obj = {}
  arr.forEach(item => {
    if (!obj[item.type]) {
      obj[item.type] = {
        ...item,
        count: 1
      }
    } else {
      obj[item.type] = {
        ...obj[item.type],
        count: ++obj[item.type].count,
        value: {
          name: `${obj[item.type].value.name},${item.value.name}`
        }
      }
    }
  });
  return Object.values(obj)
}
console.log(formate(arr));