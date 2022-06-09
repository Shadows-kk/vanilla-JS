// 数组转化形式1
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
arr = [
  { type: 'inter', value: { name: 'interface1' } },
  { type: 'inter', value: { name: 'interface2' } },
  { type: 'meteric', value: { name: 'meteric1' } },
  { type: 'meteric', value: { name: 'interface2' } },
  { type: 'meteric', value: { name: 'interface3' } },
  { type: 'event', value: { name: 'event1' } },
  { type: 'servive', value: { name: 'servive' } },
]

const formate1 = arr => {
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

// 数组转化形式2
// [{
//   ID: '2020年',
//   '新商': { OrderQty: 1837, ActualReceipts: null },
//   '老商': { OrderQty: 4794, ActualReceipts: null }
// },
// {
//   ID: '2021年',
//   '新商': { OrderQty: 1285, ActualReceipts: null },
//   '老商': { OrderQty: 6379, ActualReceipts: null }
// },
// {
//   ID: '2022年',
//   '老商': { OrderQty: 1698, ActualReceipts: 24927833.75 },
//   '新商': { OrderQty: 235, ActualReceipts: 5598521.49 }
// }]
const arr = [
  { ID: '2020年', Category: '新商', OrderQty: 1837, ActualReceipts: null },
  { ID: '2020年', Category: '老商', OrderQty: 4794, ActualReceipts: null },
  { ID: '2021年', Category: '新商', OrderQty: 1285, ActualReceipts: null },
  { ID: '2021年', Category: '老商', OrderQty: 6379, ActualReceipts: null },
  { ID: '2022年', Category: '老商', OrderQty: 1698, ActualReceipts: 24927833.75 },
  { ID: '2022年', Category: '新商', OrderQty: 235, ActualReceipts: 5598521.49 }
]
const formate2 = arr => {
  const obj = {}
  arr.forEach(item => {
    if (!obj[item.ID]) {
      obj[item.ID] = {
        ID: item.ID,
        [item.Category]: { OrderQty: item.OrderQty, ActualReceipts: item.ActualReceipts }
      }
    } else {
      obj[item.ID] = {
        ...obj[item.ID],
        [item.Category]: { OrderQty: item.OrderQty, ActualReceipts: item.ActualReceipts }
      }
    }
  });
  return Object.values(obj)
}
console.log(formate(arr));