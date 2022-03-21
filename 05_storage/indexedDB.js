//打开数据库
const dbRequest = indexedDB.open("kk");
dbRequest.onerror = function () {
  console.log("打开数据库失败");
};
let db = null;
dbRequest.onsuccess = function (event) {
  db = event.target.result;
};
//第一次打开或者版本发生变化
dbRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  // 创建存储对象
  db.createObjectStore("users", { keyPath: "id" });
};

//创建一个用户类
class user {
  constructor(id, name, age) {
    this.id = id;
    this.name = name;
    this.age = age;
  }
}
const users = [
  new user(101, "kk", 18),
  new user(102, "ckk", 19),
  new user(103, "cjk", 20),
];

//获取按钮，添加点击事件
const btns = document.querySelectorAll("button");
for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {
    // 创建事务
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    switch (i) {
      case 0:
        console.log("xz");
        for (const user of users) {
          const request = store.add(user);
          request.onsuccess = function () {
            console.log(`${user.name}插入成功`);
          };
        }
        transaction.oncomplete = function () {
          console.log("添加操作全部完成");
        };
        break;
      case 1:
        console.log("cx");
        // 查询方式一(知道主键，根据主键查询)
        // const request = store.get(103);
        // request.onsuccess = function (event) {
        //   console.log(event.target.result);
        // };

        // 查询方式二 启用游标
        const request = store.openCursor();
        request.onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.key === 103) {
              console.log(cursor.key, cursor.value);
            } else {
              cursor.continue();
            }
          } else {
            console.log("查询完成");
          }
        };
        break;
      case 2:
        console.log("xg");
        const updateRequest = store.openCursor();
        updateRequest.onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.key === 101) {
              //修改值
              const value = cursor.value;
              value.name = "cdx";
              cursor.update(value);
            } else {
              cursor.continue();
            }
          } else {
            console.log("查询完成");
          }
        };
        break;
      case 3:
        console.log("sc");
        const deleteRequest = store.openCursor();
        deleteRequest.onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.key === 101) {
              //通过游标删除值
              cursor.delete();
            } else {
              cursor.continue();
            }
          } else {
            console.log("查询完成");
          }
        };
        break;
    }
  };
}
