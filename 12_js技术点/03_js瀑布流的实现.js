// 实现原理
// 1.首先计算出每一行能后容纳几列元素；
// 2.然后通过计算比较出这一列元素中高度之和最小的一列；
// 3.然后将下一列的第一个元素添加至高度之和最小的这一列下面；
// 4.然后继续计算所有列中高度之和最小的那一列，继续将新元素添加至高度之和最小的那一列后面；
// 5.直至所有的元素添加完毕。

// 获取所有的元素 初始化间距 页面初始化执行
let items = document.getElementsByClassName('item')
const gap = 20 //定义间隙
// 进入页面执行函数
window.onload = function () {
  waterFall()
}

function waterFall() {
  // 先确定列数 = 页面宽度 / 图片宽度
  let wrapWidth = getClient().width;
  let itemWidth = item[0].clientWidth;
  let columns = parseInt(wrapWidth / (itemWidth + gap))

  // 定义一个数组，用来保存元素的高度。
  let arr = []
  for (let i = 0; i < items.length; i++) {
    if (i < columns) {
      // a.满足这个条件的说明在第一行
      items[i].style.top = 0;
      items[i].style.left = (itemWidth + gap) * i + 'px';
      arr.push(items[i].offsetHeight)//将第一行的元素高度推进数组保存
    } else {
      // b.其他行，先找出最小高度列 和 索引
      let minHeight = arr[0];// 假设最小的是第一个元素
      let index = 0;
      for (let j = 0; j < arr.length; j++) {
        if (minHeight > arr[j]) {
          minHeight = arr[j]//循环找出最小高度列
          index = j//记录索引
        }
      }
      // c.设置下一行的第一个盒子的位置
      // 高度值就是 最小列高+gap
      items[i].style.top = arr[j] + gap + 'px';
      items[i].style.left = items[index].offsetLeft + 'px'; //left还是上一行的这一列元素的left，items[index]是第一行内的元素

      // d.修改最小列的高度
      // 最小列的高度 = 当前最小的高度 + 拼接过的高度 + 间隙高度
      arr[index] = arr[index] + items[i].offsetHeight + gap
    }
  }
}

// 当页面尺寸发生变化，触发函数，实现响应式
window.onresize = function () {
  waterFall()
}
// clientWidth兼容性处理
function getClient() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }
}