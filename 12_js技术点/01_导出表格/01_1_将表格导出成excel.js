// 先安装 xlsx
import XLSX from "xlsx";
// 导出表格
function exportOutXLSX() {
  let wb = XLSX.utils.table_to_book(
    document.querySelector("#statisticTable"),
    {
      raw: true
    }
  ); // raw-解决默认把内容是数字的字符串当做数字处理导致数字前的0丢失的问题
  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  this.saveAs(
    new Blob([this.xlsxToArrayBuffer(wbout)], {
      type: "application/octet-stream"
    }),
    "orgcheck.xlsx"
  );
};
function saveAs(obj, fileName) {
  var tmpa = document.createElement("a");
  tmpa.download = fileName || "下载";
  tmpa.href = URL.createObjectURL(obj); //绑定a标签
  tmpa.click(); //模拟点击实现下载
  setTimeout(function () {
    //延时释放
    URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
  }, 100);
};
function xlsxToArrayBuffer(s) {
  if (typeof ArrayBuffer !== "undefined") {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  } else {
    var buf = new ArrayBuffer(s.length);
    for (var i = 0; i != s.length; ++i) {
      buf[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
}