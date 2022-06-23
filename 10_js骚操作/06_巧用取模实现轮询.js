const list = ['a', 'b', 'c']
let index = 0;

for (i = 0; i < 100; i++) {

  // 1.比较
  index++;
  if (index >= list.length) {
    index = 0;
  }
  // 2.取模
  index = (index + 1) % list.length;
}