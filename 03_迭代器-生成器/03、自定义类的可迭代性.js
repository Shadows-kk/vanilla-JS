//对每一个类的实例对象，我们迭代它的students
class classRoom {
  constructor(address, students) {
    this.address = address;
    this.students = students;
  }
  entry(newStu) {
    this.students.push(newStu);
  }
  // 加入Symbol.iterator,让类成为可迭代的，并且迭代的是studens
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
      // 监听迭代器的中断
      return: () => {
        console.log("迭代器提前终止");
        return { done: true, value: undefined };
      },
    };
  }
}
const classroom = new classRoom("3#201", ["A", "B", "C"]);
for (item of classroom) {
  console.log(item);
}
