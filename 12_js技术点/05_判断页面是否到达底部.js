const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight);

// 窗口可见区域的高度 和 窗口已经滚动的距离高度 得到当前页面所处的位置
// document.documentElement.clientHeight + window.scrollY

// 再与 整个页面的高度 作比较来判断是否已经到达了页面底部，如果 整个页面的高度 不存在则使用 窗口可见区域的高度 做代替
// ... >= (document.documentElement.scrollHeight || document.documentElement.clientHeight)

// 场景：做一个无限加载数据项的分页功能，当页面到达底部时进行数据加载。
// 监听页面滚动
document.addEventListener('scroll', () => {
  // 如果到达页面底部
  if (bottomVisible()) {
    // 1.发送网络请求获取数据
    // 2.插入数据到页面
  }
});

// 判断是否到达顶部
const topVisible = () => window.scrollY == 0