getStatisticImg() {
  let canvasDom = document.getElementsByTagName("canvas")[0];
  this.exportChart(canvasDom);
},

exportChart(canvas, fileName = "统计图", imageType = "png") {
  if (canvas) {
    fileName = `${fileName}.${imageType}`;
    canvas.toBlob(blob => {
      const rUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a"); // 创建a标签
      link.href = rUrl;
      link.download = fileName; // 重命名文件
      link.click();
      URL.revokeObjectURL(rUrl); // 释放内存
    });
  }
}