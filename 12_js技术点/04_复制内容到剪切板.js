const copyToClipboard = str => {
  // 浏览器提供了一个原生方法 document.execCommand('copy') 来实现 复制内容到剪贴板，
  // 但是它有一个使用前提“需要选择文本框或者输入框时”，所以先创建一个 textarea 文本框并通过定位让它不显示在屏幕里
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  // 如果用户选中了某段文字后点击复制内容到剪贴板的复制操作这段选中的文字就会消失掉，
  // 可以利用 document.getSelection 一系列光标选中 API 来帮助我们先记录下用户之前所选的文字对象
  const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;

  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  // 再进行完复制操作后对 selected 进行判断，并恢复先前记录下用户之前所选的文字对象
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};