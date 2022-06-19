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
const arr1 = [
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
// console.log(formate(arr1));

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
// console.log(formate(arr));

const arr3 = [
  {
    AbnormalFlagCount: 0,
    Date: "2018年10月",
    ExamCount: 69,
    FilmNotPaymentCount: 6,
    FilmPaymentCount: 63,
    FilmPrintCount: 62,
    ServiceSectID: "CT"
  },
  {
    AbnormalFlagCount: 0,
    Date: "2018年6月",
    ExamCount: 64,
    FilmNotPaymentCount: 12,
    FilmPaymentCount: 52,
    FilmPrintCount: 61,
    ServiceSectID: "MR"
  },
  {
    AbnormalFlagCount: 0,
    Date: "2018年10月",
    ExamCount: 54,
    FilmNotPaymentCount: 1,
    FilmPaymentCount: 53,
    FilmPrintCount: 52,
    ServiceSectID: "MR"
  }
]

function changeArr(arr) {
  let obj = {}
  arr.forEach(item => {
    if (!obj[item.Date]) {
      obj[item.Date] = {
        Date: item.Date,
        value: [{
          ServiceSectID: item.ServiceSectID, ExamCount: item.ExamCount,
          FilmNotPaymentCount: item.FilmNotPaymentCount,
          FilmPaymentCount: item.FilmPaymentCount
        }]
      }
    } else {
      obj[item.Date] = {
        ...obj[item.Date]
      }
    }
  });
  return Object.values(obj)
}
//对象数组排序
function compare(obj1, obj2) {
  // 正则规则匹配数字
  let o1Arr = obj1.Date.match(/\d+/g)
  let o2Arr = obj2.Date.match(/\d+/g)
  console.log(o1Arr, o2Arr);

  if (o1Arr[0] * 1 < o2Arr[0] * 1) {
    return -1
  } else if (o1Arr[0] * 1 > o2Arr[0] * 1) {
    return 1
  } else {
    if (o1Arr[1] * 1 < o2Arr[1] * 1) {
      return -1
    } else if (o1Arr[1] * 1 > o2Arr[1] * 1) {
      return 1
    } else {
      return 0
    }
  }
}

console.log(arr3.sort(compare));



